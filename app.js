/**
 * DetranQuiz — app.js
 * Método Gabarita Detran
 * Motor do quiz: XP, vidas, sequência, progresso, análise de pontos fracos, termômetro, histórico e efeitos sonoros gamificados
 */

const App = (() => {
  'use strict';

  // ══ CONSTANTES ══════════════════════════════════════
  const MAX_LIVES = 5;
  const QUESTIONS_PER_MODULE = 10;
  const SIMULADO_QUESTIONS_COUNT = 52;
  const XP_CORRECT = 10;
  const XP_STREAK_BONUS = [0, 0, 5, 10, 15, 20];

  // ══ ENGINE DE EFEITOS SONOROS (WEB AUDIO API GAMIFICADA) ══
  const Sound = (() => {
    let ctx = null;
    let enabled = true;

    try {
      const saved = localStorage.getItem('treina_detran_sound_enabled');
      if (saved !== null) enabled = saved === '1';
    } catch (e) {}

    function initCtx() {
      if (!ctx && (typeof window !== 'undefined')) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) ctx = new AudioCtx();
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
    }

    function playTone(freq, type = 'sine', duration = 0.15, startTime = 0, gainLevel = 0.15) {
      if (!enabled) return;
      try {
        initCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        const t = ctx.currentTime + startTime;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(gainLevel, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + duration);
      } catch (e) {}
    }

    // 1. Acerto comum (Acorde maior alegre e brilhante)
    function playCorrect() {
      if (!enabled) return;
      initCtx();
      playTone(523.25, 'triangle', 0.12, 0.00, 0.22); // C5
      playTone(659.25, 'triangle', 0.14, 0.08, 0.22); // E5
      playTone(783.99, 'triangle', 0.16, 0.16, 0.25); // G5
      playTone(1046.50, 'sine', 0.35, 0.24, 0.30); // C6
    }

    // 2. Erro (Tom suave descendente, estilo Duolingo amigável)
    function playWrong() {
      if (!enabled) return;
      initCtx();
      playTone(300, 'sine', 0.16, 0.0, 0.25);
      playTone(210, 'sine', 0.28, 0.12, 0.22);
    }

    // 3. Sequência / Combo em Chamas (Raios de XP e energia!)
    function playStreak() {
      if (!enabled) return;
      initCtx();
      playTone(440.00, 'triangle', 0.08, 0.00, 0.20);
      playTone(554.37, 'triangle', 0.08, 0.06, 0.22);
      playTone(659.25, 'triangle', 0.10, 0.12, 0.25);
      playTone(880.00, 'sine', 0.25, 0.18, 0.30);
      playTone(1174.66, 'sine', 0.40, 0.26, 0.32);
    }

    // 4. Clique tátil nos botões e abas
    function playClick() {
      if (!enabled) return;
      initCtx();
      playTone(750, 'sine', 0.035, 0.0, 0.09);
    }

    // 5. Fanfarra de Vitória (Aprovada no Simulado / Módulo com >= 70%!)
    function playVictory() {
      if (!enabled) return;
      initCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        playTone(freq, 'triangle', 0.15, i * 0.1, 0.22);
      });
      setTimeout(() => {
        playTone(1046.50, 'sine', 0.65, 0, 0.35);
        playTone(1318.51, 'triangle', 0.65, 0, 0.25);
      }, 450);
    }

    // 6. Game Over (Sem corações restantes)
    function playGameOver() {
      if (!enabled) return;
      initCtx();
      playTone(330, 'sine', 0.22, 0.0, 0.22);
      playTone(293, 'sine', 0.22, 0.2, 0.22);
      playTone(261, 'sine', 0.22, 0.4, 0.22);
      playTone(220, 'sine', 0.55, 0.6, 0.26);
    }

    // 7. Meta Diária Cumprida / Conquista (Sino cintilante de vitória diária)
    function playGoal() {
      if (!enabled) return;
      initCtx();
      playTone(587.33, 'triangle', 0.12, 0.0, 0.22); // D5
      playTone(739.99, 'triangle', 0.12, 0.1, 0.24); // F#5
      playTone(880.00, 'triangle', 0.15, 0.2, 0.25); // A5
      playTone(1174.66, 'sine', 0.50, 0.3, 0.32); // D6
    }

    // 8. Incentivo / Tente Novamente (< 70% de acertos)
    function playEncourage() {
      if (!enabled) return;
      initCtx();
      playTone(440.00, 'sine', 0.18, 0.0, 0.2); // A4
      playTone(493.88, 'sine', 0.18, 0.14, 0.2); // B4
      playTone(523.25, 'sine', 0.35, 0.28, 0.24); // C5
    }

    // 9. Ganho de Moeda / Estrela / XP Pop
    function playCoin() {
      if (!enabled) return;
      initCtx();
      playTone(987.77, 'sine', 0.08, 0.0, 0.16); // B5
      playTone(1318.51, 'sine', 0.28, 0.07, 0.24); // E6
    }

    // 10. Perda de Vida / Coração quebrado
    function playHeartLost() {
      if (!enabled) return;
      initCtx();
      playTone(330, 'sawtooth', 0.08, 0.0, 0.12);
      playTone(220, 'sine', 0.22, 0.06, 0.2);
    }

    function toggle() {
      enabled = !enabled;
      try {
        localStorage.setItem('treina_detran_sound_enabled', enabled ? '1' : '0');
      } catch (e) {}
      if (enabled) {
        initCtx();
        playTone(659.25, 'sine', 0.08, 0.0, 0.2);
        playTone(880.00, 'sine', 0.2, 0.09, 0.24);
      }
      return enabled;
    }

    function isEnabled() {
      return enabled;
    }

    return {
      initCtx,
      playCorrect,
      playWrong,
      playStreak,
      playClick,
      playVictory,
      playGameOver,
      playGoal,
      playEncourage,
      playCoin,
      playHeartLost,
      toggle,
      isEnabled
    };
  })();

  // ══ ESTADO GLOBAL ═══════════════════════════════════
  let state = {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    dailyAnswered: 0,
    dailyGoal: 10,
    moduleStats: {},
    completedModules: new Set(),
    lastPlayed: null,
    bestSimuladoScore: 0,
    desafioShown: false,
    sessionHistory: [],  // Histórico de treinos / simulados concluídos
    recentAnswers: []    // Histórico detalhado das últimas respostas
  };

  let quizState = {
    moduleId: null,
    questions: [],
    currentIndex: 0,
    lives: MAX_LIVES,
    correct: 0,
    wrong: 0,
    wrongItems: [],
    answered: false,
    isSimulado: false,
    sessionStreak: 0,
  };

  // ══ ARMAZENAMENTO LOCAL ═════════════════════════════
  function saveState() {
    try {
      const toSave = {
        ...state,
        completedModules: [...state.completedModules],
        sessionHistory: state.sessionHistory || [],
        recentAnswers: (state.recentAnswers || []).slice(0, 50)
      };
      localStorage.setItem('treina_detran_state', JSON.stringify(toSave));
    } catch (e) {
      console.warn('Erro ao salvar state:', e);
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem('treina_detran_state');
      if (!raw) return;
      const saved = JSON.parse(raw);
      state = {
        ...state,
        ...saved,
        completedModules: new Set(saved.completedModules || []),
        sessionHistory: saved.sessionHistory || [],
        recentAnswers: saved.recentAnswers || []
      };
    } catch (e) {
      console.warn('Erro ao carregar state:', e);
    }
  }

  // ══ INICIALIZAÇÃO ═══════════════════════════════════
  function init() {
    loadState();
    checkDailyReset();
    createParticles();
    renderModulesGrid();
    updateHeaderStats();
    updateDailyGoal();
    updateWeakAlert();
    updateGreeting();
    updateThermometerHome();
    renderPegadinhas();
    updateSoundIcons(Sound.isEnabled());
  }

  function checkDailyReset() {
    const today = new Date().toDateString();
    if (state.lastPlayed !== today) {
      state.dailyAnswered = 0;
      state.lastPlayed = today;
      saveState();
    }
  }

  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 5 + 3;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 4}s;
        opacity: ${Math.random() * 0.4 + 0.1};
      `;
      container.appendChild(p);
    }
  }

  function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Bora treinar hoje? 💪';
    if (hour < 12) greeting = 'Bom dia! Bora treinar cedo? 🌅';
    else if (hour < 18) greeting = 'Boa tarde! Hora de treinar! ☀️';
    else greeting = 'Boa noite! Treino noturno? 🌙';

    const el = document.getElementById('greeting-text');
    if (el) el.textContent = greeting;

    const weakTopics = getWeakTopics();
    const sub = document.getElementById('greeting-sub');
    if (sub) {
      sub.textContent = weakTopics.length > 0
        ? 'Identificamos matérias recomendadas para você revisar!'
        : 'Treine com questões da prova, descubra onde erra e chegue aprovada.';
    }
  }

  function updateThermometerHome() {
    const el = document.getElementById('thermo-score-home');
    if (el) {
      el.textContent = state.bestSimuladoScore > 0
        ? `${state.bestSimuladoScore}/52`
        : '—/52';
    }
  }

  // ══ RENDERIZAÇÃO DOS MÓDULOS ════════════════════════
  function renderModulesGrid() {
    const grid = document.getElementById('modules-grid');
    if (!grid || typeof MODULES === 'undefined') return;
    grid.innerHTML = '';

    MODULES.forEach(mod => {
      const stats = state.moduleStats[mod.id] || { correct: 0, wrong: 0, attempts: 0 };
      const total = stats.correct + stats.wrong;
      const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
      const isCompleted = state.completedModules.has(mod.id);
      const isWeak = pct < 60 && total >= 3;

      const card = document.createElement('div');
      card.className = 'module-card';
      if (card.style?.setProperty) card.style.setProperty('--mod-color', mod.color);
      card.onclick = () => {
        Sound.initCtx();
        Sound.playClick();
        startModule(mod.id);
      };

      let badge = '';
      if (isWeak) badge = `<div class="module-badge" style="background:#FF4545;color:#fff">REVISAR</div>`;
      else if (isCompleted) badge = `<div class="module-badge" style="background:#22D45A;color:#000">✓ OK</div>`;

      const stars = getModuleStars(pct);
      const starHtml = stars > 0 ? `<div class="module-stars">${'⭐'.repeat(stars)}</div>` : '';

      const iconMarkup = mod.iconImg
        ? `<div class="module-icon-wrap">
             <img src="${mod.iconImg}" alt="${mod.name}" class="module-icon-img" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';" />
             <span class="module-icon" style="display:none">${mod.icon}</span>
           </div>`
        : `<span class="module-icon">${mod.icon}</span>`;

      const qCount = (typeof QUESTIONS !== 'undefined' && QUESTIONS[mod.id])
        ? QUESTIONS[mod.id].length
        : 10;

      card.innerHTML = `
        ${badge}
        ${starHtml}
        ${iconMarkup}
        <div class="module-name">${mod.name}</div>
        <div class="module-questions">${qCount} questões</div>
        <div class="module-progress">
          <div class="module-prog-bar">
            <div class="module-prog-fill" style="width:${pct}%;background:${mod.color}"></div>
          </div>
          <div class="module-prog-text">${total > 0 ? pct + '% de acerto' : 'Não iniciado'}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function getModuleStars(pct) {
    if (pct >= 90) return 3;
    if (pct >= 70) return 2;
    if (pct >= 50) return 1;
    return 0;
  }

  // ══ INICIAR TREINO / SIMULADO COM PRIORIZAÇÃO DE IMAGENS ══
  function startModule(moduleId) {
    Sound.initCtx();
    Sound.playClick();

    if (typeof MODULES === 'undefined' || typeof QUESTIONS === 'undefined') return;
    const mod = MODULES.find(m => m.id === moduleId);
    if (!mod || !QUESTIONS[moduleId]) return;

    const allQ = [...QUESTIONS[moduleId]];

    // 🎯 PRIORIZA QUESTÕES COM IMAGENS PRIMEIRO
    const withImg = shuffle(allQ.filter(q => !!q.image));
    const withoutImg = shuffle(allQ.filter(q => !q.image));
    const prioritized = [...withImg, ...withoutImg].slice(0, QUESTIONS_PER_MODULE);

    quizState = {
      moduleId,
      questions: prioritized,
      currentIndex: 0,
      lives: MAX_LIVES,
      correct: 0,
      wrong: 0,
      wrongItems: [],
      answered: false,
      isSimulado: false,
      sessionStreak: 0,
    };

    const modNameEl = document.getElementById('quiz-module-name');
    if (modNameEl) modNameEl.textContent = mod.name;

    renderLives();
    renderQuestion();
    showScreen('screen-quiz');
  }

  function startSimulado() {
    Sound.initCtx();
    Sound.playClick();

    if (typeof QUESTIONS === 'undefined') return;

    // Coleta questões de todos os módulos
    let all = [];
    Object.keys(QUESTIONS).forEach(moduleId => {
      const q = QUESTIONS[moduleId].map(item => ({ ...item, moduleId }));
      all = all.concat(q);
    });

    const targetCount = Math.min(SIMULADO_QUESTIONS_COUNT, all.length);

    // 🎯 PRIORIZA QUESTÕES COM IMAGENS PRIMEIRO
    const withImg = shuffle(all.filter(q => !!q.image));
    const withoutImg = shuffle(all.filter(q => !q.image));
    const prioritized = [...withImg, ...withoutImg].slice(0, targetCount);

    quizState = {
      moduleId: 'simulado',
      questions: prioritized,
      currentIndex: 0,
      lives: MAX_LIVES,
      correct: 0,
      wrong: 0,
      wrongItems: [],
      answered: false,
      isSimulado: true,
      sessionStreak: 0,
    };

    const modNameEl = document.getElementById('quiz-module-name');
    if (modNameEl) modNameEl.textContent = 'Simulado Termômetro (52 Q)';

    renderLives();
    renderQuestion();
    showScreen('screen-quiz');
  }

  function startSimuladoFromDesafio() {
    hideAllOverlays();
  }

  function dismissDesafio() {
    hideAllOverlays();
  }

  // ══ RENDERIZAÇÃO DA QUESTÃO ═════════════════════════
  function renderQuestion() {
    const { questions, currentIndex } = quizState;
    if (currentIndex >= questions.length) {
      endQuiz();
      return;
    }

    const q = questions[currentIndex];
    const total = questions.length;

    // Barra de progresso
    const pct = Math.round((currentIndex / total) * 100);
    const fillEl = document.getElementById('quiz-progress-fill');
    if (fillEl) fillEl.style.width = pct + '%';

    const progTextEl = document.getElementById('quiz-progress-text');
    if (progTextEl) progTextEl.textContent = `${currentIndex + 1}/${total}`;

    const numEl = document.getElementById('question-number');
    if (numEl) numEl.textContent = `Questão ${currentIndex + 1}`;

    // Tag do módulo
    const modId = q.moduleId || quizState.moduleId;
    const mod = (typeof MODULES !== 'undefined') ? MODULES.find(m => m.id === modId) : null;
    const tagEl = document.getElementById('question-tag');
    if (tagEl) {
      tagEl.textContent = mod ? mod.name : 'Simulado DETRAN';
      if (tagEl.style?.setProperty) tagEl.style.setProperty('--tag-color', mod ? mod.color : 'var(--primary)');
    }

    // Texto da questão
    const textEl = document.getElementById('question-text');
    if (textEl) textEl.textContent = q.text;

    // A imagem fica oculta antes do usuário responder para não dar spoiler
    const fbImgWrap = document.getElementById('feedback-img-wrap');
    if (fbImgWrap) {
      fbImgWrap.style.display = 'none';
      const fbImg = document.getElementById('feedback-img');
      if (fbImg) fbImg.src = '';
    }

    // Sequência atual
    const streakEl = document.getElementById('current-streak');
    if (streakEl) streakEl.textContent = quizState.sessionStreak;

    // Lista de opções
    const optList = document.getElementById('options-list');
    if (!optList) return;
    optList.innerHTML = '';
    quizState.answered = false;

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.id = `option-${i}`;
      btn.innerHTML = `
        <span class="option-letter">${letters[i]}</span>
        <span class="option-text">${opt}</span>
      `;
      btn.onclick = () => selectAnswer(i, q);
      optList.appendChild(btn);
    });

    // Oculta painel de feedback
    const fp = document.getElementById('feedback-panel');
    if (fp) {
      fp.style.display = 'none';
      fp.className = 'feedback-panel';
    }

    // Animação suave
    const card = document.getElementById('question-card');
    if (card) {
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = 'fadeIn 0.25s ease';
    }

    // Rola para o topo da questão
    const quizBody = document.getElementById('quiz-body');
    if (quizBody) quizBody.scrollTop = 0;
  }

  // ══ SELEÇÃO DE RESPOSTA & HISTÓRICO ═════════════════
  function selectAnswer(selectedIndex, q) {
    if (quizState.answered) return;
    quizState.answered = true;
    Sound.initCtx();

    const isCorrect = selectedIndex === q.correct;
    const buttons = document.querySelectorAll('.option-btn');

    buttons.forEach(btn => (btn.disabled = true));

    // Estilos visuais
    if (buttons[selectedIndex]) {
      buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    }
    if (!isCorrect && buttons[q.correct]) {
      buttons[q.correct].classList.add('correct');
    }

    // EFEITO SONORO GAMIFICADO!
    if (isCorrect) {
      if (quizState.sessionStreak >= 2) {
        Sound.playStreak();
      } else {
        Sound.playCorrect();
      }
    } else {
      Sound.playWrong();
      setTimeout(() => Sound.playHeartLost(), 120);
    }

    // Identificação do módulo
    const mid = q.moduleId || quizState.moduleId;
    const mod = (typeof MODULES !== 'undefined') ? MODULES.find(m => m.id === mid) : null;
    const modName = mod ? mod.name : 'Simulado Oficial';

    // 💾 GRAVAÇÃO NO HISTÓRICO DE RESPOSTAS DO USUÁRIO
    const now = new Date();
    const answerLog = {
      id: Date.now() + Math.random(),
      questionText: q.text,
      moduleName: modName,
      userAnswer: q.options[selectedIndex],
      correctAnswer: q.options[q.correct],
      isCorrect: isCorrect,
      explanation: q.explanation,
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    if (!state.recentAnswers) state.recentAnswers = [];
    state.recentAnswers.unshift(answerLog);
    if (state.recentAnswers.length > 60) state.recentAnswers.pop();

    // Atualização de métricas
    if (isCorrect) {
      quizState.correct++;
      quizState.sessionStreak++;
      state.streak = Math.max(state.streak, quizState.sessionStreak);
      state.bestStreak = Math.max(state.bestStreak, quizState.sessionStreak);

      const bonusIdx = Math.min(quizState.sessionStreak, XP_STREAK_BONUS.length - 1);
      const xpEarned = XP_CORRECT + XP_STREAK_BONUS[bonusIdx];
      state.xp += xpEarned;
      showXpPopup(xpEarned, quizState.sessionStreak);
    } else {
      quizState.wrong++;
      quizState.sessionStreak = 0;
      quizState.lives--;

      quizState.wrongItems.push({
        question: q.text,
        yourAnswer: q.options[selectedIndex],
        correctAnswer: q.options[q.correct],
        moduleId: mid,
      });
    }

    state.totalAnswered++;
    state.totalCorrect += isCorrect ? 1 : 0;
    state.dailyAnswered++;

    // Celebração de Meta Diária Batida!
    if (state.dailyAnswered === state.dailyGoal) {
      setTimeout(() => {
        Sound.playGoal();
      }, 700);
    }

    // Estatísticas por módulo
    if (mid && mid !== 'simulado') {
      if (!state.moduleStats[mid]) state.moduleStats[mid] = { correct: 0, wrong: 0, attempts: 0 };
      state.moduleStats[mid].attempts++;
      if (isCorrect) state.moduleStats[mid].correct++;
      else state.moduleStats[mid].wrong++;
    }

    saveState();
    updateHeaderStats();
    updateDailyGoal();
    renderLives();
    showFeedback(isCorrect, q);

    // Se acabaram as vidas
    if (quizState.lives <= 0 && !isCorrect) {
      setTimeout(() => {
        showGameOver();
      }, 1600);
    }
  }

  // ══ FEEDBACK DETALHADO E DIDÁTICO ═══════════════════
  function showFeedback(isCorrect, q) {
    const panel = document.getElementById('feedback-panel');
    if (!panel) return;

    panel.className = 'feedback-panel ' + (isCorrect ? 'is-correct' : 'is-wrong');
    panel.style.display = 'flex';

    const iconEl = document.getElementById('feedback-icon');
    if (iconEl) iconEl.textContent = isCorrect ? '✅' : '❌';

    const titleEl = document.getElementById('feedback-title');
    if (titleEl) {
      titleEl.textContent = isCorrect
        ? getCorrectMessage()
        : 'Atenção! Você marcou a alternativa errada:';
    }

    const textEl = document.getElementById('feedback-text');
    if (textEl) {
      let expl = q.explanation || '';
      textEl.innerHTML = `
        <div class="feedback-explanation">
          <p>${expl}</p>
        </div>
      `;
    }

    // 📸 REVELA A IMAGEM DE REFERÊNCIA APENAS DEPOIS QUE O USUÁRIO RESPONDE
    const fbImgWrap = document.getElementById('feedback-img-wrap');
    const fbImg = document.getElementById('feedback-img');
    if (fbImgWrap && fbImg) {
      if (q.image) {
        fbImg.src = q.image;
        fbImgWrap.style.display = 'flex';
      } else {
        fbImgWrap.style.display = 'none';
        fbImg.src = '';
      }
    }

    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function getCorrectMessage() {
    const msgs = [
      'Correto! Resposta certeira! 🎯',
      'Boa! Você acertou! 🚀',
      'Perfeito! Conhecimento de gabarito! 💪',
      'Excelente! Ponto para sua CNH! ⭐',
      'Isso aí! Sem cair na pegadinha! 🔥',
      'Mandou muito bem! 🏆',
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  function nextQuestion() {
    Sound.playClick();
    if (quizState.lives <= 0) {
      showGameOver();
      return;
    }
    quizState.currentIndex++;
    renderQuestion();
  }

  function renderLives() {
    const container = document.getElementById('lives-display');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < MAX_LIVES; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart-icon';
      heart.textContent = i < quizState.lives ? '❤️' : '🖤';
      container.appendChild(heart);
    }
  }

  function showXpPopup(xp, streak) {
    setTimeout(() => {
      Sound.playCoin();
    }, 180);
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = streak >= 3 ? `+${xp} XP 🔥` : `+${xp} XP`;

    const quizBody = document.getElementById('quiz-body');
    const rect = quizBody ? quizBody.getBoundingClientRect() : { left: 200, top: 200, width: 300 };
    popup.style.left = (rect.left + rect.width / 2 - 35) + 'px';
    popup.style.top = (rect.top + 80) + 'px';

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
  }

  // ══ FIM DO QUIZ / TELA DE RESULTADOS ════════════════
  function endQuiz() {
    const { correct, wrong, wrongItems, isSimulado, moduleId } = quizState;
    const total = correct + wrong;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    if (pct >= 70 && !isSimulado && moduleId) {
      state.completedModules.add(moduleId);
    }

    if (isSimulado && correct > state.bestSimuladoScore) {
      state.bestSimuladoScore = correct;
      updateThermometerHome();
    }

    const mod = (typeof MODULES !== 'undefined') ? MODULES.find(m => m.id === moduleId) : null;
    const sessionTitle = isSimulado ? 'Simulado Oficial (52 Q)' : (mod ? mod.name : 'Módulo de Treino');

    // 💾 GRAVA SESSÃO CONCLUÍDA NO HISTÓRICO
    const sessionRecord = {
      id: Date.now(),
      title: sessionTitle,
      correct: correct,
      total: total,
      pct: pct,
      date: new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isSimulado: isSimulado
    };

    if (!state.sessionHistory) state.sessionHistory = [];
    state.sessionHistory.unshift(sessionRecord);
    if (state.sessionHistory.length > 30) state.sessionHistory.pop();

    const newStars = getModuleStars(pct);
    saveState();

    // Fanfarra sonora se aprovada ou som de incentivo
    if (pct >= 70) {
      Sound.playVictory();
    } else {
      Sound.playEncourage();
    }

    // Preenche estatísticas do resultado
    const rsCorrect = document.getElementById('rs-correct');
    if (rsCorrect) rsCorrect.textContent = correct;

    const rsWrong = document.getElementById('rs-wrong');
    if (rsWrong) rsWrong.textContent = wrong;

    const rsXp = document.getElementById('rs-xp');
    if (rsXp) rsXp.textContent = `+${correct * XP_CORRECT}`;

    const rsPct = document.getElementById('rs-pct');
    if (rsPct) rsPct.textContent = pct + '%';

    // Título e emojis
    let emoji, title, subtitle;
    if (pct >= 90) {
      emoji = '🏆';
      title = 'GABARITOU! Incrível!';
      subtitle = 'Você está 100% pronta para ser aprovada na prova oficial do DETRAN!';
    } else if (pct >= 70) {
      emoji = '🎉';
      title = 'APROVADA!';
      subtitle = 'Desempenho aprovado! Você já passa na nota de corte do DETRAN.';
    } else if (pct >= 50) {
      emoji = '📚';
      title = 'Quase lá!';
      subtitle = 'Mais uma rodada de treino neste módulo e você atinge os 70%.';
    } else {
      emoji = '💡';
      title = 'Vamos treinar mais!';
      subtitle = 'Revise os conteúdos das questões erradas e tente novamente.';
    }

    const resEmoji = document.getElementById('result-emoji');
    if (resEmoji) resEmoji.textContent = emoji;

    const resTitle = document.getElementById('result-title');
    if (resTitle) resTitle.textContent = title;

    const resSub = document.getElementById('result-subtitle');
    if (resSub) resSub.textContent = subtitle;

    // Estrelas animadas com som gamificado
    ['star1', 'star2', 'star3'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) {
        el.className = 'star';
        if (i < newStars) {
          setTimeout(() => {
            el.classList.add('lit');
            Sound.playCoin();
          }, 350 + i * 280);
        }
      }
    });

    // Painel do termômetro (no simulado de 52)
    const thermoCard = document.getElementById('thermo-result-card');
    if (isSimulado && thermoCard) {
      thermoCard.style.display = 'flex';
      const scoreEl = document.getElementById('thermo-result-score');
      if (scoreEl) scoreEl.textContent = `${correct}/52`;

      let thermoMsg = 'Continue treinando!';
      if (correct >= 50) thermoMsg = 'GABARITANDO! Nível máximo de aprovação! 🏆';
      else if (correct >= 44) thermoMsg = 'Excelente! Acima de 85% de acertos na prova real. 🚀';
      else if (correct >= 37) thermoMsg = 'Aprovada! Acima dos 70% mínimos exigidos pelo DETRAN. 💪';
      else if (correct >= 30) thermoMsg = 'Na trave! Mais alguns treinos e você garante a aprovação. ⚠️';
      else thermoMsg = 'Abaixo da média da prova. Foque nos módulos e nas pegadinhas!';

      const msgEl = document.getElementById('thermo-result-msg');
      if (msgEl) msgEl.textContent = thermoMsg;

      setTimeout(() => {
        const barFill = document.getElementById('thermo-bar-fill');
        if (barFill) barFill.style.width = Math.min((correct / 52) * 100, 100) + '%';
      }, 500);
    } else if (thermoCard) {
      thermoCard.style.display = 'none';
    }

    // Revisão das questões erradas
    const wrongReview = document.getElementById('wrong-review');
    const wrongList = document.getElementById('wrong-list');
    if (wrongReview && wrongList) {
      if (wrongItems.length > 0) {
        wrongReview.style.display = 'block';
        wrongList.innerHTML = wrongItems.map(w => `
          <div class="wrong-item">
            <strong>❓ ${w.question}</strong><br/>
            <span style="color:var(--accent-red)">Sua resposta: ${w.yourAnswer}</span><br/>
            <span style="color:var(--accent-green);font-weight:600">Resposta correta: ${w.correctAnswer}</span>
          </div>
        `).join('');
      } else {
        wrongReview.style.display = 'none';
      }
    }

    showScreen('screen-result');
  }

  // ══ GAME OVER E OVERLAYS ════════════════════════════
  function showGameOver() {
    Sound.playGameOver();
    showOverlay('overlay-gameover');
  }

  function retryModule() {
    Sound.playClick();
    hideAllOverlays();
    if (quizState.isSimulado) {
      startSimulado();
    } else if (quizState.moduleId) {
      startModule(quizState.moduleId);
    } else {
      showScreen('screen-home');
    }
  }

  function exitQuiz() {
    Sound.playClick();
    hideAllOverlays();
    showScreen('screen-home');
    renderModulesGrid();
    updateWeakAlert();
  }

  function closeLevelUp() {
    Sound.playClick();
    hideAllOverlays();
  }

  function showOverlay(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }

  function hideAllOverlays() {
    document.querySelectorAll('.overlay').forEach(o => (o.style.display = 'none'));
  }

  // ══ ESTATÍSTICAS E HISTÓRICO ════════════════════════
  function renderStats() {
    const xpEl = document.getElementById('sc-xp');
    if (xpEl) xpEl.textContent = state.xp;

    const corrEl = document.getElementById('sc-correct');
    if (corrEl) corrEl.textContent = state.totalCorrect;

    const streakEl = document.getElementById('sc-streak');
    if (streakEl) streakEl.textContent = state.bestStreak;

    const totEl = document.getElementById('sc-total');
    if (totEl) totEl.textContent = state.totalAnswered;

    // Desempenho por módulo
    const list = document.getElementById('module-stats-list');
    if (list && typeof MODULES !== 'undefined') {
      list.innerHTML = '';
      MODULES.forEach(mod => {
        const stats = state.moduleStats[mod.id] || { correct: 0, wrong: 0, attempts: 0 };
        const total = stats.correct + stats.wrong;
        const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;

        const item = document.createElement('div');
        item.className = 'module-stat-item';
        item.innerHTML = `
          <div class="msi-header">
            <div class="msi-name">${mod.icon} ${mod.name}</div>
            <div class="msi-pct" style="color:${mod.color}">${total > 0 ? pct + '%' : '—'}</div>
          </div>
          <div class="msi-bar-track">
            <div class="msi-bar-fill" style="background:${mod.color};width:${pct}%"></div>
          </div>
        `;
        list.appendChild(item);
      });
    }

    // Pontos fracos
    const weakList = document.getElementById('weak-areas-list');
    if (weakList) {
      weakList.innerHTML = '';
      const weakTopics = getWeakTopics();
      if (weakTopics.length === 0) {
        weakList.innerHTML = `
          <p style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px">
            🎯 Nenhum ponto fraco crítico detectado ainda! Continue respondendo aos simulados.
          </p>`;
      } else {
        weakTopics.forEach(({ mod, pct }) => {
          const item = document.createElement('div');
          item.className = 'weak-area-item';
          item.innerHTML = `
            <span class="icon">${mod.icon}</span>
            <div class="wai-info">
              <h4>${mod.name}</h4>
              <p>${pct}% de aproveitamento — recomendado treinar agora</p>
            </div>
          `;
          item.onclick = () => {
            Sound.playClick();
            startModule(mod.id);
          };
          weakList.appendChild(item);
        });
      }
    }

    // 🕒 RENDERIZAÇÃO DO HISTÓRICO DE TREINOS E RESPOSTAS
    renderHistorySection();
  }

  function renderHistorySection() {
    const historyContainer = document.getElementById('history-list');
    if (!historyContainer) return;
    historyContainer.innerHTML = '';

    const sessions = state.sessionHistory || [];
    const recentAnswers = state.recentAnswers || [];

    if (sessions.length === 0 && recentAnswers.length === 0) {
      historyContainer.innerHTML = `
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-md);padding:20px;text-align:center;">
          <p style="color:var(--text-muted);font-size:13px;">Você ainda não possui treinos registrados. Seus resultados e respostas aparecerão aqui automaticamente após responder!</p>
        </div>
      `;
      return;
    }

    // 1. Sessões Concluídas Recentes
    if (sessions.length > 0) {
      const sessionBlock = document.createElement('div');
      sessionBlock.innerHTML = `<h4 style="font-size:13px;font-weight:700;color:var(--primary-light);margin-bottom:8px;">📊 Treinos Concluídos Recentemente:</h4>`;
      
      sessions.slice(0, 5).forEach(s => {
        const isApproved = s.pct >= 70;
        const card = document.createElement('div');
        card.className = 'history-session-card';
        card.innerHTML = `
          <div class="hsc-top">
            <span class="hsc-title">${s.title}</span>
            <span class="hsc-badge ${isApproved ? 'approved' : 'review'}">${isApproved ? 'Aprovada ✓' : 'Em Treino'}</span>
          </div>
          <div class="hsc-details">
            <span>${s.correct}/${s.total} acertos (${s.pct}%)</span>
            <span>${s.date}</span>
          </div>
        `;
        sessionBlock.appendChild(card);
      });
      historyContainer.appendChild(sessionBlock);
    }

    // 2. Últimas Respostas Registradas
    if (recentAnswers.length > 0) {
      const answersBlock = document.createElement('div');
      answersBlock.style.marginTop = '14px';
      answersBlock.innerHTML = `<h4 style="font-size:13px;font-weight:700;color:var(--primary-light);margin-bottom:8px;">📝 Últimas Questões Respondidas:</h4>`;

      recentAnswers.slice(0, 10).forEach(a => {
        const item = document.createElement('div');
        item.className = 'history-q-item ' + (a.isCorrect ? 'correct' : 'wrong');
        item.innerHTML = `
          <div class="hqi-question">${a.isCorrect ? '✅' : '❌'} <strong>[${a.moduleName}]</strong> ${a.questionText.substring(0, 75)}...</div>
          <div class="hqi-answer">Sua resposta: <em>${a.userAnswer}</em></div>
          ${!a.isCorrect ? `<div class="hqi-answer" style="color:var(--accent-green)">Correta: ${a.correctAnswer}</div>` : ''}
          <div class="hqi-time">${a.date} às ${a.time}</div>
        `;
        answersBlock.appendChild(item);
      });
      historyContainer.appendChild(answersBlock);
    }
  }

  function clearHistory() {
    Sound.playClick();
    if (confirm('Deseja limpar todo o histórico de treinos e respostas salvas?')) {
      state.sessionHistory = [];
      state.recentAnswers = [];
      saveState();
      renderStats();
    }
  }

  function getWeakTopics() {
    if (typeof MODULES === 'undefined') return [];
    return MODULES.filter(mod => {
      const stats = state.moduleStats[mod.id];
      if (!stats) return false;
      const total = stats.correct + stats.wrong;
      if (total < 3) return false;
      const pct = Math.round((stats.correct / total) * 100);
      return pct < 65;
    }).map(mod => {
      const stats = state.moduleStats[mod.id];
      const total = stats.correct + stats.wrong;
      const pct = Math.round((stats.correct / total) * 100);
      return { mod, pct };
    });
  }

  function updateWeakAlert() {
    const weakTopics = getWeakTopics();
    const alert = document.getElementById('weak-alert');
    if (!alert) return;
    if (weakTopics.length > 0) {
      alert.style.display = 'flex';
      const textEl = document.getElementById('weak-topics-text');
      if (textEl) {
        textEl.textContent = weakTopics.map(w => `${w.mod.icon} ${w.mod.name} (${w.pct}%)`).join(', ');
      }
    } else {
      alert.style.display = 'none';
    }
  }

  function updateHeaderStats() {
    const xpEl = document.getElementById('total-xp-display');
    if (xpEl) xpEl.textContent = state.xp + ' XP';

    const streakEl = document.getElementById('streak-display');
    if (streakEl) streakEl.textContent = state.bestStreak;
  }

  function updateDailyGoal() {
    const pct = Math.min((state.dailyAnswered / state.dailyGoal) * 100, 100);
    const bar = document.getElementById('daily-progress-bar');
    const text = document.getElementById('daily-progress-text');
    if (bar) bar.style.width = pct + '%';
    if (text) text.textContent = `${Math.min(state.dailyAnswered, state.dailyGoal)} / ${state.dailyGoal} questões`;
  }

  // ══ CONTROLE DE SOM ═════════════════════════════════
  function toggleSound() {
    const isSoundOn = Sound.toggle();
    updateSoundIcons(isSoundOn);
    if (isSoundOn) {
      Sound.playClick();
    }
  }

  function updateSoundIcons(isSoundOn) {
    document.querySelectorAll('.sound-icon').forEach(el => {
      el.textContent = isSoundOn ? '🔊' : '🔇';
    });
  }

  // ══ PEGADINHAS DO DETRAN ════════════════════════════
  const PEGADINHAS = [
    {
      tag: 'Legislação',
      question: 'O motorista pode usar o celular no viva-voz enquanto dirige?',
      trap: '❌ Armadilha: Muita gente acha que viva-voz libera o uso.',
      answer: '✅ Não! Qualquer manuseio de celular ao volante sem suporte fixo e mãos livres é infração gravíssima.'
    },
    {
      tag: 'Infrações',
      question: 'Parar no semáforo vermelho sobre a faixa de pedestres é permitido se não houver ninguém cruzando?',
      trap: '❌ Armadilha: Parece inofensivo quando não tem pedestre.',
      answer: '✅ Não! É proibido parar sobre a faixa de pedestres em qualquer situação. Infração média.'
    },
    {
      tag: 'Legislação',
      question: 'CNH vencida é diferente de dirigir sem habilitação?',
      trap: '❌ Armadilha: São infrações diferentes com punições leves? Não!',
      answer: '✅ Para o CTB, ambas são infrações gravíssimas com recolhimento do documento e retenção do veículo.'
    },
    {
      tag: 'Placas',
      question: 'A placa “Dê a Preferência” é circular como as outras placas de regulamentação?',
      trap: '❌ Armadilha: A quase totalidade das regulamentações é circular.',
      answer: '✅ Não! É triangular com borda vermelha e vértice para baixo — única placa de regulamentação com esse formato.'
    },
    {
      tag: 'Direção Defensiva',
      question: 'Em caso de aquaplanagem, o correto é frear com força para parar mais rápido?',
      trap: '❌ Armadilha: O reflexo imediato é pisar no freio.',
      answer: '✅ Não! Frear bruscamente trava as rodas e piora a derrapagem. O correto é soltar o acelerador e manter o volante reto.'
    },
    {
      tag: 'Infrações',
      question: 'Os pontos na CNH somem depois de pagar a multa?',
      trap: '❌ Armadilha: Achar que o pagamento quita os pontos.',
      answer: '✅ Não! Os pontos duram 12 meses a contar da data do cometimento da infração, independente do pagamento do boleto.'
    },
    {
      tag: 'Primeiros Socorros',
      question: 'Ao encontrar uma vítima de acidente, devo removê-la do veículo imediatamente para socorrê-la?',
      trap: '❌ Armadilha: Tirar a vítima do carro parece urgente.',
      answer: '✅ Não! Só mova a vítima em caso de risco imediato e fatal (fogo, explosão). Mover sem preparo pode causar paralisia permanente na coluna.'
    },
    {
      tag: 'Legislação',
      question: 'Onde não houver sinalização, a velocidade máxima para automóveis em rodovias de pista simples é 110 km/h?',
      trap: '❌ Armadilha: Confundir o limite de pista simples com o de pista dupla.',
      answer: '✅ Não! Em rodovias de pista simples o limite geral é 100 km/h. O limite de 110 km/h aplica-se às rodovias de pista dupla (Art. 61 do CTB).'
    }
  ];

  function renderPegadinhas() {
    const list = document.getElementById('peg-list');
    if (!list) return;
    list.innerHTML = PEGADINHAS.map((p, i) => `
      <div class="peg-item">
        <div class="peg-item-header">
          <div class="peg-num">${i + 1}</div>
          <div class="peg-tag">${p.tag}</div>
        </div>
        <div class="peg-question">❓ ${p.question}</div>
        <div class="peg-trap">${p.trap}</div>
        <div class="peg-answer">${p.answer}</div>
      </div>
    `).join('');
  }

  // ══ NAVEGAÇÃO ENTRE TELAS E ABAS ════════════════════
  function showScreen(screenId) {
    Sound.initCtx();
    Sound.playClick();
    hideAllOverlays();

    document.querySelectorAll('.screen').forEach(s => {
      s.style.display = 'none';
      s.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.style.display = 'flex';
      target.classList.add('active');
    }

    // Sincroniza abas do rodapé
    let activeTab = 'home';
    if (screenId === 'screen-stats') activeTab = 'stats';
    else if (screenId === 'screen-pegadinhas') activeTab = 'pegadinhas';

    updateNavTabs(activeTab);

    // Atualizações específicas por tela
    if (screenId === 'screen-home') {
      renderModulesGrid();
      updateHeaderStats();
      updateDailyGoal();
      updateWeakAlert();
      updateGreeting();
      updateThermometerHome();
    } else if (screenId === 'screen-stats') {
      renderStats();
    } else if (screenId === 'screen-pegadinhas') {
      renderPegadinhas();
    }

    // Scroll para o topo
    window.scrollTo(0, 0);
  }

  function showTab(tab) {
    Sound.playClick();
    if (tab === 'home') {
      showScreen('screen-home');
    } else if (tab === 'stats') {
      showScreen('screen-stats');
    } else if (tab === 'pegadinhas') {
      showScreen('screen-pegadinhas');
    }
  }

  function updateNavTabs(activeTab) {
    document.querySelectorAll('.bottom-nav').forEach(nav => {
      nav.querySelectorAll('.nav-btn').forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${activeTab}'`)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  }

  // ══ UTILITÁRIOS ═════════════════════════════════════
  function shuffle(arr) {
    const clone = [...arr];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  // ══ API PÚBLICA ═════════════════════════════════════
  return {
    init,
    showScreen,
    showTab,
    startModule,
    startSimulado,
    startSimuladoFromDesafio,
    dismissDesafio,
    nextQuestion,
    exitQuiz,
    retryModule,
    closeLevelUp,
    clearHistory,
    toggleSound,
  };
})();

// Boot quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
