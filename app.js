/* =========================================================
   Regalo romántico — lógica
   Edita CONFIG para cambiar fotos, mensajes y credenciales.
   ========================================================= */
(() => {
'use strict';

/* ---------------- CONFIGURACIÓN ---------------- */
const CONFIG = {
  usuario: 'Mapachito',
  password: '27-11',
  cancionTitulo: 'Tu canción favorita',
  // Para cambiar una foto, reemplaza el archivo con el mismo nombre en la misma carpeta.
  // Para agregar más, copia una línea y cambia el nombre del archivo y el mensaje.
  fotos: [
    { src: 'foto1.jpg', msg: 'Tu sonrisa ilumina cualquier lugar al que llegas.' },
    { src: 'foto2.jpg', msg: 'Admiro la forma tan hermosa en que ves la vida.' },
    { src: 'foto3.jpg', msg: 'Contigo hasta los días simples se vuelven especiales.' },
    { src: 'foto4.jpg', msg: 'Eres ternura, fuerza y luz, todo en una sola persona.' },
    { src: 'foto5.jpg', msg: 'Qué suerte tengo de tenerte como amiga.' },
    { src: 'foto6.jpg', msg: 'Gracias por existir y por dejarme ser parte de tu vida.' },
    { src: 'foto7.jpg', msg: 'Eres paz, alegría y la mejor casualidad que me pasó.' },
    { src: 'foto8.jpg', msg: 'No importa lo que pase: siempre puedes contar conmigo.' }
  ]
};

/* ---------------- Utilidades ---------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const rand = (a, b) => a + Math.random() * (b - a);
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const fmt = t => {
  if (!isFinite(t)) return '0:00';
  const m = Math.floor(t / 60), s = Math.floor(t % 60);
  return m + ':' + String(s).padStart(2, '0');
};
const setRange = el => {
  const p = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.setProperty('--p', p + '%');
};

/* ---------------- Fondo flotante ---------------- */
(function buildBackground() {
  const bg = $('#bgLayer');
  const syms = ['❤', '♥', '✦', '✿', '❀', '❤', '✧'];
  const kinds = ['', 'gold', 'soft'];
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.className = 'float ' + kinds[Math.floor(Math.random() * kinds.length)];
    s.textContent = syms[Math.floor(Math.random() * syms.length)];
    s.style.left = rand(0, 100) + '%';
    s.style.fontSize = rand(10, 26) + 'px';
    s.style.animationDuration = rand(16, 32) + 's';
    s.style.animationDelay = (-rand(0, 32)) + 's';
    bg.appendChild(s);
  }
  // destellos del mar
  const g = $('#glints');
  for (let i = 0; i < 28; i++) {
    const d = document.createElement('i');
    d.style.left = rand(2, 98) + '%';
    d.style.top = rand(0, 95) + '%';
    d.style.animationDelay = (-rand(0, 3)) + 's';
    d.style.animationDuration = rand(2, 5) + 's';
    g.appendChild(d);
  }
})();

/* ---------------- Confeti / corazones ---------------- */
const Confetti = (() => {
  const cv = $('#confetti');
  const ctx = cv.getContext('2d');
  let parts = [], raf = null, W = 0, H = 0;
  const colors = ['#f2b5c5', '#e8a0b4', '#d9708b', '#e8d29a', '#c9a24d', '#fff', '#f9d9e0', '#cdeaf3'];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function heart(s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.45);
    ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.35 + s * 0.65);
    ctx.closePath();
    ctx.fill();
  }
  function star(s) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? s * 0.45 : s;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }

  function burst(x, y, n = 50, power = 1) {
    const types = ['heart', 'heart', 'star', 'rect'];
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(3, 11) * power;
      parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - rand(2, 6),
        g: rand(0.14, 0.24), rot: rand(0, 6), vr: rand(-0.2, 0.2),
        size: rand(5, 11), life: rand(80, 150),
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * types.length)]
      });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    parts = parts.filter(p => p.life > 0 && p.y < H + 40);
    for (const p of parts) {
      p.vy += p.g; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.color;
      if (p.type === 'heart') heart(p.size);
      else if (p.type === 'star') star(p.size);
      else ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      ctx.restore();
    }
    raf = parts.length ? requestAnimationFrame(loop) : null;
    if (!raf) ctx.clearRect(0, 0, W, H);
  }
  return { burst };
})();

/* ---------------- Navegación entre páginas ---------------- */
let current = 'login';
let transitioning = false;
const nav = $('#nav');

function updateNav() {
  nav.hidden = current === 'login';
  $$('button', nav).forEach(b => b.classList.toggle('on', b.dataset.go === current));
}

