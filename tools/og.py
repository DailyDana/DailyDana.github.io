"""OG (paylaşım) görsellerini üretir: tools/og/template.html → 1200×630 PNG.

Kullanım: python -m http.server 8000 (depo kökünde) → python tools/og.py [http://127.0.0.1:8000]
Çıktı: assets/img/og-default.png ve OG_PAGES'teki her sayfa için projeler/<slug>/og.png.
PNG olması şart (LinkedIn/WhatsApp WebP'yi çekmeyebiliyor); Pillow ile palet PNG'ye indirgenir.
"""
from __future__ import annotations

import asyncio
import sys
from io import BytesIO
from pathlib import Path
from urllib.parse import urlencode

from PIL import Image
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"

# (çıktı yolu, sorgu parametreleri); boş sözlük = şablonun varsayılanı
OG_PAGES: list[tuple[Path, dict[str, str]]] = [
    (ROOT / "assets" / "img" / "og-default.png", {}),
]


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        for out, params in OG_PAGES:
            url = f"{BASE}/tools/og/template.html" + (f"?{urlencode(params)}" if params else "")
            await page.goto(url, wait_until="networkidle")
            await page.evaluate("document.fonts.ready")
            await page.wait_for_timeout(200)
            png = await page.screenshot(clip={"x": 0, "y": 0, "width": 1200, "height": 630})
            im = Image.open(BytesIO(png)).convert("RGB").quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
            out.parent.mkdir(parents=True, exist_ok=True)
            im.save(out, "PNG", optimize=True)
            print(f"{out.relative_to(ROOT)}: {out.stat().st_size / 1024:.1f} KB")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
