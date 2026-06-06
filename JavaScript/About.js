// About page JavaScript - Professional Animation System
document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const nav = $('.nav');

  // Mobile toggle
  const toggleBtn = $('[data-nav-toggle]');
  const toggleMenu = () => {
    if (!nav) return;
    nav.classList.toggle('is-open');
  };
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleMenu);
  }

  // Close menu when link clicked
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

  // Scroll-triggered reveal for timeline elements
  const revealOnScroll = () => {
    $$('.timeline-col, .about-card, .about-card ul li').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85;
      if (inView) {
        el.classList.add('revealed');
      }
    });
  };

  // Initial reveal for elements in viewport
  revealOnScroll();

  // Reveal on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        revealOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Back to top smooth scroll
  const backToTop = $('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Parallax background network
  const networkSvg = $('.network-nodes');
  if (networkSvg) {
    let parallaxTicking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const yOffset = scrollY * 0.2;
      networkSvg.style.transform = `translate3d(0, ${yOffset}px, 0)`;
    }

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          updateParallax();
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });

    updateParallax();
  }
});