/* ═══════════════════════════════════════
   AUREVA LIVING — SCRIPT.JS
═══════════════════════════════════════ */

'use strict';

/* ── NAV SCROLL EFFECT ── */
(function () {
  const nav = document.getElementById('navbar');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE MENU ── */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const menu      = document.getElementById('mobileMenu');
  const closeBtn  = document.querySelector('.mobile-close');
  const links     = menu.querySelectorAll('a');

  const open  = () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { menu.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  links.forEach(l => l.addEventListener('click', close));
  menu.addEventListener('click', e => { if (e.target === menu) close(); });
})();

/* ── SCROLL REVEAL ── */
(function () {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  // Skip hero elements — they use CSS animation
  const nonHero = Array.from(elements).filter(el => !el.closest('.hero'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  nonHero.forEach(el => io.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function () {
  const counters = document.querySelectorAll('.stat-big[data-target]');
  let started = false;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(animateCounter);
        io.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const strip = document.querySelector('.stats-strip');
  if (strip) io.observe(strip);
})();

/* ── TESTIMONIAL SLIDER ── */
(function () {
  const track  = document.getElementById('testiTrack');
  const dotsEl = document.getElementById('testiDots');
  if (!track || !dotsEl) return;

  const cards  = track.querySelectorAll('.testi-card');
  const total  = cards.length;
  let current  = 0;
  let autoTimer;

  // Build dots
  const dots = Array.from({ length: total }, (_, i) => {
    const btn = document.createElement('button');
    btn.className = 'testi-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(btn);
    return btn;
  });

  const goTo = (idx) => {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetTimer();
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  const resetTimer = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 6000);
  };

  document.querySelector('.testi-next')?.addEventListener('click', next);
  document.querySelector('.testi-prev')?.addEventListener('click', prev);

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  });

  resetTimer();
})();

/* ── PORTFOLIO FILTER ── */
(function () {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.p-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (match) {
          card.style.opacity    = '1';
          card.style.transform  = 'scale(1)';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity    = '0.15';
          card.style.transform  = 'scale(0.97)';
          card.style.pointerEvents = 'none';
        }
      });
    });
  });
})();

/* ── CONTACT FORM ── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled    = true;
    btn.style.opacity = '0.7';

    // Simulate send (replace with actual API call)
    setTimeout(() => {
      btn.textContent = '✓  Enquiry Sent';
      btn.style.background = '#2e7d52';
      btn.style.borderColor = '#2e7d52';

      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.background = '';
        btn.style.borderColor = '';
        form.reset();
      }, 4000);
    }, 1200);
  });

  // Float-label style: highlight empty selects
  const select = form.querySelector('select');
  if (select) {
    select.addEventListener('change', () => {
      select.style.color = select.value ? 'var(--ivory)' : 'var(--grey-dark)';
    });
    select.style.color = 'var(--grey-dark)';
  }
})();

/* ── SMOOTH ANCHOR SCROLL ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar')?.offsetHeight || 76;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── ACTIVE NAV HIGHLIGHT ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navH     = document.getElementById('navbar')?.offsetHeight || 76;

  const onScroll = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH - 40) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.slice(1);
      link.style.color = href === current ? 'var(--gold)' : '';
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── PARALLAX HERO LINES (subtle) ── */
(function () {
  const lines = document.querySelectorAll('.vline');
  if (!lines.length) return;

  const onScroll = () => {
    const y = window.scrollY;
    lines.forEach((line, i) => {
      const speed = 0.03 * (i + 1);
      line.style.transform = `translateY(${y * speed}px)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── CURSOR GLOW (desktop only) ── */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 320px;
    height: 320px;
    pointer-events: none;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    transition: opacity 0.6s;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let active = false;
  document.addEventListener('mousemove', (e) => {
    if (!active) { glow.style.opacity = '1'; active = true; }
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; active = false; });
})();
