/* Feed de videos + WhatsApp. Sin dependencias: abrí index.html o subilo a cualquier hosting. */
(() => {
  'use strict';

  const { STORE, PRODUCTS } = window;
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const PLANS = [12, 9];
  const CAPTION_MS = 2300;     // duración de cada frase en el video de muestra
  const STORY_MS = 4500;       // duración de cada paso de "Cómo comprar"
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const isWeb = /^https?:$/.test(location.protocol);

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const fmt = new Intl.NumberFormat('es-AR');
  const money = n => '$' + fmt.format(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fullName = p => `${/^(moto|nubia)/i.test(p.name) ? '' : p.brand + ' '}${p.name} ${p.storage} GB`;
  const sameTotal = p => Math.abs(p.cuotas[9] * 9 - p.cuotas[12] * 12) / (p.cuotas[12] * 12) < 0.001;
  const baseUrl = () => location.href.split('#')[0];
  const productUrl = p => `${baseUrl()}#p=${p.id}`;
  const tint = (el, p) => { el.style.setProperty('--c1', p.color[0]); el.style.setProperty('--c2', p.color[1]); };

  const ICON = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>',
    expand: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M12 15V3M7 8l5-5 5 5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    up: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
  };

  // Íconos de la ficha técnica (mismo estilo de línea que los posts de la marca)
  const specIcon = d => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const SPEC_ICON = {
    pantalla: specIcon('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M6 6h12M6 18h12"/>'),
    camara: specIcon('<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>'),
    bateria: specIcon('<rect x="2.5" y="7.5" width="17" height="9" rx="2"/><path d="M22 11v2M6 10.5v3M9.5 10.5v3M13 10.5v3"/>'),
    memoria: specIcon('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3"/>'),
    ram: specIcon('<rect x="2.5" y="7" width="19" height="10" rx="1.5"/><path d="M6 10.5v3M10 10.5v3M14 10.5v3M18 10.5v3M6 17v2.5M18 17v2.5"/>'),
    parlante: specIcon('<path d="M4 9.5h4l5-4v13l-5-4H4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>'),
    update: specIcon('<path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5"/>'),
    carga: specIcon('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>'),
  };

  /* ---------- Memoria del visitante (qué miró), para recomendar ---------- */
  const mem = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
  };
  const interest = mem.get('cc:interest', {});
  let saveT = 0;
  function bump(id, amount) {
    if (!byId[id] || !(amount > 0)) return;
    interest[id] = (interest[id] || 0) + amount;
    clearTimeout(saveT);
    saveT = setTimeout(() => mem.set('cc:interest', interest), 500);
  }

  // Gustos acumulados: marcas que más miró, cuota promedio de lo que miró y su favorito.
  function affinity() {
    const brand = {};
    let total = 0, price = 0, top = null;
    for (const p of PRODUCTS) {
      const s = interest[p.id] || 0;
      if (!s) continue;
      brand[p.brand] = (brand[p.brand] || 0) + s;
      total += s;
      price += s * p.cuotas[12];
      if (s >= 3 && (!top || s > interest[top.id])) top = p;
    }
    return { brand, total, price: total ? price / total : 0, top };
  }

  function rank(list, { exclude = [], jitter = 0 } = {}) {
    const a = affinity();
    return list
      .filter(p => !exclude.includes(p.id))
      .map(p => {
        let s = Math.random() * jitter;
        if (a.total) {
          s += 3 * (a.brand[p.brand] || 0) / a.total;
          s += 2 * Math.max(0, 1 - Math.abs(p.cuotas[12] - a.price) / a.price);
          s += Math.min(1.5, (interest[p.id] || 0) / 20);
        }
        return { p, s };
      })
      .sort((x, y) => y.s - x.s)
      .map(x => x.p);
  }

  /* ---------- WhatsApp ---------- */
  const waHref = text => `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
  function buyMessage(p, n) {
    const lines = [
      '¡Hola! Vi este celular en la web y me interesa:',
      `📱 ${fullName(p)}`,
      `💳 ${n} cuotas${STORE.sinInteres ? ' sin interés' : ''} de ${money(p.cuotas[n])}`,
      '¿Sigue disponible?',
    ];
    if (isWeb) lines.push(productUrl(p));
    return lines.join('\n');
  }

  /* ---------- Celular dibujado (se usa mientras no haya foto/video real) ---------- */
  let uid = 0;
  const lens = (x, y, r) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#0b0c0f" stroke="rgba(255,255,255,.35)" stroke-width="2"/>` +
    `<circle cx="${x}" cy="${y}" r="${r * .55}" fill="#1a2233"/>` +
    `<circle cx="${x - r * .3}" cy="${y - r * .3}" r="${r * .18}" fill="rgba(255,255,255,.75)"/>`;
  const flash = (x, y) => `<circle cx="${x}" cy="${y}" r="4.5" fill="#fff6d6" opacity=".9"/>`;
  const CAMERAS = {
    Motorola: () =>
      `<rect x="40" y="30" width="62" height="98" rx="22" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>` +
      `${lens(71, 59, 18)}${lens(71, 102, 13)}${flash(93, 102)}` +
      `<circle cx="100" cy="236" r="15" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2"/>`,
    Samsung: () => `${lens(54, 48, 13)}${lens(54, 84, 13)}${lens(54, 120, 13)}${flash(80, 48)}`,
    Xiaomi: () =>
      `<rect x="36" y="28" width="96" height="96" rx="24" fill="rgba(0,0,0,.28)" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>` +
      `${lens(68, 60, 21)}${lens(108, 52, 10)}${lens(108, 86, 10)}${flash(68, 106)}`,
    // Nubia Music 2: dorso blanco, parlante naranja redondo y barras de ecualizador de colores
    Nubia: id => {
      const hues = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#32ade6', '#007aff', '#5856d6', '#af52de', '#ff2d55', '#ff9500'];
      const bars = hues.map((c, i) => {
        const h = 26 + Math.round(34 * Math.abs(Math.sin(i * 1.3 + .6)));
        return `<rect x="${44 + i * 10.6}" y="${352 - h}" width="6" height="${h}" rx="3" fill="${c}"/>`;
      }).join('');
      return `<defs><pattern id="${id}d" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.5" fill="rgba(0,0,0,.35)"/></pattern></defs>` +
        `<rect x="36" y="28" width="44" height="92" rx="22" fill="#18181b"/>${lens(58, 52, 15)}${lens(58, 96, 15)}` +
        `<circle cx="130" cy="70" r="31" fill="#ff7a1a"/><circle cx="130" cy="70" r="25" fill="url(#${id}d)"/>${bars}`;
    },
  };

  function phoneSVG(p) {
    const id = 'ph' + (++uid);
    const [c1, c2] = p.color;
    const camera = (CAMERAS[p.brand] || CAMERAS.Motorola)(id);
    return `<svg viewBox="0 0 200 400" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></linearGradient>
        <linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <clipPath id="${id}c"><rect x="24" y="12" width="152" height="376" rx="30"/></clipPath>
      </defs>
      <rect x="175" y="104" width="4" height="46" rx="2" fill="${c1}"/>
      <rect x="175" y="160" width="4" height="26" rx="2" fill="${c1}"/>
      <rect x="24" y="12" width="152" height="376" rx="30" fill="url(#${id}b)"/>
      <g clip-path="url(#${id}c)">
        <ellipse cx="40" cy="40" rx="120" ry="160" fill="#fff" opacity=".07"/>
        <g transform="skewX(-14)"><rect class="shine" x="-90" y="0" width="70" height="400" fill="url(#${id}s)"/></g>
      </g>
      <rect x="24.75" y="12.75" width="150.5" height="374.5" rx="29.5" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      ${camera}
    </svg>`;
  }

  function mediaHTML(p) {
    const caps = p.highlights.map(h => `<span class="cap">${esc(h)}</span>`).join('');
    const segs = p.highlights.map(() => '<span><i></i></span>').join('');
    const poster = p.poster ? `<img class="poster" src="${esc(p.poster)}" alt="" loading="lazy" decoding="async">` : '';
    const video = p.video
      ? `<video muted playsinline loop preload="none" data-src="${esc(p.video)}"${p.poster ? ` poster="${esc(p.poster)}"` : ''}></video>`
      : '';
    return `<div class="scene"><div class="rays"></div><div class="phone">${phoneSVG(p)}</div></div>${poster}${video}` +
      `<div class="segs">${segs}</div><div class="caps">${caps}</div>`;
  }

  /* ---------- Reproductor: video real o short animado, con frases y barra de progreso ---------- */
  function playerFor(media) {
    if (media._player) return media._player;
    const video = $('video', media);
    const caps = $$('.cap', media);
    const bars = $$('.segs i', media);
    const loop = CAPTION_MS * caps.length;
    let raf = 0, t0 = 0, elapsed = 0, playing = false, usingVideo = false;

    function render(f) {
      const n = caps.length;
      const k = f < 0 ? -1 : Math.min(n - 1, Math.floor(f * n));
      caps.forEach((c, i) => c.classList.toggle('on', i === k));
      bars.forEach((b, i) => { b.style.transform = `scaleX(${Math.max(0, Math.min(1, f * n - i))})`; });
    }
    function tick(now) {
      if (!playing) return;
      if (usingVideo) { if (video.duration) render(video.currentTime / video.duration); }
      else render(((now - t0) % loop) / loop);
      raf = requestAnimationFrame(tick);
    }

    const player = {
      id: media.closest('[data-id]').dataset.id,
      media,
      card: media.closest('.card'),
      get playing() { return playing; },
      play({ withVideo = true } = {}) {
        if (playing) return;
        playing = true;
        media.classList.remove('paused');
        media.classList.add('playing');
        usingVideo = !!video && withVideo;
        if (usingVideo) {
          if (!video.src) video.src = video.dataset.src;
          video.play().catch(() => { usingVideo = false; });
        }
        t0 = performance.now() - elapsed;
        raf = requestAnimationFrame(tick);
      },
      pause({ keep = false } = {}) {
        playing = false;
        cancelAnimationFrame(raf);
        if (video) video.pause();
        media.classList.remove('playing');
        if (keep) {
          elapsed = (performance.now() - t0) % loop;
          media.classList.add('paused');
        } else {
          elapsed = 0;
          media.classList.remove('paused');
          render(-1);
          if (video && video.readyState) video.currentTime = 0;
        }
      },
    };
    media._player = player;
    return player;
  }

  // Un solo video a la vez, en toda la página.
  let active = null, activeAt = 0;
  function activate(player, opts) {
    if (active === player) return;
    if (active) {
      active.pause();
      if (active.card) active.card.classList.remove('is-active');
      bump(active.id, Math.min(15, (performance.now() - activeAt) / 1000 - 1));
    }
    active = player;
    if (player) {
      player.play(opts);
      if (player.card) player.card.classList.add('is-active');
      activeAt = performance.now();
    }
  }

  /* ---------- Precio y cuotas ---------- */
  const plan = {};
  const planOf = p => plan[p.id] || 12;

  const memory = p => `${p.ram ? p.ram + ' GB RAM · ' : ''}${p.storage} GB`;

  function titleHTML(p, tag) {
    return `
      <div>
        <p class="kicker">${esc(p.brand)}</p>
        <${tag} class="title">${esc(p.name)}</${tag}>
        <p class="sub">${memory(p)}</p>
      </div>`;
  }

  function specsHTML(p) {
    return `<ul class="specs" aria-label="Características">${p.specs.map(s => `
      <li>${SPEC_ICON[s.icon] || ''}<b>${esc(s.v)}${s.u ? `<i>${esc(s.u)}</i>` : ''}</b><small>${esc(s.l)}</small></li>`).join('')}
    </ul>`;
  }

  function buyHTML(p) {
    return `
      <div class="price-pill">
        <span class="pp-n js-n"></span>
        <span class="pp-l">${STORE.sinInteres ? 'Cuotas<br>sin interés' : 'Cuotas<br>de'}</span>
        <span class="pp-amt"><strong class="js-amount"></strong><small>c/u</small></span>
      </div>
      <div class="plans" role="group" aria-label="Elegí la cantidad de cuotas">
        ${PLANS.map(n => `<button type="button" data-n="${n}">${n} cuotas</button>`).join('')}
      </div>
      <p class="meta">
        ${sameTotal(p) ? '<span class="deal">Mismo precio en 9 o 12</span>' : ''}
        <span class="js-total"></span>
        ${STORE.financing ? `<span class="fin">Financiá con ${esc(STORE.financing)}</span>` : ''}
      </p>
      <a class="wa-btn js-wa" target="_blank" rel="noopener">${ICON.wa}<span>Pedilo por WhatsApp</span></a>`;
  }

  // Descripción tipo post: nombre de la tienda + texto, cortada a 2 renglones con "más".
  const hashtag = s => '#' + s.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join('');
  function captionHTML(p) {
    const lines = [
      p.pitch,
      '',
      ...p.details,
      `💳 ${STORE.sinInteres ? 'Sin interés: ' : ''}12 cuotas de ${money(p.cuotas[12])} o 9 de ${money(p.cuotas[9])}`,
      STORE.financing ? `🤝 Financiá con ${STORE.financing}` : '',
      `📍 ${STORE.city} · Pedilo por WhatsApp`,
    ].filter((l, i) => l || i === 1);
    const tags = [p.brand, p.name, ...STORE.hashtags].map(hashtag);
    return `
      <div class="caption js-cap" role="button" tabindex="0" aria-expanded="false" aria-label="Ver descripción completa">
        <p class="cap-text"><b>${esc(STORE.name)}</b> ${esc(lines.join('\n'))}
<span class="tags">${esc([...new Set(tags)].join(' '))}</span></p>
        <span class="cap-more">… más</span>
      </div>`;
  }

  function toggleCaption(cap) {
    const open = cap.classList.toggle('open');
    cap.setAttribute('aria-expanded', String(open));
    $('.cap-more', cap).textContent = open ? 'menos' : '… más';
    const host = cap.closest('[data-id]');
    if (open && host) bump(host.dataset.id, 4);
  }

  function paint(root, p) {
    const n = planOf(p);
    $('.js-n', root).textContent = n;
    $('.js-amount', root).textContent = money(p.cuotas[n]);
    $('.js-total', root).textContent = `Total ${money(p.cuotas[n] * n)}`;
    $$('.plans button', root).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.n === n)));
    $('.js-wa', root).href = waHref(buyMessage(p, n));
  }

  function setPlan(id, n) {
    plan[id] = n;
    $$(`[data-id="${id}"]`).forEach(el => paint(el, byId[id]));
  }

  /* ---------- Tarjeta del feed ---------- */
  let hoverT = 0;
  function cardEl(p) {
    const el = document.createElement('article');
    el.className = 'card';
    el.dataset.id = p.id;
    tint(el, p);
    el.innerHTML = `
      <header class="card-head">
        <span class="avatar" aria-hidden="true">tb</span>
        <span class="who"><b>${esc(STORE.name)}</b><small>${esc(STORE.city)}</small></span>
        <span class="head-actions">
          <button class="icon-btn js-share" type="button" aria-label="Compartir ${esc(fullName(p))}">${ICON.share}</button>
          <button class="icon-btn js-open" type="button" aria-label="Ver ${esc(fullName(p))} en pantalla completa">${ICON.expand}</button>
        </span>
      </header>
      <div class="media js-open" role="button" tabindex="0" aria-label="Ver el video del ${esc(fullName(p))}">
        ${mediaHTML(p)}
        <span class="hint">${ICON.play}Video</span>
      </div>
      <div class="card-body">
        ${titleHTML(p, 'h3')}
        ${specsHTML(p)}
        ${buyHTML(p)}
        ${captionHTML(p)}
      </div>`;
    paint(el, p);

    const media = $('.media', el);
    if (canHover) {
      // Escritorio: como YouTube, el video arranca al dejar el mouse encima.
      el.addEventListener('mouseenter', () => {
        clearTimeout(hoverT);
        hoverT = setTimeout(() => activate(playerFor(media)), 160);
      });
      el.addEventListener('mouseleave', () => {
        clearTimeout(hoverT);
        if (active && active.media === media) activate(null);
      });
      el.addEventListener('focusin', () => activate(playerFor(media)));
    } else {
      seen.observe(media);
    }
    return el;
  }

  // Celular: se reproduce sola la tarjeta que quedó en el centro de la pantalla.
  const visible = new Set();
  const seen = new IntersectionObserver(entries => {
    entries.forEach(en => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
    schedulePick();
  }, { threshold: [0, .6, 1] });
  let pickRaf = 0;
  function schedulePick() {
    if (!canHover && !pickRaf) pickRaf = requestAnimationFrame(pick);
  }
  function pick() {
    pickRaf = 0;
    if (shortsOpen || storyOpen) return;
    const mid = innerHeight / 2;
    let best = null, bestD = Infinity;
    for (const m of visible) {
      const r = m.getBoundingClientRect();
      const shown = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      if (shown < r.height * .6) continue;
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestD) { bestD = d; best = m; }
    }
    activate(best ? playerFor(best) : null, { withVideo: !saveData });
  }

  /* ---------- Feed infinito con recomendaciones ---------- */
  const feed = $('#feed');
  const sentinel = $('#sentinel');
  const filters = { brand: '', max: 0 };
  const SEQUENCE = ['howto', 'foryou', 'cheap', 'share', 'memory', 'brands', 'ask'];
  const PROMOS = ['share', 'ask', 'howto'];
  const MORE_TITLES = ['Seguí mirando', 'Más para vos', 'No te los pierdas', 'Mirá otra vez'];
  let step = 0, recent = [];

  const matches = p => (!filters.brand || p.brand === filters.brand) && (!filters.max || p.cuotas[12] <= filters.max);
  const shelfSize = () => {
    const cols = getComputedStyle(feed).gridTemplateColumns.split(' ').length;
    return cols >= 3 ? cols : 4;
  };

  function headEl(eyebrow, title, note) {
    const el = document.createElement('div');
    el.className = 'shelf-head';
    el.innerHTML = `<div><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2></div>` +
      (note ? `<span class="shelf-note">${esc(note)}</span>` : '');
    return el;
  }

  function addProducts(list) {
    list.forEach(p => feed.append(cardEl(p)));
    recent = [...recent, ...list.map(p => p.id)].slice(-4);
  }

  function promoEl(key) {
    const el = document.createElement('aside');
    el.className = `promo promo-${key}`;
    if (key === 'howto') {
      el.innerHTML = `
        <div class="p-icon" aria-hidden="true">🛍️</div>
        <div><h3>Comprar es así de fácil</h3>
          <ol class="steps">${STORE.howto.map((s, i) => `<li><b>${i + 1}</b>${esc(s.title)}</li>`).join('')}</ol></div>
        <button class="p-btn js-story" type="button">${ICON.play}Ver cómo</button>`;
    } else if (key === 'share') {
      el.innerHTML = `
        <div class="p-icon" aria-hidden="true">📲</div>
        <div><h3>¿Lo querés mostrar en casa?</h3><p>Mandale esta página a tu familia por WhatsApp.</p></div>
        <button class="p-btn js-share-store" type="button">${ICON.share}Compartir</button>`;
    } else {
      el.innerHTML = `
        <div class="p-icon" aria-hidden="true">🔎</div>
        <div><h3>¿Buscás otro modelo?</h3><p>Preguntanos por WhatsApp y te contamos qué tenemos en el local.</p></div>
        <a class="p-btn js-wa" target="_blank" rel="noopener" href="${waHref('¡Hola! Estoy buscando un modelo que no vi en la web: ')}">${ICON.wa}Preguntar</a>`;
    }
    return el;
  }

  function emptyEl() {
    const el = document.createElement('div');
    el.className = 'empty';
    el.innerHTML = `
      <p><b>No tenemos ${esc(filters.brand || 'celulares')} en esas cuotas por ahora.</b></p>
      <p>Probá con otro monto o preguntanos por WhatsApp.</p>
      <a class="p-btn js-wa" target="_blank" rel="noopener" href="${waHref(STORE.greeting)}">${ICON.wa}Preguntar</a>`;
    return el;
  }

  function resetFeed() {
    activate(null);
    seen.disconnect();
    visible.clear();
    feed.innerHTML = '';
    step = 0;
    recent = [];
    const list = PRODUCTS.filter(matches);
    const personal = affinity().total > 5;
    const title = (filters.brand || 'Celulares') + (filters.max ? ` hasta ${money(filters.max)} por mes` : ' en cuotas');
    feed.append(headEl(personal ? 'Ordenado para vos' : 'Catálogo', title, `${list.length} ${list.length === 1 ? 'modelo' : 'modelos'}`));
    if (list.length) addProducts(personal ? rank(list) : list);
    else feed.append(emptyEl());
    fill();
  }

  // Después del catálogo, el feed sigue para siempre con estantes de recomendaciones.
  function nextBlock() {
    let key = SEQUENCE[step];
    if (!key) {
      const i = step - SEQUENCE.length;
      key = i % 3 === 2 ? PROMOS[Math.floor(i / 3) % PROMOS.length] : 'more';
    }
    step++;
    if (PROMOS.includes(key)) { feed.append(promoEl(key)); return; }

    const a = affinity();
    let eyebrow, title, note = '', list;
    switch (key) {
      case 'foryou':
        eyebrow = 'Recomendados';
        title = a.top ? `Porque miraste el ${fullName(a.top)}` : 'Te pueden interesar';
        list = rank(PRODUCTS, { exclude: a.top ? [a.top.id] : [], jitter: a.top ? .3 : 1 });
        break;
      case 'cheap':
        eyebrow = 'Para tu bolsillo';
        title = 'Las cuotas más bajas';
        note = 'en 12 cuotas';
        list = [...PRODUCTS].sort((x, y) => x.cuotas[12] - y.cuotas[12]);
        break;
      case 'memory':
        eyebrow = 'Para guardar todo';
        title = 'Con más memoria';
        list = [...PRODUCTS].sort((x, y) => y.storage - x.storage || x.cuotas[12] - y.cuotas[12]);
        break;
      case 'brands':
        eyebrow = 'Descubrí';
        title = 'Otras marcas que también convienen';
        list = PRODUCTS
          .map(p => ({ p, s: (a.brand[p.brand] || 0) / (a.total || 1) + Math.random() * .5 }))
          .sort((x, y) => x.s - y.s)
          .map(x => x.p);
        break;
      default:
        eyebrow = 'Para vos';
        title = MORE_TITLES[step % MORE_TITLES.length];
        list = rank(PRODUCTS, { exclude: recent, jitter: .9 });
    }
    feed.append(headEl(eyebrow, title, note));
    addProducts(list.slice(0, shelfSize()));
  }

  function fill() {
    let guard = 0;
    while (sentinel.getBoundingClientRect().top < innerHeight + 1400 && guard++ < 8) nextBlock();
  }
  let fillRaf = 0;
  function onScroll() {
    if (!fillRaf) fillRaf = requestAnimationFrame(() => { fillRaf = 0; fill(); });
    schedulePick();
  }

  /* ---------- Marcas (historias) y filtro por cuota ---------- */
  function buildStories() {
    const brands = [...new Set(PRODUCTS.map(p => p.brand))];
    const items = [
      { key: 'howto', label: 'Cómo comprar', inner: `<span class="ring-icon wa">${ICON.wa}</span>` },
      { key: '', label: 'Todos', inner: `<span class="ring-icon all">${ICON.grid}</span>` },
      ...brands.map(b => ({ key: b, label: b, inner: `<span class="ring-phone">${phoneSVG(PRODUCTS.find(x => x.brand === b))}</span>` })),
    ];
    $('#stories').innerHTML = items.map(it => `
      <button class="story-btn" type="button" data-key="${esc(it.key)}"${it.key === 'howto' ? '' : ` aria-pressed="${it.key === filters.brand}"`}>
        <span class="ring">${it.inner}</span><span class="label">${esc(it.label)}</span>
      </button>`).join('');
    if (mem.get('cc:howto-seen', false)) $('[data-key="howto"]').classList.add('seen');
  }

  function buildChips() {
    $('#chips').innerHTML = [0, ...STORE.budgets].map(v =>
      `<button class="chip" type="button" data-max="${v}" aria-pressed="${v === filters.max}">${v ? 'Hasta ' + money(v) : 'Todas'}</button>`
    ).join('');
  }

  function scrollToFeed() {
    const y = $('.filters').getBoundingClientRect().top + scrollY - 70;
    if (scrollY > y) scrollTo({ top: y, behavior: 'smooth' });
  }

  function setBrand(brand) {
    filters.brand = brand;
    $$('.story-btn[aria-pressed]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.key === brand)));
    resetFeed();
    scrollToFeed();
  }

  function setMax(max) {
    filters.max = max;
    $$('.chip').forEach(c => c.setAttribute('aria-pressed', String(+c.dataset.max === max)));
    resetFeed();
    scrollToFeed();
  }

  /* ---------- Historial: el botón "atrás" del celular cierra la pantalla completa ---------- */
  const nav = {
    push(state, url) { try { history.pushState(state, '', url); } catch {} },
    replace(state, url) { try { history.replaceState(state, '', url); } catch {} },
  };
  let ignorePop = false;
  function exitOverlay() {
    closeShorts();
    closeStory();
    const s = history.state;
    if (s && (s.shorts || s.story)) { ignorePop = true; history.back(); }
  }
  addEventListener('popstate', () => {
    if (ignorePop) { ignorePop = false; return; }
    const s = history.state || {};
    if (!s.story) closeStory();
    if (s.shorts && !shortsOpen) openShorts(s.shorts, false);
    if (!s.shorts) closeShorts();
  });

  /* ---------- Modo shorts (pantalla completa, deslizar para el siguiente) ---------- */
  const shorts = $('#shorts');
  const track = $('#shorts-track');
  let shortsOpen = false, shortsIds = [], currentSlide = null, hinted = false;
  const slideSeen = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) onSlide(en.target); });
  }, { root: track, threshold: .65 });

  function slideEl(p) {
    const el = document.createElement('section');
    el.className = 'slide';
    el.dataset.id = p.id;
    tint(el, p);
    el.innerHTML = `
      <div class="media">${mediaHTML(p)}</div>
      <div class="rail">
        <button class="rail-btn js-brand" type="button" data-brand="${esc(p.brand)}" aria-label="Ver todos los ${esc(p.brand)}">
          <span class="circle">${esc(p.brand[0])}</span>${esc(p.brand)}
        </button>
        <button class="rail-btn js-share" type="button"><span class="circle">${ICON.share}</span>Compartir</button>
      </div>
      <div class="slide-info">
        ${titleHTML(p, 'h2')}
        ${buyHTML(p)}
        ${captionHTML(p)}
      </div>`;
    paint(el, p);
    slideSeen.observe(el);
    return el;
  }

  function appendSlides(list) {
    list.forEach(p => track.append(slideEl(p)));
    shortsIds = [...shortsIds, ...list.map(p => p.id)];
  }

  function openShorts(id, push = true) {
    if (!byId[id]) return;
    if (storyOpen) closeStory();
    activate(null);
    slideSeen.disconnect();
    track.innerHTML = '';
    shortsIds = [];
    appendSlides([byId[id], ...rank(PRODUCTS, { exclude: [id], jitter: .4 })]);
    shorts.hidden = false;
    document.documentElement.classList.add('lock');
    shortsOpen = true;
    track.scrollTop = 0;
    bump(id, 5);
    if (push) nav.push({ shorts: id }, '#p=' + id);
    if (!hinted) {
      hinted = true;
      const h = $('#shorts-hint');
      h.textContent = canHover ? 'Usá la ruedita o las flechas ↕' : 'Deslizá hacia arriba para ver más ↑';
      h.classList.add('show');
      setTimeout(() => h.classList.remove('show'), 2800);
    }
    $('#shorts-close').focus({ preventScroll: true });
  }

  function closeShorts() {
    if (!shortsOpen) return;
    activate(null);
    slideSeen.disconnect();
    shorts.hidden = true;
    track.innerHTML = '';
    currentSlide = null;
    document.documentElement.classList.remove('lock');
    shortsOpen = false;
    schedulePick();
  }

  function onSlide(slide) {
    if (!shortsOpen || currentSlide === slide) return;
    currentSlide = slide;
    activate(playerFor($('.media', slide)), { withVideo: true });
    nav.replace({ shorts: slide.dataset.id }, '#p=' + slide.dataset.id);
    const slides = track.children;
    if (slide === slides[slides.length - 1] || slide === slides[slides.length - 2]) {
      appendSlides(rank(PRODUCTS, { exclude: shortsIds.slice(-3), jitter: .8 }));
    }
  }

  const slideBy = d => track.scrollBy({ top: d * track.clientHeight, behavior: 'smooth' });

  function togglePause(media) {
    const pl = playerFor(media);
    if (active !== pl) activate(pl, { withVideo: true });
    else if (pl.playing) pl.pause({ keep: true });
    else pl.play({ withVideo: true });
  }

  /* ---------- Historia "Cómo comprar" ---------- */
  const story = $('#story');
  let storyOpen = false, storyIdx = 0, storyT0 = 0, storyRaf = 0;

  function openStory(push = true) {
    if (shortsOpen) closeShorts();
    activate(null);
    story.hidden = false;
    document.documentElement.classList.add('lock');
    storyOpen = true;
    if (push) nav.push({ story: 1 }, '#como-comprar');
    mem.set('cc:howto-seen', true);
    $$('[data-key="howto"]').forEach(b => b.classList.add('seen'));
    goStep(0);
    storyRaf = requestAnimationFrame(storyTick);
    $('#story-close').focus({ preventScroll: true });
  }

  function closeStory() {
    if (!storyOpen) return;
    storyOpen = false;
    cancelAnimationFrame(storyRaf);
    story.hidden = true;
    document.documentElement.classList.remove('lock');
    schedulePick();
  }

  function goStep(i) {
    const steps = STORE.howto;
    if (i >= steps.length) { exitOverlay(); return; }
    storyIdx = Math.max(0, i);
    const s = steps[storyIdx];
    const stage = $('#story-stage');
    stage.style.setProperty('--s-bg', s.bg);
    stage.style.setProperty('--s-fg', s.fg);
    $('#story-body').innerHTML = `
      <div class="story-icon" aria-hidden="true">${s.icon === 'wa' ? ICON.wa : esc(s.icon)}</div>
      <p class="story-step">Paso ${storyIdx + 1} de ${steps.length}</p>
      <h2>${esc(s.title)}</h2>
      <p class="story-text">${esc(s.text)}</p>
      ${storyIdx === steps.length - 1
        ? `<a class="wa-btn js-wa" target="_blank" rel="noopener" href="${waHref(STORE.greeting)}">${ICON.wa}<span>Escribir ahora</span></a>`
        : ''}`;
    storyT0 = performance.now();
  }

  function storyTick(now) {
    if (!storyOpen) return;
    const f = (now - storyT0) / STORY_MS;
    $$('#story-segs i').forEach((b, i) => {
      b.style.transform = `scaleX(${i < storyIdx ? 1 : i > storyIdx ? 0 : Math.min(1, f)})`;
    });
    if (f >= 1 && storyIdx < STORE.howto.length - 1) goStep(storyIdx + 1);
    storyRaf = requestAnimationFrame(storyTick);
  }

  /* ---------- Compartir ---------- */
  async function share(title, text, url) {
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); } catch {}
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank', 'noopener');
  }
  function shareProduct(p) {
    const n = planOf(p);
    bump(p.id, 10);
    share(fullName(p), `Mirá este ${fullName(p)}: ${n} cuotas de ${money(p.cuotas[n])}`, productUrl(p));
  }

  let toastT = 0;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ---------- Eventos ---------- */
  document.addEventListener('click', e => {
    const t = e.target;
    let el;
    if ((el = t.closest('.js-cap'))) return toggleCaption(el);
    if ((el = t.closest('.plans button'))) return setPlan(el.closest('[data-id]').dataset.id, +el.dataset.n);
    if ((el = t.closest('.js-wa'))) {
      const host = el.closest('[data-id]');
      if (host) bump(host.dataset.id, 20);
      toast('Abriendo WhatsApp…');
      return;
    }
    if ((el = t.closest('.js-share'))) return shareProduct(byId[el.closest('[data-id]').dataset.id]);
    if (t.closest('.js-share-store')) return share(STORE.name, `Mirá estos celulares en cuotas de ${STORE.name}`, baseUrl());
    if (t.closest('.js-story')) return openStory();
    if (t.closest('.js-close')) return exitOverlay();
    if ((el = t.closest('.js-brand'))) { exitOverlay(); return setBrand(el.dataset.brand); }
    if ((el = t.closest('.story-btn'))) return el.dataset.key === 'howto' ? openStory() : setBrand(el.dataset.key);
    if ((el = t.closest('.chip'))) return setMax(+el.dataset.max);
    if (t.closest('#shorts-prev')) return slideBy(-1);
    if (t.closest('#shorts-next')) return slideBy(1);
    if (t.closest('#story-prev')) return goStep(storyIdx - 1);
    if (t.closest('#story-next')) return goStep(storyIdx + 1);
    if ((el = t.closest('.slide .media'))) return togglePause(el);
    if ((el = t.closest('.js-open'))) return openShorts(el.closest('[data-id]').dataset.id);
    if (t === shorts || t === story) return exitOverlay();
  });

  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.js-cap')) {
      e.preventDefault();
      toggleCaption(e.target);
    } else if (shortsOpen) {
      if (e.key === 'Escape') exitOverlay();
      else if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); slideBy(1); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); slideBy(-1); }
    } else if (storyOpen) {
      if (e.key === 'Escape') exitOverlay();
      else if (e.key === 'ArrowRight') goStep(storyIdx + 1);
      else if (e.key === 'ArrowLeft') goStep(storyIdx - 1);
    } else if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.media.js-open')) {
      e.preventDefault();
      openShorts(e.target.closest('[data-id]').dataset.id);
    }
  });

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { activate(null); currentSlide = null; return; }
    const slide = shortsOpen && [...track.children].find(s => Math.abs(s.offsetTop - track.scrollTop) < 10);
    if (slide) onSlide(slide);
    else schedulePick();
  });

  /* ---------- Inicio ---------- */
  $$('[data-icon]').forEach(el => el.insertAdjacentHTML('afterbegin', ICON[el.dataset.icon]));
  $$('[data-store]').forEach(el => { el.textContent = STORE[el.dataset.store] || ''; });
  if (!STORE.financing) $$('.js-financing').forEach(el => { el.hidden = true; });
  $$('.js-wa-general').forEach(a => { a.href = waHref(STORE.greeting); });
  $('#story-segs').innerHTML = STORE.howto.map(() => '<span><i></i></span>').join('');
  document.title = `${STORE.name} · Celulares en cuotas en ${STORE.city}`;
  buildStories();
  buildChips();
  resetFeed();

  // Links compartidos: #p=moto-g06-128 abre directo ese celular en pantalla completa.
  const deep = location.hash.match(/^#p=([\w-]+)/);
  if (deep && byId[deep[1]]) {
    nav.replace(null, baseUrl());
    nav.push({ shorts: deep[1] }, '#p=' + deep[1]);
    openShorts(deep[1], false);
  } else if (location.hash === '#como-comprar') {
    nav.replace(null, baseUrl());
    nav.push({ story: 1 }, '#como-comprar');
    openStory(false);
  }
})();
