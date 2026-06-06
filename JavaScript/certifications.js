// Certifications page JavaScript

document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll(
    '.skills-head, .certs-head, .skills-column, .certifications-column, .skills-category, .skills-category__icons, .cert-proof-item'
  );

  if (!targets.length) return;

  // Add staggered delays to skill categories
  document.querySelectorAll('.skills-category').forEach((el, i) => {
    el.style.setProperty('--category-index', i);
  });

  // Add staggered delays to skill icons within each category
  document.querySelectorAll('.skills-category__icons .skills-icon').forEach((el, i) => {
    el.style.setProperty('--icon-index', i % 12);
  });

  // Add staggered delays to certification items
  document.querySelectorAll('.cert-proof-item').forEach((el, i) => {
    el.style.setProperty('--cert-index', i);
  });

  const io = new IntersectionObserver(
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
    io.observe(el);
  });
});