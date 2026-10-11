const STORAGE_KEYS = {
  theme: 'noor-theme',
  quranFont: 'noor-quran-font',
  quranTheme: 'noor-quran-theme',
  journey: 'noor-hafiza-journey',
  bookmarks: 'noor-bookmarks'
};

const state = {
  selectedSurah: 0,
  searchTerm: '',
  theme: localStorage.getItem(STORAGE_KEYS.theme) || 'light',
  quranTheme: localStorage.getItem(STORAGE_KEYS.quranTheme) || 'light',
  arabicFontSize: Number(localStorage.getItem(STORAGE_KEYS.quranFont)) || 34,
  selectedTrack: 0,
  audio: null,
  playing: false,
  progress: JSON.parse(localStorage.getItem(STORAGE_KEYS.journey) || '{}'),
  bookmarkedVerses: new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarks) || '[]'))
};

const elements = {
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
  navLinks: [...document.querySelectorAll('.nav-link')],
  dailyAyahArabic: document.getElementById('ayah-arabic'),
  dailyAyahReference: document.getElementById('ayah-reference'),
  dailyAyahTranslation: document.getElementById('ayah-translation'),
  dailyAyahReflection: document.getElementById('ayah-reflection'),
  dailyAyahSource: document.getElementById('ayah-translation-source'),
  quranSearch: document.getElementById('quran-search'),
  surahList: document.getElementById('surah-list'),
  quranContent: document.getElementById('quran-content'),
  fontDecrease: document.getElementById('font-decrease'),
  fontIncrease: document.getElementById('font-increase'),
  themeButtons: [...document.querySelectorAll('[data-theme]')],
  reminderGrid: document.getElementById('reminder-grid'),
  duaGrid: document.getElementById('dua-grid'),
  journeyList: document.getElementById('journey-list'),
  progressFill: document.getElementById('progress-fill'),
  progressPercent: document.getElementById('progress-percent'),
  progressCount: document.getElementById('progress-count'),
  resetProgress: document.getElementById('reset-progress'),
  toast: document.getElementById('toast'),
  copyright: document.getElementById('copyright-year'),
  nasheedGrid: document.getElementById('nasheed-grid'),
  playlist: document.getElementById('audio-playlist'),
  audioTitle: document.getElementById('audio-title'),
  audioReciter: document.getElementById('audio-reciter'),
  playPause: document.getElementById('play-pause'),
  progressSlider: document.getElementById('audio-progress'),
  currentTime: document.getElementById('current-time'),
  totalTime: document.getElementById('total-time'),
  audio: document.getElementById('quran-audio'),
  volumeControl: document.getElementById('volume-control')
};

const safeText = (text) => text || '';

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('visible');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    elements.toast.classList.remove('visible');
  }, 1800);
}

