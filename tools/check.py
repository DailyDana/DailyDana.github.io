"""Derlemesiz sitenin güvenlik ağı. Hata bulursa 1 ile çıkar.

Kontroller:
  - HTML'de her data-lang="tr" öğesinin aynı ebeveynde data-lang="en" eşi var (ve tersi)
  - data.js içindeki her {tr, en} nesnesinin iki tarafı da dolu (node ile yürütülür)
  - style.css'te token bloklarının ve @media print dışında literal renk yok
  - HTML'deki kök-göreli (/...) ve çapa (#...) bağlantıların hedefi var
  - Statik <img> etiketlerinde width/height/alt var
  - cv/*.pdf dışında 500 KB'den büyük dosya yok
  - Sayfalar arasında chrome (nav/footer) blokları bire bir aynı
  - sitemap.xml'deki URL'ler dosya olarak mevcut
Kullanım: python tools/check.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = [p for p in [ROOT / "index.html", *ROOT.glob("projeler/*/index.html"), *ROOT.glob("cv/index.html")] if p.exists()]
errors: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


class Scan(HTMLParser):
    """data-lang eşleşmesi, id listesi, href listesi ve img öznitelikleri için tek geçiş."""

    def __init__(self) -> None:
        super().__init__()
        self.stack: list[dict[str, int]] = [{"tr": 0, "en": 0}]
        self.ids: set[str] = set()
        self.hrefs: list[str] = []
        self.imgs: list[dict[str, str | None]] = []
        self.unbalanced = 0
        self.void = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "a" and a.get("href"):
            self.hrefs.append(a["href"])
        if tag == "img":
            self.imgs.append(a)
        lang = a.get("data-lang")
        if lang in ("tr", "en"):
            self.stack[-1][lang] += 1
        if tag not in self.void:
            self.stack.append({"tr": 0, "en": 0})

    def handle_endtag(self, tag: str) -> None:
        if tag in self.void or len(self.stack) < 2:
            return
        counts = self.stack.pop()
        if counts["tr"] != counts["en"]:
            self.unbalanced += 1


def check_html(page: Path) -> None:
    s = Scan()
    text = page.read_text(encoding="utf-8")
    s.feed(text)
    rel = page.relative_to(ROOT)
    if s.unbalanced:
        err(f"{rel}: {s.unbalanced} ebeveynde data-lang tr/en sayısı eşit değil")
    for href in s.hrefs:
        if href.startswith("#"):
            if href != "#" and href[1:] not in s.ids:
                err(f"{rel}: çapa hedefi yok: {href}")
        elif href.startswith("/") and not href.startswith("//"):
            target = ROOT / href.lstrip("/").split("?")[0].split("#")[0]
            if target.is_dir():
                target = target / "index.html"
            if href.rstrip("/") == "" or href == "/":
                continue
            if not target.exists():
                err(f"{rel}: bağlantı hedefi yok: {href}")
    for img in s.imgs:
        if not (img.get("width") and img.get("height")):
            err(f"{rel}: <img src={img.get('src')}> width/height eksik")
        if img.get("alt") is None:
            err(f"{rel}: <img src={img.get('src')}> alt eksik")
    for attr in ("src", "href"):
        for m in re.finditer(rf'{attr}="(/[^"]+)"', text):
            path = m.group(1).split("?")[0].split("#")[0]
            if path.startswith("/tools/") or path in ("", "/"):
                continue
            if not (ROOT / path.lstrip("/")).exists() and not (ROOT / path.lstrip("/") / "index.html").exists():
                err(f"{rel}: dosya yok: {path}")


def check_chrome() -> None:
    blocks: dict[str, dict[str, str]] = {}
    for page in PAGES:
        text = page.read_text(encoding="utf-8")
        for name in ("nav", "footer"):
            m = re.search(rf"<!-- chrome:{name} -->(.*?)<!-- /chrome:{name} -->", text, re.S)
            blocks.setdefault(name, {})[str(page.relative_to(ROOT))] = m.group(1).strip() if m else ""
    for name, per_page in blocks.items():
        ref = per_page.get("index.html", "")
        for rel, block in per_page.items():
            if not block:
                err(f"{rel}: chrome:{name} bloğu yok")
            elif block != ref and not rel.startswith("index"):
                # alt sayfalarda çapalar /#... biçiminde olabilir; bunu normalize edip karşılaştır
                if block.replace('href="/#', 'href="#') != ref:
                    err(f"{rel}: chrome:{name} bloğu index.html ile aynı değil")


def check_css() -> None:
    css = (ROOT / "assets" / "css" / "style.css").read_text(encoding="utf-8")
    body = re.sub(r":root(\[data-theme=\"dark\"\])?\s*\{[^}]*\}", "", css)
    body = re.sub(r"@media print\s*\{.*?\n\}", "", body, flags=re.S)
    body = re.sub(r"url\(\"data:[^\"]*\"\)", "", body)
    for m in re.finditer(r"#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(", body):
        line = body.count("\n", 0, m.start()) + 1
        err(f"style.css: token dışında literal renk ({m.group(0)}), yaklaşık satır {line}")


def check_data() -> None:
    script = r"""
      const fs=require('fs');const src=fs.readFileSync(process.argv[1],'utf8');
      const window={};new Function('window',src)(window);
      const bad=[];const walk=(v,p)=>{if(v&&typeof v==='object'){const k=Object.keys(v);
        if(k.length===2&&k.includes('tr')&&k.includes('en')){if(!String(v.tr).trim()||!String(v.en).trim())bad.push(p);return;}
        for(const key of k)walk(v[key],p+'.'+key);}};
      walk(window.PORTFOLIO,'PORTFOLIO');console.log(JSON.stringify(bad));
    """
    try:
        out = subprocess.run(["node", "-e", script, str(ROOT / "assets" / "js" / "data.js")], capture_output=True, text=True, check=True)
        for p in json.loads(out.stdout or "[]"):
            err(f"data.js: boş dil tarafı: {p}")
    except FileNotFoundError:
        print("uyarı: node bulunamadı, data.js dil kontrolü atlandı")
    except subprocess.CalledProcessError as exc:
        err(f"data.js yürütülemedi: {exc.stderr.strip()[:200]}")


def check_sizes() -> None:
    for f in ROOT.rglob("*"):
        if f.is_file() and ".git" not in f.parts and ".cache" not in f.parts:
            if f.stat().st_size > 500 * 1024 and not (f.parent.name == "cv" and f.suffix == ".pdf"):
                err(f"{f.relative_to(ROOT)}: {f.stat().st_size / 1024:.0f} KB > 500 KB")


def check_sitemap() -> None:
    sm = ROOT / "sitemap.xml"
    if not sm.exists():
        err("sitemap.xml yok")
        return
    for loc in re.findall(r"<loc>https://dailydana\.github\.io(/[^<]*)</loc>", sm.read_text(encoding="utf-8")):
        target = ROOT / loc.lstrip("/")
        if not ((target / "index.html").exists() or target.exists()):
            err(f"sitemap.xml: hedef yok: {loc}")


def main() -> int:
    for page in PAGES:
        check_html(page)
    check_chrome()
    check_css()
    check_data()
    check_sizes()
    check_sitemap()
    if errors:
        print("\n".join(f"HATA  {e}" for e in errors))
        print(f"\n{len(errors)} sorun")
        return 1
    print(f"OK  {len(PAGES)} sayfa, kontroller temiz")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
