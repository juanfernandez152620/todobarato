/* Diseño Minimalista: catálogo tipo e-commerce + video al pasar el mouse + pedido por WhatsApp.
   Usa el mismo catálogo que el diseño "Red social" (../shared/products.js). Sin dependencias. */
(() => {
  'use strict';

  const { STORE, PRODUCTS } = window;
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const PLANS = [12, 9];
  const CAPTION_MS = 2300;     // duración de cada frase en el video de muestra
  const END_WEIGHT = 1.7;      // la imagen final de financiación dura 1,7 veces más
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const isWeb = /^https?:$/.test(location.protocol);
  const sinInteres = STORE.sinInteres ? ' sin interés' : '';
  const offerLabel = STORE.sinInteres ? '12 cuotas sin interés' : 'Mismo precio en 9 o 12';

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const fmt = new Intl.NumberFormat('es-AR');
  const money = n => '$' + fmt.format(n);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fullName = p => `${/^(moto|nubia)/i.test(p.name) ? '' : p.brand + ' '}${p.name} ${p.storage} GB`;
  const memory = p => `${p.ram ? p.ram + ' GB RAM · ' : ''}${p.storage} GB`;
  const baseUrl = () => location.href.split('#')[0];
  const productUrl = p => `${baseUrl()}#p=${p.id}`;
  const tint = (el, p) => { el.style.setProperty('--c1', p.color[0]); el.style.setProperty('--c2', p.color[1]); };

  const line = d => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICON = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13l11-6.5z"/></svg>',
    expand: line('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'),
    share: line('<path d="M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M12 15V3M7 8l5-5 5 5"/>'),
    close: line('<path d="M6 6l12 12M18 6L6 18"/>'),
    up: line('<path d="M6 15l6-6 6 6"/>'),
    down: line('<path d="M6 9l6 6 6-6"/>'),
    left: line('<path d="M15 6l-6 6 6 6"/>'),
    right: line('<path d="M9 6l6 6-6 6"/>'),
    chevron: line('<path d="M6 9l6 6 6-6"/>'),
    filter: line('<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>'),
    heart: line('<path d="M12 20.3s-7.6-4.7-9.4-9.4C1.3 7.6 3.5 4.2 7 4.2c2 0 3.7 1.1 5 2.9 1.3-1.8 3-2.9 5-2.9 3.5 0 5.7 3.4 4.4 6.7-1.8 4.7-9.4 9.4-9.4 9.4z"/>'),
    sun: line('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M5.3 18.7l1.5-1.5M17.2 6.8l1.5-1.5"/>'),
    moon: line('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
  };
  const SPEC_ICON = {
    pantalla: line('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M6 6h12M6 18h12"/>'),
    camara: line('<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>'),
    bateria: line('<rect x="2.5" y="7.5" width="17" height="9" rx="2"/><path d="M22 11v2M6 10.5v3M9.5 10.5v3M13 10.5v3"/>'),
    memoria: line('<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3"/>'),
    ram: line('<rect x="2.5" y="7" width="19" height="10" rx="1.5"/><path d="M6 10.5v3M10 10.5v3M14 10.5v3M18 10.5v3M6 17v2.5M18 17v2.5"/>'),
    parlante: line('<path d="M4 9.5h4l5-4v13l-5-4H4z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>'),
    update: line('<path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4.5h-4.5"/>'),
    carga: line('<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>'),
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

  /* ---------- Me gusta (solo en el modo video): se guardan en el teléfono, compartidos con "Red social" ---------- */
  const likes = new Set(mem.get('cc:likes', []).filter(id => byId[id]));
  function toggleLike(id, on = !likes.has(id)) {
    if (on) likes.add(id); else likes.delete(id);
    mem.set('cc:likes', [...likes]);
    if (on) bump(id, 25);
    $$(`[data-id="${id}"] .js-like`).forEach(b => {
      b.setAttribute('aria-pressed', String(on));
      b.classList.remove('pop');
      void b.offsetWidth; // reinicia la animación
      b.classList.add('pop');
    });
    paintLikeCount();
  }
  function paintLikeCount() {
    $$('.js-like-count').forEach(el => { el.textContent = likes.size; el.hidden = !likes.size; });
  }

  // Doble toque en el video = me gusta; un toque solo pausa.
  let tapT = 0, tapEl = null;
  function tap(media, e, single) {
    clearTimeout(tapT);
    if (tapEl === media) {
      tapEl = null;
      toggleLike(media.closest('[data-id]').dataset.id, true);
      burst(media, e);
      return;
    }
    tapEl = media;
    tapT = setTimeout(() => { tapEl = null; single(); }, 260);
  }
  function burst(media, e) {
    const r = media.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'burst';
    el.innerHTML = ICON.heart;
    el.style.left = `${(e.detail ? e.clientX : r.left + r.width / 2) - r.left}px`;
    el.style.top = `${(e.detail ? e.clientY : r.top + r.height / 2) - r.top}px`;
    media.append(el);
    setTimeout(() => el.remove(), 900);
  }

  function affinity() {
    const brand = {};
    let total = 0, price = 0;
    for (const p of PRODUCTS) {
      const s = interest[p.id] || 0;
      if (!s) continue;
      brand[p.brand] = (brand[p.brand] || 0) + s;
      total += s;
      price += s * p.cuotas[12];
    }
    return { brand, total, price: total ? price / total : 0 };
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
      `💳 ${n} cuotas${sinInteres} de ${money(p.cuotas[n])}`,
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
      <rect x="24.75" y="12.75" width="150.5" height="374.5" rx="29.5" fill="none" stroke="rgba(0,0,0,.08)" stroke-width="1.5"/>
      ${camera}
    </svg>`;
  }

  const photoOf = p => (p.gallery && p.gallery[0]) || '';
  // Logo de la financiera (GO cuotas); si no hay logo, el nombre en texto.
  const finLogo = () => STORE.financingLogo && STORE.financingLogo.color
    ? `<img class="go-logo" src="${esc(STORE.financingLogo.color)}" alt="${esc(STORE.financing)}">`
    : esc(STORE.financing);
  // Cada palabra del título va en su propio span para animarlas de a una.
  const words = text => text.split(' ').map((w, i) => `<span class="w" style="--i:${i}"><span>${esc(w)}</span></span>`).join(' ');

  function mediaHTML(p) {
    const closing = STORE.closing;
    const caps = p.highlights.map(h => `<span class="cap">${words(h)}</span>`).join('');
    // Última imagen: la promo de financiación, un poco más larga para que se llegue a leer.
    const endcard = closing ? `
      <span class="cap endcard" data-w="${END_WEIGHT}">
        ${STORE.financing ? `<span class="end-label">${finLogo()}</span>` : ''}
        <span class="end-title">${words(closing.title)}</span>
        <span class="end-text">${esc(closing.text)}</span>
      </span>` : '';
    const steps = [...p.highlights.map(() => 1), ...(closing ? [END_WEIGHT] : [])];
    const segs = steps.map(w => `<span style="flex:${w}"><i></i></span>`).join('');
    const palette = p.palette || p.color;
    const blobs = p.highlights.map((_, i) => `<span class="blob" style="--b:${palette[i % palette.length]}"></span>`).join('') +
      (closing ? '<span class="blob" style="--b:var(--yellow)"></span>' : '');
    const art = photoOf(p)
      ? `<span class="shot"><img class="photo" src="${esc(photoOf(p))}" alt="" loading="lazy" decoding="async"></span>`
      : `<span class="phone">${phoneSVG(p)}</span>`;
    const poster = p.poster ? `<img class="poster" src="${esc(p.poster)}" alt="" loading="lazy" decoding="async">` : '';
    const video = p.video
      ? `<video muted playsinline loop preload="none" data-src="${esc(p.video)}"${p.poster ? ` poster="${esc(p.poster)}"` : ''}></video>`
      : '';
    return `<span class="scene"><span class="blobs">${blobs}</span>${art}</span>${poster}${video}` +
      `<span class="segs">${segs}</span><span class="caps">${caps}</span>${endcard}`;
  }

  /* ---------- Reproductor: video real o short animado, con frases y barra de progreso ---------- */
  function playerFor(media) {
    if (media._player) return media._player;
    const video = $('video', media);
    const caps = $$('.cap', media);
    const blobs = $$('.blob', media);
    const bars = $$('.segs i', media);
    // Cada paso dura CAPTION_MS por su peso (la imagen final dura un poco más).
    const weights = caps.map(c => +c.dataset.w || 1);
    const starts = weights.map((_, i) => weights.slice(0, i).reduce((a, b) => a + b, 0));
    const total = weights.reduce((a, b) => a + b, 0);
    const loop = CAPTION_MS * total;
    let raf = 0, t0 = 0, elapsed = 0, lastF = 0, playing = false, usingVideo = false;

    function render(f) {
      const t = f * total;
      const k = f < 0 ? -1 : starts.filter(s => t >= s).length - 1;
      caps.forEach((c, i) => c.classList.toggle('on', i === k));
      blobs.forEach((b, i) => b.classList.toggle('on', i === k));
      bars.forEach((b, i) => { b.style.transform = `scaleX(${f < 0 ? 0 : Math.max(0, Math.min(1, (t - starts[i]) / weights[i]))})`; });
    }
    function tick(now) {
      if (!playing) return;
      const f = usingVideo ? (video.duration ? video.currentTime / video.duration : -1) : ((now - t0) % loop) / loop;
      if (f >= 0) {
        // Terminó la vuelta completa (los 3 títulos): la portada pasa al siguiente celular.
        if (f < lastF && media.onloop) { lastF = 0; media.onloop(); if (!playing) return; }
        lastF = f;
        render(f);
      }
      raf = requestAnimationFrame(tick);
    }

    const player = {
      id: media.closest('[data-id]').dataset.id,
      media,
      card: media.closest('.pcard'),
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
        lastF = 0;
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
      // La portada se reproduce sola: no cuenta como interés del visitante
      if (!active.media.classList.contains('reel')) bump(active.id, Math.min(15, (performance.now() - activeAt) / 1000 - 1));
    }
    active = player;
    if (player) {
      player.play(opts);
      if (player.card) player.card.classList.add('is-active');
      activeAt = performance.now();
    }
  }

  // Qué se reproduce solo: en celular, lo que quedó en el centro de la pantalla;
  // en computadora, la portada o el video del producto (las tarjetas, al pasar el mouse).
  const visible = new Set();
  const seen = new IntersectionObserver(entries => {
    entries.forEach(en => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
    schedulePick();
  }, { threshold: [0, .55, 1] });
  let hovered = null, pickRaf = 0;
  function schedulePick() {
    if (!pickRaf) pickRaf = requestAnimationFrame(pick);
  }
  function pick() {
    pickRaf = 0;
    if (shortsOpen || (canHover && hovered)) return;
    const mid = innerHeight / 2;
    let best = null, bestD = Infinity;
    for (const m of visible) {
      if (!m.isConnected) { visible.delete(m); continue; }
      if (canHover && !m.classList.contains('ambient')) continue;
      const r = m.getBoundingClientRect();
      const shown = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      if (shown < Math.min(r.height, innerHeight) * .55) continue;
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bestD) { bestD = d; best = m; }
    }
    activate(best ? playerFor(best) : null, { withVideo: canHover || !saveData });
  }
  function watch(media) {
    seen.observe(media);
    if (!canHover || media.classList.contains('ambient')) return;
    const host = media.closest('.pcard');
    let t = 0;
    host.addEventListener('mouseenter', () => {
      clearTimeout(t);
      t = setTimeout(() => { hovered = media; activate(playerFor(media)); }, 140);
    });
    host.addEventListener('mouseleave', () => {
      clearTimeout(t);
      if (hovered === media) { hovered = null; schedulePick(); }
    });
    host.addEventListener('focusin', () => { hovered = media; activate(playerFor(media)); });
    host.addEventListener('focusout', e => {
      if (!host.contains(e.relatedTarget) && hovered === media) { hovered = null; schedulePick(); }
    });
  }

  /* ---------- Cuotas elegidas (se sincronizan en todas las tarjetas del mismo celular) ---------- */
  const plan = {};
  const planOf = p => plan[p.id] || 12;
  const own = (root, sel) => $$(sel, root).filter(el => el.closest('[data-id]') === root);

  function paint(root, p) {
    const n = planOf(p);
    own(root, '.js-n').forEach(el => { el.textContent = n; });
    own(root, '.js-amount').forEach(el => { el.textContent = money(p.cuotas[n]); });
    own(root, '.js-total').forEach(el => { el.textContent = `Total ${money(p.cuotas[n] * n)}`; });
    own(root, '[data-n]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.n === n)));
    own(root, '.js-wa').forEach(a => { a.href = waHref(buyMessage(p, n)); });
  }
  function setPlan(id, n) {
    plan[id] = n;
    $$(`[data-id="${id}"]`).forEach(el => paint(el, byId[id]));
  }

  /* ---------- Tarjeta de producto ---------- */
  function cardEl(p) {
    const el = document.createElement('article');
    el.className = 'pcard';
    el.dataset.id = p.id;
    tint(el, p);
    el.innerHTML = `
      <div class="pcard-media">
        <a class="media js-product" href="#p=${p.id}" aria-label="${esc(fullName(p))}">
          ${mediaHTML(p)}
          <span class="vbadge" aria-hidden="true">${ICON.play}</span>
        </a>
        <a class="quick js-wa" target="_blank" rel="noopener">${ICON.wa}<span>Pedilo por WhatsApp</span></a>
      </div>
      <a class="pcard-info js-product" href="#p=${p.id}" tabindex="-1">
        <p class="label">${offerLabel}</p>
        <h3 class="name">${esc(p.name)}</h3>
        <p class="sub">${esc(p.brand)} · ${memory(p)}</p>
        <p class="price"><span class="js-n"></span> x <span class="js-amount"></span></p>
        <p class="total js-total"></p>
      </a>`;
    paint(el, p);
    watch($('.media', el));
    return el;
  }

  /* ---------- Portada ---------- */
  // La portada arranca con el destacado y va pasando por todos: cambia al terminar sus 3 títulos.
  const heroFirst = byId[STORE.featured] || PRODUCTS[0];
  const heroOrder = [heroFirst, ...PRODUCTS.filter(p => p !== heroFirst)];
  let heroAt = 0;

  function showHero(p) {
    const box = $('#hero-media');
    const old = $('.media:not(.leaving)', box);
    box.dataset.id = p.id;
    tint(box, p);
    box.insertAdjacentHTML('beforeend',
      `<div class="media ambient reel js-shorts" role="button" tabindex="0" aria-label="Ver el video del ${esc(fullName(p))}">${mediaHTML(p)}</div>`);
    const media = box.lastElementChild;
    media.onloop = () => showHero(heroOrder[heroAt = (heroAt + 1) % heroOrder.length]);
    watch(media);
    $('#hero-kicker').textContent = fullName(p);
    if (!old) return;
    seen.unobserve(old);
    visible.delete(old);
    if (active && active.media === old) activate(playerFor(media), { withVideo: canHover || !saveData });
    old.classList.add('leaving');
    setTimeout(() => old.remove(), 700);
  }

  function buildHero() {
    showHero(heroOrder[0]);
    $('#hero-text').textContent = `${STORE.sinInteres ? 'Hasta 12 cuotas sin interés' : 'Mismo precio en 9 o 12 cuotas'}` +
      `${STORE.financing ? ` con ${STORE.financing}` : ''}. Mirá el video de cada celular y pedilo por WhatsApp.`;
  }

  function buildBrands() {
    const brands = [...new Set(PRODUCTS.map(p => p.brand))];
    $('#brand-row').innerHTML = brands.map(b => {
      const p = PRODUCTS.find(x => x.brand === b);
      const art = photoOf(p) ? `<img src="${esc(photoOf(p))}" alt="" loading="lazy">` : phoneSVG(p);
      return `<button class="brand-tile js-brand" type="button" data-brand="${esc(b)}">
        <span class="tile">${art}</span><span>${esc(b)}</span></button>`;
    }).join('');
    $('#nav').innerHTML = ['', ...brands].map(b =>
      `<button type="button" class="js-brand" data-brand="${esc(b)}">${esc(b || 'Celulares')}</button>`).join('');
  }

  /* ---------- Catálogo con filtros ---------- */
  const F = { brands: new Set(), max: 0, storage: new Set(), sort: 'destacados', liked: false };
  const matches = p =>
    (!F.liked || likes.has(p.id)) &&
    (!F.brands.size || F.brands.has(p.brand)) &&
    (!F.max || p.cuotas[12] <= F.max) &&
    (!F.storage.size || F.storage.has(p.storage));

  function buildFilters() {
    const brands = [...new Set(PRODUCTS.map(p => p.brand))];
    const storages = [...new Set(PRODUCTS.map(p => p.storage))].sort((a, b) => a - b);
    const count = fn => PRODUCTS.filter(fn).length;
    const box = (type, name, value, label, n) => `
      <label class="opt"><input type="${type}" name="${name}" value="${esc(value)}"><span class="box${type === 'radio' ? ' round' : ''}"></span>${esc(label)}${n != null ? `<small>${n}</small>` : ''}</label>`;
    $('#filter-groups').innerHTML = `
      <fieldset><legend>Marca</legend>${brands.map(b => box('checkbox', 'brand', b, b, count(p => p.brand === b))).join('')}</fieldset>
      <fieldset><legend>Cuota por mes</legend>${[0, ...STORE.budgets].map(v => box('radio', 'max', v, v ? `Hasta ${money(v)}` : 'Todas')).join('')}</fieldset>
      <fieldset><legend>Memoria</legend>${storages.map(s => box('checkbox', 'storage', s, `${s} GB`, count(p => p.storage === s))).join('')}</fieldset>`;
    syncFilterInputs();
  }

  function syncFilterInputs() {
    $$('#filters input[name="brand"]').forEach(i => { i.checked = F.brands.has(i.value); });
    $$('#filters input[name="storage"]').forEach(i => { i.checked = F.storage.has(+i.value); });
    $$('#filters input[name="max"]').forEach(i => { i.checked = +i.value === F.max; });
    const only = F.brands.size === 1 ? [...F.brands][0] : '';
    $$('#nav button').forEach(b => {
      const current = !F.liked && (only ? b.dataset.brand === only : !F.brands.size && b.dataset.brand === '');
      b.setAttribute('aria-current', String(current));
    });
    $('.js-favs').setAttribute('aria-pressed', String(F.liked));
  }

  function readFilterInputs() {
    F.brands = new Set($$('#filters input[name="brand"]:checked').map(i => i.value));
    F.storage = new Set($$('#filters input[name="storage"]:checked').map(i => +i.value));
    F.max = +(($('#filters input[name="max"]:checked') || {}).value || 0);
  }

  function sorted(list) {
    switch (F.sort) {
      case 'menor': return [...list].sort((a, b) => a.cuotas[12] - b.cuotas[12]);
      case 'mayor': return [...list].sort((a, b) => b.cuotas[12] - a.cuotas[12]);
      case 'memoria': return [...list].sort((a, b) => b.storage - a.storage || a.cuotas[12] - b.cuotas[12]);
      default: return affinity().total > 5 ? rank(list) : list;
    }
  }

  function renderGrid() {
    const grid = $('#grid');
    $$('.media', grid).forEach(m => { seen.unobserve(m); visible.delete(m); if (active && active.media === m) activate(null); });
    hovered = null;
    grid.innerHTML = '';
    const list = sorted(PRODUCTS.filter(matches));
    list.forEach(p => grid.append(cardEl(p)));
    if (!list.length && F.liked && !likes.size) {
      grid.innerHTML = `
        <div class="empty">
          <b>Todavía no tenés me gusta</b>
          <p>Abrí "Mirá los videos" y tocá el ♥ (o tocá dos veces el video) en los celulares que te gusten.</p>
          <button class="btn-pill js-shorts-all" type="button">Mirá los videos</button>
        </div>`;
    } else if (!list.length) {
      grid.innerHTML = `
        <div class="empty">
          <b>No hay celulares con esos filtros</b>
          <p>Probá sacando alguno o preguntanos por WhatsApp.</p>
          <a class="btn-pill js-wa" target="_blank" rel="noopener" href="${waHref(STORE.greeting)}">${ICON.wa}Preguntar</a>
        </div>`;
    }
    $('#plp-title').textContent = F.liked ? 'Tus me gusta' : F.brands.size === 1 ? [...F.brands][0] : 'Celulares';
    $('#plp-count').textContent = `(${list.length})`;
    $('.js-apply').textContent = `Ver ${list.length} ${list.length === 1 ? 'resultado' : 'resultados'}`;
    syncFilterInputs();
    schedulePick();
  }

  function showBrand(brand) {
    F.liked = false;
    F.brands = new Set(brand ? [brand] : []);
    renderGrid();
    toCatalog();
  }

  function showLikes() {
    F.liked = true;
    F.brands = new Set();
    renderGrid();
    toCatalog();
  }

  function toCatalog() {
    if (view !== 'home') { homeScroll = -1; go(baseUrl()); }
    else $('#catalogo').scrollIntoView({ behavior: 'smooth' });
  }

  const isDesk = () => matchMedia('(min-width: 960px)').matches;
  function toggleFilters() {
    if (!isDesk()) { openSheet(); return; }
    const hide = $('.plp-body').classList.toggle('no-filters');
    $('.js-filters').setAttribute('aria-expanded', String(!hide));
    $('.js-filters .t-desk').textContent = hide ? 'Mostrar filtros' : 'Ocultar filtros';
  }
  function openSheet() {
    $('#filters').classList.add('open');
    $('#scrim').hidden = false;
    document.documentElement.classList.add('lock');
  }
  function closeSheet() {
    $('#filters').classList.remove('open');
    $('#scrim').hidden = true;
    document.documentElement.classList.remove('lock');
  }

  /* ---------- Recomendados ---------- */
  function renderRecs(box, excludeId) {
    $$('.media', box).forEach(m => { seen.unobserve(m); visible.delete(m); });
    const list = rank(PRODUCTS, { exclude: excludeId ? [excludeId] : [], jitter: .35 });
    box.innerHTML = `
      <div class="recs-head">
        <h2>Quizás también te guste</h2>
        <div class="arrows">
          <button class="arrow js-scroll" type="button" data-dir="-1" aria-label="Anteriores">${ICON.left}</button>
          <button class="arrow js-scroll" type="button" data-dir="1" aria-label="Siguientes">${ICON.right}</button>
        </div>
      </div>
      <div class="recs-row"></div>`;
    const row = $('.recs-row', box);
    list.forEach(p => row.append(cardEl(p)));
  }

  /* ---------- Página de producto ---------- */
  function specListHTML(p) {
    const rows = p.specs.map(s => [SPEC_ICON[s.icon], s.l, s.v + (s.u ? ' ' + s.u : '')]);
    if (!p.specs.some(s => s.icon === 'memoria')) rows.push([SPEC_ICON.memoria, 'Memoria', `${p.storage} GB`]);
    if (p.ram && !p.specs.some(s => s.icon === 'ram')) rows.push([SPEC_ICON.ram, 'RAM', `${p.ram} GB`]);
    return `<ul class="spec-list">${rows.map(([icon, label, value]) =>
      `<li>${icon || '<span></span>'}<span>${esc(label)}</span><b>${esc(value)}</b></li>`).join('')}</ul>`;
  }

  function renderProduct(p) {
    $$('.media', product).forEach(m => { seen.unobserve(m); visible.delete(m); });
    product.innerHTML = `
      <nav class="crumbs" aria-label="Ruta">
        <a class="js-home" href="./">Celulares</a><span>/</span>
        <a class="js-brand" href="./" data-brand="${esc(p.brand)}">${esc(p.brand)}</a><span>/</span>
        <span>${esc(p.name)} ${p.storage} GB</span>
      </nav>
      <div class="pdp" data-id="${p.id}">
        <div class="pdp-media">
          <div class="media ambient js-shorts" role="button" tabindex="0" aria-label="Ver video en pantalla completa">${mediaHTML(p)}</div>
          ${(p.gallery || []).length > 1 ? `<div class="thumbs" role="group" aria-label="Fotos">${p.gallery.map((src, i) => `
            <button class="thumb js-thumb" type="button" data-src="${esc(src)}" aria-pressed="${i === 0}" aria-label="Foto ${i + 1}">
              <img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
          <button class="pdp-full js-shorts" type="button">${ICON.expand}Ver en pantalla completa</button>
        </div>
        <div class="pdp-info">
          <p class="label">${offerLabel}</p>
          <h1 class="pdp-name">${esc(p.name)}</h1>
          <p class="pdp-sub">${esc(p.brand)} · ${memory(p)}</p>
          <p class="pdp-price"><span class="js-n"></span> cuotas${sinInteres} de <strong class="js-amount"></strong></p>
          <p class="pdp-total js-total"></p>
          <div class="plan-head"><span>Elegí tus cuotas</span>${STORE.financing ? `<span class="fin">Financiá con ${finLogo()}</span>` : ''}</div>
          <div class="plan-grid" role="group" aria-label="Cantidad de cuotas">
            ${PLANS.map(n => `<button type="button" data-n="${n}"><b>${n} cuotas</b><span>${money(p.cuotas[n])} por mes</span></button>`).join('')}
          </div>
          <a class="btn-primary js-wa" target="_blank" rel="noopener">${ICON.wa}Pedilo por WhatsApp</a>
          <button class="btn-secondary js-share" type="button">${ICON.share}Compartir</button>
          <p class="pdp-pitch">${esc(p.pitch)}</p>
          <details class="acc" open><summary>Características ${ICON.chevron}</summary>${specListHTML(p)}</details>
          <details class="acc"><summary>Descripción ${ICON.chevron}</summary>
            <ul class="desc">${p.details.map(d => `<li>${esc(d)}</li>`).join('')}</ul></details>
          <details class="acc"><summary>Cómo comprar ${ICON.chevron}</summary>
            <ol class="howto">${STORE.howto.map(s => `<li><b>${esc(s.title)}</b><span>${esc(s.text)}</span></li>`).join('')}</ol></details>
        </div>
      </div>
      <section class="recs" id="recs-product"></section>`;
    const pdp = $('.pdp', product);
    tint(pdp, p);
    paint(pdp, p);
    watch($('.media', pdp));
    renderRecs($('#recs-product'), p.id);
    document.title = `${fullName(p)} en cuotas · ${STORE.name}`;
  }

  /* ---------- Navegación: inicio ↔ producto ↔ modo video (el "atrás" del celular funciona) ---------- */
  const home = $('#home');
  const product = $('#product');
  let view = '', viewId = '', homeScroll = 0;
  const nav = {
    push(url) { try { history.pushState(null, '', url); } catch {} },
    replace(url) { try { history.replaceState(null, '', url); } catch {} },
  };
  function go(url) { nav.push(url); route(); }

  function route() {
    const v = /^#v=([\w-]+)$/.exec(location.hash);
    const p = /^#p=([\w-]+)$/.exec(location.hash);
    if (v && byId[v[1]]) {
      if (!view) showHome();
      openShorts(v[1]);
      return;
    }
    closeShorts();
    if (p && byId[p[1]]) showProduct(p[1]);
    else showHome();
  }

  function showHome() {
    if (view === 'home') return;
    activate(null);
    hovered = null;
    view = 'home';
    viewId = '';
    product.hidden = true;
    home.hidden = false;
    document.title = `${STORE.name} · Celulares en cuotas${sinInteres}`;
    renderRecs($('#recs-home'));
    const y = homeScroll < 0 ? $('#catalogo').getBoundingClientRect().top + scrollY : homeScroll;
    requestAnimationFrame(() => { scrollTo(0, y); schedulePick(); });
  }

  function showProduct(id) {
    if (view === 'product' && viewId === id) return;
    if (view === 'home') homeScroll = scrollY;
    activate(null);
    hovered = null;
    view = 'product';
    viewId = id;
    home.hidden = true;
    product.hidden = false;
    renderProduct(byId[id]);
    scrollTo(0, 0);
    bump(id, 5);
    schedulePick();
  }

  /* ---------- Modo video: pantalla completa, deslizar para el siguiente ---------- */
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
        <button class="rail-btn js-like" type="button" aria-pressed="${likes.has(p.id)}" aria-label="Me gusta"><span class="circle">${ICON.heart}</span>Me gusta</button>
        <button class="rail-btn js-share" type="button"><span class="circle">${ICON.share}</span>Compartir</button>
      </div>
      <div class="slide-info">
        <p class="label">${offerLabel}</p>
        <h2 class="slide-name">${esc(p.name)} <span>${memory(p)}</span></h2>
        <p class="slide-price"><span class="js-n"></span> cuotas${sinInteres} de <strong class="js-amount"></strong><small class="js-total"></small></p>
        <div class="slide-ctas">
          <a class="btn-primary js-wa" target="_blank" rel="noopener">${ICON.wa}Pedilo</a>
          <a class="btn-secondary js-view" href="#p=${p.id}">Ver producto</a>
        </div>
      </div>`;
    paint(el, p);
    slideSeen.observe(el);
    return el;
  }

  function appendSlides(list) {
    list.forEach(p => track.append(slideEl(p)));
    shortsIds = [...shortsIds, ...list.map(p => p.id)];
  }

  function openShorts(id) {
    if (shortsOpen) return;
    activate(null);
    track.innerHTML = '';
    shortsIds = [];
    appendSlides([byId[id], ...rank(PRODUCTS, { exclude: [id], jitter: .4 })]);
    shorts.hidden = false;
    document.documentElement.classList.add('lock');
    shortsOpen = true;
    track.scrollTop = 0;
    bump(id, 5);
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
    nav.replace('#v=' + slide.dataset.id);
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

  /* ---------- Compartir y avisos ---------- */
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
    share(fullName(p), `Mirá este ${fullName(p)}: ${n} cuotas${sinInteres} de ${money(p.cuotas[n])}`, productUrl(p));
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
  const plainClick = e => !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button);

  document.addEventListener('click', e => {
    const t = e.target;
    let el;
    if ((el = t.closest('.js-like'))) return toggleLike(el.closest('[data-id]').dataset.id);
    if (t.closest('.js-favs')) return showLikes();
    if (t.closest('.js-theme')) return toggleTheme();
    if ((el = t.closest('.js-thumb'))) {
      const pdp = el.closest('.pdp');
      $('.photo', pdp).src = el.dataset.src;
      $$('.js-thumb', pdp).forEach(b => b.setAttribute('aria-pressed', String(b === el)));
      return;
    }
    if ((el = t.closest('[data-n]'))) return setPlan(el.closest('[data-id]').dataset.id, +el.dataset.n);
    if ((el = t.closest('.js-wa'))) {
      const host = el.closest('[data-id]');
      if (host) bump(host.dataset.id, 20);
      toast('Abriendo WhatsApp…');
      return;
    }
    if ((el = t.closest('.js-share'))) return shareProduct(byId[el.closest('[data-id]').dataset.id]);
    if ((el = t.closest('.js-view'))) {
      e.preventDefault();
      nav.replace('#p=' + el.closest('[data-id]').dataset.id);
      return route();
    }
    if ((el = t.closest('.js-product')) && plainClick(e)) {
      e.preventDefault();
      return go('#p=' + el.closest('[data-id]').dataset.id);
    }
    if (t.closest('.js-close')) return history.back();
    if ((el = t.closest('.slide .media'))) return tap(el, e, () => togglePause(el));
    if ((el = t.closest('.js-shorts'))) return go('#v=' + el.closest('[data-id]').dataset.id);
    if (t.closest('.js-shorts-all')) {
      const first = $('#grid .pcard');
      return go('#v=' + (first ? first.dataset.id : PRODUCTS[0].id));
    }
    if ((el = t.closest('.js-brand'))) { e.preventDefault(); return showBrand(el.dataset.brand); }
    if (t.closest('.js-home') && plainClick(e)) {
      e.preventDefault();
      homeScroll = 0;
      return view === 'home' ? scrollTo({ top: 0, behavior: 'smooth' }) : go(baseUrl());
    }
    if (t.closest('.js-catalog')) { e.preventDefault(); return $('#catalogo').scrollIntoView({ behavior: 'smooth' }); }
    if (t.closest('.js-filters')) return toggleFilters();
    if (t.closest('.js-sheet-close') || t === $('#scrim')) return closeSheet();
    if (t.closest('.js-clear')) {
      F.liked = false;
      F.brands.clear();
      F.storage.clear();
      F.max = 0;
      return renderGrid();
    }
    if ((el = t.closest('.js-scroll'))) {
      const row = $('.recs-row', el.closest('.recs'));
      return row.scrollBy({ left: +el.dataset.dir * row.clientWidth * .9, behavior: 'smooth' });
    }
    if (t.closest('#shorts-prev')) return slideBy(-1);
    if (t.closest('#shorts-next')) return slideBy(1);
    if (t === shorts) return history.back();
  });

  $('#filters').addEventListener('change', () => { readFilterInputs(); renderGrid(); });
  $('#sort').addEventListener('change', e => { F.sort = e.target.value; renderGrid(); });

  document.addEventListener('keydown', e => {
    if (shortsOpen) {
      if (e.key === 'Escape') history.back();
      else if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); slideBy(1); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); slideBy(-1); }
    } else if (e.key === 'Escape' && $('#filters').classList.contains('open')) {
      closeSheet();
    } else if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.js-shorts[role="button"]')) {
      e.preventDefault();
      go('#v=' + e.target.closest('[data-id]').dataset.id);
    }
  });

  // Alto real del header (en celular ocupa dos renglones) para las barras que quedan fijas debajo.
  const setHeadH = () => document.documentElement.style.setProperty('--head-h', $('.head').offsetHeight + 'px');
  addEventListener('resize', setHeadH);
  if (document.fonts) document.fonts.ready.then(setHeadH);

  addEventListener('popstate', route);
  addEventListener('scroll', () => {
    $('.head').classList.toggle('scrolled', scrollY > 8);
    schedulePick();
  }, { passive: true });
  addEventListener('resize', schedulePick);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { activate(null); currentSlide = null; return; }
    const slide = shortsOpen && [...track.children].find(s => Math.abs(s.offsetTop - track.scrollTop) < 10);
    if (slide) onSlide(slide);
    else schedulePick();
  });

  /* ---------- Modo claro / oscuro: sigue al teléfono hasta que el visitante elige con el botón ---------- */
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (document.documentElement.dataset.theme || (systemDark.matches ? 'dark' : 'light')) === 'dark';
  function paintTheme() {
    const dark = isDark();
    const btn = $('.js-theme');
    btn.innerHTML = dark ? ICON.sun : ICON.moon;
    btn.setAttribute('aria-label', dark ? 'Pasar a modo claro' : 'Pasar a modo oscuro');
    btn.title = btn.getAttribute('aria-label');
    if (document.documentElement.dataset.theme) {
      $$('meta[name="theme-color"]').forEach(m => { m.content = dark ? '#0b0b0c' : '#ffffff'; });
    }
  }
  function toggleTheme() {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('cc:theme', next); } catch {}
    paintTheme();
  }
  systemDark.addEventListener('change', paintTheme);

  /* ---------- Aviso superior rotativo ---------- */
  const PROMO = [
    STORE.sinInteres ? 'Hasta 12 cuotas sin interés' : 'Mismo precio en 9 o 12 cuotas',
    STORE.financing && `Financiá con ${finLogo()}`,
    esc(`Pedí por WhatsApp · Estamos en ${STORE.city}`),
  ].filter(Boolean);
  let promoI = 0;
  $('#promo').innerHTML = PROMO[0];
  setInterval(() => {
    const el = $('#promo');
    promoI = (promoI + 1) % PROMO.length;
    el.classList.add('out');
    setTimeout(() => { el.innerHTML = PROMO[promoI]; el.classList.remove('out'); }, 260);
  }, 4200);

  /* ---------- Inicio ---------- */
  $$('[data-icon]').forEach(el => el.insertAdjacentHTML('afterbegin', ICON[el.dataset.icon]));
  $$('[data-store]').forEach(el => { el.textContent = STORE[el.dataset.store] || ''; });
  $$('[data-store="financing"]').forEach(el => { el.innerHTML = finLogo(); });
  if (!STORE.financing) $$('.js-financing').forEach(el => { el.closest('li').hidden = true; });
  $$('.js-wa-general').forEach(a => { a.href = waHref(STORE.greeting); });
  $('#year').textContent = new Date().getFullYear();
  buildHero();
  buildBrands();
  paintLikeCount();
  paintTheme();
  setHeadH();
  buildFilters();
  renderGrid();

  // Links compartidos (#p=… producto, #v=… video): "atrás" vuelve al catálogo en vez de salir.
  if (/^#[pv]=/.test(location.hash)) {
    const target = location.hash;
    nav.replace(baseUrl());
    showHome();
    go(target);
  } else {
    route();
  }
})();
