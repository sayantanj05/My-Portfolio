// Certifications page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll-reveal for main content blocks (same as Contact page)
  const sectionEls = document.querySelectorAll('.section-fadein');
  if (sectionEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    sectionEls.forEach((el) => io.observe(el));
  }

  const targets = document.querySelectorAll(
    '.skills-head, .certs-head, .skills-column, .certifications-column, .skills-category, .skills-category__icons, .cert-proof-item'
  );

  if (!targets.length) return;

  document.querySelectorAll('.skills-category').forEach((el, i) => {
    el.style.setProperty('--category-index', i);
  });

  document.querySelectorAll('.skills-category__icons .skills-icon').forEach((el, i) => {
    el.style.setProperty('--icon-index', i % 12);
  });

  document.querySelectorAll('.cert-proof-item').forEach((el, i) => {
    el.style.setProperty('--cert-index', i);
  });

  const io2 = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  targets.forEach((el) => {
    el.classList.add('reveal');
    io2.observe(el);
  });
});
