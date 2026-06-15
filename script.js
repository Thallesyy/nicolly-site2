// ===== CONFIGURAÇÕES =====
const CORRECT_PASSWORD = '20/05';
const START_DATE = new Date('2026-05-20T00:00:00-03:00');
const STORAGE_KEY = 'eu_e_voce_texto_especial';

// ===== DADOS DAS MÚSICAS =====
const tracks = [
  { title: "Pyramids",        artist: "Frank Ocean",  file: "pyramids.mp3",  cover: "capa1.jpg", startAt: 290 },
  { title: "Love Drought",    artist: "Beyoncé",      file: "musica2.mp3",   cover: "capa2.jpg", startAt: 170 },
  { title: "Best part",       artist: "Daniel Cesar", file: "musica3.mp3",   cover: "capa3.jpg", startAt: 50  },
  { title: "All of me",       artist: "John Legend",  file: "musica4.mp3",   cover: "capa4.jpg", startAt: 145 },
  { title: "Essa aq é especial", artist: "Thales",   file: "musica5.mp3",   cover: "capa5.jpg", startAt: 0   },
  { title: "Haunted",         artist: "Beyoncé",      file: "musica6.mp3",   cover: "capa6.jpg", startAt: 110 },
  { title: "Dance for you",   artist: "Beyoncé",      file: "musica7.mp3",   cover: "capa7.jpg", startAt: 40  },
];

// ===== DADOS DOS ÁLBUNS =====
const albums = {
  dates: {
    title: "Suas fotos",
    photos: Array.from({ length: 18 }, (_, i) => ({
      src: `dates${i + 1}.jpg`,
      caption: "Todas as tuas fotos que eu tanto amo ver"
    }))
  },
  random: {
    title: "Fotos aleatórias",
    photos: Array.from({ length: 13 }, (_, i) => ({
      src: `random${i + 1}.jpg`,
      caption: "Nossos momentos mais aleatórios"
    }))
  },
  us: {
    title: "Nossas fotos",
    photos: Array.from({ length: 9 }, (_, i) => ({
      src: `us${i + 1}.jpg`,
      caption: "Nossos momentos especiais"
    }))
  }
};

// ===== ELEMENTOS DO DOM =====
const msgWrap      = document.getElementById('msgWrap');
const btnToggleMsg = document.getElementById('btnToggleMsg');
const sheet        = document.getElementById('sheet');
const sheetHandle  = document.getElementById('sheetHandle');
const audio        = document.getElementById('audio');
const playBtn      = document.getElementById('playBtn');
const progressBar  = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const curTime      = document.getElementById('curTime');
const durTime      = document.getElementById('durTime');
const songCover    = document.getElementById('songCover');
const songTitle    = document.getElementById('songTitle');
const songArtist   = document.getElementById('songArtist');
const viewer       = document.getElementById('viewer');
const viewerCounter = document.getElementById('viewerCounter');
const viewerCaption = document.getElementById('viewerCaption');
const frontImg     = document.getElementById('frontImg');
const behind1      = document.getElementById('behind1');
const behind2      = document.getElementById('behind2');
const textBox      = document.getElementById('specialTextBox');
const saveHint     = document.getElementById('saveHint');
const bgMusicBtn   = document.getElementById('bgMusicBtn');
const bgMusicControl = document.getElementById('bgMusicControl');
const bgMusicLabel = document.getElementById('bgMusicLabel');
const volumeSlider = document.getElementById('volumeSlider');

// ===== ESTADO =====
let msgOpen        = false;
let currentTrack   = 0;
let currentAlbum   = null;
let photoIndex     = 0;
let isPlaying      = false;
let sheetExpanded  = false;
let touchStartY    = 0;
let touchStartX    = 0;
let bgMusicPlaying = false;
let bgMusicStarted = false;
let saveTimeout;

