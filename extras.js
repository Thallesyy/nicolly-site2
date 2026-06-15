// ===== FEATURE 4: ANIMAÇÃO DE ENTRADA =====
function showWelcomeAnimation() {
  const overlay = document.createElement('div');
  overlay.id = 'welcomeOverlay';
  overlay.innerHTML = `
    <div class="welcome-hearts-container" id="welcomeHeartsContainer"></div>
    <div class="welcome-text" id="welcomeText">Bem-vinda, Nicolly 💕</div>
  `;
  document.body.appendChild(overlay);

  // Chuva de corações
  const heartsEl = document.getElementById('welcomeHeartsContainer');
  const heartEmojis = ['💖','💕','💗','💓','💝','🩷','💘','❤️'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'welcome-heart-rain';
      h.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.fontSize = (16 + Math.random() * 22) + 'px';
      h.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      heartsEl.appendChild(h);
      setTimeout(() => h.remove(), 3500);
    }, i * 80);
  }

  // Texto some depois de 2.5s
  setTimeout(() => {
    const txt = document.getElementById('welcomeText');
    if (txt) txt.classList.add('fade-out');
  }, 2500);

  // Remove overlay depois de 3.5s
  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 600);
  }, 3200);
}

// ===== FEATURE 3: EASTER EGG NA FOTO 4 DO ÁLBUM RANDOM =====
// Injetado dinamicamente quando o álbum random abre na foto 4
function checkEasterEgg(album, index) {
  const existing = document.getElementById('easterEggBtn');
  if (existing) existing.remove();

  if (album === 'random' && index === 3) { // foto 4 (índice 3)
    const btn = document.createElement('div');
    btn.id = 'easterEggBtn';
    btn.innerHTML = '🤍';
    btn.title = 'Clica aqui...';
    btn.onclick = openEasterEgg;
    document.getElementById('viewer').appendChild(btn);

    // Pequena animação de entrada
    setTimeout(() => btn.classList.add('visible'), 300);
  }
}