function go(id) {
  if (id === current || transitioning) return;
  transitioning = true;
  const from = $('#' + current), to = $('#' + id);
  stopAudios();
  from.classList.add('leaving');
  setTimeout(() => {
    from.classList.remove('active', 'leaving');
    to.classList.add('active');
    window.scrollTo(0, 0);
    current = id;
    updateNav();
    transitioning = false;
    if (id === 'mundo') revealShots();
  }, 450);
}
$$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

/* ---------------- 1. Login ---------------- */
(function login() {
  const form = $('#loginForm'), msg = $('#loginMsg');
  const card = form;
  const errs = [
    'Mmm… esos datos no son los correctos, amiga 💕 Inténtalo otra vez.',
    'Casi, casi, amiga 🥺 Piensa en esa fecha tan especial.',
    'Tú puedes, amiga ✨ Esa sorpresa te está esperando.'
  ];
  let tries = 0;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = norm($('#user').value) === norm(CONFIG.usuario) &&
               norm($('#pass').value) === norm(CONFIG.password);
    if (ok) {
      msg.textContent = 'Bienvenida, amiga ❤️';
      const r = card.getBoundingClientRect();
      Confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 70, 1.1);
      card.classList.add('ok');
      setTimeout(() => {
        go('carta');
        setTimeout(() => card.classList.remove('ok'), 600);
      }, 900);
    } else {
      msg.textContent = errs[tries++ % errs.length];
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 520);
    }
  });
})();

