/* =========================================================
   Portföy site betiği (kütüphanesiz).
   İçerik için data.js'e bakın; burada yalnızca davranış var.
   Renderer'lar her metni iki dilde (data-lang çifti) üretir;
   dil değişince hiçbir şey yeniden çizilmez, CSS gösterir/gizler.
   ========================================================= */
(() => {
  'use strict';

  const D = window.PORTFOLIO || {};
  const root = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  const isHttp = u => typeof u === 'string' && /^https?:\/\//i.test(u.trim());
  const isPath = u => typeof u === 'string' && /^\/[^\s]*$/.test(u.trim());
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safe = (name, fn) => { try { fn(); } catch (err) { console.error(`[portfolio] ${name}:`, err); } };
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* özel pencere vb. */ } }
  };

  /* ---------- dil yardımcıları ---------- */
  const getLang = () => (root.lang === 'en' ? 'en' : 'tr');
  const ui = (key, lang = getLang()) => D.ui?.[lang]?.[key] ?? D.ui?.tr?.[key] ?? key;
  const pick = (v, lang = getLang()) => (v && typeof v === 'object') ? (v[lang] ?? v.tr ?? '') : (v ?? '');
  // iki dilli alan → çift span; düz string → kaçışlı metin
  const t = (v, tag = 'span') => {
    if (v == null) return '';
    if (typeof v !== 'object') return esc(v);
    return `<${tag} data-lang="tr">${esc(v.tr ?? '')}</${tag}><${tag} data-lang="en">${esc(v.en ?? '')}</${tag}>`;
  };
  const tu = key => t({ tr: ui(key, 'tr'), en: ui(key, 'en') });

  const MONTHS = {
    tr: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  const ym = (s, lang) => {
    const m = /^(\d{4})-(\d{2})$/.exec(String(s || ''));
    if (!m) return /^\d{4}$/.test(String(s || '')) ? String(s) : '';
    return `${MONTHS[lang][+m[2] - 1]} ${m[1]}`;
  };
  const tDate = s => s ? t({ tr: ym(s, 'tr'), en: ym(s, 'en') }) : '';

  const extLink = (url, inner, cls = '') =>
    `<a${cls ? ` class="${cls}"` : ''} href="${esc(url.trim())}" target="_blank" rel="noopener">${inner} <span aria-hidden="true">↗</span></a>`;
  const linkLabel = l => l.label ? t(l.label) : tu(`btn.${l.kind}`);
  const links = arr => (Array.isArray(arr) ? arr : []).filter(l => l && isHttp(l.url)).map(l => extLink(l.url, linkLabel(l))).join('');
  const chips = arr => (Array.isArray(arr) ? arr : []).map(x => `<span class="chip">${t(x)}</span>`).join('');
  const metrics = arr => (Array.isArray(arr) ? arr : []).map(m => `<span class="metric"><b>${esc(m.value)}</b>${t(m.label)}</span>`).join('');

  /* ---------- dil ve tema geçişleri ---------- */
  const titleEl = $('title');
  const applyLangLabels = () => {
    const lang = getLang();
    if (titleEl && titleEl.dataset[lang]) document.title = titleEl.dataset[lang];
    $$('img[data-alt-tr]').forEach(img => { img.alt = img.dataset[`alt${lang === 'en' ? 'En' : 'Tr'}`] || ''; });
    $$('[data-aria]').forEach(el => el.setAttribute('aria-label', ui(el.dataset.aria)));
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
    const toggle = $('#navToggle');
    if (toggle) toggle.setAttribute('aria-label', ui(toggle.getAttribute('aria-expanded') === 'true' ? 'menu.close' : 'menu.open'));
    const theme = $('#themeToggle');
    if (theme) theme.setAttribute('aria-label', ui(root.dataset.theme === 'dark' ? 'theme.light' : 'theme.dark'));
  };

  safe('lang', () => {
    const btns = $$('[data-lang-set]');
    const apply = (lang, fromClick) => {
      root.lang = lang;
      btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.langSet === lang)));
      if (fromClick) {
        store.set('lang', lang);
        const u = new URL(location.href);
        if (lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
        history.replaceState(null, '', u);
      }
      applyLangLabels();
    };
    btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.langSet === 'en' ? 'en' : 'tr', true)));
    apply(getLang(), false);
  });

  safe('theme', () => {
    const btn = $('#themeToggle');
    const meta = $('meta[name="theme-color"]');
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (theme, fromClick) => {
      root.dataset.theme = theme;
      if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
      if (fromClick) store.set('theme', theme);
      if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim() || meta.content;
      applyLangLabels();
    };
    if (btn) btn.addEventListener('click', () => apply(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
    mq.addEventListener('change', e => { if (!store.get('theme')) apply(e.matches ? 'dark' : 'light', false); });
    apply(root.dataset.theme === 'dark' ? 'dark' : 'light', false);
  });

  /* ---------- görünme animasyonu ---------- */
  let revealIO = null;
  const reveal = els => {
    els.forEach(el => {
      if (!revealIO) { el.classList.add('is-in'); return; }
      const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
      const delay = Math.min(Math.max(0, sibs.indexOf(el)), 6) * 70;
      el.style.transitionDelay = `${delay}ms`;
      el.dataset.delay = String(delay);
      revealIO.observe(el);
    });
  };
  safe('reveal', () => {
    if (!reduceMotion && hasIO) {
      revealIO = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const el = en.target;
          revealIO.unobserve(el);
          el.classList.add('is-in');
          setTimeout(() => { el.classList.remove('reveal', 'is-in'); el.style.transitionDelay = ''; }, 800 + Number(el.dataset.delay || 0));
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
  });

  /* ---------- menü, ilerleme çubuğu, aktif bölüm ---------- */
  safe('nav', () => {
    const nav = $('#nav'), toggle = $('#navToggle'), linksEl = $('#navLinks'), bar = $('#progress');
    if (!nav || !toggle || !linksEl) return;
    const setOpen = open => {
      linksEl.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', ui(open ? 'menu.close' : 'menu.open'));
    };
    toggle.addEventListener('click', () => setOpen(!linksEl.classList.contains('is-open')));
    linksEl.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', e => { if (!nav.contains(e.target)) setOpen(false); });

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 8);
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();

    if (!hasIO) return;
    const navLinks = new Map($$('[data-nav]').map(a => [a.getAttribute('href').replace(/^.*#/, ''), a]));
    if (!navLinks.size) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a => { a.classList.remove('is-current'); a.removeAttribute('aria-current'); });
        const a = navLinks.get(en.target.id);
        if (a) { a.classList.add('is-current'); a.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  });

  /* ---------- projeler ---------- */
  const projectCard = (p, featured) => {
    const img = p.image && (isPath(p.image.src) || isHttp(p.image.src))
      ? `<img src="${esc(p.image.src)}" width="${Number(p.image.w) || 1200}" height="${Number(p.image.h) || 750}" loading="lazy" decoding="async" alt="${esc(pick(p.image.alt))}" data-alt-tr="${esc(pick(p.image.alt, 'tr'))}" data-alt-en="${esc(pick(p.image.alt, 'en'))}">`
      : `<div class="card-noimg" aria-hidden="true"><b>${esc(p.slug)}</b>${esc((p.tags || []).slice(0, 3).join(' · '))}</div>`;
    const page = isPath(p.page) ? p.page.trim() : '';
    const title = page ? `<a href="${esc(page)}">${t(p.title)}</a>` : t(p.title);
    const caseLink = page ? `<a class="is-muted" href="${esc(page)}">${tu('btn.case')} →</a>` : '';
    return `
      <article class="card ${featured ? 'card-featured' : 'card-medium'} reveal" id="p-${esc(p.slug)}">
        <div class="card-media">${img}</div>
        <div class="card-body">
          <div class="card-top"><span><b>${t({ tr: `Şekil ${p.order ?? ''}`, en: `Figure ${p.order ?? ''}` })}</b> · ${esc(p.year || '')}${p.repo ? ` · <span lang="en">${esc(p.repo)}</span>` : ''}</span><span class="card-status">${tu(`status.${p.status || 'active'}`)}</span></div>
          <h3>${title}</h3>
          <p>${t(p.summary)}</p>
          <div class="card-metrics">${metrics(p.metrics)}</div>
          <div class="card-tags">${chips(p.tags)}</div>
          <div class="card-links">${caseLink}${links(p.links)}</div>
        </div>
      </article>`;
  };
  safe('projects', () => {
    const feat = $('#projectsFeatured'), more = $('#projectsMore');
    if (!feat || !more) return;
    const list = (Array.isArray(D.projects) ? D.projects : []).slice().sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    feat.innerHTML = list.filter(p => p.featured).map(p => projectCard(p, true)).join('');
    more.innerHTML = list.filter(p => !p.featured).map(p => projectCard(p, false)).join('');
    reveal($$('.reveal', feat).concat($$('.reveal', more)));
  });

  /* ---------- araçlar ---------- */
  safe('tools', () => {
    const box = $('#tools');
    if (!box) return;
    const list = Array.isArray(D.tools) ? D.tools : [];
    box.innerHTML = list.map((x, i) => `
      <article class="tool reveal">
        <span class="tool-no">${String(i + 1).padStart(2, '0')}</span>
        <div>
          <h3>${t(x.name)}</h3>
          <p>${t(x.desc)}</p>
          <div class="tool-tech">${chips(x.tech)}</div>
        </div>
        <div class="tool-links">${links(x.links).replace(/<a /g, '<a class="link-arrow" ')}</div>
      </article>`).join('');
    reveal($$('.reveal', box));
  });

  /* ---------- beceriler ---------- */
  safe('skills', () => {
    const box = $('#skills');
    if (!box) return;
    const bySlug = new Map((D.projects || []).map(p => [p.slug, p]));
    const list = Array.isArray(D.skills) ? D.skills : [];
    box.innerHTML = list.map(g => `
      <section class="skill-group reveal" id="skill-${esc(g.id)}">
        <h3>${t(g.title)}</h3>
        <p class="skill-blurb">${t(g.blurb)}</p>
        <ul class="skill-list">
          ${(g.items || []).map(it => {
            const refs = (it.projects || []).map(s => bySlug.get(s)).filter(Boolean)
              .map(p => `<a href="#p-${esc(p.slug)}">${esc(p.repo || p.slug)}</a>`).join(', ');
            return `<li class="skill-item"><span class="skill-name">${t(it.name)}</span><span class="skill-note">${t(it.note)}${refs ? ` · ${refs}` : ''}</span></li>`;
          }).join('')}
        </ul>
      </section>`).join('');
    reveal($$('.reveal', box));
  });

  /* ---------- deneyim ---------- */
  safe('experience', () => {
    const box = $('#experience');
    if (!box) return;
    const list = Array.isArray(D.experience) ? D.experience : [];
    box.innerHTML = list.map(x => {
      const same = x.start && x.end && x.start === x.end;
      const when = same
        ? `<b>${tDate(x.start)}</b>${tu('xp.month')}`
        : `<b>${tDate(x.start)} – ${x.end ? tDate(x.end) : tu('xp.now')}</b>`;
      const kind = x.type ? tu(`xp.${x.type}`) : '';
      return `
        <article class="xp reveal">
          <div class="xp-when">${when}${kind ? `<br>${kind}` : ''}${x.location ? ` · ${esc(x.location)}` : ''}</div>
          <div>
            <h3>${t(x.role)}</h3>
            <div class="xp-org">${t(x.org)}</div>
            <ul>${(x.bullets || []).map(b => `<li>${t(b)}</li>`).join('')}</ul>
            ${x.links && x.links.length ? `<div class="xp-links">${links(x.links).replace(/<a /g, '<a class="link-arrow" ')}</div>` : ''}
          </div>
        </article>`;
    }).join('');
    reveal($$('.reveal', box));
  });

  /* ---------- eğitim, diller, sertifikalar ---------- */
  safe('education', () => {
    const edu = $('#education'), langs = $('#languages'), certs = $('#certs');
    if (edu) {
      edu.innerHTML = (D.education || []).map(e => `
        <div class="edu reveal">
          <div class="edu-school">${t(e.school)}</div>
          <div class="edu-degree">${t(e.degree)}</div>
          ${e.notes ? `<p class="edu-note">${t(e.notes)}</p>` : ''}
        </div>`).join('');
      reveal($$('.reveal', edu));
    }
    if (langs) {
      langs.innerHTML = (D.languages || []).map(l => `<li><span>${t(l.name)}</span><span>${t(l.level)}</span></li>`).join('');
    }
    if (certs) {
      certs.innerHTML = (D.certificates || []).map(c => `
        <li class="cert reveal">
          <div>
            <div class="cert-title">${t(c.title)}</div>
            <div class="cert-issuer">${t(c.issuer)}${c.id ? ` · <span class="mono">${esc(c.id)}</span>` : ''}${isHttp(c.url) ? ` · ${extLink(c.url, tu('cert.verify'))}` : ''}</div>
          </div>
          <span class="cert-date">${tDate(c.date)}</span>
        </li>`).join('');
      reveal($$('.reveal', certs));
    }
  });

  /* ---------- vaka sayfası: ilgili projeler ve galeri ---------- */
  safe('related', () => {
    const box = $('#related');
    if (!box) return;
    const exclude = box.dataset.exclude || '';
    const list = (Array.isArray(D.projects) ? D.projects : []).slice()
      .sort((a, b) => (a.order ?? 99) - (b.order ?? 99)).filter(p => p.slug !== exclude).slice(0, 2);
    box.innerHTML = list.map(p => projectCard(p, false)).join('');
    reveal($$('.reveal', box));
  });
  safe('lightbox', () => {
    const dlg = $('#lightbox');
    const thumbs = $$('a[data-lightbox]');
    if (!dlg || !thumbs.length || typeof dlg.showModal !== 'function') return;
    const img = $('img', dlg), cap = $('.lightbox-cap', dlg);
    thumbs.forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      img.src = a.href;
      img.alt = a.dataset.alt || '';
      if (cap) cap.textContent = a.dataset.caption || '';
      dlg.showModal();
    }));
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.lightbox-close')) dlg.close(); });
    dlg.addEventListener('close', () => { img.removeAttribute('src'); });
  });

  /* ---------- ilk ekran: CAD imleci (artı çizgileri, konum okuması, bölge vurgusu) ---------- */
  safe('cad', () => {
    const hero = $('.sheet-hero'), cad = $('.cad', hero || undefined);
    if (!hero || !cad || reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const read = $('.cad-read', hero);
    const cols = $$('.sheet-top i', hero), rows = $$('.sheet-left i', hero);
    let raf = 0, x = 0, y = 0, lastC = -1, lastR = -1;
    hero.classList.add('has-cad');
    const paint = () => {
      raf = 0;
      const r = cad.getBoundingClientRect();
      const cx = x - r.left, cy = y - r.top;
      const inside = cx >= 0 && cy >= 0 && cx <= r.width && cy <= r.height;
      hero.classList.toggle('is-cad', inside);
      if (!inside) return;
      cad.style.setProperty('--mx', `${cx}px`);
      cad.style.setProperty('--my', `${cy}px`);
      const h = hero.getBoundingClientRect();
      hero.style.setProperty('--hx', `${x - h.left}px`);
      hero.style.setProperty('--hy', `${y - h.top}px`);
      const c = Math.min(cols.length - 1, Math.floor(cx / r.width * cols.length));
      const rw = Math.min(rows.length - 1, Math.floor(cy / r.height * rows.length));
      if (c !== lastC) { cols[lastC]?.classList.remove('is-on'); cols[c]?.classList.add('is-on'); lastC = c; }
      if (rw !== lastR) { rows[lastR]?.classList.remove('is-on'); rows[rw]?.classList.add('is-on'); lastR = rw; }
      if (read) {
        const zone = `${rows[rw]?.textContent || ''}${cols[c]?.textContent || ''}`;
        // CAD kuralı: orijin paftanın sol alt köşesi, Y yukarı doğru artar (ekranda Y aşağı artar)
        const cadY = r.height - cy;
        read.textContent = `${zone} · X ${String(Math.round(cx)).padStart(4, '0')} Y ${String(Math.round(cadY)).padStart(4, '0')}`;
        read.classList.toggle('is-flip', cx > r.width - 190);
      }
    };
    hero.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(paint); });
    hero.addEventListener('pointerleave', () => {
      hero.classList.remove('is-cad');
      cols[lastC]?.classList.remove('is-on'); rows[lastR]?.classList.remove('is-on'); lastC = lastR = -1;
    });
  });

  /* ---------- Cpk hesaplayıcı ---------- */
  safe('cpk', () => {
    const box = $('#cpk');
    if (!box) return;
    const f = id => $(`#${id}`, box);
    const usl = f('cpkUsl'), lsl = f('cpkLsl'), mean = f('cpkMean'), sigma = f('cpkSigma');
    const outCp = f('cpkCp'), outCpk = f('cpkCpk'), outV = f('cpkVerdict'), outNote = f('cpkNote');
    if (!usl || !lsl || !mean || !sigma || !outCp || !outCpk || !outV) return;
    const num = el => { const s = String(el.value).trim().replace(',', '.'); if (!s) return null; const v = Number(s); return Number.isFinite(v) ? v : NaN; };
    const fmt = x => x.toLocaleString(getLang() === 'tr' ? 'tr-TR' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const calc = () => {
      const U = num(usl), L = num(lsl), m = num(mean), s = num(sigma);
      const bad = [U, L, m, s].some(Number.isNaN) || m === null || s === null || s <= 0 || (U === null && L === null) || (U !== null && L !== null && U <= L);
      if (bad) { outCp.textContent = '—'; outCpk.textContent = '—'; outV.textContent = ''; if (outNote) outNote.textContent = ui('cpk.invalid'); return; }
      const cpu = U !== null ? (U - m) / (3 * s) : null;
      const cpl = L !== null ? (m - L) / (3 * s) : null;
      const cpk = cpu !== null && cpl !== null ? Math.min(cpu, cpl) : (cpu ?? cpl);
      const cp = U !== null && L !== null ? (U - L) / (6 * s) : null;
      outCp.textContent = cp === null ? '—' : fmt(cp);
      outCpk.textContent = fmt(cpk);
      outV.textContent = cpk < 1 ? ui('cpk.low') : cpk < 1.33 ? ui('cpk.marginal') : ui('cpk.ok');
      outV.dataset.state = cpk < 1 ? 'low' : cpk < 1.33 ? 'marginal' : 'ok';
      if (outNote) outNote.textContent = cp === null ? ui('cpk.onesided') : ui('cpk.caveat');
    };
    [usl, lsl, mean, sigma].forEach(el => el.addEventListener('input', calc));
    document.addEventListener('langchange', calc);
    calc();
  });

  /* ---------- statik reveal öğeleri ve küçük dokunuşlar ---------- */
  safe('reveal-static', () => reveal($$('.reveal').filter(el => !el.closest('#projectsFeatured, #projectsMore, #tools, #skills, #experience, #education, #certs, #related'))));
  safe('portrait', () => { $$('.portrait img').forEach(img => img.addEventListener('error', () => img.remove())); });
  safe('year', () => { const y = $('#year'); if (y) y.textContent = String(new Date().getFullYear()); });
  safe('console', () => {
    console.log('%cİBK%c İsmail Bilgehan Kazancı', 'background:#16171B;color:#F4F2ED;font:700 14px monospace;padding:4px 6px', 'font:700 14px monospace');
    console.log(`%cKütüphanesiz, elle yazıldı: HTML + CSS + JS · ${D.meta?.links?.github || ''}`, 'font:12px monospace');
  });
})();
