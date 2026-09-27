/* =========================================================
   Site içeriği. Metin alanları ya düz string (ad, sayı, URL)
   ya da { tr: '...', en: '...' } biçiminde iki dilli.
   Yeni proje/sertifika eklemek için yalnızca bu dosya düzenlenir.
   ========================================================= */
window.PORTFOLIO = {
  meta: {
    name: 'İsmail Bilgehan Kazancı',
    location: 'Bursa',
    updated: '2026-09-27',
    links: {
      github: 'https://github.com/DailyDana',
      linkedin: 'https://www.linkedin.com/in/ismailbilgehankazanci',
      cvTr: '',
      cvEn: ''
    }
  },

  ui: {
    tr: {
      'title.home': 'İsmail Bilgehan Kazancı · İmalat mühendisliği, SPC ve Python',
      'btn.demo': 'Canlı demo',
      'btn.repo': 'Kaynak kod',
      'btn.case': 'Vaka çalışması',
      'btn.site': 'Siteyi aç',
      'btn.release': 'Sürümler',
      'btn.pdf': 'PDF',
      'status.wip': 'geliştiriliyor',
      'status.active': 'aktif',
      'status.done': 'tamamlandı',
      'xp.now': 'devam ediyor',
      'xp.volunteer': 'gönüllü',
      'xp.seasonal': 'sezonluk',
      'xp.month': '1 ay',
      'menu.open': 'Menüyü aç',
      'menu.close': 'Menüyü kapat',
      'theme.dark': 'Koyu temaya geç',
      'theme.light': 'Açık temaya geç',
      'cert.verify': 'Doğrula',
      'aria.menu': 'Ana menü',
      'aria.brand': 'İsmail Bilgehan Kazancı · ana sayfa',
      'aria.crumb': 'Sayfa yolu',
      'aria.metrics': 'Özet sayılar',
      'cpk.low': 'yetersiz',
      'cpk.marginal': 'sınırda',
      'cpk.ok': 'yeterli',
      'cpk.onesided': 'tek taraflı spek: Cp tanımsız',
      'cpk.invalid': 'geçersiz girdi: σ > 0 ve USL > LSL olmalı',
      'cpk.caveat': 'Eşik 1,33 bir müşteri sözleşmesidir, istatistik yasası değil; kararlılık doğrulanmadan hiçbir Cpk geçerli değildir.',
      'noscript': 'Bu liste JavaScript ile oluşturuluyor. Projeler için GitHub profiline bakabilirsin:'
    },
    en: {
      'title.home': 'İsmail Bilgehan Kazancı · Manufacturing engineering, SPC & Python',
      'btn.demo': 'Live demo',
      'btn.repo': 'Source code',
      'btn.case': 'Case study',
      'btn.site': 'Open site',
      'btn.release': 'Releases',
      'btn.pdf': 'PDF',
      'status.wip': 'in progress',
      'status.active': 'active',
      'status.done': 'completed',
      'xp.now': 'present',
      'xp.volunteer': 'volunteer',
      'xp.seasonal': 'seasonal',
      'xp.month': '1 month',
      'menu.open': 'Open menu',
      'menu.close': 'Close menu',
      'theme.dark': 'Switch to dark theme',
      'theme.light': 'Switch to light theme',
      'cert.verify': 'Verify',
      'aria.menu': 'Main menu',
      'aria.brand': 'İsmail Bilgehan Kazancı · home',
      'aria.crumb': 'Breadcrumb',
      'aria.metrics': 'Headline numbers',
      'cpk.low': 'not capable',
      'cpk.marginal': 'marginal',
      'cpk.ok': 'capable',
      'cpk.onesided': 'one-sided spec: Cp undefined',
      'cpk.invalid': 'invalid input: σ > 0 and USL > LSL required',
      'cpk.caveat': 'The 1.33 threshold is a customer convention, not a statistical law; no Cpk is valid until stability has been verified.',
      'noscript': 'This list is rendered with JavaScript. The projects are on GitHub:'
    }
  },

  projects: [
    {
      slug: 'spc-analyzer',
      repo: 'process-capability-analyzer',
      order: 1, featured: true, cluster: 'quality', status: 'active', year: '2026',
      title: { tr: 'Süreç Yeterliliği ve SPC Analiz Aracı', en: 'Process Capability & SPC Analyzer' },
      summary: {
        tr: 'X̄-R, X̄-S ve I-MR kontrol grafikleri; 4 Western Electric + 8 Nelson kuralı; Cp/Cpk (grup içi) ve Pp/Ppk (genel). Yeterlilikten önce kararlılığı denetler, yorumları kural tabanlı üretir, CSV/Excel/PDF rapor verir. Montgomery\'nin piston segmanı verisiyle yayınlanan değerlere karşı doğrulandı.',
        en: 'X̄-R, X̄-S and I-MR control charts; 4 Western Electric + 8 Nelson rules; Cp/Cpk (within) and Pp/Ppk (overall). Checks stability before capability, produces rule-based interpretations and CSV/Excel/PDF reports. Validated against Montgomery\'s published piston-ring results.'
      },
      tags: ['Python', 'Streamlit', 'SPC', 'pytest', 'Apache-2.0'],
      metrics: [
        { value: '776', label: { tr: 'test', en: 'tests' } },
        { value: '12', label: { tr: 'çalışma kuralı', en: 'run rules' } },
        { value: '3', label: { tr: 'grafik tipi', en: 'chart types' } }
      ],
      links: [
        { kind: 'demo', url: 'https://spc-analyzer.streamlit.app/' },
        { kind: 'repo', url: 'https://github.com/DailyDana/process-capability-analyzer' }
      ],
      page: '/projeler/spc-analyzer/',
      image: { src: '/assets/img/projects/spc-analyzer.webp', w: 1200, h: 898, alt: { tr: 'I-MR kontrol grafiği çıktısı', en: 'I-MR control chart output' } }
    },
    {
      slug: 'hoffmann-line-balancing',
      repo: 'hoffmann-line-balancing',
      order: 2, featured: true, cluster: 'quality', status: 'active', year: '2026',
      title: { tr: 'Hoffmann Montaj Hattı Dengeleme', en: 'Hoffmann Assembly Line Balancing' },
      summary: {
        tr: 'SALBP-1 için Hoffmann (1963) öncelik matrisi yöntemi: her istasyon için uygun tüm alt kümeleri sayar. Komut satırı + beş dilli Streamlit arayüzü, çevrim süresi taraması. Brute-force ve bitmask-DP çözücülerle çapraz doğrulandı; ders ödevi olarak başlayan kodun aslında first-fit olduğu görülünce sıfırdan yazıldı.',
        en: 'Hoffmann\'s (1963) precedence-matrix method for SALBP-1: enumerates every feasible subset per station. CLI + five-language Streamlit UI, cycle-time sweep. Cross-checked against brute-force and bitmask-DP solvers; rewritten from scratch after a review showed the original coursework code was first-fit, not Hoffmann.'
      },
      tags: ['Python', 'Streamlit', { tr: 'Yöneylem', en: 'Operations research' }, 'hypothesis', 'Apache-2.0'],
      metrics: [
        { value: '127', label: { tr: 'test', en: 'tests' } },
        { value: '5', label: { tr: 'arayüz dili', en: 'UI languages' } },
        { value: '2', label: { tr: 'doğrulama çözücüsü', en: 'oracle solvers' } }
      ],
      links: [
        { kind: 'demo', url: 'https://hoffmann-line-balancing.streamlit.app/' },
        { kind: 'repo', url: 'https://github.com/DailyDana/hoffmann-line-balancing' }
      ],
      page: '/projeler/hoffmann-line-balancing/',
      image: { src: '/assets/img/projects/hoffmann-line-balancing.webp', w: 1200, h: 1520, alt: { tr: 'Hat dengeleme Streamlit arayüzü', en: 'Line balancing Streamlit interface' } }
    },
    {
      slug: 'aniflow',
      repo: 'Aniflow',
      order: 3, featured: true, cluster: 'software', status: 'active', year: '2026',
      title: { tr: 'Aniflow — Video Upscale Aracı', en: 'Aniflow — Video Upscaler' },
      summary: {
        tr: 'Anime4K ve FSRCNNX GLSL shader zincirlerini ffmpeg libplacebo ile videoya kalıcı olarak uygulayan taşınabilir Windows aracı. Real-ESRGAN AI upscale, RIFE 2x kare ara değerleme, QSV/NVENC/AMF donanım kodlama, çoklu GPU seçimi, sürükle-bırak kuyruk ve tek satırlık kurulum betiği.',
        en: 'Portable Windows tool that permanently applies Anime4K and FSRCNNX GLSL shader chains to video through ffmpeg libplacebo. Real-ESRGAN AI upscaling, RIFE 2x frame interpolation, QSV/NVENC/AMF hardware encoding, multi-GPU selection, drag-and-drop queue and a one-line installer.'
      },
      tags: ['PowerShell', 'WinForms', 'ffmpeg', 'GLSL', 'MIT'],
      metrics: [
        { value: 'v1.4', label: { tr: 'sürüm', en: 'release' } },
        { value: '11', label: { tr: 'shader ön ayarı', en: 'shader presets' } },
        { value: '3', label: { tr: 'GPU kodlayıcı', en: 'GPU encoders' } }
      ],
      links: [
        { kind: 'repo', url: 'https://github.com/DailyDana/Aniflow' },
        { kind: 'release', url: 'https://github.com/DailyDana/Aniflow/releases' }
      ],
      page: '/projeler/aniflow/',
      image: { src: '/assets/img/projects/aniflow.webp', w: 676, h: 749, alt: { tr: 'Aniflow arayüzü', en: 'Aniflow interface' } }
    },
    {
      slug: 'codecdelta',
      repo: 'CodecDelta',
      order: 4, featured: false, cluster: 'software', status: 'wip', year: '2026',
      title: { tr: 'CodecDelta — Ses Kodlama Farkı Analizi', en: 'CodecDelta — Audio Codec Delta Analysis' },
      summary: {
        tr: 'Kayıplı bir kodlayıcının kayda ne yaptığını ölçen araç: Ogg/Opus/Vorbis/FLAC/MP3 bit akışı okuyucuları, alt-örnek hizalama ve geçerlilik ölçüsü, kapalı formlu ABX istatistiği. Her tasarım kararı ölçülerek verildi ve belgelendi; arayüz henüz yok.',
        en: 'Measures what a lossy encoder did to a recording: Ogg/Opus/Vorbis/FLAC/MP3 bitstream readers, sub-sample alignment with a validity measure, closed-form ABX statistics. Every design decision was measured and documented; no UI yet.'
      },
      tags: ['Python', 'numpy', 'DSP', 'mypy --strict', 'GPL-3.0'],
      metrics: [
        { value: '231', label: { tr: 'test', en: 'tests' } },
        { value: '57×', label: { tr: 'hızlanma (readinto)', en: 'speed-up (readinto)' } },
        { value: '5', label: { tr: 'bit akışı formatı', en: 'bitstream formats' } }
      ],
      links: [
        { kind: 'repo', url: 'https://github.com/DailyDana/CodecDelta' }
      ],
      page: '/projeler/codecdelta/',
      image: null
    },
    {
      slug: 'cad-calismalari',
      repo: 'cannon-model',
      order: 5, featured: false, cluster: 'cad', status: 'done', year: '2026',
      title: { tr: 'CAD Çalışmaları — Donanma Topu ve Napoleon Sahra Topu', en: 'CAD Work — Naval Cannon & Napoleon Field Gun' },
      summary: {
        tr: 'SolidWorks\'te sekiz parça, iki montaj ve teknik resimleriyle bir donanma topu; Siemens NX\'te 19 parçalı Napoleon 12\'lik sahra topu montajı ve montaj resmi. Parça modelleme, montaj kısıtları ve teknik resim standartları üzerine çalışma.',
        en: 'A naval cannon in SolidWorks with eight parts, two assemblies and full drawings; a 19-part Napoleon 12-pounder field gun assembly and assembly drawing in Siemens NX. Practice in part modelling, assembly mates and drawing standards.'
      },
      tags: ['SolidWorks', 'Siemens NX', { tr: 'Teknik resim', en: 'Technical drawing' }],
      metrics: [
        { value: '27', label: { tr: 'parça', en: 'parts' } },
        { value: '3', label: { tr: 'montaj', en: 'assemblies' } },
        { value: '10', label: { tr: 'teknik resim', en: 'drawings' } }
      ],
      links: [
        { kind: 'repo', url: 'https://github.com/DailyDana/cannon-model', label: { tr: 'SolidWorks deposu', en: 'SolidWorks repo' } },
        { kind: 'repo', url: 'https://github.com/DailyDana/napoleon-artillery-cannon', label: { tr: 'NX deposu', en: 'NX repo' } }
      ],
      page: '/projeler/cad-calismalari/',
      image: { src: '/assets/img/cad/cannon-top-assem-thumb.webp', w: 800, h: 574, alt: { tr: 'Donanma topu montaj teknik resmi', en: 'Naval cannon assembly drawing' } }
    }
  ],

  tools: [
    {
      name: { tr: 'mpv yapılandırması · Anime4K + RIFE', en: 'mpv configuration · Anime4K + RIFE' },
      desc: {
        tr: 'uosc tabanlı canlı ayar panelleri, çözünürlüğe göre RIFE politikası, shader profilleri, LUT menüsü ve SHA-256 karşılaştırmalı güncelleme sistemi. README\'de ölçülerek bulunan yedi hatanın kaydı var.',
        en: 'uosc-based live settings panels, resolution-aware RIFE policy, shader profiles, LUT menu and a SHA-256 update checker. The README records seven bugs found by measurement.'
      },
      tech: ['Lua', 'mpv', 'VapourSynth'],
      links: [{ kind: 'repo', url: 'https://github.com/DailyDana/mpv-player-anime4k-rife-frame-interpolation-config' }]
    },
    {
      name: 'LUT Studio',
      desc: {
        tr: 'Bir videonun seçilen karesine 60 renk LUT\'unu tek ffmpeg geçişinde uygulayıp galeri olarak gösteren WinForms aracı; seçilen LUT videoya renk etiketleri korunarak işlenir.',
        en: 'WinForms tool that renders 60 colour LUTs onto one frame of a video in a single ffmpeg pass and shows them as a gallery; the chosen LUT is baked in with colour tags preserved.'
      },
      tech: ['PowerShell', 'ffmpeg', 'lut3d'],
      links: []
    },
    {
      name: { tr: 'Sistem onarım betikleri', en: 'System repair scripts' },
      desc: {
        tr: 'UDP port tükenmesini süreç bazında izleyen kayıt aracı, sürücü güncellemesinde bozulan monitör kimliklerini onaran betik, pano yazma olaylarını izleyerek bir yapıştırma hatasını teşhis eden araç.',
        en: 'A per-process UDP port-exhaustion monitor, a script that repairs monitor IDs broken by driver updates, and a clipboard tracer that diagnosed a paste failure.'
      },
      tech: ['PowerShell', 'Windows'],
      links: []
    },
    {
      name: { tr: 'HSD Gazi web sitesi', en: 'HSD Gazi website' },
      desc: {
        tr: 'Huawei Student Developers Gazi topluluğu için kütüphanesiz tek sayfa site: veri dosyasından üretilen etkinlik kartları, takvim linkleri, erişilebilir mobil menü.',
        en: 'Library-free single-page site for the Huawei Student Developers Gazi community: event cards rendered from a data file, calendar links, accessible mobile navigation.'
      },
      tech: ['HTML', 'CSS', 'JavaScript'],
      links: [
        { kind: 'site', url: 'https://dailydana.github.io/hsd-gazi-web/' },
        { kind: 'repo', url: 'https://github.com/DailyDana/hsd-gazi-web' }
      ]
    }
  ],

  skills: [
    {
      id: 'quality',
      title: { tr: 'Kalite ve süreç', en: 'Quality & process' },
      blurb: { tr: 'Ölçüm verisinden karar çıkarmak: kararlılık, yeterlilik, hat dengesi.', en: 'Turning measurement data into decisions: stability, capability, line balance.' },
      items: [
        { name: 'SPC · X̄-R, X̄-S, I-MR', note: { tr: 'Kontrol limitleri yayınlanan sabitlerle; 4 WE + 8 Nelson kuralı', en: 'Limits from published constants; 4 WE + 8 Nelson rules' }, projects: ['spc-analyzer'] },
        { name: 'Cp/Cpk · Pp/Ppk · DPMO', note: { tr: 'Grup içi/genel sigma ayrımı, tek taraflı spek, güven aralığı', en: 'Within/overall sigma, one-sided specs, confidence interval' }, projects: ['spc-analyzer'] },
        { name: { tr: 'Normallik testleri', en: 'Normality tests' }, note: { tr: 'Shapiro-Wilk, Anderson-Darling; küçük örneklem korumaları', en: 'Shapiro-Wilk, Anderson-Darling; small-sample guards' }, projects: ['spc-analyzer'] },
        { name: { tr: 'Hat dengeleme (SALBP)', en: 'Line balancing (SALBP)' }, note: { tr: 'Hoffmann öncelik matrisi, çevrim süresi taraması', en: 'Hoffmann precedence matrix, cycle-time sweep' }, projects: ['hoffmann-line-balancing'] },
        { name: 'Six Sigma White Belt', note: { tr: 'CSSC, 2026', en: 'CSSC, 2026' }, projects: [] }
      ]
    },
    {
      id: 'software',
      title: { tr: 'Yazılım ve otomasyon', en: 'Software & automation' },
      blurb: { tr: 'Tekrarlanan işi test edilmiş araca dönüştürmek.', en: 'Turning repeated work into tested tools.' },
      items: [
        { name: 'Python', note: { tr: 'numpy, pandas, scipy, Streamlit; pytest, hypothesis, mypy --strict, ruff', en: 'numpy, pandas, scipy, Streamlit; pytest, hypothesis, mypy --strict, ruff' }, projects: ['spc-analyzer', 'hoffmann-line-balancing', 'codecdelta'] },
        { name: 'PowerShell', note: { tr: 'WinForms arayüzler, ffmpeg otomasyonu, sistem betikleri', en: 'WinForms GUIs, ffmpeg automation, system scripts' }, projects: ['aniflow'] },
        { name: 'ffmpeg · libplacebo · DSP', note: { tr: 'Shader zincirleri, LUT işleme, bit akışı ayrıştırma', en: 'Shader chains, LUT baking, bitstream parsing' }, projects: ['aniflow', 'codecdelta'] },
        { name: 'Git · GitHub Actions', note: { tr: 'Her depoda CI; Conventional Commits', en: 'CI on every repo; Conventional Commits' }, projects: [] },
        { name: 'Lua · HTML/CSS/JS', note: { tr: 'mpv eklentileri, kütüphanesiz statik siteler', en: 'mpv plugins, library-free static sites' }, projects: [] },
        { name: 'Power BI', note: { tr: 'Microsoft Learn rozetleri', en: 'Microsoft Learn badges' }, projects: [] }
      ]
    },
    {
      id: 'cad',
      title: { tr: 'CAD / CAM', en: 'CAD / CAM' },
      blurb: { tr: 'Parça, montaj ve teknik resim; CNC tarafında uygulamalı ders deneyimi.', en: 'Parts, assemblies and drawings; hands-on CNC coursework.' },
      items: [
        { name: 'SolidWorks', note: { tr: 'Parça/montaj/teknik resim; LinkedIn Learning ileri çizim eğitimi', en: 'Parts/assemblies/drawings; LinkedIn Learning advanced drawings course' }, projects: ['cad-calismalari'] },
        { name: 'Siemens NX', note: { tr: '19 parçalı montaj ve montaj resmi', en: '19-part assembly and assembly drawing' }, projects: ['cad-calismalari'] },
        { name: 'Mastercam · AutoCAD', note: { tr: 'CAM takım yolu ve 2B çizim dersleri', en: 'CAM toolpath and 2D drafting coursework' }, projects: [] },
        { name: { tr: 'CNC torna · teknik resim', en: 'CNC lathe · technical drawing' }, note: { tr: 'Uygulamalı atölye dersleri', en: 'Hands-on workshop courses' }, projects: [] }
      ]
    }
  ],

  experience: [
    {
      org: 'HUAWEI Student Developers Türkiye',
      role: { tr: 'Denetim Kurulu Başkanı', en: 'Chair of the Audit Board' },
      type: 'volunteer', location: 'Türkiye',
      start: '2026-04', end: null,
      bullets: [
        { tr: 'Huawei destekli öğrenci geliştirici programının Türkiye yapılanmasında gönüllü görev.', en: 'Volunteer role in the Türkiye organisation of the Huawei-backed student developer programme.' },
        { tr: 'HSD Gazi topluluk sitesinin tasarımı ve geliştirilmesi (yayında).', en: 'Designed and built the HSD Gazi community website (live).' }
      ],
      links: [{ kind: 'site', url: 'https://dailydana.github.io/hsd-gazi-web/' }]
    },
    {
      org: 'Doruk Hastaneleri',
      role: { tr: 'Bilgi Sistemleri Yardımcı Personeli', en: 'IT Systems Assistant' },
      type: 'seasonal', location: 'Bursa',
      start: '2023-06', end: '2023-06',
      bullets: [
        { tr: 'Donanım ve yazılım kurulumu, kullanıcı desteği.', en: 'Hardware and software setup, user support.' },
        { tr: 'Ağ kablolama, envanter takibi, dizüstü ve disk onarımı.', en: 'Network cabling, asset inventory, laptop and HDD repair.' }
      ],
      links: []
    }
  ],

  education: [
    {
      school: { tr: 'Gazi Üniversitesi · Teknoloji Fakültesi', en: 'Gazi University · Faculty of Technology' },
      degree: { tr: 'İmalat Mühendisliği (Lisans)', en: 'B.Sc. Manufacturing Engineering' },
      notes: { tr: 'Uygulamalı CNC ve CAD/CAM dersleri; SPC ve kalite mühendisliği odağı.', en: 'Hands-on CNC and CAD/CAM coursework; focus on SPC and quality engineering.' }
    }
  ],

  languages: [
    { name: { tr: 'Türkçe', en: 'Turkish' }, level: { tr: 'ana dil', en: 'native' } },
    { name: { tr: 'İngilizce', en: 'English' }, level: { tr: 'profesyonel çalışma yetkinliği', en: 'professional working proficiency' } }
  ],

  certificates: [
    { title: 'Six Sigma White Belt', issuer: 'Council for Six Sigma Certification (CSSC)', date: '2026-09', id: 'jJSN0zWra1', url: '' },
    { title: { tr: 'SOLIDWORKS: İleri Mühendislik Çizimleri', en: 'SOLIDWORKS: Advanced Engineering Drawings' }, issuer: 'LinkedIn Learning', date: '', id: '', url: '' },
    { title: { tr: 'Proje ve Risk Yönetimi', en: 'Project and Risk Management' }, issuer: 'BTK Akademi', date: '', id: '', url: '' },
    { title: 'Project Management Tips', issuer: 'LinkedIn', date: '2026-03', id: '', url: '' },
    { title: { tr: 'Veri analizini keşfetme', en: 'Explore data analysis' }, issuer: 'Microsoft Learn', date: '', id: '', url: '' },
    { title: { tr: 'Power BI ile oluşturmaya başlama', en: 'Get started building with Power BI' }, issuer: 'Microsoft Learn', date: '', id: '', url: '' }
  ]
};
