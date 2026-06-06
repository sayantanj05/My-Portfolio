// Contact page icons (Lucide, injected as inline SVG)

function mountLucideIcon(target, lucideName) {
  if (!target) return;

  // Avoid double-mount.
  if (target.dataset.mounted === 'true') return;
  target.dataset.mounted = 'true';

  const svg = document.createElement('span');
  svg.className = 'lucide-inline';

  // Use Lucide CDN for SVG sprite-free rendering.
  // This loads the corresponding SVG content at runtime.
  const size = target.getAttribute('data-size') || '28';
  svg.innerHTML = '';

  // Fetch the SVG from Lucide CDN.
  // Example: https://unpkg.com/lucide@latest/dist/esm/icons/mail.svg
  fetch(`https://unpkg.com/lucide@latest/dist/esm/icons/${lucideName}.svg`)
    .then((r) => r.text())
    .then((text) => {
      svg.innerHTML = text;
      const iconEl = svg.querySelector('svg');
      if (!iconEl) return;

      iconEl.setAttribute('width', size);
      iconEl.setAttribute('height', size);
      iconEl.setAttribute('aria-hidden', 'true');
      iconEl.removeAttribute('focusable');

      // Ensure stroke color matches CSS via currentColor.
      iconEl.style.stroke = 'currentColor';
      iconEl.style.fill = 'none';

      target.replaceWith(svg);
    })
    .catch(() => {
      // If fetch fails, keep the placeholder.
      target.style.display = 'none';
    });
}

function initContactIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    const key = el.getAttribute('data-icon');
    const map = {
      mail: 'mail',
      phone: 'phone',
      map: 'map-pin'
    };
    mountLucideIcon(el, map[key] || 'mail');
  });

  document.querySelectorAll('[data-social]').forEach((el) => {
    const key = el.getAttribute('data-social');
    const map = {
      github: 'github',
      linkedin: 'linkedin',
      whatsapp: 'message-circle',
      facebook: 'facebook',
      instagram: 'instagram'
    };
    mountLucideIcon(el, map[key] || 'github');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initContactIcons();

  // Smooth scroll-reveal using IntersectionObserver
  // Applies to any element with `.section-fadein`.
  const revealEls = document.querySelectorAll('.section-fadein');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    revealEls.forEach((el) => io.observe(el));
  }
});