function openEasterEgg() {
  const modal = document.createElement('div');
  modal.id = 'easterEggModal';
  modal.innerHTML = `
    <div class="easter-egg-content">
      <div class="easter-egg-hearts">💖</div>
      <p class="easter-egg-msg">Achou ne <br><br>
      Saiba que eu penso em você o tempo todo, tipo todo mesmo<br>
      Tudo nesse site é so pra demonstrar um pouco do meu amor o nosso quantinho<br><br>
      Eu Te amo, My beyhive 💕</p>
      <button class="easter-egg-close" onclick="document.getElementById('easterEggModal').remove()">Fechar ✕</button>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);
}

window.openEasterEgg = openEasterEgg;

// ===== FEATURE 2: LINHA DO TEMPO =====
const timelineEvents = [
  { date: "28/03", title: "O primeiro dia", desc: "Esse foi o primeiro dia em que nos vimos, o primeiro dia que nos abraçamos, e um dos melhores dias da minha vida" },
  { date: "12/04", title: "ily", desc: "Esse foi o dia em que voce descobriu que me ama e começou aquela semna infernal em que eu ficava pesando me que frase era" },
  { date: "19/04", title: "O primeiro encontro", desc: "O famoso dia do zoologico, o dia em que tu falou que me amava, o dia em que tu deixou eu seguir as tuas contas do pv, aq foi o começo de tudo" },
  { date: "06/05", title: "Cinema", desc: "O dia do Filme do mj, quando tu chorou falando que me ama, e eu chorei tambem, um grande dia para a nossa historia" },
  { date: "20/05", title: "O Começo do namoro", desc: "O dia que o sonho da aliança virou realidade " },
  { date: "12/06", title: "O dia dos namorados", desc: "O dia em que eu fiquei na tua casa, e te fiz ter um orgasmo" },
];

function buildTimeline() {
  const section = document.createElement('section');
  section.className = 'section';
  section.id = 'timelineSection';
  section.innerHTML = `
    <div class="section-card">
      <div class="section-header">Nossa história 🗓️</div>
      <div class="timeline" id="timelineList">
        ${timelineEvents.map((ev, i) => `
          <div class="timeline-item" style="animation-delay:${i * 0.1}s">
            <div class="timeline-dot">💖</div>
            <div class="timeline-content">
              <div class="timeline-date">${ev.date}</div>
              <div class="timeline-title">${ev.title}</div>
              <div class="timeline-desc">${ev.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Inserir antes da seção "Nossos momentos"
  const momentosSection = document.querySelector('.grid')?.closest('.section');
  if (momentosSection) {
    momentosSection.before(section);
  } else {
    document.getElementById('mainApp').appendChild(section);
  }
}

// ===== FEATURE 5: RAZÕES =====
const reasons = [
  "Porque voce me faz feliz",
  "Porque eu me sinto bem com você do meu lado",
  "porque eu te amo",
  "porque eu me sinto amado por vc",
  "porque eu quero estar com você sempre",
  "porque o seu calor virou uma coisa que eu preciso pra me sentir bem",
  "porque eu me sinto mais eu mesmo quando estou com você",
  " porque eu amo o jeito que a gente se entende mesmo sem falar nada",
  "porque eu amo o jeito que a gente se diverte junto",
  " independente de tudo, eu so consigo pensar em vc",
];

let reasonIndex = 0;
let reasonsUnlocked = false;

function buildReasons() {
  const section = document.createElement('section');
  section.className = 'section';
  section.id = 'reasonsSection';
  section.innerHTML = `
    <div class="section-card special">
      <div class="section-header">Por que eu gosto de você 💝</div>
      <div class="section-body">
        <div class="reason-display" id="reasonDisplay">
          <div class="reason-number" id="reasonNumber">1</div>
          <div class="reason-text" id="reasonText">${reasons[0]}</div>
        </div>
        <div class="reason-controls">
          <button class="btn reason-btn" id="nextReasonBtn" onclick="nextReason()">
            Próxima razão ✨
          </button>
          <div class="reason-progress" id="reasonProgress">1 / ${reasons.length}</div>
        </div>
      </div>
    </div>
  `;

  // Inserir depois do recado especial
  const recadoSection = document.querySelector('#btnToggleMsg')?.closest('.section');
  if (recadoSection) {
    recadoSection.after(section);
  } else {
    document.getElementById('mainApp').appendChild(section);
  }
}

function nextReason() {
  reasonIndex = (reasonIndex + 1) % reasons.length;
  const display = document.getElementById('reasonText');
  const number  = document.getElementById('reasonNumber');
  const progress = document.getElementById('reasonProgress');
  const btn = document.getElementById('nextReasonBtn');

  display.style.opacity = '0';
  display.style.transform = 'translateY(10px)';

  setTimeout(() => {
    display.innerHTML = reasons[reasonIndex];
    number.innerHTML  = reasonIndex + 1;
    progress.innerHTML = `${reasonIndex + 1} / ${reasons.length}`;
    display.style.opacity = '1';
    display.style.transform = 'translateY(0)';

    if (reasonIndex === reasons.length - 1) {
      btn.innerHTML = 'Recomeçar 💕';
    } else {
      btn.innerHTML = 'Próxima razão ✨';
    }
  }, 250);
}

window.nextReason = nextReason;

// ===== FEATURE 6: CONTADOR DE MOMENTOS =====
const COUNTER_KEY = 'eu_e_voce_momentos';

function buildMomentCounter() {
  const section = document.createElement('section');
  section.className = 'section';
  section.id = 'momentCounterSection';

  const saved = parseInt(localStorage.getItem(COUNTER_KEY) || '0');

  section.innerHTML = `
    <div class="section-card special">
      <div class="section-header">Nossos momentos especiais 🌟</div>
      <div class="section-body" style="text-align:center;">
        <p style="color:var(--text-secondary);margin-bottom:12px;font-size:14px;">
          Cada vez que vivemos algo especial, clica aqui pra contar 💕
        </p>
        <div class="moment-counter-wrap">
          <div class="moment-count" id="momentCount">${saved}</div>
          <div class="moment-label">momentos juntos</div>
        </div>
        <button class="moment-btn" id="momentBtn" onclick="addMoment()">
          + Adicionar momento 💖
        </button>
        <div class="moment-hint" id="momentHint"></div>
      </div>
    </div>
  `;

  // Inserir antes da linha do tempo
  const timeline = document.getElementById('timelineSection');
  if (timeline) {
    timeline.before(section);
  } else {
    const momentosSection = document.querySelector('.grid')?.closest('.section');
    if (momentosSection) momentosSection.before(section);
    else document.getElementById('mainApp').appendChild(section);
  }
}

function addMoment() {
  const current = parseInt(localStorage.getItem(COUNTER_KEY) || '0') + 1;
  localStorage.setItem(COUNTER_KEY, current);

  const countEl = document.getElementById('momentCount');
  const hint    = document.getElementById('momentHint');
  const btn     = document.getElementById('momentBtn');

  // Animação no número
  countEl.style.transform = 'scale(1.4)';
  countEl.style.color     = '#ff6b9d';
  setTimeout(() => {
    countEl.innerHTML = current;
    countEl.style.transform = 'scale(1)';
    countEl.style.color = '';
  }, 200);

  // Feedback com frase
  const phrases = [
    "mais um momento lindo 💕",
    "eu nunca vou esquecer 🥹",
    "que sorte a minha 💖",
    "cada vez mais 💗",
    "pra sempre na memória 🌸",
    "feliz demais 🩷",
  ];
  hint.innerHTML = phrases[Math.floor(Math.random() * phrases.length)];
  hint.style.opacity = '1';

  // Animação no botão
  btn.style.transform = 'scale(0.95)';
  setTimeout(() => btn.style.transform = '', 150);

  // Some o hint depois de 2s
  setTimeout(() => { hint.style.opacity = '0'; }, 2000);

  // Spawn coração na tela
  spawnCelebrationHeart();
}

function spawnCelebrationHeart() {
  const h = document.createElement('div');
  h.className = 'celebration-heart';
  h.innerHTML = ['💖','💕','💗','🩷'][Math.floor(Math.random() * 4)];
  const btn = document.getElementById('momentBtn');
  const rect = btn.getBoundingClientRect();
  h.style.left = (rect.left + rect.width / 2) + 'px';
  h.style.top  = rect.top + 'px';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 1200);
}

window.addMoment = addMoment;

// ===== INICIALIZAÇÃO DE TODAS AS FEATURES =====
// Hook na função checkPassword original para disparar a animação
const _originalCheckPassword = window.checkPassword;
window.checkPassword = function() {
  const input = document.getElementById('passwordInput');
  const isCorrect = input.value.toLowerCase() === '20/05';

  _originalCheckPassword();

  if (isCorrect) {
    setTimeout(showWelcomeAnimation, 600);
  }
};

// Hook na função openAlbum para checar easter egg
const _originalOpenAlbum = window.openAlbum;
window.openAlbum = function(key) {
  _originalOpenAlbum(key);
  checkEasterEgg(key, 0);
};

// Hook na função nextPhoto para checar easter egg
const _originalNextPhoto = window.nextPhoto;
window.nextPhoto = function() {
  _originalNextPhoto();
  // Precisamos saber qual album e índice atual
  // Pegamos do viewerCounter
  const counter = document.getElementById('viewerCounter');
  if (counter && window._currentAlbumKey) {
    const idx = parseInt(counter.innerHTML.split('/')[0]) - 1;
    checkEasterEgg(window._currentAlbumKey, idx);
  }
};

// Guardar qual album está aberto
const _originalOpenAlbum2 = window.openAlbum;
window.openAlbum = function(key) {
  window._currentAlbumKey = key;
  _originalOpenAlbum2(key);
};

// Build das seções quando o app aparece
function initExtras() {
  buildTimeline();
  buildReasons();
  buildMomentCounter();
}

// Espera o app estar visível
const _observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.target.id === 'mainApp' && m.target.classList.contains('show')) {
      setTimeout(initExtras, 700);
      _observer.disconnect();
      break;
    }
  }
});

const mainApp = document.getElementById('mainApp');
if (mainApp) {
  _observer.observe(mainApp, { attributes: true, attributeFilter: ['class'] });
}
