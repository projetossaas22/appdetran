/**
 * DetranQuiz — app.js
 * Método Gabarita Detran
 * Motor do quiz: XP, vidas, sequência, progresso, análise de pontos fracos, termômetro
 */

const App = (() => {
  'use strict';

  // ══ STATE ══════════════════════════════════════════
  const MAX_LIVES = 5;
  const QUESTIONS_PER_MODULE = 10;
  const XP_CORRECT = 10;
  const XP_STREAK_BONUS = [0, 0, 5, 10, 15, 20];
  const WHATSAPP_URL = 'https://wa.me'; // ← substitua pelo link real do WhatsApp

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
    bestSimuladoScore: 0,  // melhor pontuação no quiz de 52
    desafioShown: false,
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

  // ══ STORAGE ════════════════════════════════════════
  function saveState() {
    const toSave = {
      ...state,
      completedModules: [...state.completedModules]
    };
    localStorage.setItem('treina_detran_state', JSON.stringify(toSave));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem('treina_detran_state');
      if (!raw) return;
      const saved = JSON.parse(raw);
      state = {
        ...state,
        ...saved,
        completedModules: new Set(saved.completedModules || [])
      };
    } catch (e) {
      console.warn('Erro ao carregar state:', e);
    }
  }

  // ══ INIT ═══════════════════════════════════════════
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
    updateWALinks();

    // Mostra o desafio na primeira vez que o usuário entra na home
    if (!state.desafioShown) {
      setTimeout(() => {
        document.getElementById('overlay-desafio').style.display = 'flex';
        state.desafioShown = true;
        saveState();
      }, 1200);
    }
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
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 2;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -10px;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 5}s;
        opacity: ${Math.random() * 0.5};
      `;
      container.appendChild(p);
    }
  }

  function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Bora treinar hoje? 💪';
    if (hour < 12) greeting = 'Bom dia! Bora treinar cedo? 🌅';
    else if (hour < 18) greeting = 'Boa tarde! Hora do treino! ☀️';
    else greeting = 'Boa noite! Treino noturno? 🌙';

    const el = document.getElementById('greeting-text');
    if (el) el.textContent = greeting;

    const weakTopics = getWeakTopics();
    const sub = document.getElementById('greeting-sub');
    if (sub) {
      sub.textContent = weakTopics.length > 0
        ? `Você tem pontos fracos para melhorar!`
        : 'Treine, descubra onde erra e chegue aprovada.';
    }
  }

  function updateWALinks() {
    document.querySelectorAll('#btn-whatsapp, .btn-whatsapp').forEach(el => {
      el.href = WHATSAPP_URL;
    });
  }

  function updateThermometerHome() {
    const el = document.getElementById('thermo-score-home');
    if (el) {
      el.textContent = state.bestSimuladoScore > 0
        ? `${state.bestSimuladoScore}/52`
        : '—/52';
    }
  }

  // ══ RENDER MODULES ═════════════════════════════════
  function renderModulesGrid() {
    const grid = document.getElementById('modules-grid');
    if (!grid) return;
    grid.innerHTML = '';

    MODULES.forEach(mod => {
      const stats = state.moduleStats[mod.id] || { correct: 0, wrong: 0, attempts: 0 };
      const total = stats.correct + stats.wrong;
      const pct = total > 0 ? Math.round((stats.correct / total) * 100) : 0;
      const isCompleted = state.completedModules.has(mod.id);
      const isWeak = pct < 60 && total > 0;

      const card = document.createElement('div');
      card.className = 'module-card';
      card.style.setProperty('--mod-color', mod.color);
      card.onclick = () => startModule(mod.id);

      let badge = '';
      if (isWeak) badge = `<div class="module-badge" style="background:#FFD700;color:#000">REVISAR</div>`;
      else if (isCompleted) badge = `<div class="module-badge" style="background:#22D45A">✓ OK</div>`;

      const stars = getModuleStars(pct);
      const starHtml = stars > 0 ? `<div class="module-stars">${'⭐'.repeat(stars)}</div>` : '';

      card.innerHTML = `
        ${badge}
        ${starHtml}
        <span class="module-icon">${mod.icon}</span>
        <div class="module-name">${mod.name}</div>
        <div class="module-questions">${QUESTIONS[mod.id].length} questões</div>
        <div class="module-progress">
          <div class="module-prog-bar">
            <div class="module-prog-fill" style="width:${pct}%;background:${mod.color}"></div>
          </div>
          <div class="module-prog-text">${total > 0 ? pct + '% de acerto' : 'Não iniciado'}</div>
        </div>
      `;
      card.querySelector('.module-card, .module-prog-bar')?.setAttribute('style', `--mod-color:${mod.color}`);
      grid.appendChild(card);

      // Animated bar
      requestAnimationFrame(() => {
        const fill = card.querySelector('.module-prog-fill');
        if (fill) fill.style.width = pct + '%';
      });
    });
  }

  function getModuleStars(pct) {
    if (pct >= 90) return 3;
    if (pct >= 70) return 2;
    if (pct >= 50) return 1;
    return 0;
  }

  // ══ START MODULE ═══════════════════════════════════
  function startModule(moduleId) {
    const mod = MODULES.find(m => m.id === moduleId);
    if (!mod) return;

    const allQ = QUESTIONS[moduleId];
    const shuffled = shuffle([...allQ]).slice(0, QUESTIONS_PER_MODULE);

    quizState = {
      moduleId,
      questions: shuffled,
      currentIndex: 0,
      lives: MAX_LIVES,
      correct: 0,
      wrong: 0,
      wrongItems: [],
      answered: false,
      isSimulado: false,
      sessionStreak: 0,
    };

    document.getElementById('quiz-module-name').textContent = mod.name;
    renderLives();
    renderQuestion();
    showScreen('screen-quiz');
  }

  function startSimulado() {
    // Coleta questões de todos os módulos
    let all = [];
    Object.keys(QUESTIONS).forEach(moduleId => {
      const q = QUESTIONS[moduleId].map(q => ({ ...q, moduleId }));
      all = all.concat(q);
    });

    const shuffled = shuffle(all).slice(0, SIMULADO_QUESTIONS_COUNT);

    quizState = {
      moduleId: 'simulado',
      questions: shuffled,
      currentIndex: 0,
      lives: MAX_LIVES,
      correct: 0,
      wrong: 0,
      wrongItems: [],
      answered: false,
      isSimulado: true,
      sessionStreak: 0,
    };

    document.getElementById('quiz-module-name').textContent = 'Simulado Final';
    renderLives();
    renderQuestion();
    showScreen('screen-quiz');
  }

  // ══ QUIZ LOGIC ═════════════════════════════════════
  function renderQuestion() {
    const { questions, currentIndex } = quizState;
    if (currentIndex >= questions.length) {
      endQuiz();
      return;
    }

    const q = questions[currentIndex];
    const total = questions.length;

    // Progress
    const pct = (currentIndex / total) * 100;
    document.getElementById('quiz-progress-fill').style.width = pct + '%';
    document.getElementById('quiz-progress-text').textContent = `${currentIndex}/${total}`;
    document.getElementById('question-number').textContent = `Questão ${currentIndex + 1}`;

    // Module tag
    const modId = q.moduleId || quizState.moduleId;
    const mod = MODULES.find(m => m.id === modId);
    document.getElementById('question-tag').textContent = mod ? mod.name : '';
    document.getElementById('question-tag').style.setProperty('--tag-color', mod ? mod.color : 'var(--primary)');

    document.getElementById('question-text').textContent = q.text;

    // Image if any
    const imgWrap = document.getElementById('question-img-wrap');
    const img = document.getElementById('question-img');
    if (q.image) {
      img.src = q.image;
      imgWrap.style.display = 'block';
    } else {
      imgWrap.style.display = 'none';
    }

    // Streak
    document.getElementById('current-streak').textContent = quizState.sessionStreak;

    // Options
    const optList = document.getElementById('options-list');
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

    // Hide feedback
    const fp = document.getElementById('feedback-panel');
    fp.style.display = 'none';
    fp.className = 'feedback-panel';

    // Card animation
    const card = document.getElementById('question-card');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = '';
  }

  function selectAnswer(selectedIndex, q) {
    if (quizState.answered) return;
    quizState.answered = true;

    const isCorrect = selectedIndex === q.correct;
    const buttons = document.querySelectorAll('.option-btn');

    buttons.forEach(btn => btn.disabled = true);

    // Visual feedback on options
    buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) {
      buttons[q.correct].classList.add('correct');
    }

    // Update stats
    if (isCorrect) {
      quizState.correct++;
      quizState.sessionStreak++;
      state.streak = Math.max(state.streak, quizState.sessionStreak);
      state.bestStreak = Math.max(state.bestStreak, quizState.sessionStreak);

      // XP
      const bonusIdx = Math.min(quizState.sessionStreak, XP_STREAK_BONUS.length - 1);
      const xpEarned = XP_CORRECT + XP_STREAK_BONUS[bonusIdx];
      state.xp += xpEarned;
      showXpPopup(xpEarned, quizState.sessionStreak);
    } else {
      quizState.wrong++;
      quizState.sessionStreak = 0;
      quizState.lives--;

      // Track wrong for weak areas
      quizState.wrongItems.push({
        question: q.text,
        yourAnswer: q.options[selectedIndex],
        correctAnswer: q.options[q.correct],
        moduleId: q.moduleId || quizState.moduleId
      });
    }

    state.totalAnswered++;
    state.totalCorrect += isCorrect ? 1 : 0;
    state.dailyAnswered++;

    // Module stats
    const mid = q.moduleId || quizState.moduleId;
    if (mid !== 'simulado') {
      if (!state.moduleStats[mid]) state.moduleStats[mid] = { correct: 0, wrong: 0, attempts: 0 };
      state.moduleStats[mid].attempts++;
      if (isCorrect) state.moduleStats[mid].correct++;
      else state.moduleStats[mid].wrong++;
    }

    saveState();
    updateHeaderStats();
    updateDailyGoal();
    renderLives();

    // Feedback panel
    showFeedback(isCorrect, q);

    // Game over?
    if (quizState.lives <= 0 && !isCorrect) {
      setTimeout(() => {
        showGameOver();
      }, 2000);
    }
  }

  function showFeedback(isCorrect, q) {
    const panel = document.getElementById('feedback-panel');
    panel.className = 'feedback-panel ' + (isCorrect ? 'is-correct' : 'is-wrong');
    panel.style.display = 'flex';

    document.getElementById('feedback-icon').textContent = isCorrect ? '✅' : '❌';
    document.getElementById('feedback-title').textContent = isCorrect
      ? getCorrectMessage()
      : 'Resposta incorreta';
    document.getElementById('feedback-text').textContent = q.explanation;
  }

  function getCorrectMessage() {
    const msgs = [
      'Correto! 🎯',
      'Boa! Você acertou! 🚀',
      'Perfeito! 💪',
      'Excelente! ⭐',
      'Isso aí! Continue! 🔥',
      'Mandou bem! 🏆'
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  function nextQuestion() {
    quizState.currentIndex++;
    renderQuestion();
  }

  function renderLives() {
    const container = document.getElementById('lives-display');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < MAX_LIVES; i++) {
      const heart = document.createElement('span');
      heart.textContent = i < quizState.lives ? '❤️' : '🖤';
      heart.style.transition = 'transform 0.2s ease';
      if (i === quizState.lives && quizState.lives < MAX_LIVES) {
        heart.style.animation = 'wrongShake 0.4s ease';
      }
      container.appendChild(heart);
    }
  }

  function showXpPopup(xp, streak) {
    const popup = document.createElement('div');
    popup.className = 'xp-popup';
    popup.textContent = streak >= 3 ? `+${xp} XP 🔥` : `+${xp} XP`;

    const rect = document.getElementById('quiz-body')?.getBoundingClientRect() || { left: 200, top: 400 };
    popup.style.left = (rect.left + rect.width / 2 - 30) + 'px';
    popup.style.top = (rect.top + 100) + 'px';

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1300);
  }

  // ══ END QUIZ ═══════════════════════════════════════
  function endQuiz() {
    const { correct, wrong, wrongItems, isSimulado, moduleId } = quizState;
    const total = correct + wrong;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    if (pct >= 70 && !isSimulado) {
      state.completedModules.add(moduleId);
    }

    // Atualiza melhor pontuação do simulado (termômetro)
    if (isSimulado && correct > state.bestSimuladoScore) {
      state.bestSimuladoScore = correct;
    }

    const oldStars = getModuleStars(
      state.moduleStats[moduleId]
        ? Math.round((state.moduleStats[moduleId].correct / (state.moduleStats[moduleId].correct + state.moduleStats[moduleId].wrong)) * 100)
        : 0
    );
    const newStars = getModuleStars(pct);
    const leveledUp = newStars > oldStars && newStars > 0;

    saveState();

    // Fill result screen
    document.getElementById('rs-correct').textContent = correct;
    document.getElementById('rs-wrong').textContent = wrong;
    document.getElementById('rs-xp').textContent = `+${correct * XP_CORRECT}`;
    document.getElementById('rs-pct').textContent = pct + '%';

    // Emoji & title
    let emoji, title, subtitle;
    if (pct >= 90) { emoji = '🏆'; title = 'Nota 10! Incrível!'; subtitle = 'Você está mais que pronta!'; }
    else if (pct >= 70) { emoji = '🎉'; title = 'Aprovada!'; subtitle = 'Ótimo desempenho! Continue assim.'; }
    else if (pct >= 50) { emoji = '📚'; title = 'Quase lá!'; subtitle = 'Mais treino neste módulo e você passa.'; }
    else { emoji = '💡'; title = 'Vamos revisar!'; subtitle = 'Estude mais este conteúdo e tente de novo.'; }

    document.getElementById('result-emoji').textContent = emoji;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-subtitle').textContent = subtitle;

    // Stars with animation
    const starCount = getModuleStars(pct);
    ['star1', 'star2', 'star3'].forEach((id, i) => {
      const el = document.getElementById(id);
      el.className = 'star';
      if (i < starCount) setTimeout(() => el.classList.add('lit'), 400 + i * 300);
    });

    // Painel do termômetro (só no simulado de 52)
    const thermoCard = document.getElementById('thermo-result-card');
    if (isSimulado && thermoCard) {
      thermoCard.style.display = 'flex';
      document.getElementById('thermo-result-score').textContent = `${correct}/52`;

      // Mensagem do termômetro
      let thermoMsg = 'Continue treinando!';
      if (correct >= 52) thermoMsg = 'GABARITOU! Você está mais do que pronta! 🏆';
      else if (correct >= 45) thermoMsg = 'Excelente! Praticamente gabaritando. (~95% na prova)';
      else if (correct >= 40) thermoMsg = 'Ótimo! Quase aprovada com folga. (~80% na prova)';
      else if (correct >= 30) thermoMsg = 'Você está na média. Não pare! (~60% na prova)';
      else thermoMsg = 'Ainda precisa de bastante treino. Vamos lá!';

      document.getElementById('thermo-result-msg').textContent = thermoMsg;

      // Barra
      setTimeout(() => {
        const pctBar = (correct / 52) * 100;
        document.getElementById('thermo-bar-fill').style.width = pctBar + '%';
      }, 600);
    } else if (thermoCard) {
      thermoCard.style.display = 'none';
    }

    // XP bar
    const xpPct = Math.min((state.xp / 1000) * 100, 100);
    setTimeout(() => {
      const xpBar = document.getElementById('xp-bar-result');
      if (xpBar) xpBar.style.width = xpPct + '%';
      const xpVal = document.getElementById('xp-val-result');
      if (xpVal) xpVal.textContent = state.xp + ' XP';
    }, 600);

    // Wrong items review
    if (wrongItems.length > 0) {
      document.getElementById('wrong-review').style.display = 'block';
      const list = document.getElementById('wrong-list');
      list.innerHTML = wrongItems.map(w => `
        <div class="wrong-item">
          <strong>${w.question.substring(0, 70)}...</strong><br/>
          Sua resposta: ${w.yourAnswer}<br/>
          Correta: ${w.correctAnswer}
        </div>
      `).join('');
    } else {
      document.getElementById('wrong-review').style.display = 'none';
    }

    showScreen('screen-result');

    if (leveledUp) {
      setTimeout(() => {
        const mod = MODULES.find(m => m.id === moduleId);
        document.getElementById('levelup-text').textContent =
          `Você subiu para ${newStars} estrela${newStars > 1 ? 's' : ''} em ${mod?.name || moduleId}!`;
        showOverlay('overlay-levelup');
      }, 1500);
    }
  }

  // ══ PEGADINHAS ═══════════════════════════════════════
  const PEGADINHAS = [
    {
      tag: 'Legislação',
      question: 'O motorista pode usar o celular no viva-voz enquanto dirige?',
      trap: '❌ Armadilha: Muita gente acha que viva-voz libera o uso.',
      answer: '✅ Não! Qualquer uso de celular ao volante é infração gravisssima, inclusive viva-voz sem suporte fixo.'
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
      trap: '❌ Armadilha: São coisas diferentes? Não!',
      answer: '✅ Para o CTB, ambas são infrações gravissimas com as mesmas penalidades: multa + veículo recolhido.'
    },
    {
      tag: 'Placas',
      question: 'A placa “Dê a Preferência” é circular como as outras placas de regulamentação?',
      trap: '❌ Armadilha: A maioria das regulamentações é circular.',
      answer: '✅ Não! É triangular com borda vermelha — única placa de regulamentação com esse formato.'
    },
    {
      tag: 'Direção Defensiva',
      question: 'Em caso de aquaplanagem, o correto é frear com força para parar mais rápido?',
      trap: '❌ Armadilha: Instinto natural é frear.',
      answer: '✅ Não! Frear bruscamente piora. Solte o acelerador suavemente e mantenha o volante firme até recuperar aderência.'
    },
    {
      tag: 'Infrações',
      question: 'Os pontos na CNH somem depois de pagar a multa?',
      trap: '❌ Armadilha: Muita gente paga achando que zera os pontos.',
      answer: '✅ Não! Os pontos só somem após 12 meses da data da infração, independente do pagamento da multa.'
    },
    {
      tag: 'Primeiros Socorros',
      question: 'Ao encontrar uma vítima de acidente, devo removê-la do veículo imediatamente para socorrê-la?',
      trap: '❌ Armadilha: Parece que tirar do local é a coisa certa.',
      answer: '✅ Não! Só mova a vítima se houver risco imediato de vida no local (fogo, afogamento). Mover errado pode causar paralisia.'
    },
    {
      tag: 'Legislação',
      question: 'Em rodovias de pista simples, a velocidade máxima para carro é 120 km/h?',
      trap: '❌ Armadilha: Confunde com pista dupla.',
      answer: '✅ Não! Em pista simples o limite é 100 km/h. 120 km/h é o limite apenas em pistas duplas.'
    },
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
    showOverlay('overlay-gameover');
  }

  function showGameOver() {
    showOverlay('overlay-gameover');
  }

  function dismissDesafio() {
    hideAllOverlays();
  }

  function startSimuladoFromDesafio() {
    hideAllOverlays();
    startSimulado();
  }

  function retryModule() {
    hideAllOverlays();
    if (quizState.isSimulado) {
      startSimulado();
    } else {
      startModule(quizState.moduleId);
    }
  }

  function exitQuiz() {
    hideAllOverlays();
    showScreen('screen-home');
    renderModulesGrid();
    updateWeakAlert();
  }

  function closeLevelUp() {
    hideAllOverlays();
  }

  // ══ STATS ══════════════════════════════════════════
  function renderStats() {
    document.getElementById('sc-xp').textContent = state.xp;
    document.getElementById('sc-correct').textContent = state.totalCorrect;
    document.getElementById('sc-streak').textContent = state.bestStreak;
    document.getElementById('sc-total').textContent = state.totalAnswered;

    // Module stats list
    const list = document.getElementById('module-stats-list');
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

    // Weak areas
    const weakList = document.getElementById('weak-areas-list');
    weakList.innerHTML = '';
    const weakTopics = getWeakTopics();
    if (weakTopics.length === 0) {
      weakList.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px">🎯 Nenhum ponto fraco detectado ainda. Continue treinando!</p>';
    } else {
      weakTopics.forEach(({ mod, pct }) => {
        const item = document.createElement('div');
        item.className = 'weak-area-item';
        item.innerHTML = `
          <span class="icon">${mod.icon}</span>
          <div class="wai-info">
            <h4>${mod.name}</h4>
            <p>${pct}% de acerto — recomendado revisar este módulo</p>
          </div>
        `;
        item.onclick = () => { startModule(mod.id); };
        weakList.appendChild(item);
      });
    }
  }

  function getWeakTopics() {
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
      document.getElementById('weak-topics-text').textContent =
        weakTopics.map(w => `${w.mod.icon} ${w.mod.name} (${w.pct}%)`).join(', ');
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

  // ══ NAVIGATION ═════════════════════════════════════
  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
      s.style.display = 'none';
      s.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
      target.style.display = 'flex';
      target.classList.add('active');
    }

    if (screenId === 'screen-home') {
      renderModulesGrid();
      updateHeaderStats();
      updateDailyGoal();
      updateWeakAlert();
    }

    if (screenId === 'screen-stats') {
      renderStats();
    }
  }

  function showTab(tab) {
    if (tab === 'home') {
      showScreen('screen-home');
    } else if (tab === 'stats') {
      showScreen('screen-stats');
    } else if (tab === 'pegadinhas') {
      showScreen('screen-pegadinhas');
    }
  }

  function showOverlay(id) {
    document.getElementById(id).style.display = 'flex';
  }

  function hideAllOverlays() {
    document.querySelectorAll('.overlay').forEach(o => o.style.display = 'none');
  }

  // ══ UTILS ══════════════════════════════════════════
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ══ PUBLIC API ══════════════════════════════════════
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
  };
})();

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
