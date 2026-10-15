(() => {
  const menuButton = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const dialog = document.getElementById('siteDialog');
  const dialogTitle = document.getElementById('dialogTitle');
  const dialogCopy = document.getElementById('dialogCopy');
  const form = dialog.querySelector('form');
  const formNote = document.getElementById('formNote');
  const toast = document.getElementById('toast');
  let toastTimer;
  const messages = {
    signin: ['Sign in to BackLine', 'Enter your details to continue. This demo keeps your information on this page only.'],
    join: ['Join BackLine', 'Create your crew profile and connect with the live-event community.'],
    discussion: ['Join the discussion', 'Introduce yourself to the backstage community. Add your details to continue.'],
    messages: ['Messages', 'Sign in or join BackLine to connect with other live-event professionals.'],
    about: ['About BackLine', 'A community built for the people who make live events happen.'],
    privacy: ['Privacy', 'This static demo does not send or store the details entered here.']
  };
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
  }
  function openDialog(type) {
    const copy = messages[type] || [type, 'Explore the BackLine community.'];
    dialogTitle.textContent = copy[0];
    dialogCopy.textContent = copy[1];
    formNote.textContent = '';
    const fields = form.querySelectorAll('label,input,.dialog-submit');
    fields.forEach(el => el.hidden = ['about','privacy'].includes(type));
    if (!dialog.open) dialog.showModal();
  }
  menuButton.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-links-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('nav-links-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }));
  document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    openDialog(button.dataset.dialog);
  }));
  document.querySelectorAll('.action-button').forEach(button => button.addEventListener('click', () => {
    showToast(button.dataset.message || 'More details coming soon.');
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    formNote.textContent = 'Thanks! This demo form does not send or store your details.';
    form.reset();
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks.classList.contains('nav-links-open')) {
      navLinks.classList.remove('nav-links-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
})();