/* =============================================
   UNLIMITED DREAMS — main.js
   Inception Estudio 2026
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initReveal();
  initCounters();
  initTestimonials();
  initMobileNav();
  initUpcomingCarousel();
  initAboutParallax();
  initAccordion();
  initStoriesCarousel();
  initExpShowcase();
});

/* =============================================
   LOADER
   ============================================= */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  if (!loader) return;

  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('is-done');
        document.body.style.overflow = '';
      }, 350);
    }
    if (bar) bar.style.width = Math.min(pct, 100) + '%';
  }, 90);

  document.body.style.overflow = 'hidden';
}

/* =============================================
   CUSTOM CURSOR
   ============================================= */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function trackFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(trackFollower);
  }
  trackFollower();

  const hoverTargets = document.querySelectorAll('a, button, [data-cursor-hover]');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* =============================================
   NAVEGACIÓN — scroll behavior
   ============================================= */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (!nav.classList.contains('nav--always-dark')) {
      nav.classList.toggle('nav--scrolled', current > 70);
    }
    nav.classList.toggle('nav--hidden',   current > lastScroll && current > 250);
    lastScroll = Math.max(0, current);
  }, { passive: true });
}

/* =============================================
   MENÚ MÓVIL
   ============================================= */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  const mLinks = mobile ? mobile.querySelectorAll('a') : [];
  if (!toggle || !mobile) return;

  function openMenu() {
    toggle.classList.add('is-open');
    mobile.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('is-open');
    mobile.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    mobile.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  mLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* =============================================
   REVEAL ON SCROLL
   ============================================= */
function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* =============================================
   ACCORDION (EL DESAFÍO)
   ============================================= */
function initAccordion() {
  const items = document.querySelectorAll('.challenge-item.accordion');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.accordion__header');
    if (!header) return;
    
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('is-active');
      items.forEach(i => i.classList.remove('is-active'));
      if (!isActive) {
        item.classList.add('is-active');
      }
    });
  });
}

/* =============================================
   CONTADORES ANIMADOS
   ============================================= */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '+';
      const dur    = 1600;
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

/* =============================================
   TESTIMONIALS — scroll + dots
   ============================================= */
function initTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const dots  = document.querySelectorAll('.testimonials__dot');
  if (!track || !dots.length) return;

  function getActiveIndex() {
    const cards = track.querySelectorAll('.t-card');
    const trackLeft = track.getBoundingClientRect().left;
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    return closest;
  }

  function updateDots(idx) {
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === idx));
  }

  track.addEventListener('scroll', () => {
    updateDots(getActiveIndex());
  }, { passive: true });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const cards = track.querySelectorAll('.t-card');
      if (cards[i]) {
        cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    });
  });
}

/* =============================================
   3D COVERFLOW CAROUSEL — Próximas Experiencias
   Motor: requestAnimationFrame + lerp
   Solo propiedades GPU-composited: transform, opacity, filter
   El loop se detiene automáticamente cuando converge
   ============================================= */
