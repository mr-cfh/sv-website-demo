/* ============================================================
   JS OVERVIEW
   - Module 1: Mobile header menu (toggle .header--open)
   - Module 2: Focus trap while menu open (a11y)
   - Module 3: Footer accordion behavior on mobile only
   Edit notes:
   • To change the breakpoint: update the matchMedia query below
   • To change animation duration: adjust --menu-speed in CSS tokens
   ============================================================ */

/* ── Module 1: Header menu toggle ─────────────────────────── */
(() => {
  const header = document.querySelector('.header');
  const btn    = document.querySelector('.header__menu-toggle');
  const panel  = document.getElementById('primary-nav');
  if (!header || !btn || !panel) return;

  const openMenu = () => {
    header.classList.add('header--open');
    btn.setAttribute('aria-expanded','true');
    panel.setAttribute('aria-hidden','false');
    // Move focus to first link without scrolling the page
    const firstLink = panel.querySelector('a');
    if (firstLink) firstLink.focus({preventScroll:true});
  };

  const closeMenu = () => {
    header.classList.remove('header--open');
    btn.setAttribute('aria-expanded','false');
    panel.setAttribute('aria-hidden','true');
  };

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  });

  // Close menu when a nav link is activated
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Optional idea:
  // If you want to preserve scrollbar gutter only while open,
  // toggle a class on <html> here and apply
  // `scrollbar-gutter: stable both-edges` to that class in CSS.
})();

/* ── Module 2: Focus trap when menu is open (accessibility) ─ */
(() => {
  const header = document.querySelector('.header');
  const btn    = document.querySelector('.header__menu-toggle');
  const panel  = document.getElementById('primary-nav');
  if (!header || !btn || !panel) return;

  function onKeydown(e){
    if (!header.classList.contains('header--open') || e.key !== 'Tab') return;
    const focusables = header.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', onKeydown);
})();

/* ── Module 3: Footer accordion (mobile only) ─────────────── */
(() => {
  const mq = window.matchMedia('(max-width: 768px)');
  const sections = document.querySelectorAll('.footer__section');

  function setExpanded(sec, expand){
    const title = sec.querySelector('.footer__title');
    if (!title) return;
    title.setAttribute('aria-expanded', String(expand));
    sec.classList.toggle('footer__section--open', expand);
  }

  function enableMobile(){
    sections.forEach(sec => {
      const title = sec.querySelector('.footer__title');
      if (!title) return;

      setExpanded(sec, false); // collapsed by default on mobile

      const toggle = () => setExpanded(sec, title.getAttribute('aria-expanded') !== 'true');

      // Avoid duplicate listeners if we re-enter mobile state
      if (title._footerClick){ title.removeEventListener('click', title._footerClick); }
      if (title._footerKey){   title.removeEventListener('keydown', title._footerKey); }

      title._footerClick = toggle;
      title._footerKey   = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } };

      title.addEventListener('click', title._footerClick);
      title.addEventListener('keydown', title._footerKey);
    });
  }

  function disableMobile(){
    sections.forEach(sec => {
      const title = sec.querySelector('.footer__title');
      if (!title) return;
      setExpanded(sec, true); // expanded on desktop
      if (title._footerClick){ title.removeEventListener('click', title._footerClick); title._footerClick = null; }
      if (title._footerKey){   title.removeEventListener('keydown', title._footerKey); title._footerKey = null; }
    });
  }

  const onChange = e => e.matches ? enableMobile() : disableMobile();
  onChange(mq);
  mq.addEventListener('change', onChange);
})();