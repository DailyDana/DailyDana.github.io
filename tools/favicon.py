"""favicon.svg'den apple-touch-icon.png (180 px) ve favicon.ico (16/32/48) üretir.

Kullanım: python tools/favicon.py   (Playwright + Edge ile SVG render, Pillow ile ico)
"""
from __future__ import annotations

import asyncio
from io import BytesIO
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"


async def render(size: int) -> bytes:
    svg = (IMG / "favicon.svg").read_text(encoding="utf-8")
    html = f"<!doctype html><html><head><style>html,body{{margin:0;background:transparent}}svg{{display:block;width:{size}px;height:{size}px}}</style></head><body>{svg}</body></html>"
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        page = await browser.new_page(viewport={"width": size, "height": size}, device_scale_factor=1)
        await page.set_content(html)
        png = await page.screenshot(omit_background=True, clip={"x": 0, "y": 0, "width": size, "height": size})
        await browser.close()
    return png


async def main() -> None:
    big = Image.open(BytesIO(await render(180))).convert("RGBA")
    big.save(IMG / "apple-touch-icon.png", optimize=True)
    base = Image.open(BytesIO(await render(64))).convert("RGBA")
    base.save(IMG / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    for f in ("apple-touch-icon.png", "favicon.ico"):
        print(f"{f}: {(IMG / f).stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    asyncio.run(main())
