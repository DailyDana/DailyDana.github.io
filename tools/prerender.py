"""data.js'ten üretilen listeleri sayfaların HTML'ine statik olarak yazar.

Neden: JavaScript çalıştırmayan okuyucular (bazı ATS'ler, yapay zekâ özetleyicileri, basit
tarayıcılar) projeleri, becerileri ve deneyimi boş görüyordu. Bu betik sayfayı Edge'de açar,
main.js'in ürettiği içeriği alır ve `<!-- static:X -->` işaretlerinin arasına yazar. Tarayıcıda
JS yine çalışır ve aynı içeriği yeniden üretir; statik kopya yalnız JS'siz okuyucular içindir.

Kullanım (data.js değiştikten sonra):
    python -m http.server 8765 --bind 127.0.0.1      (depo kökünde)
    python tools/prerender.py [http://127.0.0.1:8765]
`--check` ile yazmaz, yalnız statik kopyanın güncel olup olmadığını söyler (eskiyse çıkış kodu 1).
"""
from __future__ import annotations

import asyncio
import re
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
args = [a for a in sys.argv[1:] if not a.startswith("--")]
BASE = args[0] if args else "http://127.0.0.1:8765"
CHECK = "--check" in sys.argv
MARK = re.compile(r"<!-- static:([A-Za-z]+) -->(.*?)<!-- /static:\1 -->", re.S)


def clean(html: str) -> str:
    """Görünme animasyonunun çalışma anı izlerini temizler: statik kopya her zaman görünür olmalı."""
    html = re.sub(r'\s+style="transition-delay:[^"]*"', "", html)
    html = re.sub(r'\s+data-delay="\d+"', "", html)
    html = re.sub(r'class="([^"]*?)\s*\breveal\b\s*(is-in)?\s*"', lambda m: f'class="{m.group(1).strip()}"', html)
    return html.replace(' class=""', "")


async def main() -> int:
    pages = [ROOT / "index.html", *sorted(ROOT.glob("projeler/*/index.html"))]
    stale = 0
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        ctx = await browser.new_context(color_scheme="light")
        # Cloudflare ziyaret sayacı yalnız canlı alan adında çalışır; yerel testte isteği hiç gönderme
        await ctx.route("**/*cloudflareinsights.com/**", lambda r: r.fulfill(status=200, content_type="text/javascript", body=""))
        for page_path in pages:
            text = page_path.read_text(encoding="utf-8")
            ids = MARK.findall(text)
            if not ids:
                continue
            url = BASE + "/" + page_path.relative_to(ROOT).as_posix().replace("index.html", "") + "?lang=tr"
            page = await ctx.new_page()
            await page.goto(url, wait_until="networkidle")
            rendered = {}
            for cid, _ in ids:
                rendered[cid] = clean(await page.eval_on_selector(f"#{cid}", "el => el.innerHTML.trim()"))
                if not rendered[cid]:
                    raise SystemExit(f"{page_path.relative_to(ROOT)}: #{cid} boş üretildi, data.js'i kontrol et")
            await page.close()
            new = MARK.sub(lambda m: f"<!-- static:{m.group(1)} -->{rendered[m.group(1)]}<!-- /static:{m.group(1)} -->", text)
            rel = page_path.relative_to(ROOT)
            if new == text:
                print(f"güncel   {rel}")
            elif CHECK:
                stale += 1
                print(f"ESKİ     {rel}")
            else:
                page_path.write_text(new, encoding="utf-8", newline="\n")
                print(f"yazıldı  {rel} ({', '.join(c for c, _ in ids)})")
        await browser.close()
    return 1 if stale else 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