function initUpcomingCarousel() {
  const stage     = document.getElementById('upcomingStage');
  const titleEl   = document.getElementById('upcomingTitle');
  const counterEl = document.getElementById('upcomingCounter');
  const prevBtn   = document.getElementById('upcomingPrev');
  const nextBtn   = document.getElementById('upcomingNext');
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll('.ucard'));
  const total  = cards.length;
  let active   = 0;
  let locked   = false;
  let rafId    = null;

  /* ── Posición relativa circular ──────────────────────── */
  function relPos(i) {
    let p = i - active;
    if (p >  Math.floor(total / 2)) p -= total;
    if (p < -Math.floor(total / 2)) p += total;
    return p;
  }

  /* ── Valores objetivo por posición ──────────────────── */
  // tx  → offset horizontal en px desde el centro del stage
  // ty  → offset vertical (efecto arco: card activa levitada)
  // sc  → escala
  // ry  → rotateY en grados
  // op  → opacity
  // br  → brightness
  function getTarget(pos) {
    const abs  = Math.abs(pos);
    const sign = pos < 0 ? -1 : 1;
    // Gap adaptativo: 20% del viewport con tope 255px
    const gap  = Math.min(window.innerWidth * 0.20, 255);

    if (pos === 0) return { tx: 0,                ty: -10, sc: 1,    ry: 0,          op: 1,    br: 1    };
    if (abs === 1) return { tx: sign * gap,        ty:   0, sc: 0.78, ry: sign * -38, op: 1,    br: 0.55 };
    if (abs === 2) return { tx: sign * gap * 1.76, ty:   9, sc: 0.62, ry: sign * -52, op: 0.65, br: 0.28 };
    /* ≥ 3 → fuera de escena */
                   return { tx: sign * gap * 2.55, ty:  16, sc: 0.50, ry: sign * -63, op: 0,    br: 0.12 };
  }

  /* ── Estado animado actual — arranca en posición destino ─ */
  const st = cards.map((_, i) => ({ ...getTarget(relPos(i)) }));

  /* ── Lerp helper ────────────────────────────────────── */
  const lerp = (a, b, t) => a + (b - a) * t;
  // F = 0.10 → deceleración exponencial ~450ms real, sin librería
  const F = 0.10;

  /* ── Tick: interpola y aplica — solo GPU props ─────── */
  function tick() {
    let moving = false;
    cards.forEach((card, i) => {
      const s = st[i];
      const g = getTarget(relPos(i));
      s.tx = lerp(s.tx, g.tx, F);
      s.ty = lerp(s.ty, g.ty, F);
      s.sc = lerp(s.sc, g.sc, F);
      s.ry = lerp(s.ry, g.ry, F);
      s.op = lerp(s.op, g.op, F);
      s.br = lerp(s.br, g.br, F);
      // GPU-composited únicamente → sin reflow / repaint
      card.style.transform = `translate(calc(-50% + ${s.tx.toFixed(1)}px),calc(-50% + ${s.ty.toFixed(1)}px)) scale(${s.sc.toFixed(4)}) rotateY(${s.ry.toFixed(2)}deg)`;
      card.style.opacity   = s.op.toFixed(4);
      card.style.filter    = `brightness(${s.br.toFixed(3)})`;
      // Continuar si todavía hay residuo visible
      if (Math.abs(s.tx - g.tx) > 0.5 || Math.abs(s.ry - g.ry) > 0.12 || Math.abs(s.op - g.op) > 0.003) {
        moving = true;
      }
    });
    rafId = moving ? requestAnimationFrame(tick) : null;
  }

  function startAnim() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  }

  /* ── z-index: actualización inmediata, sin lerp ─────── */
  function updateZIndex() {
    cards.forEach((card, i) => {
      card.style.zIndex = String(10 - Math.abs(relPos(i)));
    });
  }

  /* ── Fade del título ─────────────────────────────────  */
  function updateTitle() {
    if (!titleEl) return;
    const next = cards[active].dataset.title;
    if (titleEl.textContent.trim() === next) return;
    titleEl.classList.add('is-fading');
    setTimeout(() => {
      titleEl.innerHTML = next;
      titleEl.classList.remove('is-fading');
    }, 230);
    if (counterEl) counterEl.textContent = `${active + 1} / ${total}`;
  }

  /* ── Navegar ─────────────────────────────────────────  */
  function go(dir) {
    if (locked) return;
    locked = true;
    active = (active + dir + total) % total;
    updateZIndex();   // Profundidad inmediata
    startAnim();      // Lanza el loop de interpolación
    updateTitle();    // Fade text
    setTimeout(() => { locked = false; }, 380);
  }

  /* ── Controles ───────────────────────────────────────  */
  if (nextBtn) nextBtn.addEventListener('click', () => go(1));
  if (prevBtn) prevBtn.addEventListener('click', () => go(-1));

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i !== active) go(relPos(i) > 0 ? 1 : -1);
    });
  });

  document.addEventListener('keydown', e => {
    const sec = document.getElementById('proximas');
    if (!sec) return;
    const r = sec.getBoundingClientRect();
    if (r.top > window.innerHeight || r.bottom < 0) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft')  go(-1);
  });

  let touchX = 0;
  stage.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx >  50) go(-1);
    if (dx < -50) go(1);
  }, { passive: true });

  // Recalcular posiciones si cambia el viewport
  let _rt;
  window.addEventListener('resize', () => {
    clearTimeout(_rt);
    _rt = setTimeout(startAnim, 100);
  }, { passive: true });

  /* ── Render inicial sincrónico (sin animación) ───────  */
  updateZIndex();
  cards.forEach((card, i) => {
    const s = st[i];
    card.style.transform = `translate(calc(-50% + ${s.tx}px),calc(-50% + ${s.ty}px)) scale(${s.sc}) rotateY(${s.ry}deg)`;
    card.style.opacity   = String(s.op);
    card.style.filter    = `brightness(${s.br})`;
  });
  if (counterEl) counterEl.textContent = `1 / ${total}`;
}

