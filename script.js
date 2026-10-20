(() => {
  const menuButton = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const nav = document.querySelector('.nav-wrap');
  const dialog = document.getElementById('siteDialog');
  const dialogTitle = document.getElementById('dialogTitle');
  const dialogCopy = document.getElementById('dialogCopy');
  const form = dialog.querySelector('form');
  const formNote = document.getElementById('formNote');
  const toast = document.getElementById('toast');
  const search = document.getElementById('directorySearch');
  const typeFilter = document.getElementById('directoryType');
  const savedOnlyButton = document.getElementById('savedOnly');
  const savedCount = document.getElementById('savedCount');
  const resultCount = document.getElementById('directoryCount');
  const cards = [...document.querySelectorAll('.gig-card, .crew-card, .call-card')];
  const storageKey = 'backline-home-saved';
  let toastTimer;
  let savedOnly = false;
  let savedIds = new Set();
  const messages = {
    signin: ['Sign in to BackLine', 'This is a visual demo. Sign-in is not connected to an account service, and your details stay on this page.'],
    join: ['Join BackLine', 'Create your crew profile and connect with the live-event community. This demo does not send or store your details.'],
    discussion: ['Join the discussion', 'Introduce yourself to the backstage community. This demo form does not send or store your details.'],
    messages: ['Messages', 'Sign in or join BackLine to connect with other live-event professionals.'],
    about: ['About BackLine', 'A community built for the people who make live events happen.'],
    privacy: ['Privacy', 'This static demo does not send or store the details entered here.']
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  function setMenuOpen(isOpen) {
    navLinks.classList.toggle('nav-links-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  }

  function openDialog(type, detail) {
    const copy = messages[type] || [type, 'Explore the BackLine community.'];
    const needsForm = !['about', 'privacy', 'detail'].includes(type);
    const submitButton = form.querySelector('.dialog-submit');
    dialogTitle.textContent = type === 'detail' ? detail.title : copy[0];
    dialogCopy.textContent = type === 'detail' ? detail.copy : copy[1];
    formNote.textContent = '';
    formNote.hidden = true;
    form.classList.remove('dialog-complete');
    submitButton.textContent = type === 'detail' ? detail.actionLabel : 'Continue';
    submitButton.hidden = !needsForm && type !== 'detail';
    submitButton.disabled = false;
    form.dataset.dialogType = type;

    form.querySelectorAll('label, input, .dialog-submit').forEach(element => {
      const isNameField = element.matches('[for="dialogName"], #dialogName');
      const visible = element.matches('.dialog-submit')
        ? needsForm || type === 'detail'
        : needsForm && !(type === 'signin' && isNameField);
      element.hidden = !visible;
      if ('disabled' in element) element.disabled = !visible;
      if (element.matches('input')) element.required = visible;
    });

    if (!dialog.open) dialog.showModal();
  }

  function cardType(card) {
    if (card.matches('.gig-card')) return 'production';
    if (card.matches('.crew-card')) return 'crew';
    return 'call';
  }

  function addSaveButton(card, index) {
    const title = card.querySelector('h3')?.textContent.trim() || 'listing';
    const id = `${cardType(card)}-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    card.dataset.directoryId = id;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'directory-save';
    button.dataset.saveId = id;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', `Save ${title}`);
    button.textContent = 'Save';

    if (card.matches('.gig-card')) {
      card.querySelector('.gig-footer').append(button);
    } else if (card.matches('.crew-card')) {
      card.querySelector('.crew-bottom').append(button);
    } else {
      const action = card.querySelector('.call-action');
      const controls = document.createElement('div');
      controls.className = 'call-controls';
      action.before(controls);
      controls.append(action, button);
    }
  }

  function updateSaveButtons() {
    cards.forEach(card => {
      const button = card.querySelector('.directory-save');
      const isSaved = savedIds.has(card.dataset.directoryId);
      button.textContent = isSaved ? 'Saved' : 'Save';
      button.setAttribute('aria-pressed', String(isSaved));
      button.setAttribute('aria-label', `${isSaved ? 'Remove saved' : 'Save'} ${card.querySelector('h3')?.textContent.trim() || 'listing'}`);
      button.classList.toggle('is-saved', isSaved);
    });
    savedCount.textContent = String(savedIds.size);
  }

  function addEmptyMessages() {
    [
      ['.gig-grid', 'No productions match. Try a different search or filter.'],
      ['.crew-grid', 'No crew profiles match. Try a different search or filter.'],
      ['.calls-list', 'No crew calls match. Try a different search or filter.']
    ].forEach(([selector, message]) => {
      const list = document.querySelector(selector);
      const empty = document.createElement('p');
      empty.className = 'directory-empty';
      empty.hidden = true;
      empty.textContent = message;
      list.after(empty);
      list.dataset.emptyMessage = selector;
    });
  }

  function filterListings() {
    const query = search.value.trim().toLowerCase();
    const selectedType = typeFilter.value;
    let visibleCount = 0;
    const visibleByType = { production: 0, crew: 0, call: 0 };

    cards.forEach(card => {
      const type = cardType(card);
      const matches = (!query || card.textContent.toLowerCase().includes(query)) &&
        (selectedType === 'all' || selectedType === type) &&
        (!savedOnly || savedIds.has(card.dataset.directoryId));
      card.hidden = !matches;
      if (matches) {
        visibleCount += 1;
        visibleByType[type] += 1;
      }
    });

    [
      ['production', '.gig-grid'],
      ['crew', '.crew-grid'],
      ['call', '.calls-list']
    ].forEach(([type, selector]) => {
      const list = document.querySelector(selector);
      const isIncluded = selectedType === 'all' || selectedType === type;
      list.hidden = !isIncluded || visibleByType[type] === 0;
      list.nextElementSibling.hidden = !isIncluded || visibleByType[type] > 0;
    });

    resultCount.textContent = `${visibleCount} of ${cards.length} listings`;
    if (visibleCount === 0) resultCount.textContent = 'No listings match. Try another search or filter.';
    savedOnlyButton.setAttribute('aria-pressed', String(savedOnly));
    savedOnlyButton.classList.toggle('is-active', savedOnly);
  }

  function openListingDetails(card) {
    const type = cardType(card);
    const title = card.querySelector('h3')?.textContent.trim() || 'BackLine listing';
    const detailSelectors = {
      production: ['.gig-role', '.venue-name', '.gig-meta', '.crew-chip'],
      crew: ['.crew-role', '.crew-location', '.skill-list', '.crew-bottom'],
      call: ['.call-details', '.call-skills']
    };
    const details = detailSelectors[type]
      .flatMap(selector => [...card.querySelectorAll(selector)].map(element => element.textContent.trim()))
      .filter(Boolean);
    const description = type === 'crew'
      ? 'Sample crew profile'
      : type === 'call'
        ? 'Sample crew call'
        : 'Featured production';
    const actionLabel = type === 'call' ? 'Join to apply' : type === 'crew' ? 'Join to connect' : 'Join BackLine';
    openDialog('detail', { title, copy: [description, ...details].join(' · '), actionLabel });
  }

  try {
    const storedIds = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(storedIds) || storedIds.some(id => typeof id !== 'string')) {
      throw new Error('Saved listing data is not a list of IDs.');
    }
    savedIds = new Set(storedIds);
  } catch (error) {
    showToast('Saved listings could not be loaded from this browser.');
  }

  cards.forEach(addSaveButton);
  addEmptyMessages();
  updateSaveButtons();
  filterListings();

  menuButton.addEventListener('click', () => {
    setMenuOpen(!navLinks.classList.contains('nav-links-open'));
  });

  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));

  document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    openDialog(button.dataset.dialog);
  }));

  document.addEventListener('click', event => {
    const saveButton = event.target.closest('[data-save-id]');
    if (saveButton) {
      const id = saveButton.dataset.saveId;
      const nextSavedIds = new Set(savedIds);
      if (nextSavedIds.has(id)) nextSavedIds.delete(id);
      else nextSavedIds.add(id);

      try {
        localStorage.setItem(storageKey, JSON.stringify([...nextSavedIds]));
      } catch (error) {
        showToast('Could not save this listing in your browser.');
        return;
      }
      savedIds = nextSavedIds;
      updateSaveButtons();
      filterListings();
      showToast(savedIds.has(id) ? 'Listing saved on this device.' : 'Listing removed from saved items.');
      return;
    }

    const actionButton = event.target.closest('.action-button');
    if (actionButton) {
      const card = actionButton.closest('.gig-card, .crew-card, .call-card');
      if (card) openListingDetails(card);
    }
  });

  search.addEventListener('input', filterListings);
  typeFilter.addEventListener('change', filterListings);
  savedOnlyButton.addEventListener('click', () => {
    savedOnly = !savedOnly;
    filterListings();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (form.dataset.dialogType === 'detail') {
      openDialog('join');
      return;
    }
    if (form.classList.contains('dialog-complete')) {
      dialog.close();
      return;
    }
    if (!form.reportValidity()) return;
    const type = form.dataset.dialogType;
    const title = type === 'signin' ? 'Sign-in is not connected' : 'This is a preview';
    const message = type === 'signin'
      ? 'This static demo has no account service, so it cannot sign you in. Your details were not sent or saved.'
      : 'This static demo has no account service, so no account or post was created. Your details were not sent or saved.';
    dialogTitle.textContent = title;
    dialogCopy.textContent = message;
    formNote.hidden = true;
    form.classList.add('dialog-complete');
    form.querySelectorAll('label, input').forEach(element => {
      element.hidden = true;
      if ('disabled' in element) element.disabled = true;
      if (element.matches('input')) element.required = false;
    });
    form.querySelector('.dialog-submit').textContent = 'Done';
    form.reset();
  });

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks.classList.contains('nav-links-open')) setMenuOpen(false);
  });

  const updateNavigation = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  updateNavigation();
  window.addEventListener('scroll', updateNavigation, { passive: true });
})();