// ===== CONTADOR DE RELACIONAMENTO =====
function updateRelationshipCounter() {
  try {
    const counter = document.getElementById('relationshipCounter');
    if (!counter) return;

    const diffMs = new Date() - START_DATE;

    if (diffMs < 0) {
      counter.innerHTML = 'Ainda não começou 💕';
      return;
    }

    const totalSeconds  = Math.floor(diffMs / 1000);
    const totalMinutes  = Math.floor(totalSeconds / 60);
    const totalHours    = Math.floor(totalMinutes / 60);
    const totalDays     = Math.floor(totalHours / 24);

    const seconds = totalSeconds % 60;
    const minutes = totalMinutes % 60;
    const hours   = totalHours   % 24;

    let remaining = totalDays;
    let years     = Math.floor(remaining / 365);
    remaining    -= years * 365;
    let months    = Math.floor(remaining / 30);
    remaining    -= months * 30;
    let days      = remaining;

    if (months >= 12) { years += Math.floor(months / 12); months %= 12; }

    let text = '';
    if (years  > 0) text += years  + ' ano'  + (years  > 1 ? 's' : '') + ', ';
    if (months > 0 || years > 0) text += months + ' mê' + (months !== 1 ? 'ses' : 's') + ', ';
    text += days + ' dia' + (days !== 1 ? 's' : '');
    text += '<br><span style="color:var(--accent-light);">' +
            String(hours).padStart(2,'0')   + ':' +
            String(minutes).padStart(2,'0') + ':' +
            String(seconds).padStart(2,'0') + '</span>';

    counter.innerHTML = text;
  } catch (e) {
    console.error('Erro no contador:', e);
  }
}

// ===== SENHA =====
function checkPassword() {
  const input  = document.getElementById('passwordInput');
  const error  = document.getElementById('passwordError');
  const screen = document.getElementById('passwordScreen');
  const app    = document.getElementById('mainApp');

  if (input.value.toLowerCase() === CORRECT_PASSWORD.toLowerCase()) {
    screen.classList.add('hide');
    app.classList.add('show');
    setTimeout(() => { screen.style.display = 'none'; }, 500);

    startAnimations();
    showBgMusicControl();
    setTimeout(updateRelationshipCounter, 600);
    setTimeout(startBgMusic, 1000);
  } else {
    error.classList.add('show');
    input.style.borderColor = '#ff5252';
    setTimeout(() => {
      error.classList.remove('show');
      input.style.borderColor = '';
    }, 2000);
  }
}

document.getElementById('passwordInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') checkPassword();
});

// Expor para o HTML inline (onclick)
window.checkPassword = checkPassword;

// ===== ANIMAÇÕES (FIREFLIES + CORAÇÕES) =====
function startAnimations() {
  const container = document.getElementById('animationsContainer');
  const hearts = ['💖','💕','💗','💓','💝','🩷','💘'];

  function spawnFirefly() {
    const el = document.createElement('div');
    el.className = 'firefly';
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDelay    = Math.random() * 15 + 's';
    el.style.animationDuration = (10 + Math.random() * 10) + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 20000);
  }

  function spawnHeart() {
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left            = Math.random() * 100 + '%';
    el.style.bottom          = '-50px';
    el.style.animationDelay    = Math.random() * 5 + 's';
    el.style.animationDuration = (10 + Math.random() * 8) + 's';
    el.style.fontSize        = (15 + Math.random() * 15) + 'px';
    container.appendChild(el);
    setTimeout(() => el.remove(), 20000);
  }

  // Burst inicial
  for (let i = 0; i < 25; i++) setTimeout(spawnFirefly, i * 600);
  for (let i = 0; i < 15; i++) setTimeout(spawnHeart,   i * 800 + 300);

  // Loop contínuo
  setInterval(() => {
    for (let i = 0; i < 3; i++) setTimeout(spawnFirefly, i * 500);
    for (let i = 0; i < 2; i++) setTimeout(spawnHeart,   i * 600 + 200);
  }, 8000);
}

// ===== PLAYER DE MÚSICA =====
function formatTime(s) {
  if (!isFinite(s)) return '0:00';
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function loadTrack(index) {
  currentTrack = index;
  const t = tracks[index];
  songCover.src = t.cover;
  songTitle.innerHTML  = t.title;
  songArtist.innerHTML = t.artist;
  audio.src = t.file;
  if (volumeSlider) audio.volume = volumeSlider.value / 100;

  document.querySelectorAll('.track').forEach((tr, i) => {
    const badge = tr.querySelector('.badge');
    badge.innerHTML          = i === index ? '...' : 'Play';
    badge.style.background   = 'rgba(255,255,255,0.95)';
  });
}

async function playTrack() {
  const t = tracks[currentTrack];
  try {
    if (audio.currentTime < 1 && t.startAt) audio.currentTime = t.startAt;
    await audio.play();
    isPlaying = true;
    playBtn.innerHTML = '⏸';
  } catch (e) {
    console.log('Erro ao tocar:', e);
  }
}

function togglePlay() {
  if (audio.paused) {
    playTrack();
  } else {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '▶';
  }
}

function updateProgress() {
  if (audio.duration) {
    progressFill.style.width = (audio.currentTime / audio.duration) * 100 + '%';
    curTime.innerHTML = formatTime(audio.currentTime);
    durTime.innerHTML = formatTime(audio.duration);
  }
}

function seek(e) {
  const rect = progressBar.getBoundingClientRect();
  audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
}

playBtn.addEventListener('click', togglePlay);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);
audio.addEventListener('ended', () => {
  loadTrack((currentTrack + 1) % tracks.length);
  playTrack();
});
progressBar.addEventListener('click', seek);

