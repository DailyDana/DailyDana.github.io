"""Yerel sunucudaki sayfaların ekran görüntüsünü alır (kalite kontrol için).

Kullanım: python -m http.server 8000  (depo kökünde)  →  python tools/preview.py
Edge'in kurulu Chromium'unu kullanır (Playwright channel="msedge"); tarayıcı indirmez.
Çıktı: tools/.cache/preview/*.png + her sayfa için dil/tema/yatay taşma/konsol hatası raporu.
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
OUT = Path(__file__).resolve().parent / ".cache" / "preview"

# (ad, yol, genişlik, renk şeması, beklenen dil)
SHOTS = [
    ("index-1440-light-tr", "/", 1440, "light", "tr"),
    ("index-1440-dark-en", "/?lang=en", 1440, "dark", "en"),
    ("index-360-light-tr", "/", 360, "light", "tr"),
    ("index-360-dark-en", "/?lang=en", 360, "dark", "en"),
    ("404-900-light", "/404.html", 900, "light", "tr"),
]
# Açık temada bölüm bazlı yakın çekimler (tam sayfa görüntüsü ayrıntı için fazla küçülüyor)
SECTIONS = ["#hero", "#projectsFeatured", "#projectsMore", "#tools", "#skills", "#experience", "#egitim", "#iletisim"]


async def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    bad = 0
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")
        for name, path, width, scheme, lang in SHOTS:
            ctx = await browser.new_context(viewport={"width": width, "height": 900}, color_scheme=scheme, device_scale_factor=1)
            page = await ctx.new_page()
            errors: list[str] = []
            page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("requestfailed", lambda r: errors.append(f"requestfailed {r.url}"))
            page.on("response", lambda r: errors.append(f"{r.status} {r.url}") if r.status >= 400 else None)
            await page.goto(BASE + path, wait_until="networkidle")
            await page.evaluate("document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in'))")
            # lazy görseller yüklensin diye sayfayı adım adım kaydır, sonra başa dön
            height = await page.evaluate("document.documentElement.scrollHeight")
            for y in range(0, height, 700):
                await page.evaluate(f"window.scrollTo(0, {y})")
                await page.wait_for_timeout(60)
            await page.evaluate("window.scrollTo(0, 0)")
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(700)
            await page.screenshot(path=str(OUT / f"{name}.png"), full_page=True)
            if scheme == "light" and not path.endswith("404.html"):
                for sel in SECTIONS:
                    el = page.locator(sel).first
                    if await el.count():
                        await el.screenshot(path=str(OUT / f"{name}-{sel.strip('#').replace(' ', '_').replace('.', '')}.png"))
            got_lang = await page.evaluate("document.documentElement.lang")
            theme = await page.evaluate("document.documentElement.dataset.theme || ''")
            sw = await page.evaluate("document.documentElement.scrollWidth")
            title = await page.title()
            ok = got_lang == lang and (theme == scheme or path.endswith("404.html")) and sw <= width and not errors
            bad += 0 if ok else 1
            print(f"{'OK ' if ok else 'BAD'} {name}: lang={got_lang} theme={theme} scrollWidth={sw}/{width} title={title!r}")
            for e in errors:
                print("     ", e)
            await ctx.close()
        await browser.close()
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
