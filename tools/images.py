"""Proje görsellerini WebP'ye çevirir.

Kullanım: python tools/images.py
Kaynaklar aşağıdaki MANIFEST'te; yerel dosya ya da URL olabilir. URL'ler
tools/.cache/ altına indirilir. Çıktı: assets/img/projects/<slug>.webp
(en çok 1200 px genişlik, q=82). Sonunda her görselin boyutu yazdırılır;
data.js içindeki image.w / image.h alanlarına bu değerler girilir.
"""
from __future__ import annotations

import sys
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "projects"
CACHE = ROOT / "tools" / ".cache"
MAX_W = 1200

MANIFEST: dict[str, str] = {
    "spc-analyzer": r"C:\Users\bilge\spc-analyzer\docs\images\example_imr_chart.png",
    "aniflow": r"C:\Users\bilge\Documents\Aniflow v2\docs\screenshot.png",
    "hoffmann-line-balancing": "https://raw.githubusercontent.com/DailyDana/hoffmann-line-balancing/main/docs/images/streamlit_app.png",
}


def fetch(src: str, slug: str) -> Path:
    if src.startswith(("http://", "https://")):
        CACHE.mkdir(parents=True, exist_ok=True)
        dst = CACHE / f"{slug}{Path(src).suffix or '.png'}"
        if not dst.exists():
            urllib.request.urlretrieve(src, dst)
        return dst
    return Path(src)


def convert(slug: str, src: str) -> tuple[int, int, int]:
    path = fetch(src, slug)
    im = Image.open(path)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    out = OUT / f"{slug}.webp"
    im.save(out, "WEBP", quality=82, method=6)
    return im.width, im.height, out.stat().st_size


def main() -> int:
    ok = True
    for slug, src in MANIFEST.items():
        try:
            w, h, size = convert(slug, src)
            print(f"{slug:28s} {w}x{h}  {size/1024:6.1f} KB")
        except Exception as exc:  # noqa: BLE001 - raporla, devam et
            ok = False
            print(f"{slug:28s} HATA: {exc}", file=sys.stderr)
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
