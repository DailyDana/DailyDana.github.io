# dailydana.github.io

İsmail Bilgehan Kazancı'nın kişisel portföy sitesi: **https://dailydana.github.io/**

Kütüphanesiz statik site (HTML + CSS + JS), derleme adımı yok. Türkçe varsayılan, sağ üstten İngilizce'ye geçilir; açık/koyu tema.

## İçerik nasıl düzenlenir

| Ne | Nerede |
|---|---|
| Projeler, araçlar, beceriler, deneyim, eğitim, sertifikalar | `assets/js/data.js` — her metin alanı ya düz string ya `{ tr: '…', en: '…' }` |
| Hero, Hakkımda, İletişim gibi düzyazı bölümler | `index.html` — her metin `<span data-lang="tr">…</span><span data-lang="en">…</span>` çifti hâlinde |
| Renkler ve yazı tipleri | `assets/css/style.css` başındaki `:root` ve `[data-theme="dark"]` token'ları |
| Arayüz metinleri (düğme etiketleri vb.) | `data.js` içindeki `ui.tr` / `ui.en` |

Yeni proje eklerken `projects` dizisine bir nesne eklemek yeterli; `featured: true` olanlar büyük kart, diğerleri orta kart olur. Görseller `assets/img/projects/<slug>.webp`.

## Yerelde çalıştırma

Yollar kök-göreli (`/assets/...`) olduğu için dosyayı doğrudan açmak yerine bir sunucu gerekir:

```powershell
python -m http.server 8000
# http://localhost:8000/
```

## Yardımcı betikler (`tools/`)

- `images.py` — proje görsellerini WebP'ye çevirir (Pillow).
- `check.py` — dil çiftleri, CSS'te literal renk, kırık iç bağlantı, `<img>` boyut/alt kontrolü.

Bunlar derleme adımı değildir; site onlar olmadan da çalışır.

## Yayın

GitHub Pages, `main` dalı kökünden yayınlanır (`.nojekyll` ile). Yeni commit push edilince site birkaç dakika içinde güncellenir.

## Lisans

Kod MIT lisanslıdır (`LICENSE`). Metinler, görseller ve kişisel bilgiler © İsmail Bilgehan Kazancı, tüm hakları saklıdır.
