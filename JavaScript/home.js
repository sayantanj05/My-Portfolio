/* Home page JavaScript - Quiet Luxury Motion Design System */

document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Staggered Entry Logic - Reveal items with sequential animation
  const revealItems = $$('.reveal-item');
  revealItems.forEach((el, index) => {
    const delay = index * 150;
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.classList.add('active');
      }, delay);
    });
  });

  // Magnetic Button Interaction - Desktop only (10% follow distance)
  $$('.btn').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      btn.style.transform = `translate(${x * 10}%, ${y * 10}%)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });

  // Mermaid render (if Mermaid is loaded)
  async function renderMermaid() {
    const mermaidEls = $$('.mermaid-bg');
    if (!mermaidEls.length) return;

    if (!window.mermaid || typeof window.mermaid.initialize !== 'function') return;

    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose'
      });

      for (const el of mermaidEls) {
        const code = el.textContent.trim();
        el.textContent = code;
        await window.mermaid.run({ nodes: [el] });
      }
    } catch (err) {
      console.error('Mermaid render failed:', err);
    }
  }

  renderMermaid();

  // Contextual Motion - Portrait Parallax (rAF)
  const portrait = $('.portrait');
  const heroForParallax = $('.hero');
  let parallaxTicking = false;

  function updateParallax() {
    if (!portrait || !heroForParallax) return;

    // progress based on hero position in viewport
    const heroRect = heroForParallax.getBoundingClientRect();
    const viewportH = window.innerHeight || 1;

    // when hero is near top => progress approaches 1
    const raw = (viewportH - heroRect.top) / (viewportH + heroRect.height);
    const progress = Math.max(0, Math.min(1, raw));

    // depth factor: move slightly slower than page
    const maxTranslate = 22; // px
    const y = progress * maxTranslate;

    portrait.style.transform = `translate3d(0, ${y}px, 0) scale(1.02)`;
  }

  function onScrollParallax() {
    if (parallaxTicking) return;
    parallaxTicking = true;
    requestAnimationFrame(() => {
      updateParallax();
      parallaxTicking = false;
    });
  }

  updateParallax();
  window.addEventListener('scroll', onScrollParallax, { passive: true });

  // Contextual Motion - Headline Scramble (run once) + chained boot typing
  const heroTitle = $('#hero-title');
  if (heroTitle && !heroTitle.dataset.scrambleDone) {
    heroTitle.dataset.scrambleDone = '1';
    const finalText = heroTitle.textContent.trim();

    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>?/';
    const totalMs = 900;
    const start = performance.now();

    let scrambleDone = false;

    function triggerBootTyping() {
      if (scrambleDone) return;
      scrambleDone = true;

      // Start terminal typing for the role line (instruction says: chain immediately after scramble)
      const designationEl = $('.designation');
      const introEl = $('.intro');
      if (!designationEl) return;

      // Use data attributes so we don't double-trigger on hot reload/navigation
      if (designationEl.dataset.bootTypingDone === '1') return;
      designationEl.dataset.bootTypingDone = '1';

      const finalRole = designationEl.textContent.trim();

      // Always guarantee the final text exists (prevents blank hero/designation on animation issues)
      const safeFinalText = finalRole;

      designationEl.classList.add('kinetic-title');
      designationEl.setAttribute('data-kinetic-final', safeFinalText);

      // Initialize terminal typing
      const bootTotalMs = 1400;
      const caretHoldMs = 1000;
      const typingStart = performance.now();

      // Create caret underscore
      const caret = document.createElement('span');
      caret.className = 'terminal-caret';
      caret.setAttribute('aria-hidden', 'true');
      caret.textContent = '_';

      // Build an inner span once and only animate its textContent
      const typed = document.createElement('span');
      typed.className = 'kinetic-text';
      typed.textContent = '';

      // Replace designation contents safely
      designationEl.textContent = '';
      designationEl.appendChild(typed);
      designationEl.appendChild(caret);

      function step(now) {
        const t = now - typingStart;
        const p = Math.min(1, t / bootTotalMs);
        const count = Math.floor(safeFinalText.length * p);

        // Apply clip-path wipe as soon as typing starts; CSS handles the rest
        designationEl.classList.add('is-booting');

        typed.textContent = safeFinalText.slice(0, count);

        if (p < 1) {
          requestAnimationFrame(step);
          return;
        }

        // Finish: keep caret active for caretHoldMs
        typed.textContent = safeFinalText;

        setTimeout(() => {
          designationEl.classList.add('is-complete');
          caret.classList.add('terminal-caret--steady');
        }, caretHoldMs);
      }

      // If anything throws during animation, restore final text
      try {
        requestAnimationFrame(step);
      } catch (e) {
        designationEl.textContent = safeFinalText;
        console.error('Boot typing failed:', e);
      }
    }

    function scramble(now) {
      const t = now - start;
      const p = Math.min(1, t / totalMs);
      const revealCount = Math.floor(finalText.length * p);

      let out = '';
      for (let i = 0; i < finalText.length; i++) {
        if (i < revealCount) {
          out += finalText[i];
        } else {
          out += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }

      heroTitle.textContent = out;

      if (p < 1) {
        requestAnimationFrame(scramble);
      } else {
        heroTitle.textContent = finalText;
        triggerBootTyping();
      }
    }

    requestAnimationFrame(scramble);
  }

  // Contextual Motion - Staggered color ripple on .pill-row hover
  const pillRows = $$('.pill-row');

  function armRipple(row) {
    if (!row) return;
    row.classList.add('pill-row--ripple', 'is-armed');

    const pills = $$('.pill', row);
    for (let i = 0; i < pills.length; i++) {
      const pill = pills[i];
      setTimeout(() => {
        pill.classList.add('pill--ripple');
      }, i * 55);
    }
  }

  function disarmRipple(row) {
    if (!row) return;
    row.classList.remove('is-armed');
    $$('.pill', row).forEach((p) => p.classList.remove('pill--ripple'));
  }

  pillRows.forEach((row) => {
    row.addEventListener('mouseenter', () => armRipple(row));
    row.addEventListener('mouseleave', () => disarmRipple(row));
  });

  // Navbar hide/show on scroll + contextual motion
  const nav = $('.nav');

  const hero = $('.hero');
  let lastY = window.scrollY;
  let scrollTicking = false;

  function updateNavMotion() {
    if (!nav || !hero) return;

    const y = window.scrollY;

    // Existing behavior: hide navbar while scrolling down
    if (Math.abs(y - lastY) >= 8) {
      if (y > lastY && y > 120) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      lastY = y;
    }

    // New behavior: solid blurred glass after passing hero
    const heroRect = hero.getBoundingClientRect();
    const navHeight = nav.getBoundingClientRect().height || 72;
    const pastHero = heroRect.bottom <= navHeight + 8;
    nav.classList.toggle('nav--solid', pastHero);
  }

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateNavMotion();
      scrollTicking = false;
    });
  }, { passive: true });

  // Mobile toggle
  const toggleBtn = $('[data-nav-toggle]');
  const toggleMenu = () => {
    if (!nav) return;
    nav.classList.toggle('is-open');
  };
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMenu);
  }
  $$('.nav-link[data-link]').forEach((a) => {
    a.addEventListener('click', () => {
      if (nav) nav.classList.remove('is-open');
    });
  });

  // Active link glow
  const current = location.pathname.split('/').pop() || 'Home.html';
  $$('.nav-link').forEach((a) => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href && href === current) a.classList.add('active');
  });

  // ------------------------------
  // Home marquees (legacy devicon injector)
  // ------------------------------
  // Uses existing HTML containers: #skills-container, #frameworks-container, #tools-container

  const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

  const ICONS = {
    skills: [
      { folder: "java", name: "java-original", alt: "Java" },
      { folder: "python", name: "python-original", alt: "Python" },
      { folder: "cplusplus", name: "cplusplus-original", alt: "C++" },
      { folder: "mysql", name: "mysql-original", alt: "SQL" },
      { folder: "javascript", name: "javascript-original", alt: "JavaScript" },
      { folder: "mongodb", name: "mongodb-original", alt: "MongoDB (NoSQL)" },
      { folder: "html5", name: "html5-original", alt: "HTML" },
      { folder: "css3", name: "css3-original", alt: "CSS" },
      { folder: "php", name: "php-original", alt: "PHP" },
      { folder: "c", name: "c-original", alt: "C" }
    ],
    frameworks: [
      { folder: "spring", name: "spring-original", alt: "Spring Boot" },
      { folder: "react", name: "react-original", alt: "React" },
      { folder: "nodejs", name: "nodejs-original", alt: "Node.js" },
      { folder: "express", name: "express-original", alt: "Express" },
      { folder: "fastapi", name: "fastapi-original", alt: "FastAPI" },
      { folder: "vuejs", name: "vuejs-original", alt: "Vue" },
      { folder: "bootstrap", name: "bootstrap-original", alt: "Bootstrap" }
    ],
    tools: [
      { folder: "git", name: "git-original", alt: "Git" },
      { folder: "docker", name: "docker-original", alt: "Docker" },
      { folder: "mongodb", name: "mongodb-original", alt: "MongoDB" },
      { folder: "postman", name: "postman-original", alt: "Postman" },
      { folder: "vscode", name: "vscode-original", alt: "VS Code" },
      { folder: "mysql", name: "mysql-original", alt: "MySQL" },
      { folder: "postgresql", name: "postgresql-original", alt: "PostgreSQL" }
    ]
  };

  function deviconUrl({ folder, name }) {
    return `${DEVICON_BASE}/${folder}/${name}.svg`;
  }

  function makeIconSpan({ alt, folder, name }) {
    const span = document.createElement('span');
    span.className = 'marquee-icon';
    span.title = alt;

    const wrapper = document.createElement('span');
    wrapper.className = 'icon-wrapper';

    const img = document.createElement('img');
    img.alt = alt;
    img.loading = 'lazy';
    img.className = 'marquee-img';
    img.src = deviconUrl({ folder, name });

    img.onerror = () => {
      span.remove();
    };

    wrapper.appendChild(img);
    span.appendChild(wrapper);
    return span;
  }

  function injectIconsInto(containerId, icons) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const marqueeTrackInner = container.closest('.marquee-track-inner') || container.parentElement;

    // reset
    container.innerHTML = '';
    marqueeTrackInner?.classList?.remove('active');

    const frag = document.createDocumentFragment();

    let totalToLoad = 0;
    let loaded = 0;

    const maybeActivate = () => {
      if (totalToLoad > 0 && loaded >= totalToLoad) {
        marqueeTrackInner?.classList?.add('active');
      }
    };

    // Duplicate once for seamless infinite loop
    for (let pass = 0; pass < 2; pass++) {
      for (const icon of icons) {
        const span = document.createElement('span');
        span.appendChild(makeIconSpan(icon));
        const img = span.querySelector('img');

        if (img) {
          totalToLoad++;
          img.addEventListener('load', () => {
            loaded++;
            maybeActivate();
          });
          img.addEventListener('error', () => {
            loaded++;
            maybeActivate();
          }, { once: true });
        }

        frag.appendChild(span.firstChild);
      }
    }

    container.appendChild(frag);

    maybeActivate();
  }

  injectIconsInto('skills-container', ICONS.skills);
  injectIconsInto('frameworks-container', ICONS.frameworks);
  injectIconsInto('tools-container', ICONS.tools);
});

