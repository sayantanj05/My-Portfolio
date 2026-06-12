// Floating Neon Sidebar — navigation logic
(() => {
  "use strict";

  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById("floatingSidebar");
    const progress = document.getElementById("sidebarProgress");
    const items = Array.from(document.querySelectorAll(".sidebar-item"));
    const targets = items.map((btn) => btn.getAttribute("data-target"));

    if (!sidebar || !progress || items.length === 0) return;

    /* ---------- smooth scroll ---------- */
    function scrollToTarget(targetId) {
      const el = document.getElementById(targetId);
      if (!el) return;

      const offsetTop = el.offsetTop - 100;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }

    items.forEach((btn, idx) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToTarget(targets[idx]);
      });

      btn.addEventListener("keydown", (e) => {
        const key = e.key;
        if (key === "ArrowDown" || key === "ArrowRight") {
          e.preventDefault();
          const next = items[(idx + 1) % items.length];
          next.focus();
        } else if (key === "ArrowUp" || key === "ArrowLeft") {
          e.preventDefault();
          const prev = items[(idx - 1 + items.length) % items.length];
          prev.focus();
        } else if (key === "Enter" || key === " ") {
          e.preventDefault();
          scrollToTarget(targets[idx]);
        }
      });
    });

    /* ---------- IntersectionObserver for active section ---------- */
    let currentActive = -1;

    function setActive(index) {
      if (currentActive === index) return;
      currentActive = index;

      items.forEach((btn, i) => btn.classList.toggle("is-active", i === index));
    }

    const observerOptions = {
      root: null,
      rootMargin: "-12% 0px -72% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const id = visible[0].target.id;
        const idx = targets.indexOf(id);
        if (idx >= 0) setActive(idx);
      }
    }, observerOptions);

    targets.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    /* ---------- scroll progress ---------- */
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) {
        progress.style.height = "0%";
        return;
      }

      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progress.style.height = pct + "%";
    }

    let progressTicking = false;
    window.addEventListener("scroll", () => {
      if (!progressTicking) {
        progressTicking = true;
        requestAnimationFrame(() => {
          updateProgress();
          progressTicking = false;
        });
      }
    }, { passive: true });

    /* ---------- enhanced reveal on scroll animations ---------- */
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const aboutCards = document.querySelectorAll('.about-card');
    const techCards = document.querySelectorAll('.tech-card');
    const funFactCards = document.querySelectorAll('.fun-fact-card');
    const careerGoalCard = document.querySelector('.career-goal-card');
    const learningCards = document.querySelectorAll('.learning-card');
    const neonTags = document.querySelectorAll('.neon-tag');
    const timelineEntries = document.querySelectorAll('.timeline-entry');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const aboutMeIntro = document.querySelector('.about-me-intro');

    // General fade-in sections observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          const fadeItems = entry.target.querySelectorAll('.fade-in-item');
          fadeItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('revealed');
            }, index * 150);
          });
        }
      });
    }, { threshold: 0.1 });

    fadeSections.forEach(section => revealObserver.observe(section));

    // About cards observer
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    aboutCards.forEach(card => cardObserver.observe(card));

    // Tech cards observer
    const techCardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    techCards.forEach(card => techCardObserver.observe(card));

    // Fun fact cards observer
    const funFactObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    funFactCards.forEach(card => funFactObserver.observe(card));

    // Career goal card observer
    if (careerGoalCard) {
      const careerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      careerObserver.observe(careerGoalCard);
    }

    // Learning cards observer
    const learningObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    learningCards.forEach(card => learningObserver.observe(card));

    // Neon tags observer
    const tagObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    neonTags.forEach(tag => tagObserver.observe(tag));

    // Timeline entries observer
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    timelineEntries.forEach(entry => timelineObserver.observe(entry));

    // Timeline items observer (Work Experience & Education)
    const timelineItemObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    timelineItems.forEach(item => timelineItemObserver.observe(item));

    // Sidebar items observer
    const sidebarObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    sidebarItems.forEach(item => sidebarObserver.observe(item));

    // About me intro observer
    if (aboutMeIntro) {
      const introObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.1 });

      introObserver.observe(aboutMeIntro);
    }

    /* ---------- initial ---------- */
    updateProgress();
    
    // Set initial active state after a short delay to ensure proper detection
    setTimeout(() => {
      if (currentActive === -1 && targets.length > 0) {
        setActive(0);
      }
    }, 100);
  });
})();
