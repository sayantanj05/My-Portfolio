/* Vanilla animation utilities inspired by Framer Motion */

const AnimationUtils = {
  spring(current, target, velocity, stiffness = 0.05, damping = 0.92) {
    const force = (target - current) * stiffness;
    velocity += force;
    velocity *= damping;
    return { value: current + velocity, velocity };
  },

  springAnimate(element, property, target, options = {}) {
    const stiffness = options.stiffness ?? 0.05;
    const damping = options.damping ?? 0.92;
    let current = parseFloat(getComputedStyle(element)[property]) || 0;
    let velocity = 0;

    function tick() {
      const result = AnimationUtils.spring(current, target, velocity, stiffness, damping);
      current = result.value;
      velocity = result.velocity;
      element.style[property] = `${current}px`;

      if (Math.abs(target - current) > 0.1 || Math.abs(velocity) > 0.1) {
        requestAnimationFrame(tick);
      } else {
        element.style[property] = `${target}px`;
      }
    }

    requestAnimationFrame(tick);
  },

  staggerChildren(parent, selector, options = {}) {
    const delay = options.delay ?? 100;
    const duration = options.duration ?? 400;
    const children = parent.querySelectorAll(selector);

    children.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(24px)';
      child.style.transition = 'none';

      setTimeout(() => {
        child.style.transition = `opacity ${duration}ms ease, transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, index * delay);
    });
  },

  flipAnimate(elements, callback) {
    const firstRects = new Map();
    elements.forEach(el => {
      firstRects.set(el, el.getBoundingClientRect());
    });

    callback();

    elements.forEach(el => {
      const first = firstRects.get(el);
      if (!first) return;
      const last = el.getBoundingClientRect();

      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;
      const deltaW = first.width / last.width;
      const deltaH = first.height / last.height;

      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5 && Math.abs(deltaW - 1) < 0.01 && Math.abs(deltaH - 1) < 0.01) return;

      el.style.transformOrigin = 'top left';
      el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
      el.style.transition = 'none';

      requestAnimationFrame(() => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.transform = '';
      });
    });
  },

  createPresence(enterDuration = 400, exitDuration = 300) {
    return {
      enter(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(24px)';
        element.style.transition = 'none';

        requestAnimationFrame(() => {
          element.style.transition = `opacity ${enterDuration}ms ease, transform ${enterDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });
      },

      exit(element) {
        return new Promise(resolve => {
          element.style.transition = `opacity ${exitDuration}ms ease, transform ${exitDuration}ms ease`;
          element.style.opacity = '0';
          element.style.transform = 'translateY(-16px)';

          setTimeout(() => {
            element.remove();
            resolve();
          }, exitDuration);
        });
      }
    };
  }
};
