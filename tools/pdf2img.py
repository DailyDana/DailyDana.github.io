"""Teknik çizim PDF'lerini (ilk sayfa) WebP'ye çevirir.

Kullanım: python tools/pdf2img.py
Girdi: tools/.cache/cad/*.pdf  (dosya adı "<grup>__<ad>.pdf", ör. cannon__govde duz.pdf)
Çıktı: assets/img/cad/<grup>-<ascii-ad>.webp (en çok 1600 px, kayıpsız) ve
       assets/img/cad/<grup>-<ascii-ad>-thumb.webp (800 px, q=80).
Beyaz kenar boşlukları otomatik kırpılır. pypdfium2 gerekir (pip install pypdfium2).
"""
from __future__ import annotations

import re
import unicodedata
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tools" / ".cache" / "cad"
OUT = ROOT / "assets" / "img" / "cad"
SCALE = 3  # 72 dpi × 3 ≈ 216 dpi
MAX_W = 1600
THUMB_W = 800


def slug(name: str) -> str:
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    s = re.sub(r"[^A-Za-z0-9]+", "-", s).strip("-").lower()
    return s


def autocrop(im: Image.Image, pad: int = 24) -> Image.Image:
    bg = Image.new(im.mode, im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert("L").point(lambda p: 255 if p > 12 else 0)
    box = diff.getbbox()
    if not box:
        return im
    x0, y0, x1, y1 = box
    return im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))


def convert(pdf: Path) -> None:
    doc = pdfium.PdfDocument(str(pdf))
    page = doc[0]
    im = page.render(scale=SCALE).to_pil().convert("RGB")
    im = autocrop(im)
    group, _, name = pdf.stem.partition("__")
    base = f"{slug(group)}-{slug(name or group)}"
    OUT.mkdir(parents=True, exist_ok=True)
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    full = OUT / f"{base}.webp"
    im.save(full, "WEBP", lossless=True, method=6)
    th = im.resize((THUMB_W, round(im.height * THUMB_W / im.width)), Image.LANCZOS) if im.width > THUMB_W else im
    thumb = OUT / f"{base}-thumb.webp"
    th.save(thumb, "WEBP", quality=80, method=6)
    print(f"{base:34s} {im.width}x{im.height}  full {full.stat().st_size/1024:6.1f} KB  thumb {thumb.stat().st_size/1024:5.1f} KB")


def main() -> None:
    for pdf in sorted(SRC.glob("*.pdf")):
        convert(pdf)


if __name__ == "__main__":
    main()