document.querySelectorAll('.track').forEach((tr, i) => {
  tr.addEventListener('click', () => { loadTrack(i); playTrack(); });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && !audio.paused) {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '▶';
  }
});

// Sincroniza botão do topo com o player
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    bgMusicBtn?.classList.add('playing');
    if (bgMusicBtn)   bgMusicBtn.innerHTML  = '⏸';
    if (bgMusicLabel) bgMusicLabel.innerHTML = 'Tocando';
    bgMusicPlaying = true;
    bgMusicStarted = true;
  } else {
    bgMusicBtn?.classList.remove('playing');
    if (bgMusicBtn)   bgMusicBtn.innerHTML  = '▶';
    if (bgMusicLabel) bgMusicLabel.innerHTML = 'Pausado';
    bgMusicPlaying = false;
  }
});

// ===== MÚSICA DE FUNDO (CONTROLE DO TOPO) =====
function showBgMusicControl() {
  bgMusicControl?.classList.add('show');
}

function startBgMusic() {
  if (bgMusicStarted) return;
  bgMusicStarted = true;
  audio.volume = 0.15;
  loadTrack(0);
  playTrack().then(() => {
    bgMusicPlaying = true;
    if (bgMusicBtn)   { bgMusicBtn.innerHTML = '⏸'; bgMusicBtn.classList.add('playing'); }
    if (bgMusicLabel) bgMusicLabel.innerHTML = 'Tocando';
  }).catch(() => {
    if (bgMusicBtn)   bgMusicBtn.innerHTML  = '▶';
    if (bgMusicLabel) bgMusicLabel.innerHTML = 'Tocar';
    bgMusicStarted = false;
  });
}

function toggleBgMusic() {
  if (!bgMusicStarted) { startBgMusic(); return; }

  if (bgMusicPlaying) {
    audio.pause();
    bgMusicPlaying = false;
    isPlaying = false;
    if (bgMusicBtn)   { bgMusicBtn.innerHTML = '▶'; bgMusicBtn.classList.remove('playing'); }
    if (bgMusicLabel) bgMusicLabel.innerHTML = 'Pausado';
    if (playBtn)      playBtn.innerHTML = '▶';
  } else {
    playTrack();
    bgMusicPlaying = true;
    if (bgMusicBtn)   { bgMusicBtn.innerHTML = '⏸'; bgMusicBtn.classList.add('playing'); }
    if (bgMusicLabel) bgMusicLabel.innerHTML = 'Tocando';
  }
}

function changeVolume(value) {
  audio.volume = value / 100;
  if (bgMusicLabel) {
    bgMusicLabel.innerHTML =
      value == 0   ? 'Mudo'  :
      value < 30   ? 'Baixo' :
      value < 70   ? 'Médio' : 'Alto';
  }
}

window.toggleBgMusic = toggleBgMusic;
window.changeVolume  = changeVolume;

// ===== MENSAGEM EXPANSÍVEL =====
btnToggleMsg.addEventListener('click', () => {
  msgOpen = !msgOpen;
  msgWrap.classList.toggle('expanded', msgOpen);
  btnToggleMsg.innerHTML = msgOpen ? 'Esconder mensagem' : 'Mostrar mensagem';
  if (!msgOpen) msgWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ===== SHEET (PLAYER DRAWER) =====
const MIN_HEIGHT = 125;
const MAX_HEIGHT = window.innerHeight * 0.7;

function setSheetHeight(h) {
  sheet.style.height = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, h)) + 'px';
}

function snapSheet() {
  sheet.style.transition = 'height 0.3s ease';
  const h   = parseInt(sheet.style.height || MIN_HEIGHT);
  const mid = (MIN_HEIGHT + MAX_HEIGHT) / 2;
  if (h > mid) {
    setSheetHeight(MAX_HEIGHT);
    sheet.classList.add('expanded');
    sheetExpanded = true;
  } else {
    setSheetHeight(MIN_HEIGHT);
    sheet.classList.remove('expanded');
    sheetExpanded = false;
  }
}

// Touch
sheetHandle.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
  sheet.style.transition = 'none';
}, { passive: true });

