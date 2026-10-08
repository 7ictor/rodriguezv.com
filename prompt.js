/* The shell under the page. To add a command, add a function to `commands`:
   it gets the words typed after the name and returns the text to print. */

(() => {
  const tty = document.getElementById('tty');
  if (!tty) return;

  const out = tty.querySelector('.out');
  const form = tty.querySelector('form');
  const input = tty.querySelector('input');

  // no inherited keys, so typing "constructor" finds nothing
  const table = (entries) => Object.assign(Object.create(null), entries);

  const MAIL = 'vic[at]outlook[dot]com';
  const VERSION = 'victor 2026.10'; // year.month of the last publish
  const TRY_HELP = "try 'victor --help' for more information.";

  const LINKS = table({
    github: 'https://github.com/7ictor',
    linkedin: 'https://www.linkedin.com/in/vicrodriguezm',
    twitter: 'https://x.com/vicrod',
  });

  const FLAGS = table({
    '--mobile': 'mobile: react native from js down to swift and kotlin, fast at country scale.',
    '--web': 'web: here since plain html. javascript by heart, good taste on top.',
    '--backend': 'backend: distributed, offline-first, at scale, on more databases than fit here.',
    '--lead': 'lead: people of all kinds, teams of all sizes, agents too, all pulling one way.',
  });
  const THE_ONE = `i'm the one. let's talk: ${MAIL}`;

  const VICTOR_HELP = [
    'usage: victor [--mobile] [--web] [--backend] [--lead]',
    '',
    '  --mobile    react native, native modules, performance',
    '  --web       since plain html; javascript, taste',
    '  --backend   distributed, offline-first, at scale',
    '  --lead      people, teams, agents',
    '  --version   print the version and exit',
    '  --help      print this help and exit',
    '',
    `report bugs to ${MAIL}.`,
  ].join('\n');

  const SHELL_HELP = [
    'victor    what i do',
    'github    open it in a new tab; also linkedin, twitter',
    'mail      my email address',
    'theme     light, dark or system',
    'history   what you typed before',
    'clear     clean the screen',
    'exit      close the prompt',
  ].join('\n');

  const line = (className) => {
    const pre = document.createElement('pre');
    if (className) pre.className = className;
    out.append(pre);
    return pre;
  };

  const say = (text) => {
    line().textContent = text;
  };

  const echo = (text) => {
    const ps1 = document.createElement('span');
    ps1.className = 'ps1';
    ps1.textContent = '$';
    line('said').append(ps1, ` ${text}`);
  };

  const visit = (name) => {
    const a = document.createElement('a');
    a.href = LINKS[name];
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = LINKS[name];
    line().append(a);
    window.open(LINKS[name], '_blank', 'noopener');
  };

  const recall = () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('history'));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  };

  const remember = () => {
    try {
      sessionStorage.setItem('history', JSON.stringify(past));
    } catch {}
  };

  const past = recall();
  let at = past.length;

  const commands = table({
    help: () => SHELL_HELP,

    victor(args) {
      const flags = args.filter((word) => word.startsWith('-'));
      const problem = args.filter((word) => !word.startsWith('-'));
      const wants = (flag) => flags.some((word) => word.toLowerCase() === flag);

      if (!args.length || wants('--help') || wants('-h')) return VICTOR_HELP;
      if (wants('--version')) return VERSION;

      const unknown = flags.find((flag) => !(flag.toLowerCase() in FLAGS));
      if (unknown) return `victor: unrecognized option '${unknown}'\n${TRY_HELP}`;

      const answers = flags.map((flag) => FLAGS[flag.toLowerCase()]);
      if (answers.length) answers.push(THE_ONE);
      else if (problem.length) answers.push(`victor: send the details to ${MAIL}`);
      return answers.join('\n');
    },

    man([page]) {
      if (!page) return "what manual page do you want?\nfor example, try 'man victor'.";
      if (page.toLowerCase() !== 'victor') return `no manual entry for ${page}`;
      return "you're reading it.";
    },

    github: () => visit('github'),
    linkedin: () => visit('linkedin'),
    twitter: () => visit('twitter'),
    x: () => visit('twitter'),
    mail: () => MAIL,
    email: () => MAIL,

    theme([name]) {
      const theme = window.theme;
      if (!theme) return 'theme: no switch on this page';
      if (!name) return theme.current();
      const want = name.toLowerCase();
      if (!['light', 'dark', 'system'].includes(want)) {
        return `theme: unknown theme '${name}'\nusage: theme light|dark|system`;
      }
      theme.set(want);
    },

    whoami: () => 'visitor',
    sudo: () => 'visitor is not in the sudoers file.  this incident will be reported.',
    date: () => new Date().toString().toLowerCase(),
    echo: (args) => args.join(' '),

    history([flag]) {
      if (flag !== '-c') return past.map((entry, i) => `${String(i + 1).padStart(4)}  ${entry}`).join('\n');
      past.length = 0;
      at = 0;
      remember();
    },

    clear: () => {
      out.textContent = '';
    },

    exit: () => {
      tty.hidden = true;
    },
  });

  const run = (text) => {
    const [name, ...args] = text.split(/\s+/);
    const command = commands[name.toLowerCase()];
    if (!command) return say(`sh: ${name}: command not found\ntry 'help'.`);
    const result = command(args);
    if (result) say(result);
  };

  // a block cursor drawn where the real caret is; monospace, so column n sits at n × 1ch
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  form.append(cursor);

  const place = (on = document.hasFocus()) => {
    const col = input.selectionStart ?? input.value.length;
    const text = input.value || input.placeholder;
    cursor.textContent = text[col] || '';
    cursor.style.left = `calc(${input.offsetLeft - input.scrollLeft}px + ${col}ch)`;
    cursor.classList.toggle('on', on);
  };

  input.addEventListener('focus', () => place());
  input.addEventListener('blur', () => place());
  window.addEventListener('focus', () => place());
  window.addEventListener('blur', () => place(false));
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === input) place();
  });
  input.addEventListener('input', () => {
    cursor.style.animation = 'none'; // restart the blink, so it stays solid while typing
    void cursor.offsetWidth;
    cursor.style.animation = '';
    place();
  });

  // phones turn "--" into a dash and straight quotes into curly ones
  const tidy = (text) =>
    text
      .replace(/—/g, '--')
      .replace(/–/g, '-')
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')
      .trim();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = tidy(input.value);
    input.value = '';
    place();
    echo(text);
    if (text) {
      past.push(text);
      at = past.length;
      remember();
      run(text);
    }
    input.scrollIntoView({ block: 'nearest' });
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && at > 0) at -= 1;
    else if (event.key === 'ArrowDown' && at < past.length) at += 1;
    else return;
    event.preventDefault();
    input.value = past[at] || '';
    place();
  });

  tty.addEventListener('click', () => {
    if (!String(getSelection())) input.focus();
  });

  // typing anywhere lands in the prompt; shortcuts, Tab, Enter, arrows and Space on a button or link are left alone
  document.addEventListener('keydown', (event) => {
    if (tty.hidden || event.target === input) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.length !== 1) return;
    if (event.key === ' ' && event.target.closest('button, a')) return;
    input.focus();
  });

  tty.hidden = false;
  place();
  document.fonts?.ready.then(() => place());

  // the first real mouse move focuses the prompt: not on load (screen readers), not on touch (keyboard)
  const onMouse = (event) => {
    if (event.pointerType !== 'mouse') return;
    window.removeEventListener('pointermove', onMouse);
    if (document.activeElement === document.body) input.focus({ preventScroll: true });
  };
  window.addEventListener('pointermove', onMouse);
})();