/* ---------------- 2. Carta ---------------- */
(function carta() {
  const env = $('#envelope'), wrap = $('#envelopeWrap'), letter = $('#letter');
  let opened = false;
  function open() {
    if (opened) return;
    opened = true;
    env.classList.add('open');
    const r = env.getBoundingClientRect();
    Confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 30, 0.7);
    setTimeout(() => {
      wrap.classList.add('gone');
      letter.hidden = false;
      $$('.letter>*:not(.letter-deco)').forEach((el, i) => { el.style.animationDelay = (0.5 + i * 0.35) + 's'; });
      requestAnimationFrame(() => letter.classList.add('show'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1300);
  }
  env.addEventListener('click', open);
  $('#toMundo').addEventListener('click', e => {
    Confetti.burst(e.clientX, e.clientY, 36, 0.8);
    setTimeout(() => go('mundo'), 450);
  });
})();

/* ---------------- 3a. Piñata ---------------- */
(function pinata() {
  const NEED = 7;
  const wrap = $('#pinata'), swing = $('#swing'), hint = $('#pinataHint'), msg = $('#pinataMsg');
  let hits = 0, broken = false;

  function svg(sfx) {
    const cx = 150, cy = 150, R = 102, r = 66, pts = [];
    for (let i = 0; i < 14; i++) {
      const rad = i % 2 ? r : R, a = -Math.PI / 2 + (i * Math.PI) / 7;
      pts.push((cx + Math.cos(a) * rad).toFixed(1) + ',' + (cy + Math.sin(a) * rad).toFixed(1));
    }
    const star = pts.join(' ');
    const cols = ['#f4b8c7', '#fff4e2', '#e8c971', '#f9d9e0', '#cdeaf3', '#f4b8c7', '#fff4e2', '#e8c971', '#f9d9e0'];
    let bands = '';
    for (let i = cols.length - 1; i >= 0; i--) {
      const y = 44 + i * 24;
      let sc = '';
      for (let x = 30; x <= 280; x += 22) sc += `<circle cx="${x}" cy="${y + 24}" r="13" fill="${cols[i]}"/>`;
      bands += `<g><rect x="0" y="${y}" width="300" height="24" fill="${cols[i]}"/>${sc}</g>`;
    }
    const cracks = [
      'M150 60 L142 90 L156 112 L146 140', 'M146 140 L120 150 L108 176', 'M156 112 L190 118 L204 146',
      'M146 140 L160 172 L150 204', 'M120 150 L96 140 L80 150', 'M190 118 L214 100'
    ].map((d, i) => `<path class="crack" data-l="${i + 1}" d="${d}" fill="none" stroke="#7a3b4e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0" style="transition:opacity .25s"/>`).join('');
    return `<svg viewBox="0 -70 300 380" aria-hidden="true">
      <defs><clipPath id="cp${sfx}"><polygon points="${star}"/></clipPath>
      <radialGradient id="sh${sfx}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <line class="rope" x1="150" y1="-70" x2="150" y2="50" stroke="#c9a24d" stroke-width="3" stroke-dasharray="6 3"/>
      <polygon points="${star}" fill="#f4b8c7" stroke="#e8a0b4" stroke-width="8" stroke-linejoin="round"/>
      <g clip-path="url(#cp${sfx})">${bands}<rect width="300" height="300" y="-20" fill="url(#sh${sfx})"/></g>
      <polygon points="${star}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="3" stroke-linejoin="round"/>
      <text x="150" y="172" text-anchor="middle" font-size="64" fill="#fff" stroke="#d9708b" stroke-width="2">♥</text>
      ${cracks}
    </svg>`;
  }
  const build = () => { $('#halfL').innerHTML = svg('L'); $('#halfR').innerHTML = svg('R'); };
  build();

  function center() { const r = wrap.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * 0.45]; }

  function setCracks() {
    $$('.crack').forEach(c => { c.style.opacity = Number(c.dataset.l) <= hits ? 1 : 0; });
  }

  function hit() {
    if (broken) return;
    hits++;
    swing.classList.remove('hit'); void swing.offsetWidth; swing.classList.add('hit');
    setCracks();
    const [x, y] = center();
    Confetti.burst(x, y, 8 + hits * 2, 0.6);
    const left = NEED - hits;
    hint.textContent = left > 0
      ? (left === 1 ? '¡Uno más, amiga! 💥' : `¡Sigue! Faltan ${left} golpes 🎉`)
      : '¡Sorpresa! 💖';
    if (hits >= NEED) breakIt();
  }

  function breakIt() {
    broken = true;
    wrap.classList.add('broken');
    const [x, y] = center();
    Confetti.burst(x, y, 140, 1.5);
    setTimeout(() => Confetti.burst(x - 60, y, 80, 1.2), 250);
    setTimeout(() => Confetti.burst(x + 60, y, 80, 1.2), 450);
    setTimeout(() => {
      msg.hidden = false;
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1100);
  }

  function reset() {
    hits = 0; broken = false;
    wrap.classList.remove('broken');
    msg.hidden = true;
    build();
    hint.textContent = 'Toca la piñata para romperla 🎉';
  }

  wrap.addEventListener('click', hit);
  $('#pinataReset').addEventListener('click', reset);
})();

/* ---------------- 3b. Reproductor de música ---------------- */
const song = $('#song'), seaAudio = $('#seaAudio');
(function player() {
  const btn = $('#songBtn'), seek = $('#seek'), cur = $('#tCur'), dur = $('#tDur'), disc = $('#disc'), note = $('#songNote');
  $('#songTitle').textContent = CONFIG.cancionTitulo;
  setRange(seek);

  btn.addEventListener('click', () => {
    if (song.paused) {
      song.play().catch(() => { note.hidden = false; });
    } else song.pause();
  });
  song.addEventListener('play',  () => { btn.textContent = '❚❚'; btn.setAttribute('aria-label', 'Pausar canción'); disc.classList.add('playing'); });
  song.addEventListener('pause', () => { btn.textContent = '▶';  btn.setAttribute('aria-label', 'Reproducir canción'); disc.classList.remove('playing'); });
  song.addEventListener('ended', () => { btn.textContent = '▶'; disc.classList.remove('playing'); });
  song.addEventListener('loadedmetadata', () => { dur.textContent = fmt(song.duration); note.hidden = true; });
  song.addEventListener('error', () => { note.hidden = false; });
  song.addEventListener('timeupdate', () => {
    cur.textContent = fmt(song.currentTime);
    if (song.duration) { seek.value = (song.currentTime / song.duration) * 100; setRange(seek); }
  });
  seek.addEventListener('input', () => {
    if (song.duration) song.currentTime = (seek.value / 100) * song.duration;
    setRange(seek);
  });
})();

/* ---------------- 3c. Galería + visor ---------------- */
function placeholder(n) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbe3e8"/><stop offset="1" stop-color="#f3c6d3"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><text x="150" y="215" font-size="96" text-anchor="middle" fill="#fff">♥</text><text x="150" y="290" font-family="Georgia,serif" font-style="italic" font-size="22" text-anchor="middle" fill="#b9667f">Tu foto ${n}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
function revealShots() {
  $$('.shot').forEach((el, i) => setTimeout(() => el.classList.add('in'), 120 + i * 110));
}
(function gallery() {
  const g = $('#gallery');
  const rots = [-2.5, 1.8, -1.2, 2.6, -2, 1.4, -2.8, 2.2];
  CONFIG.fotos.forEach((f, i) => {
    const b = document.createElement('button');
    b.className = 'shot';
    b.style.setProperty('--rot', rots[i % rots.length] + 'deg');
    b.setAttribute('aria-label', 'Ver foto ' + (i + 1));
    b.innerHTML = `<div class="ph"><img loading="lazy" alt="Foto ${i + 1}"></div><span class="tag">${i + 1} ❤</span>`;
    const img = $('img', b);
    img.onerror = () => { img.onerror = null; img.src = placeholder(i + 1); };
    img.src = f.src;
    b.addEventListener('click', () => openLb(i));
    g.appendChild(b);
  });

  const lb = $('#lightbox'), im = $('#lbImg'), cap = $('#lbCap'), cnt = $('#lbCount'), fig = $('#lbFig');
  let idx = 0;
  function show(i, anim) {
    idx = (i + CONFIG.fotos.length) % CONFIG.fotos.length;
    const f = CONFIG.fotos[idx];
    im.onerror = () => { im.onerror = null; im.src = placeholder(idx + 1); };
    im.src = f.src;
    im.alt = 'Foto ' + (idx + 1);
    cap.textContent = f.msg;
    cnt.textContent = (idx + 1) + ' / ' + CONFIG.fotos.length;
    if (anim) { fig.classList.remove('swap'); void fig.offsetWidth; fig.classList.add('swap'); }
  }
  function openLb(i) {
    lb.hidden = false; document.body.style.overflow = 'hidden';
    fig.classList.remove('swap'); show(i, false);
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', () => show(idx - 1, true));
  $('#lbNext').addEventListener('click', () => show(idx + 1, true));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(idx - 1, true);
    if (e.key === 'ArrowRight') show(idx + 1, true);
  });
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1), true);
  }, { passive: true });
})();