function setTheme(theme) {
  state.theme = theme;
  document.body.classList.toggle('dark-theme', theme === 'dark');
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function setQuranTheme(theme) {
  state.quranTheme = theme;
  document.body.classList.toggle('quran-dark', theme === 'dark');
  localStorage.setItem(STORAGE_KEYS.quranTheme, theme);
}

function applyQuranFont() {
  const content = document.querySelector('.quran-content');
  if (!content) return;
  content.style.setProperty('--arabic-size', `${state.arabicFontSize}px`);
  content.style.setProperty('--english-size', `${Math.max(18, state.arabicFontSize - 12)}px`);
  localStorage.setItem(STORAGE_KEYS.quranFont, String(state.arabicFontSize));
}

function renderDailyAyah() {
  const today = new Date();
  const index = ((today.getFullYear() * 372) + (today.getMonth() + 1) * 31 + today.getDate()) % dailyAyat.length;
  const ayah = dailyAyat[index];

  elements.dailyAyahArabic.textContent = ayah.arabic;
  elements.dailyAyahReference.textContent = `${ayah.surah} ${ayah.number}:${ayah.verse}`;
  elements.dailyAyahTranslation.textContent = `${ayah.translation} — ${ayah.translationSource}`;
  elements.dailyAyahReflection.textContent = ayah.reflection;
  elements.dailyAyahSource.textContent = ayah.translationSource;

  const bookmarkState = state.bookmarkedVerses.has(`daily-ayah-${index}`);
  const bookmarkBtn = document.querySelector('[data-action="bookmark-ayah"]');
  bookmarkBtn.classList.toggle('active', bookmarkState);
  bookmarkBtn.textContent = bookmarkState ? 'Saved' : 'Bookmark';

  const playBtn = document.querySelector('[data-action="play-ayah"]');
  playBtn.disabled = !ayah.audioUrl;
  playBtn.title = ayah.audioUrl ? 'Play daily ayah audio' : 'No ayah audio configured';
}

function renderSurahList() {
  const filtered = starterSurahs.filter((surah) =>
    surah.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    surah.english.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    surah.arabic.includes(state.searchTerm)
  );

  if (!filtered.length) {
    elements.surahList.innerHTML = '<p class="empty-state">No surah matches your search.</p>';
    return;
  }

  elements.surahList.innerHTML = filtered
    .map(
      (surah, index) => `
        <button class="surah-item ${index === state.selectedSurah ? 'selected' : ''}" data-surah-index="${starterSurahs.indexOf(surah)}" type="button" aria-label="Open ${surah.name}">
          <span class="surah-number">${surah.number}</span>
          <span class="surah-name-wrap">
            <strong>${surah.arabic}</strong>
            <small>${surah.name} · ${surah.english}</small>
          </span>
          <span class="verse-count">${surah.verses}</span>
        </button>
      `
    )
    .join('');

  elements.surahList.querySelectorAll('.surah-item').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedSurah = Number(button.dataset.surahIndex);
      renderSurahList();
      renderQuranContent();
    });
  });
}

function renderQuranContent() {
  const surah = starterSurahs[state.selectedSurah];
  if (!surah) return;

  elements.quranContent.innerHTML = `
    <div class="quran-header">
      <div>
        <p class="surah-label">Surah ${surah.number}</p>
        <h3>${surah.name}</h3>
        <span>${surah.english}</span>
      </div>
      <div class="surah-stats">
        <span>${surah.arabic}</span>
        <small>${surah.verses} verses</small>
      </div>
    </div>
    <div class="verse-list">
      ${surah.text
        .map(
          (verse, verseIndex) => `
            <article class="verse-item">
              <div class="verse-toolbar">
                <span class="verse-ref">${surah.name} ${surah.number}:${verseIndex + 1}</span>
                <div class="verse-actions">
                  <button class="mini-btn" type="button" data-copy-verse="${surah.number}:${verseIndex + 1}" aria-label="Copy verse ${surah.number}:${verseIndex + 1}">Copy</button>
                  <button class="mini-btn bookmark-btn ${state.bookmarkedVerses.has(`verse-${surah.number}-${verseIndex}`) ? 'active' : ''}" type="button" data-bookmark-verse="${surah.number}:${verseIndex + 1}" aria-label="Bookmark verse ${surah.number}:${verseIndex + 1}">Bookmark</button>
                </div>
              </div>
              <p class="verse-arabic" dir="rtl">${verse.arabic}</p>
              <p class="verse-english">${verse.english}</p>
              <p class="verse-reference">${verse.reference}</p>
            </article>
          `
        )
        .join('')}
    </div>
  `;

  elements.quranContent.querySelectorAll('[data-copy-verse]').forEach((button) => {
    button.addEventListener('click', async () => {
      const target = button.dataset.copyVerse;
      const verse = surah.text[Number(target.split(':')[1]) - 1];
      const text = `${verse.arabic}\n${verse.english}\n${surah.name} ${target}`;
      await copyText(text);
      showToast('Verse copied.');
    });
  });

  elements.quranContent.querySelectorAll('[data-bookmark-verse]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.bookmarkVerse;
      const key = `verse-${surah.number}-${Number(target.split(':')[1]) - 1}`;
      if (state.bookmarkedVerses.has(key)) {
        state.bookmarkedVerses.delete(key);
        showToast('Bookmark removed.');
      } else {
        state.bookmarkedVerses.add(key);
        showToast('Verse bookmarked.');
      }
      saveBookmarks();
      renderQuranContent();
    });
  });
}

