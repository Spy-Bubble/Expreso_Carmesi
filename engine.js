/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NIEBLA Y LLUVIA DE SANGRE — Canvas de fondo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const rainCanvas = document.getElementById('rain-canvas');
const rCtx       = rainCanvas.getContext('2d');
let drops = [];

function initRain() {
  if(!rainCanvas) return;
  rainCanvas.width  = window.innerWidth;
  rainCanvas.height = window.innerHeight;
  const n = Math.min(Math.floor((rainCanvas.width * rainCanvas.height) / 7000), 180);
  drops = Array.from({ length: n }, () => ({
    x:     Math.random() * rainCanvas.width,
    y:     Math.random() * rainCanvas.height,
    speed: Math.random() * 3.5 + 2.2,
    len:   Math.random() * 22 + 10,
    op:    Math.random() * 0.11 + 0.03,
    w:     Math.random() * 0.5 + 0.3,
  }));
}

function animateRain() {
  rCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  drops.forEach(d => {
    rCtx.beginPath();
    rCtx.globalAlpha = Math.min(d.op * 5, 1); // 🛠️ Más opacidad
    rCtx.strokeStyle = '#FF3333'; // 🛠️ Rojo más vibrante y luminoso
    rCtx.lineWidth   = d.w * 3.5; // 🛠️ Gotas más gruesas
    rCtx.moveTo(d.x, d.y);
    rCtx.lineTo(d.x - (d.speed * 0.4), d.y + d.len); 
    rCtx.stroke();
    d.y += d.speed * 1.5;
    if (d.y > rainCanvas.height + d.len) {
      d.y = -d.len;
      d.x = Math.random() * rainCanvas.width;
    }
  });
  rCtx.globalAlpha = 1;
  requestAnimationFrame(animateRain);
}

