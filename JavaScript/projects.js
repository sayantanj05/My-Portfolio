// Projects page JavaScript

// Footer year + reveal hooks.
(function initProjectsPage() {
  'use strict';

  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Staggered reveal behavior with animation delays
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        }
      },
      { threshold: 0.15 }
    );
    
    revealEls.forEach((el, index) => {
      const staggerClass = `stagger-${Math.min(index + 1, 7)}`;
      el.classList.add(staggerClass);
      io.observe(el);
    });
  }

  // Simple mobile nav toggle (matches markup pattern).
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && nav && navLinks) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      const isClickInside = nav.contains(e.target);
      if (!isClickInside) nav.classList.remove('is-open');
    });
  }

  // Tab switching: filter projects by status with smooth transitions.
  const tabsWrap = document.querySelector('[data-project-tabs]');
  const tabButtons = tabsWrap ? Array.from(tabsWrap.querySelectorAll('[data-project-tab]')) : [];
  const projectCards = Array.from(document.querySelectorAll('.project-details'));

  function animateTabChange(nextTab) {
    tabButtons.forEach((btn) => {
      const isActive = btn.getAttribute('data-project-tab') === nextTab;
      btn.setAttribute('aria-selected', String(isActive));
      btn.classList.toggle('is-active', isActive);
    });

    const tabToStatus = {
      all: null,
      completed: 'completed',
      'in-progress': 'in-progress',
      planned: 'planned'
    };

    const requiredStatus = tabToStatus[nextTab];

    projectCards.forEach((card, index) => {
      const cardStatus = card.getAttribute('data-project-status');
      const matches = requiredStatus === null || cardStatus === requiredStatus;
      
      if (!matches && !card.hasAttribute('hidden')) {
        card.classList.add('filtering');
        setTimeout(() => {
          card.setAttribute('hidden', '');
          card.classList.remove('filtering');
        }, 400);
      } else if (matches && card.hasAttribute('hidden')) {
        card.removeAttribute('hidden');
        card.style.animationDelay = `${index * 50}ms`;
        card.classList.add('filtering');
        setTimeout(() => card.classList.remove('filtering'), 400);
      }
    });
  }

  if (tabsWrap && tabButtons.length) {
    tabsWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-project-tab]');
      if (!btn) return;

      const nextTab = btn.getAttribute('data-project-tab');

      animateTabChange(nextTab);
    });

    // Initialize default tab.
    const initiallyActive = tabButtons.find((b) => b.classList.contains('is-active')) || tabButtons[0];
    const initialTab = initiallyActive ? initiallyActive.getAttribute('data-project-tab') : 'all';
    animateTabChange(initialTab);
  }

  // Project card expand/collapse with skill animation
  projectCards.forEach((card) => {
    const toggleBtn = card.querySelector('[data-project-details-toggle]');
    if (!toggleBtn) return;

    const toggleLink = toggleBtn.querySelector('[data-project-details-url]');
    if (toggleLink) {
      toggleLink.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Animate skill tags on card reveal
    const skillTags = card.querySelectorAll('.skill-list li');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillTags.forEach((tag, i) => {
            setTimeout(() => tag.style.opacity = '1', i * 30);
          });
          cardObserver.unobserve(card);
        }
      });
    }, { threshold: 0.2 });
    
    cardObserver.observe(card);

    toggleBtn.addEventListener('click', () => {
      const isExpanded = card.classList.toggle('is-expanded');
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));

      const textEl = toggleBtn.querySelector('.toggle-text');
      if (textEl) textEl.textContent = isExpanded ? 'Hide' : 'Show';
    });
  });

  // Animate progress bars when visible
  const progressBars = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const parent = fill.closest('.project-progress');
        if (parent) {
          const delay = Array.from(progressBars).indexOf(fill) * 200;
          fill.style.animationDelay = `${delay}ms`;
        }
        progressObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  
  progressBars.forEach(bar => progressObserver.observe(bar));
})();