/* ---------------- Botón hacia el lugar secreto ---------------- */
$('#toRefugio').addEventListener('click', e => {
  Confetti.burst(e.clientX, e.clientY, 30, 0.7);
  setTimeout(() => go('refugio'), 350);
});
$('#backMundo').addEventListener('click', () => go('mundo'));

/* ---------------- 4. Sonido del mar ---------------- */
const Sea = (() => {
  const btn = $('#seaBtn'), vol = $('#vol');
  let useSynth = false, ac = null, master = null, playing = false;
  setRange(vol);

  function buildSynth() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ac = new AC();
    const len = ac.sampleRate * 6;
    const mk = brown => {
      const buf = ac.createBuffer(2, len, ac.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = buf.getChannelData(c); let last = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w * 0.5;
        }
      }
      const s = ac.createBufferSource(); s.buffer = buf; s.loop = true; return s;
    };
    master = ac.createGain();
    master.gain.value = Number(vol.value);
    master.connect(ac.destination);

    // oleaje grave
    const body = mk(true), lp = ac.createBiquadFilter(), g1 = ac.createGain();
    lp.type = 'lowpass'; lp.frequency.value = 650; g1.gain.value = 0.55;
    const lfo = ac.createOscillator(), lfoG = ac.createGain();
    lfo.frequency.value = 0.11; lfoG.gain.value = 0.4; lfo.connect(lfoG); lfoG.connect(g1.gain);
    body.connect(lp); lp.connect(g1); g1.connect(master);

    // espuma
    const foam = mk(false), hp = ac.createBiquadFilter(), g2 = ac.createGain();
    hp.type = 'bandpass'; hp.frequency.value = 2600; hp.Q.value = 0.6; g2.gain.value = 0.06;
    const lfo2 = ac.createOscillator(), lfo2G = ac.createGain();
    lfo2.frequency.value = 0.11; lfo2G.gain.value = 0.06; lfo2.connect(lfo2G); lfo2G.connect(g2.gain);
    foam.connect(hp); hp.connect(g2); g2.connect(master);

    body.start(); foam.start(); lfo.start(); lfo2.start();
    return true;
  }

  function ui(on) {
    playing = on;
    btn.textContent = on ? '❚❚' : '▶';
    btn.setAttribute('aria-label', on ? 'Pausar sonido del mar' : 'Reproducir sonido del mar');
  }

  async function play() {
    const missing = seaAudio.error || seaAudio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
    if (!useSynth && !missing) {
      try { await seaAudio.play(); ui(true); return; } catch (e) { /* cae al sonido sintetizado */ }
    }
    useSynth = true;
    if (!ac && !buildSynth()) return;
    await ac.resume();
    ui(true);
  }
  function pause() {
    if (useSynth && ac) ac.suspend();
    else seaAudio.pause();
    ui(false);
  }
  function stop() { if (playing) pause(); }

  btn.addEventListener('click', () => (playing ? pause() : play()));
  vol.addEventListener('input', () => {
    seaAudio.volume = Number(vol.value);
    if (master) master.gain.value = Number(vol.value);
    setRange(vol);
  });
  seaAudio.volume = Number(vol.value);
  return { stop };
})();

function stopAudios() {
  if (!song.paused) song.pause();
  Sea.stop();
}

/* Guía de respiración */
(function breath() {
  const t = $('#breathText'); let inh = true;
  setInterval(() => { inh = !inh; t.textContent = inh ? 'Inhala…' : 'Exhala…'; }, 4000);
})();

updateNav();
})();