// 🛠️ FIX: Arranque a prueba de balas (funciona sin importar la velocidad del navegador)
function startVisuals() {
  initRain();
  animateRain();
  try {
    if (window.VANTA) {
      window.VANTA.FOG({
        el: "#vanta-bg",
        mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200.00, minWidth: 200.00,
        highlightColor: 0x5c0a14, midtoneColor: 0x8b1a2a,
        lowlightColor: 0x06030a, baseColor: 0x06030a,
        blurFactor: 0.65, speed: 1.20, zoom: 1.50
      });
    }
  } catch(e) { console.warn("Vanta Fog omitido", e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startVisuals);
} else {
  startVisuals();
}
window.addEventListener('resize', initRain);
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ESTADO DEL JUEGO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
let G = {};

function resetGame() {
  G = {
    culprit:      Math.floor(Math.random() * CHARS.length),
    weapon:       Math.floor(Math.random() * WEAPONS.length),
    room:         Math.floor(Math.random() * LOCATIONS.length),
    clueMap:      {},
    collected:    [],
    visited:      new Set(),
    interrogated: new Set(),
    accusation:   { char: null, weapon: null, room: null },
  };
  buildClueMap();
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DISTRIBUCIÓN DE PISTAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildClueMap() {
  const culprit = CHARS[G.culprit];
  const weapon  = WEAPONS[G.weapon];
  const room    = LOCATIONS[G.room];

  // Pistas verdaderas (culpable + arma + locación)
  // Asignamos certeza 'alta' a las pistas más reveladoras y 'media' a las secundarias
  const truth = [
    { text: culprit.culprit_clues[0], tag: 'suspect',  confidence: 'alta' },
    { text: culprit.culprit_clues[1], tag: 'suspect',  confidence: 'media' },
    { text: weapon.clues[0].text,     tag: 'weapon',   confidence: 'alta' },
    { text: weapon.clues[1].text,     tag: 'weapon',   confidence: 'media' },
    { text: room.clues[0].text,       tag: 'location', confidence: 'alta' },
    { text: room.clues[1].text,       tag: 'location', confidence: 'media' },
  ];

  // Pistas falsas (red herrings)
  // Las pistas falsas nacen con certeza 'baja' (dudosas), ayudando al jugador a descartar
  const red = CHARS
    .filter((_, i) => i !== G.culprit)
    .map(ch => ({ ...RED_HERRINGS[ch.id], confidence: 'baja' }));

  const selectedRed = shuffle(red).slice(0, 3);
  const all = shuffle([...truth, ...selectedRed]);

  // 2 pistas por locación (como hay 5 locaciones, el jugador encontrará máximo 10 pistas)
  G.clueMap = {};
  LOCATIONS.forEach((loc, i) => {
    // Si se nos acaban las pistas (porque ahora hay 9), rellenamos la última con un texto de ambiente
    const cluesForLoc = all.slice(i * 2, i * 2 + 2);
    if (cluesForLoc.length < 2) {
      cluesForLoc.push({ text: "No hay más rastros evidentes en esta zona.", tag: 'location', confidence: 'baja' });
    }
    G.clueMap[loc.id] = cluesForLoc;
  });

  // Garantizar que la escena del crimen tenga al menos una pista de locación
  const murderRoomId = room.id;
  const hasTruth = G.clueMap[murderRoomId].some(c => c.tag === 'location');
  if (!hasTruth) {
    G.clueMap[murderRoomId][0] = { text: room.clues[2].text, tag: 'location' };
  }
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAVEGACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function goTo(id, ambientType) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  // Scroll to top of new screen
  const el = document.getElementById(id);
  if (el) el.scrollTop = 0;
  if (ambientType) Sounds.playAmbient(ambientType);
}

function switchTab(name, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
  
  // 🛠️ Freno: Cortar el sonido del lápiz si cambiamos de pestaña
  Sounds.stopSFX('notebook_open');
  Sounds.stopSFX('clue_found');
  
  // 🎵 Reproducir sonido según la pestaña
  if (name === 'notebook') Sounds.playSFX('notebook_open');
  else if (name === 'scenes') Sounds.playSFX('tab_scenes');
  else if (name === 'suspects') Sounds.playSFX('tab_suspects');
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UI — Brief
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildBriefSuspects() {
  const row = document.getElementById('brief-suspects');
  row.innerHTML = '';
  CHARS.forEach(ch => {
    const d = document.createElement('div');
    d.className = 'char-card';
    d.innerHTML = `
      <div class="char-top" style="background:${ch.color}">
        <span class="char-sym">${ch.symbol}</span>
      </div>
      <div class="char-bot">
        <div class="char-name">${ch.name}</div>
        <div class="char-role">${ch.role}</div>
      </div>`;
    row.appendChild(d);
  });
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UI — Investigate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function buildLocGrid() {
  const grid = document.getElementById('loc-grid');
  grid.innerHTML = '';
  LOCATIONS.forEach(loc => {
    const vis = G.visited.has(loc.id);
    const d   = document.createElement('div');
    d.className = 'loc-card' + (vis ? ' visited' : '');
    d.style.background = `linear-gradient(160deg, ${loc.color} 0%, #06030A 100%)`;
    d.innerHTML = `
      <div class="loc-icon-wrap">${loc.icon}</div>
      <div class="loc-info">
        <div class="loc-name">${loc.name}</div>
        <div class="loc-sub">${loc.sub}</div>
        ${vis ? '<div class="loc-visited-badge">✓ Investigado</div>' : ''}
      </div>`;
    if (!vis) d.onclick = () => openLocationModal(loc.id);
    grid.appendChild(d);
  });
}

function buildSuspGrid() {
  const grid = document.getElementById('susp-grid');
  grid.innerHTML = '';
  CHARS.forEach(ch => {
    const done = G.interrogated.has(ch.id);
    const d    = document.createElement('div');
    d.className = 'susp-card' + (done ? ' interrogated' : '');
    d.innerHTML = `
      <div class="susp-top" style="background:${ch.color}">
        <span class="susp-emoji">${ch.emoji}</span>
      </div>
      <div class="susp-body">
        <div class="susp-name">${ch.name}</div>
        <div class="susp-role">${ch.role}</div>
        <div class="susp-action">${done ? '✓ Interrogado' : '← Desliza la carta →'}</div>
      </div>`;
    if (!done) d.onclick = () => openReigns(ch.id);
    grid.appendChild(d);
  });
}

function buildNotebook() {
  const el = document.getElementById('notebook-entries');
  if (!G.collected.length) {
    el.innerHTML = '<p class="no-clues">— El cuaderno está vacío. Investigue las escenas para recopilar pistas. —</p>';
    return;
  }

  // Separar pistas por categoría
  const suspects  = G.collected.filter(c => c.tag === 'suspect');
  const weapons   = G.collected.filter(c => c.tag === 'weapon');
  const locations = G.collected.filter(c => c.tag === 'location');

  // Función auxiliar para los iconos de certeza
  const getConfIcon = (conf) => {
    if (conf === 'alta') return '<span class="conf-icon conf-alta" title="Certeza Alta: Casi confirmado">🟢</span>';
    if (conf === 'baja') return '<span class="conf-icon conf-baja" title="Certeza Baja: Dudoso / Descartable">🔴</span>';
    return '<span class="conf-icon conf-media" title="Certeza Media: Sospecha fuerte">🟡</span>'; // Default media
  };

  // Función para renderizar un bloque del cuaderno
  const renderGroup = (title, clues) => {
    if (!clues.length) return '';
    return `
      <div class="notebook-group">
        <div class="notebook-group-title">${title}</div>
        ${clues.map(c => `
          <div class="clue-entry">
            ${getConfIcon(c.confidence || 'media')}
            <div class="clue-text">${c.text}</div>
          </div>
        `).join('')}
      </div>
    `;
  };

  // Construir el HTML agrupado
  let html = '';
  html += renderGroup('👤 Perfiles y Sospechosos', suspects);
  html += renderGroup('🗡️ Posibles Armas', weapons);
  html += renderGroup('📍 Lugares de Interés', locations);

  // Sistema de Inferencia Automática (Guía pasiva para el jugador)
  if (G.collected.length >= 4) {
    const altas = G.collected.filter(c => c.confidence === 'alta').length;
    html += `
      <div class="notebook-inference">
        <strong>🧠 Deducción Activa:</strong> Has encontrado ${altas} pista(s) de certeza alta (🟢). Concéntrate en cruzar esa información y descarta las rojas (🔴).
      </div>
    `;
  }

  el.innerHTML = html;
}

function updateCounters() {
  const sc = G.visited.size;
  const cc = G.collected.length;
  const ic = G.interrogated.size;

  ['scenes-count','b-scenes'].forEach(id => {
    const e = document.getElementById(id); if (e) e.textContent = sc;
  });
  ['clues-count','b-clues'].forEach(id => {
    const e = document.getElementById(id); if (e) e.textContent = cc;
  });
  const ie = document.getElementById('interr-count');
  if (ie) ie.textContent = ic;

  const btn = document.getElementById('btn-accuse');
  if (btn) {
    btn.disabled     = sc < 3;
    btn.style.opacity = sc >= 3 ? '1' : '0.28';
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MODAL DE LOCACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function openLocationModal(locId) {
  const loc   = LOCATIONS.find(l => l.id === locId);
  const clues = G.clueMap[locId] || [];

  document.getElementById('modal-inner').innerHTML = `
    <div class="modal-loc-art">${loc.icon}</div>
    <div class="modal-loc-name">${loc.name}</div>
    <div class="modal-loc-desc">${loc.desc}</div>
    <div class="clues-header">Pistas encontradas</div>
    ${clues.map((c, i) => `
      <div class="clue-reveal" id="cr-${i}">
        <span class="clue-tag ${c.tag}">${
          c.tag === 'location' ? 'Escena' : c.tag === 'weapon' ? 'Arma' : 'Sospechoso'
        }</span>${c.text}
      </div>`).join('')}
  `;

  openModalBox();

  // Staggered reveal
  clues.forEach((_, i) => {
    setTimeout(() => {
      const el = document.getElementById('cr-' + i);
      if (el) el.classList.add('shown');
    }, 400 + i * 700);
  });

  G.visited.add(locId);
  clues.forEach(c => {
    if (!G.collected.find(x => x.text === c.text)) G.collected.push(c);
  });

  buildLocGrid();
  buildNotebook();
  updateCounters();
  Sounds.playSFX('door_open'); // Suena la puerta...
  Sounds.playLocation(locId);  // 🛠️ ¡NUEVO!: ...y arranca el audio de la habitación
}

function openModalBox() {
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModalBtn() {
  document.getElementById('modal-overlay').classList.remove('open');
  Sounds.stopLocation(); 
  // 🛠️ Freno: Cortar sonido del lápiz al salir de la escena
  Sounds.stopSFX('clue_found'); 
}

function handleOverlayClick(e) {
  // Only close if clicking the dark overlay, not the modal box
  if (e.target === document.getElementById('modal-overlay')) {
    closeModalBtn();
  }
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   REIGNS — Sistema de interrogatorio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SISTEMA REIGNS — 3 cartas secuenciales por sospechoso
   2/3 o 3/3 aciertos → pista bonus
   0/3 o 1/3 aciertos → pista falsa en el cuaderno
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const SWIPE_THRESHOLD = 110;
const MAX_TILT        = 22;

let _rChar     = null;
let _rDrag     = false;
let _rStartX   = 0;
let _rCurrX    = 0;
let _rAnswered = false;
let _rDeck     = [];   // 3 cartas del interrogatorio actual
let _rCardIdx  = 0;    // carta actual (0, 1, 2)
let _rScore    = 0;    // aciertos acumulados

// ── Abrir el interrogatorio ──────────────────────────────────
function openReigns(charId) {
  _rChar    = CHARS.find(c => c.id === charId);
  _rDeck    = INTERROGATION_DECKS[_rChar.id].cards;
  _rCardIdx = 0;
  _rScore   = 0;
  _rAnswered = false;
  _rCurrX   = 0;

  // Cabecera del overlay
  document.getElementById('r-header-emoji').innerHTML= _rChar.emoji;
  document.getElementById('r-header-name').innerHTML  = _rChar.name;
  document.getElementById('r-header-role').innerHTML = _rChar.role;

  // Ocultar secciones post-swipe, mostrar carta
  document.getElementById('r-midanswer').style.display    = 'none';
  document.getElementById('r-final-result').style.display = 'none';
  document.getElementById('r-card-wrap').style.display    = 'flex';

  document.getElementById('reigns-overlay').classList.add('open');
  Sounds.playSFX('interrogation_start');

  rLoadCard(0);
}

// ── Cargar carta por índice ──────────────────────────────────
function rLoadCard(idx) {
  const c    = _rDeck[idx];
  _rAnswered = false;
  _rCurrX    = 0;

  // Badge de tipo
  const typeLabels = {
    acercamiento:'① Apertura',  tactica:'② Táctica',    presion:'③ Presión',
    respeto:'① Respeto',        tecnica:'② Técnico',    etica:'③ Ética',
    admiracion:'① Admiración',  injusticia:'② Validar', confesion:'③ Cierre',
    franqueza:'② Franqueza',    honor:'③ Honor',
    halago:'① Halago',          superioridad:'② Ego',   ego:'③ Cierre',
  };
  document.getElementById('r-type-badge').textContent     = typeLabels[c.type] || c.label;
  document.getElementById('r-context').textContent        = c.context;
  document.getElementById('r-progress-label').textContent = `Ronda ${idx + 1} de 3`;

  // Dots de progreso
  [0,1,2].forEach(i => {
    const dot = document.getElementById('rd-' + i);
    dot.className = 'r-dot' + (i < idx ? ' done' : i === idx ? ' active' : '');
  });

  // Contenido de la carta
  document.getElementById('r-emoji').innerHTML     = _rChar.emoji;
  document.getElementById('r-name').innerHTML     = c.label;
  document.getElementById('r-opt-left').innerHTML  = c.left_text;
  document.getElementById('r-opt-right').innerHTML = c.right_text;
  document.getElementById('r-q-left').innerHTML    = c.left_label;
  document.getElementById('r-q-right').innerHTML   = c.right_label;
  document.getElementById('r-card-top').style.background = _rChar.color;

  // Reset visual de la carta
  const card = document.getElementById('r-card');
  card.style.transition = 'none';
  card.style.transform  = 'none';
  card.style.opacity    = '1';
  document.getElementById('r-hint-left').style.opacity  = '0';
  document.getElementById('r-hint-right').style.opacity = '0';
  document.getElementById('r-card-wrap').style.display  = 'flex';
  document.getElementById('r-midanswer').style.display  = 'none';
}

function closeReigns() {
  document.getElementById('reigns-overlay').classList.remove('open');
  // 🛠️ Freno: Cortar el sonido del lápiz al terminar de interrogar
  Sounds.stopSFX('clue_found');
}

// ── Botón "Continuar / Ver resultado" ───────────────────────
function rNextCard() {
  _rCardIdx++;
  if (_rCardIdx >= _rDeck.length) {
    rShowFinalResult();
  } else {
    document.getElementById('r-midanswer').style.display = 'none';
    rLoadCard(_rCardIdx);
    Sounds.playSFX('card_draw');
  }
}

// ── Resultado final tras las 3 cartas ───────────────────────
function rShowFinalResult() {
  document.getElementById('r-card-wrap').style.display    = 'none';
  document.getElementById('r-midanswer').style.display    = 'none';
  document.getElementById('r-final-result').style.display = 'flex';

  const deck  = INTERROGATION_DECKS[_rChar.id];
  const score = _rScore;

  // Marcar todos los dots como completados
  [0,1,2].forEach(i => {
    const dot = document.getElementById('rd-' + i);
    if (!dot.classList.contains('wrong')) dot.className = 'r-dot done';
  });

  const icons    = ['💢','😒','🤔','✅'];
  const scoreStr = ['0/3 — Sin progreso','1/3 — Sin avances','2/3 — Pista obtenida','3/3 — Testigo clave'];
  const verdicts = [
    `${_rChar.name} lo mira con frialdad absoluta. Ha perdido toda posibilidad de colaboración — y algo peor: ha sembrado dudas en su propio cuaderno.`,
    `${_rChar.name} cierra la conversación sin revelar nada útil. Sin embargo, antes de irse deja caer algo... que puede ser verdad o puede ser una trampa.`,
    `${_rChar.name} baja la guardia levemente. Su lectura psicológica fue precisa — una pista genuina queda registrada.`,
    `${_rChar.name} revela más de lo que pretendía. Ha leído su psicología a la perfección, Inspector.`,
  ];

  document.getElementById('r-final-icon').textContent    = icons[score];
  document.getElementById('r-final-score').textContent   = scoreStr[score];
  document.getElementById('r-final-verdict').textContent = verdicts[score];

  const clueWrap    = document.getElementById('r-final-clue-wrap');
  const penaltyWrap = document.getElementById('r-penalty-wrap');
  clueWrap.style.display    = 'none';
  penaltyWrap.style.display = 'none';

  if (score >= 2) {
    // ✅ Pista bonus genuina
    const bonus = deck.bonus_clue;
    if (bonus && !G.collected.find(x => x.text === bonus.text)) {
      // 🛠️ Preparando el terreno: le asignamos certeza alta
      bonus.confidence = 'alta'; 
      G.collected.push(bonus);
      buildNotebook();
      updateCounters();
    }
    document.getElementById('r-final-clue-text').textContent = bonus.text;
    clueWrap.style.display = 'flex';
    Sounds.playSFX('clue_found');
  } else {
    // 🛠️ CAMBIO CLAVE: Ya no empujamos la pista falsa al G.collected.
    // El castigo ahora es simplemente perder la oportunidad de obtener la pista útil.
    const penaltyText = "El sospechoso cierra la conversación sin revelar nada útil. No has logrado descifrar su psicología.";
    
    document.getElementById('r-penalty-text').textContent = penaltyText;
    
    // Cambiamos visualmente el aviso para que ya no diga "Entrada falsa en el cuaderno"
    const penaltyLabel = document.querySelector('.r-penalty-label');
    if (penaltyLabel) penaltyLabel.textContent = "Interrogatorio Fallido";
    
    penaltyWrap.style.display = 'flex';
    Sounds.playSFX('failure');
  }

  G.interrogated.add(_rChar.id);
  buildSuspGrid();
  updateCounters();
}

/* ── Drag / Touch events ────────────────────────────────────── */
window.addEventListener('load', () => {
  const card = document.getElementById('r-card');
  if (!card) return;

  card.addEventListener('mousedown', e => {
    _rDrag = true; _rStartX = e.clientX;
    card.style.cursor = 'grabbing'; card.style.transition = 'none';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => { if (!_rDrag || _rAnswered) return; rMoveDrag(e.clientX); });
  document.addEventListener('mouseup',   () => { if (!_rDrag || _rAnswered) return; _rDrag = false; card.style.cursor = 'grab'; rEndDrag(); });

  card.addEventListener('touchstart', e => {
    _rDrag = true; _rStartX = e.touches[0].clientX; card.style.transition = 'none';
  }, { passive: true });
  document.addEventListener('touchmove', e => { if (!_rDrag || _rAnswered) return; rMoveDrag(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchend',  () => { if (!_rDrag || _rAnswered) return; _rDrag = false; rEndDrag(); });
});

function rMoveDrag(clientX) {
  _rCurrX       = clientX - _rStartX;
  const tilt     = Math.min(MAX_TILT, Math.abs(_rCurrX) * 0.12) * Math.sign(_rCurrX);
  const progress = Math.min(1, Math.abs(_rCurrX) / SWIPE_THRESHOLD);
  const card     = document.getElementById('r-card');
  if (card) card.style.transform = `translateX(${_rCurrX}px) rotate(${tilt}deg)`;

  const L = document.getElementById('r-hint-left');
  const R = document.getElementById('r-hint-right');
  if (!L || !R) return;
  const p = Math.min(1, progress * 1.1);
  if      (_rCurrX < -15) { L.style.opacity = String(p); R.style.opacity = '0'; }
  else if (_rCurrX >  15) { R.style.opacity = String(p); L.style.opacity = '0'; }
  else                    { L.style.opacity = R.style.opacity = '0'; }
}

function rEndDrag() {
  if      (_rCurrX < -SWIPE_THRESHOLD) rSwipe('left');
  else if (_rCurrX >  SWIPE_THRESHOLD) rSwipe('right');
  else {
    const card = document.getElementById('r-card');
    if (card) { card.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)'; card.style.transform = 'none'; }
    const L = document.getElementById('r-hint-left'), R = document.getElementById('r-hint-right');
    if (L) L.style.opacity = '0'; if (R) R.style.opacity = '0';
    Sounds.playSFX('card_snap');
  }
}

function rSwipe(direction) {
  _rAnswered    = true;
  Sounds.playSFX('card_swipe');

  const cardDef = _rDeck[_rCardIdx];
  const correct  = (direction === cardDef.correct);
  const response = direction === 'left' ? cardDef.left_response : cardDef.right_response;

  if (correct) _rScore++;

  // Animar carta saliendo de pantalla
  const el   = document.getElementById('r-card');
  const flyX = direction === 'left' ? -window.innerWidth : window.innerWidth;
  const flyR = direction === 'left' ? -35 : 35;
  if (el) {
    el.style.transition = 'transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.3s ease';
    el.style.transform  = `translateX(${flyX}px) rotate(${flyR}deg)`;
    el.style.opacity    = '0';
  }

  setTimeout(() => {
    document.getElementById('r-card-wrap').style.display = 'none';
    const midAns = document.getElementById('r-midanswer');
    midAns.style.display = 'flex';

    // Actualizar dot del turno actual
    const dot = document.getElementById('rd-' + _rCardIdx);
    if (dot) dot.className = 'r-dot ' + (correct ? 'done' : 'wrong');

    // Respuesta del personaje
    document.getElementById('r-midans-reaction').textContent = response;

    // Indicador de acierto
    const ind = document.getElementById('r-midans-indicator');
    if (correct) {
      ind.innerHTML = '<span class="r-correct-badge">✓ Acercamiento acertado</span>';
      Sounds.playSFX('clue_found');
      midAns.classList.remove('shake-anim'); // Asegurar que no tiemble
    } else {
      ind.innerHTML = '<span class="r-wrong-badge">✗ El sospechoso se cierra</span>';
      Sounds.playSFX('answer_reveal');
      
      // 🛠️ ¡NUEVO! Reiniciar y aplicar animación de sacudida
      midAns.classList.remove('shake-anim');
      void midAns.offsetWidth; // Forzar reflow del navegador para reiniciar la animación
      midAns.classList.add('shake-anim');
    }

    // Etiqueta del botón
    const btn = document.getElementById('r-next-btn');
    if (btn) btn.querySelector('span').textContent = _rCardIdx >= 2 ? 'Ver resultado final' : 'Siguiente ronda →';
  }, 360);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ACUSACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function goToAccuse() {
  buildAccuseScreen();
  goTo('s-accuse', 'accusation');
}

function buildAccuseScreen() {
  G.accusation = { char: null, weapon: null, room: null };

  // Characters
  document.getElementById('acc-chars').innerHTML = CHARS.map((ch, i) => `
    <div class="acc-char-pick" onclick="selectAccChar(${i}, this)">
      <div class="acc-char-top" style="background:${ch.color}">${ch.emoji}</div>
      <div class="acc-char-name">${ch.name}</div>
    </div>`).join('');

  // Weapons — richer cards showing owner
  document.getElementById('acc-weapons').innerHTML = WEAPONS.map((w, i) => `
    <div class="acc-weapon-pick" onclick="selectAccWeapon(${i}, this)">
      <span class="acc-weapon-icon">${w.icon}</span>
      <div class="acc-weapon-name">${w.name}</div>
      <div class="acc-weapon-owner">Objeto de ${w.owner_name}</div>
    </div>`).join('');

  // Rooms
  document.getElementById('acc-rooms').innerHTML = LOCATIONS.map((loc, i) => `
    <div class="acc-room-pick" onclick="selectAccRoom(${i}, this)">
      <span class="acc-room-icon">${loc.icon}</span>
      <div class="acc-room-name">${loc.name}</div>
    </div>`).join('');

  // Hide weapon detail
  const wd = document.getElementById('weapon-detail');
  if (wd) wd.classList.remove('visible');

  updateAccuseSummary();
}

function selectAccChar(idx, el) {
  document.querySelectorAll('#acc-chars .acc-char-pick').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  G.accusation.char = idx;
  updateAccuseSummary();
}

function selectAccWeapon(idx, el) {
  document.querySelectorAll('#acc-weapons .acc-weapon-pick').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  G.accusation.weapon = idx;

  // Show weapon detail panel with description + innocent reason
  const w  = WEAPONS[idx];
  const wd = document.getElementById('weapon-detail');
  if (wd) {
    document.getElementById('wd-name').textContent  = w.name;
    document.getElementById('wd-desc').textContent  = w.description;
    document.getElementById('wd-alibi').textContent = w.innocent_reason;
    wd.classList.add('visible');
  }

  Sounds.playWeapon(w.sound);
  updateAccuseSummary();
}

function selectAccRoom(idx, el) {
  document.querySelectorAll('#acc-rooms .acc-room-pick').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  G.accusation.room = idx;
  updateAccuseSummary();
}

function updateAccuseSummary() {
  const { char, weapon, room } = G.accusation;
  const btn = document.getElementById('btn-confirm');
  const sum = document.getElementById('acc-summary');

  if (char !== null && weapon !== null && room !== null) {
    btn.disabled = false;
    sum.innerHTML =
      `<em>${CHARS[char].name}</em> · con <em>${WEAPONS[weapon].name}</em> · en <em>${LOCATIONS[room].name}</em>`;
  } else {
    btn.disabled = true;
    sum.textContent = 'Seleccione al culpable, el arma y el lugar del crimen.';
  }
}

function confirmAccusation() {
  Sounds.playSFX('accusation_confirm');
  Sounds.stopAmbient();
  const { char, weapon, room } = G.accusation;
  const correct = char === G.culprit && weapon === G.weapon && room === G.room;
  setTimeout(() => showResolution(correct), 600);
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RESOLUCIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function showResolution(correct) {
  const culprit = CHARS[G.culprit];
  const weapon  = WEAPONS[G.weapon];
  const room    = LOCATIONS[G.room];

  const banner = document.getElementById('verdict-banner');
  banner.className = 'verdict-banner ' + (correct ? 'correct' : 'wrong');

  document.getElementById('verdict-icon').textContent  = correct ? '🏅' : '💀';
  document.getElementById('verdict-title').textContent  = correct ? '¡Caso Resuelto!' : 'Acusación Incorrecta';
  document.getElementById('verdict-sub').textContent    = correct
    ? 'Detective Renard, su intuición es extraordinaria. El Expreso llega a Viena con el culpable bajo custodia.'
    : `Se equivocó, Detective. ${culprit.name} escapó en la estación de Linz antes de que pudiera actuar.`;

  document.getElementById('sol-culprit').innerHTML = `${culprit.emoji} ${culprit.name}`;
  document.getElementById('sol-weapon').innerHTML  = `${weapon.icon} ${weapon.name}`;
  document.getElementById('sol-room').innerHTML    = `${room.icon} ${room.name}`;

  document.getElementById('story-title').textContent  = culprit.story_title;
  document.getElementById('story-author').textContent = `— En las propias palabras de ${culprit.name}`;
  document.getElementById('story-text').innerHTML     = `"${culprit.story(weapon.name, room.name)}"`;

  goTo('s-resolve');
  setTimeout(() => Sounds.playSFX(correct ? 'success' : 'failure'), 500);
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SONIDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function toggleMute() {
  const muted = Sounds.toggleMute();
  const btn   = document.getElementById('mute-btn');
  if (btn) btn.textContent = muted ? '🔇' : '🔊';
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FLUJO PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function startBrief() {
  buildBriefSuspects();
  // 🛠️ FIX: Le decimos que mantenga el ambiente de 'intro' (Lluvia) en esta pantalla
  goTo('s-brief', 'intro'); 
}

function startInvestigation() {
  buildLocGrid();
  buildSuspGrid();
  buildNotebook();
  updateCounters();

  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const firstTab   = document.querySelector('.tab');
  const firstPanel = document.getElementById('tab-scenes');
  if (firstTab)   firstTab.classList.add('active');
  if (firstPanel) firstPanel.classList.add('active');

  // 🛠️ ESTA ES LA LÍNEA CLAVE: Le dice al motor que vaya a la pantalla y ponga la música 'investigation' (Jazz)
  goTo('s-investigate', 'investigation');
}

function newGame() {
  Sounds.stopAmbient(0.3);
  resetGame();
  goTo('s-intro');
  setTimeout(() => Sounds.playAmbient('intro'), 500);
}


/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
// Iniciar AudioContext en primer gesto del usuario
document.addEventListener('click', () => { Sounds.init(); }, { once: true });
document.addEventListener('touchstart', () => { Sounds.init(); }, { once: true });

// Boot
resetGame();
goTo('s-intro');
setTimeout(() => Sounds.playAmbient('intro'), 900);