function renderReminders() {
  elements.reminderGrid.innerHTML = reminders
    .map(
      (item) => `
        <article class="reminder-card panel-card reveal">
          <span class="reminder-tag">${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.reflection}</p>
          <small>${item.reference}</small>
        </article>
      `
    )
    .join('');
}

function renderDuas() {
  elements.duaGrid.innerHTML = duas
    .map(
      (dua) => `
        <article class="dua-card panel-card">
          <div class="dua-header">
            <h3>${dua.title}</h3>
            <button class="mini-btn copy-dua" data-dua="${dua.arabic} | ${dua.meaning} | ${dua.reference}" type="button">Copy</button>
          </div>
          <p class="dua-arabic" dir="rtl">${dua.arabic}</p>
          <p class="dua-transliteration">${dua.transliteration}</p>
          <p class="dua-meaning">${dua.meaning}</p>
          <small>${dua.reference}</small>
        </article>
      `
    )
    .join('');

  elements.duaGrid.querySelectorAll('.copy-dua').forEach((button) => {
    button.addEventListener('click', async () => {
      const payload = button.dataset.dua;
      await copyText(payload.replace(' | ', '\n'));
      showToast('Dua copied.');
    });
  });
}

function renderNasheed() {
  elements.nasheedGrid.innerHTML = nasheedTracks
    .map(
      (track) => `
        <article class="nasheed-card ${track.color}" style="background-image: linear-gradient(180deg, rgba(11, 38, 31, 0.36), rgba(11, 38, 31, 0.22)), url('${track.image}'); background-size: cover; background-position: center;">
          <div class="nasheed-cover">${track.cover}</div>
          <div class="nasheed-info">
            <h3>${track.title}</h3>
            <p>${track.artist}</p>
          </div>
          <button class="btn btn-secondary" type="button" disabled>Preview soon</button>
        </article>
      `
    )
    .join('');
}

function initializeJourney() {
  const defaultProgress = {};
  hafizaSteps.forEach((_, index) => {
    defaultProgress[index] = false;
  });

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.journey) || '{}');
  const progressState = Object.keys(stored).length ? stored : defaultProgress;

  state.progress = progressState;

  elements.journeyList.innerHTML = hafizaSteps
    .map(
      (step, index) => `
        <li>
          <label>
            <input type="checkbox" data-journey-index="${index}" ${state.progress[index] ? 'checked' : ''} />
            <span>${step}</span>
          </label>
        </li>
      `
    )
    .join('');

  elements.journeyList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', () => {
      const index = Number(input.dataset.journeyIndex);
      state.progress[index] = input.checked;
      localStorage.setItem(STORAGE_KEYS.journey, JSON.stringify(state.progress));
      updateProgressSummary();
    });
  });

  updateProgressSummary();
}

function updateProgressSummary() {
  const total = hafizaSteps.length;
  const done = Object.values(state.progress).filter(Boolean).length;
  const percent = Math.round((done / total) * 100);

  elements.progressFill.style.width = `${percent}%`;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressCount.textContent = `${done} / ${total} completed`;
}

function saveBookmarks() {
  localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify([...state.bookmarkedVerses]));
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const helper = document.createElement('textarea');
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    document.body.removeChild(helper);
  } catch (error) {
    showToast('Clipboard not available in this browser.');
  }
}