/* =============================================
   ABOUT PARALLAX HOVER
   ============================================= */
function initAboutParallax() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const scene = document.getElementById('aboutScene');
  if (!scene) return;
  const widgets  = scene.querySelectorAll('[data-depth]');
  const STRENGTH = 13;
  scene.addEventListener('mousemove', e => {
    const r  = scene.getBoundingClientRect();
    const cx = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
    const cy = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
    widgets.forEach(w => {
      const d = parseFloat(w.dataset.depth) || 1;
      w.style.setProperty('--px', (cx * STRENGTH * d).toFixed(2) + 'px');
      w.style.setProperty('--py', (cy * STRENGTH * d * 0.65).toFixed(2) + 'px');
    });
  });
  scene.addEventListener('mouseleave', () => {
    widgets.forEach(w => {
      w.style.transition = 'transform .65s cubic-bezier(0.16,1,0.3,1), box-shadow .4s ease';
      w.style.setProperty('--px', '0px');
      w.style.setProperty('--py', '0px');
      setTimeout(() => { w.style.transition = 'box-shadow .4s ease'; }, 700);
    });
  });
}
/* =============================================
   WHATSAPP CTA — placeholder handler
   ============================================= */
(function patchWhatsApp() {
  const btn = document.getElementById('whatsapp-cta');
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    if (btn.getAttribute('href') === '#') {
      e.preventDefault();
      alert('¡Enlace de WhatsApp próximamente disponible!');
    }
  });
})();

/* =============================================
   STORIES DRAG CAROUSEL
   ============================================= */
function initStoriesCarousel() {
  const carousel = document.getElementById('storiesCarousel');
  if (!carousel) return;

  const prevBtn = document.getElementById('storiesPrev');
  const nextBtn = document.getElementById('storiesNext');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.style.cursor = 'grabbing';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2.5; // Scroll speed multiplier
    carousel.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile
  carousel.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  }, { passive: true });
  carousel.addEventListener('touchend', () => {
    isDown = false;
  });
  carousel.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2.5;
    carousel.scrollLeft = scrollLeft - walk;
  }, { passive: true });
}
/* =============================================
   EXP SHOWCASE — Drag Carousel
   ============================================= */
function initExpShowcase() {
  const carousel = document.getElementById('expCarousel');
  const track = document.getElementById('expTrack');
  if (!carousel || !track) return;

  let isDown = false;
  let startX;
  let scrollLeft;
  let lastInteractionTime = 0;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    lastInteractionTime = Date.now();
    carousel.style.cursor = 'grabbing';
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
  });
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    lastInteractionTime = Date.now();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });

  // Touch
  carousel.addEventListener('touchstart', (e) => {
    isDown = true;
    lastInteractionTime = Date.now();
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  }, { passive: true });
  carousel.addEventListener('touchend', () => {
    isDown = false;
  });
  carousel.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    lastInteractionTime = Date.now();
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  }, { passive: true });

  // Auto-scroll para mobile
  let scrollDir = 1;
  let exactScrollLeft = carousel.scrollLeft || 0;
  
  function autoScroll() {
    requestAnimationFrame(autoScroll);
    
    // Sincronizar posición exacta con la real si el usuario redimensiona o interactúa
    if (window.innerWidth > 768 || isDown) {
      exactScrollLeft = carousel.scrollLeft;
      return;
    }
    
    // Pausa de 2 segundos después de soltar el arrastre
    if (Date.now() - lastInteractionTime < 2000) {
      exactScrollLeft = carousel.scrollLeft;
      return;
    }

    exactScrollLeft += 0.6 * scrollDir;
    carousel.scrollLeft = exactScrollLeft;
    
    // Cambiar de dirección al llegar a los bordes
    // (Margen de 2px de error por posibles redondeos del navegador)
    if (carousel.scrollLeft >= track.scrollWidth - carousel.clientWidth - 2) {
      scrollDir = -1;
      exactScrollLeft = track.scrollWidth - carousel.clientWidth - 2;
    } else if (carousel.scrollLeft <= 0) {
      scrollDir = 1;
      exactScrollLeft = 0;
    }
  }
  requestAnimationFrame(autoScroll);
}
