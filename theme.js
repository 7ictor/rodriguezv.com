/* The light/dark switch. The page follows the system on its own; this adds the
   switch, remembers a choice, and exposes window.theme for the prompt. */

(() => {
  const root = document.documentElement;
  const button = document.querySelector('.switch');
  const system = matchMedia('(prefers-color-scheme: dark)');

  const remember = (name) => {
    try {
      if (name) localStorage.setItem('theme', name);
      else localStorage.removeItem('theme');
    } catch {}
  };

  const current = () => root.dataset.theme || (system.matches ? 'dark' : 'light');

  const sync = () => {
    if (button) button.setAttribute('aria-checked', String(current() === 'dark'));
    const ground = getComputedStyle(root).backgroundColor;
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.content = ground;
  };

  const set = (name) => {
    if (name === 'system') delete root.dataset.theme;
    else root.dataset.theme = name;
    remember(name === 'system' ? null : name);
    sync();
  };

  if (button) {
    button.addEventListener('click', () => set(current() === 'dark' ? 'light' : 'dark'));
    button.hidden = false;
  }
  system.addEventListener('change', sync);
  sync();

  window.theme = { current, set };
})();