sheetHandle.addEventListener('touchmove', (e) => {
  const delta = touchStartY - e.touches[0].clientY;
  setSheetHeight(parseInt(sheet.style.height || MIN_HEIGHT) + delta);
  touchStartY = e.touches[0].clientY;
}, { passive: true });

sheetHandle.addEventListener('touchend', snapSheet);

// Mouse
let mouseDragging = false;
sheetHandle.addEventListener('mousedown', (e) => {
  mouseDragging = true;
  touchStartY = e.clientY;
  sheet.style.transition = 'none';
});
window.addEventListener('mousemove', (e) => {
  if (!mouseDragging) return;
  setSheetHeight(parseInt(sheet.style.height || MIN_HEIGHT) + (touchStartY - e.clientY));
  touchStartY = e.clientY;
});
window.addEventListener('mouseup', () => { if (mouseDragging) { mouseDragging = false; snapSheet(); } });

// ===== GALERIA DE FOTOS =====
function openAlbum(key) {
  currentAlbum = albums[key];
  photoIndex   = 0;
  viewer.classList.add('show');
  document.body.style.overflow = 'hidden';
  renderPhoto();
}

function closeViewer() {
  viewer.classList.remove('show');
  document.body.style.overflow = '';
  currentAlbum = null;
}

function renderPhoto() {
  if (!currentAlbum) return;
  const total   = currentAlbum.photos.length;
  const current = currentAlbum.photos[photoIndex];
  viewerCounter.innerHTML  = `${photoIndex + 1}/${total}`;
  viewerCaption.innerHTML  = current.caption;
  frontImg.src  = current.src;
  behind1.src   = currentAlbum.photos[(photoIndex - 1 + total) % total].src;
  behind2.src   = currentAlbum.photos[(photoIndex + 1) % total].src;
}

function nextPhoto() {
  if (!currentAlbum) return;
  photoIndex = (photoIndex + 1) % currentAlbum.photos.length;
  frontImg.style.opacity   = '0.7';
  frontImg.style.transform = 'scale(0.95)';
  setTimeout(() => {
    renderPhoto();
    frontImg.style.opacity   = '1';
    frontImg.style.transform = 'scale(1)';
  }, 150);
}

viewer.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
viewer.addEventListener('touchend',   (e) => {
  if (e.changedTouches[0].clientX - touchStartX < -50) nextPhoto();
}, { passive: true });

window.openAlbum   = openAlbum;
window.closeViewer = closeViewer;
window.nextPhoto   = nextPhoto;

// ===== CAIXA DE TEXTO (FIREBASE REALTIME DATABASE) =====
import { initializeApp }               from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey:            "AIzaSyAqKx7g-kNBN3F3ziyIUFVhiMLdA5N3wp0",
  authDomain:        "nicolly-site2.firebaseapp.com",
  databaseURL:       "https://nicolly-site2-default-rtdb.firebaseio.com",
  projectId:         "nicolly-site2",
  storageBucket:     "nicolly-site2.firebasestorage.app",
  messagingSenderId: "676371407160",
  appId:             "1:676371407160:web:b9b3cb379b66c1a61fe1cd",
};

const fbApp    = initializeApp(firebaseConfig);
const fbDb     = getDatabase(fbApp);
const textoRef = ref(fbDb, 'site/textoEspecial');

// Carrega o texto do banco assim que o app abre
function loadSavedText() {
  onValue(textoRef, (snapshot) => {
    const valor = snapshot.val();
    if (valor !== null && textBox && textBox.value === '') {
      textBox.value = valor;
    }
  });
}

// Salva no banco com debounce de 800ms
function saveText() {
  if (!textBox) return;
  clearTimeout(saveTimeout);
  saveHint.innerHTML = 'Salvando...';
  saveTimeout = setTimeout(() => {
    set(textoRef, textBox.value)
      .then(() => {
        saveHint.innerHTML = 'Salvo ✓';
        textBox.classList.add('text-box-saved');
        setTimeout(() => {
          saveHint.innerHTML = '💾 Salvo automaticamente';
          textBox.classList.remove('text-box-saved');
        }, 1500);
      })
      .catch(() => {
        saveHint.innerHTML = '⚠️ Erro ao salvar';
      });
  }, 800);
}

if (textBox) {
  textBox.addEventListener('input', saveText);
  loadSavedText();
}

// ===== PREVENÇÃO DE DOUBLE-TAP ZOOM =====
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, { passive: false });

// ===== SERVICE WORKER =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ===== INICIALIZAÇÃO =====
loadTrack(0);
updateRelationshipCounter();
setInterval(updateRelationshipCounter, 1000);