function bindActionButtons() {
  document.querySelector('[data-action="copy-ayah"]').addEventListener('click', async () => {
    const currentAyah = dailyAyat[((new Date().getFullYear() * 372) + (new Date().getMonth() + 1) * 31 + new Date().getDate()) % dailyAyat.length];
    await copyText(`${currentAyah.arabic}\n${currentAyah.translation}\n${currentAyah.surah} ${currentAyah.number}:${currentAyah.verse}`);
    showToast('Ayah copied.');
  });

  document.querySelector('[data-action="bookmark-ayah"]').addEventListener('click', () => {
    const today = new Date();
    const index = ((today.getFullYear() * 372) + (today.getMonth() + 1) * 31 + today.getDate()) % dailyAyat.length;
    const key = `daily-ayah-${index}`;
    if (state.bookmarkedVerses.has(key)) {
      state.bookmarkedVerses.delete(key);
      showToast('Daily ayah bookmark removed.');
    } else {
      state.bookmarkedVerses.add(key);
      showToast('Daily ayah bookmarked.');
    }
    saveBookmarks();
    renderDailyAyah();
  });

  document.querySelector('[data-action="share-ayah"]').addEventListener('click', async () => {
    const today = new Date();
    const index = ((today.getFullYear() * 372) + (today.getMonth() + 1) * 31 + today.getDate()) % dailyAyat.length;
    const ayah = dailyAyat[index];
    const shareText = `${ayah.arabic}\n${ayah.translation}\n${ayah.surah} ${ayah.number}:${ayah.verse}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Daily Ayah', text: shareText });
        showToast('Ayah shared.');
        return;
      } catch (error) {
        showToast('Sharing canceled.');
        return;
      }
    }

    await copyText(shareText);
    showToast('Share text copied.');
  });

  document.querySelector('[data-action="play-ayah"]').addEventListener('click', () => {
    showToast('No daily ayah audio source is configured for this project yet.');
  });
}

function bindRenderingControls() {
  elements.quranSearch.addEventListener('input', (event) => {
    state.searchTerm = event.target.value.trim();
    renderSurahList();
  });

  elements.fontDecrease.addEventListener('click', () => {
    state.arabicFontSize = Math.max(26, state.arabicFontSize - 2);
    applyQuranFont();
  });

  elements.fontIncrease.addEventListener('click', () => {
    state.arabicFontSize = Math.min(48, state.arabicFontSize + 2);
    applyQuranFont();
  });

  elements.themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = button.dataset.theme;
      setQuranTheme(nextTheme);
      elements.themeButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    });
  });

  elements.resetProgress.addEventListener('click', () => {
    const confirmed = window.confirm('Reset your Hafiza progress on this device? This clears the local checklist only.');
    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEYS.journey);
    state.progress = {};
    hafizaSteps.forEach((_, index) => {
      state.progress[index] = false;
    });
    initializeJourney();
    showToast('Progress reset.');
  });

  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('main section[id]');
    const offset = 140;
    let current = 'home';

    sections.forEach((section) => {
      const top = section.offsetTop - offset;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.id;
      }
    });

    elements.navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
    });
  });
}

function bindNav() {
  elements.navToggle.addEventListener('click', () => {
    const expanded = elements.navToggle.getAttribute('aria-expanded') === 'true';
    elements.navToggle.setAttribute('aria-expanded', String(!expanded));
    elements.navMenu.classList.toggle('open', !expanded);
  });

  elements.navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      elements.navMenu.classList.remove('open');
      elements.navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initAudio() {
  const audioTracks = configuredAudioTracks.map((track) => ({ ...track }));
  elements.audio.dataset.trackCount = String(audioTracks.length);

  function updateTrackView() {
    const currentTrack = audioTracks[state.selectedTrack];
    if (!currentTrack) return;

    elements.audioTitle.textContent = currentTrack.title;
    elements.audioReciter.textContent = currentTrack.reciter;
    elements.playPause.textContent = state.playing ? '❚❚' : '▶';
    elements.playPause.disabled = !currentTrack.source;
    elements.playPause.title = currentTrack.source ? 'Play or pause audio' : 'Audio source not configured';
  }

  function renderPlaylist() {
    elements.playlist.innerHTML = audioTracks
      .map(
        (track, index) => `
          <li>
            <button class="playlist-item ${index === state.selectedTrack ? 'selected' : ''}" type="button" data-track-index="${index}" ${track.source ? '' : 'disabled'}>
              <span>${track.title}</span>
              <small>${track.reciter}</small>
            </button>
          </li>
        `
      )
      .join('');

    elements.playlist.querySelectorAll('.playlist-item').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedTrack = Number(button.dataset.trackIndex);
        const track = audioTracks[state.selectedTrack];
        if (!track.source) {
          showToast('Audio source must be configured before playback.');
          return;
        }
        elements.audio.src = track.source;
        elements.audio.load();
        elements.audio.play().catch(() => {
          showToast('Playback request was blocked until the user interacted with the page.');
        });
        state.playing = true;
        updateTrackView();
        renderPlaylist();
      });
    });
  }

  elements.playPause.addEventListener('click', () => {
    const track = audioTracks[state.selectedTrack];
    if (!track.source) {
      showToast('Audio source must be configured before playback.');
      return;
    }

    if (state.playing) {
      elements.audio.pause();
      state.playing = false;
    } else {
      elements.audio.src = track.source;
      elements.audio.play().catch(() => {
        showToast('Playback cannot start until the user interacts with the page.');
      });
      state.playing = true;
    }
    updateTrackView();
  });

  elements.volumeControl.addEventListener('input', (event) => {
    elements.audio.volume = Number(event.target.value);
  });

  elements.progressSlider.addEventListener('input', (event) => {
    if (!elements.audio.duration || Number.isNaN(elements.audio.duration)) return;
    const value = Number(event.target.value);
    elements.audio.currentTime = (value / 100) * elements.audio.duration;
  });

  elements.audio.addEventListener('loadedmetadata', () => {
    const totalSeconds = Math.floor(elements.audio.duration || 0);
    elements.totalTime.textContent = formatTime(totalSeconds);
  });

  elements.audio.addEventListener('timeupdate', () => {
    if (!elements.audio.duration || Number.isNaN(elements.audio.duration)) return;
    const value = (elements.audio.currentTime / elements.audio.duration) * 100;
    elements.progressSlider.value = String(value);
    elements.currentTime.textContent = formatTime(Math.floor(elements.audio.currentTime));
  });

  elements.audio.addEventListener('ended', () => {
    state.playing = false;
    updateTrackView();
  });

  document.getElementById('prev-track').addEventListener('click', () => {
    if (!audioTracks.length) return;
    state.selectedTrack = (state.selectedTrack - 1 + audioTracks.length) % audioTracks.length;
    renderPlaylist();
    updateTrackView();
  });

  document.getElementById('next-track').addEventListener('click', () => {
    if (!audioTracks.length) return;
    state.selectedTrack = (state.selectedTrack + 1) % audioTracks.length;
    renderPlaylist();
    updateTrackView();
  });

  renderPlaylist();
  updateTrackView();
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function setCurrentYear() {
  elements.copyright.textContent = `© ${new Date().getFullYear()} NOOR-E-NARGIZ`;
}

function setInitialThemeStates() {
  setTheme(state.theme);
  setQuranTheme(state.quranTheme);
  elements.themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.theme === state.quranTheme);
  });
  applyQuranFont();
}

function initAccessibilityMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
}

function initWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const enterButton = document.getElementById('welcome-enter');
  const pageShell = document.querySelector('.page-shell');
  let closed = false;

  function closeWelcome() {
    if (closed) return;
    closed = true;
    welcomeScreen.classList.add('is-leaving');
    welcomeScreen.setAttribute('aria-hidden', 'true');
    pageShell.inert = false;
    document.body.classList.remove('welcome-open');

    window.setTimeout(() => {
      welcomeScreen.hidden = true;
      document.querySelector('.brand').focus();
    }, 500);
  }

  document.body.classList.add('welcome-open');
  enterButton.focus();
  enterButton.addEventListener('click', closeWelcome);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeWelcome();
  });
  window.setTimeout(closeWelcome, 5000);
}

function init() {
  setCurrentYear();
  setInitialThemeStates();
  renderDailyAyah();
  renderSurahList();
  renderQuranContent();
  renderReminders();
  renderDuas();
  renderNasheed();
  bindNav();
  bindActionButtons();
  bindRenderingControls();
  initializeJourney();
  initAudio();
  initAccessibilityMotion();
  initWelcomeScreen();
}

init();
