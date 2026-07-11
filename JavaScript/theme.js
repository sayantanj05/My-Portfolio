/* Theme toggle: dark (default neon) <-> light */
(function () {
  var root = document.documentElement;
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    var icon = document.getElementById('themeIcon');
    if (icon) {
      icon.innerHTML = theme === 'light'
        ? '<circle cx="12" cy="12" r="4.2"></circle><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>'
        : '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path>';
    }
  }
  var stored = localStorage.getItem('theme');
  if (!stored) {
    stored = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  apply(stored);
  var btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      apply(next);
    });
  }
})();
