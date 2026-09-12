document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const nav = document.querySelector('#site-nav');
  const menuToggle = document.querySelector('#menu-toggle');
  const themeToggle = document.querySelector('#theme-toggle');
  const progressLine = document.querySelector('#progress-line');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...nav.querySelectorAll('a')];
  const storedTheme = localStorage.getItem('portfolio-theme');

  const heroCard = document.querySelector('.hero-card');
  const portraitFrame = document.createElement('div');
  portraitFrame.className = 'portrait-frame';
  portraitFrame.innerHTML = '<img src="https://github.com/JannatulHosna.png?size=640" alt="Jannatul Hosna on GitHub"><span>JANNATUL HOSNA</span>';
  portraitFrame.querySelector('img').addEventListener('load', () => heroCard.classList.add('portrait-ready'));
  portraitFrame.querySelector('img').addEventListener('error', () => portraitFrame.classList.add('portrait-missing'));
  heroCard.prepend(portraitFrame);

  if (storedTheme) root.dataset.theme = storedTheme;
  themeToggle.textContent = root.dataset.theme === 'dark' ? '☀' : '◐';

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('portfolio-theme', nextTheme);
    themeToggle.textContent = nextTheme === 'dark' ? '☀' : '◐';
  });

  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.textContent = open ? 'Close' : 'Menu';
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.textContent = 'Menu';
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  const updateScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progressLine.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    const current = sections.reduce((active, section) => window.scrollY + 150 >= section.offsetTop ? section : active, sections[0]);
    navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${current.id}`));
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal, .section, .timeline article, .expertise-card').forEach(item => {
    item.classList.add('reveal');
    revealObserver.observe(item);
  });

  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  }));

  const projectDetails = {
    database: ['Database / SQL', 'A normalized reservation workflow focused on table relationships, constraints, and reliable booking transactions.', 'Make ticket records easy to query, validate, and maintain.'],
    analysis: ['Data analysis', 'A dashboard concept for turning cleaned beneficiary records into readable assistance, demographic, and assessment indicators.', 'Help teams move from field records to practical decisions.'],
    field: ['Information management', 'A digital survey workflow using validation rules, skip logic, and quality-control checks for dependable field submissions.', 'Build accuracy, confidentiality, and smoother field operations into the collection process.'],
    python: ['Python / CSE', 'A collection of utilities for parsing CSV data, automating verification checks, and supporting exploratory analysis.', 'Reduce repetitive checks and make datasets easier to inspect.']
  };
  const modal = document.createElement('dialog');
  modal.className = 'project-modal';
  document.body.appendChild(modal);
  document.querySelectorAll('.project-card').forEach(card => {
    card.querySelector('.project-more').addEventListener('click', () => {
      const detail = projectDetails[card.dataset.category];
      modal.innerHTML = `<div class="modal-top"><span>${detail[0]}</span><button class="modal-close" type="button" aria-label="Close case study">×</button></div><h2>${card.querySelector('h3').textContent}</h2><p>${detail[1]}</p><p class="modal-outcome"><strong>Designed to:</strong> ${detail[2]}</p>`;
      modal.showModal();
      modal.querySelector('.modal-close').focus();
    });
  });
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('.modal-close')) modal.close();
  });

  const toast = document.querySelector('#toast');
  document.querySelectorAll('#copy-email, #hero-copy-email').forEach(button => button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('adury.hosna@gmail.com');
      toast.textContent = 'Email copied to clipboard';
    } catch {
      toast.textContent = 'Email: adury.hosna@gmail.com';
    }
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2200);
  }));

  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', event => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
});
