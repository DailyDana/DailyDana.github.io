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
    (ROOT / "projeler" / "spc-analyzer" / "og.png", {
        "kicker": "Vaka çalışması · Kalite ve süreç",
        "title": "Süreç yeterliliği ve *SPC* analiz aracı", "sheet": "02",
        "sub": "X̄-R, X̄-S, I-MR; 4 Western Electric + 8 Nelson kuralı; Cp/Cpk ve Pp/Ppk. Önce kararlılık, sonra yeterlilik.",
        "m1": "776 test", "m2": "Apache-2.0 lisans", "m3": "Streamlit canlı demo",
        "url": "dailydana.github.io/projeler/spc-analyzer",
    }),
    (ROOT / "projeler" / "hoffmann-line-balancing" / "og.png", {
        "kicker": "Vaka çalışması · Üretim planlama",
        "title": "Hoffmann ile *montaj hattı* dengeleme", "sheet": "03",
        "sub": "SALBP-1, öncelik matrisi yöntemi; CLI + beş dilli Streamlit. Ders ödevi olarak başladı, inceleme sonrası sıfırdan yazıldı.",
        "m1": "127 test", "m2": "2 doğrulama çözücüsü", "m3": "5 arayüz dili",
        "url": "dailydana.github.io/projeler/hoffmann-line-balancing",
    }),
    (ROOT / "projeler" / "aniflow" / "og.png", {
        "kicker": "Vaka çalışması · Yazılım ve otomasyon",
        "title": "Aniflow: *shader tabanlı* video upscale", "sheet": "04",
        "sub": "Anime4K/FSRCNNX shader zincirlerini ffmpeg libplacebo ile videoya kalıcı işler; RIFE, Real-ESRGAN, donanım kodlama, tek satır kurulum.",
        "m1": "v1.4 sürüm", "m2": "11 shader ön ayarı", "m3": "MIT lisans",
        "url": "dailydana.github.io/projeler/aniflow",
    }),
    (ROOT / "projeler" / "codecdelta" / "og.png", {
        "kicker": "Vaka çalışması · Sinyal işleme",
        "title": "CodecDelta: *ölçülerek* verilmiş kararlar", "sheet": "05",
        "sub": "Kayıplı kodlayıcının kayda ne yaptığını ölçen motor; her tasarım kararı ölçüldü, reddedilenler belgelendi.",
        "m1": "231 test", "m2": "57× hızlanma", "m3": "12.600 denetim denemesi",
        "url": "dailydana.github.io/projeler/codecdelta",
    }),
    (ROOT / "projeler" / "cad-calismalari" / "og.png", {
        "kicker": "Vaka çalışması · CAD / CAM",
        "title": "Donanma topu ve *Napoleon* sahra topu", "sheet": "06",
        "sub": "Donanma topu: 8 parça, 2 montaj, 9 teknik resim. Napoleon 12'lik sahra topu: 19 parça, montaj resmi.",
        "m1": "27 parça", "m2": "3 montaj", "m3": "10 teknik resim",
        "url": "dailydana.github.io/projeler/cad-calismalari",
    }),
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
            im = Image.open(BytesIO(png)).convert("RGB").quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
            out.parent.mkdir(parents=True, exist_ok=True)
            im.save(out, "PNG", optimize=True)
            print(f"{out.relative_to(ROOT)}: {out.stat().st_size / 1024:.1f} KB")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
