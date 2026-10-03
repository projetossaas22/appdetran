/**
 * DetranQuiz — app.js
 * Método Gabarita Detran
 * Motor do quiz: XP, vidas, sequência, progresso, análise de pontos fracos, termômetro
 */

const App = (() => {
  'use strict';

  // ══ CONSTANTES ══════════════════════════════════════
  const MAX_LIVES = 5;
  const QUESTIONS_PER_MODULE = 10;
  const SIMULADO_QUESTIONS_COUNT = 52;
  const XP_CORRECT = 10;
  const XP_STREAK_BONUS = [0, 0, 5, 10, 15, 20];
  const WHATSAPP_URL = 'https://wa.me'; // ← Substitua pelo seu link do WhatsApp / checkout

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
    updateWALinks();

    // Mostra o desafio na primeira vez que o usuário entra na home
    if (!state.desafioShown) {
      setTimeout(() => {
        showOverlay('overlay-desafio');
        state.desafioShown = true;
        saveState();
      }, 1400);
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
    else if (hour < 18) greeting = 'Boa tarde! Hora do treino! ☀️';
    else greeting = 'Boa noite! Treino noturno? 🌙';

    const el = document.getElementById('greeting-text');
    if (el) el.textContent = greeting;

    const weakTopics = getWeakTopics();
    const sub = document.getElementById('greeting-sub');
    if (sub) {
      sub.textContent = weakTopics.length > 0
        ? 'Você tem pontos fracos para revisar antes da prova!'
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
      card.style.setProperty('--mod-color', mod.color);
      card.onclick = () => startModule(mod.id);

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

  // ══ INICIAR TREINO / SIMULADO ═══════════════════════
  function startModule(moduleId) {
    if (typeof MODULES === 'undefined' || typeof QUESTIONS === 'undefined') return;
    const mod = MODULES.find(m => m.id === moduleId);
    if (!mod || !QUESTIONS[moduleId]) return;

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

    const modNameEl = document.getElementById('quiz-module-name');
    if (modNameEl) modNameEl.textContent = mod.name;

    renderLives();
    renderQuestion();
    showScreen('screen-quiz');
  }

  function startSimulado() {
    if (typeof QUESTIONS === 'undefined') return;

    // Coleta questões de todos os módulos
    let all = [];
    Object.keys(QUESTIONS).forEach(moduleId => {
      const q = QUESTIONS[moduleId].map(item => ({ ...item, moduleId }));
      all = all.concat(q);
    });

    const targetCount = Math.min(SIMULADO_QUESTIONS_COUNT, all.length);
    const shuffled = shuffle(all).slice(0, targetCount);

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

    const modNameEl = document.getElementById('quiz-module-name');
    if (modNameEl) modNameEl.textContent = 'Simulado Termômetro (52 Q)';

    renderLives();
    renderQuestion();
    showScreen('screen-quiz');
  }

  function startSimuladoFromDesafio() {
    hideAllOverlays();
    startSimulado();
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

    // Barra de progresso do quiz
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
      tagEl.style.setProperty('--tag-color', mod ? mod.color : 'var(--primary)');
    }

    // Texto da questão
    const textEl = document.getElementById('question-text');
    if (textEl) textEl.textContent = q.text;

    // Imagem se houver
    const imgWrap = document.getElementById('question-img-wrap');
    const img = document.getElementById('question-img');
    if (imgWrap && img) {
      if (q.image) {
        img.src = q.image;
        imgWrap.style.display = 'block';
      } else {
        imgWrap.style.display = 'none';
        img.src = '';
      }
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

    // Animação suave do card da questão
    const card = document.getElementById('question-card');
    if (card) {
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = 'fadeIn 0.25s ease';
    }

    // Rola o quiz para o topo ao mudar de questão
    const quizBody = document.getElementById('quiz-body');
    if (quizBody) quizBody.scrollTop = 0;
  }

  // ══ SELEÇÃO DE RESPOSTA ═════════════════════════════
  function selectAnswer(selectedIndex, q) {
    if (quizState.answered) return;
    quizState.answered = true;

    const isCorrect = selectedIndex === q.correct;
    const buttons = document.querySelectorAll('.option-btn');

    buttons.forEach(btn => (btn.disabled = true));

    // Estilos visuais de acerto / erro
    if (buttons[selectedIndex]) {
      buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'wrong');
    }
    if (!isCorrect && buttons[q.correct]) {
      buttons[q.correct].classList.add('correct');
    }

    // Atualização das métricas
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
        moduleId: q.moduleId || quizState.moduleId,
      });
    }

    state.totalAnswered++;
    state.totalCorrect += isCorrect ? 1 : 0;
    state.dailyAnswered++;

    // Estatísticas por módulo
    const mid = q.moduleId || quizState.moduleId;
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

    // Se acabou as vidas
    if (quizState.lives <= 0 && !isCorrect) {
      setTimeout(() => {
        showGameOver();
      }, 1600);
    }
  }

  function showFeedback(isCorrect, q) {
    const panel = document.getElementById('feedback-panel');
    if (!panel) return;

    panel.className = 'feedback-panel ' + (isCorrect ? 'is-correct' : 'is-wrong');
    panel.style.display = 'flex';

    const iconEl = document.getElementById('feedback-icon');
    if (iconEl) iconEl.textContent = isCorrect ? '✅' : '❌';

    const titleEl = document.getElementById('feedback-title');
    if (titleEl) titleEl.textContent = isCorrect ? getCorrectMessage() : 'Resposta incorreta';

    const textEl = document.getElementById('feedback-text');
    if (textEl) textEl.textContent = q.explanation;

    // Rola até o feedback para garantir visibilidade no celular
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function getCorrectMessage() {
    const msgs = [
      'Correto! 🎯',
      'Boa! Você acertou! 🚀',
      'Perfeito! 💪',
      'Excelente! ⭐',
      'Isso aí! Continue assim! 🔥',
      'Mandou muito bem! 🏆',
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  function nextQuestion() {
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

    const newStars = getModuleStars(pct);
    saveState();

    // Preenche estatísticas
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
      subtitle = 'Você está 100% pronta para a prova real do DETRAN!';
    } else if (pct >= 70) {
      emoji = '🎉';
      title = 'APROVADA!';
      subtitle = 'Desempenho aprovado! Mantenha o ritmo até o dia da prova.';
    } else if (pct >= 50) {
      emoji = '📚';
      title = 'Quase lá!';
      subtitle = 'Mais um pouco de treino e você atinge a nota de corte (70%).';
    } else {
      emoji = '💡';
      title = 'Vamos treinar mais!';
      subtitle = 'Revise os conteúdos recomendados e tente novamente.';
    }

    const resEmoji = document.getElementById('result-emoji');
    if (resEmoji) resEmoji.textContent = emoji;

    const resTitle = document.getElementById('result-title');
    if (resTitle) resTitle.textContent = title;

    const resSub = document.getElementById('result-subtitle');
    if (resSub) resSub.textContent = subtitle;

    // Estrelas animadas
    ['star1', 'star2', 'star3'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) {
        el.className = 'star';
        if (i < newStars) {
          setTimeout(() => el.classList.add('lit'), 300 + i * 250);
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
      if (correct >= 50) thermoMsg = 'GABARITANDO! Você está no nível máximo de aprovação! 🏆';
      else if (correct >= 44) thermoMsg = 'Excelente! Acima de 85% de acertos na prova real. 🚀';
      else if (correct >= 37) thermoMsg = 'Aprovada! Acima dos 70% mínimos do DETRAN. 💪';
      else if (correct >= 30) thermoMsg = 'Na trave! Precisa de mais algumas questões para garantir. ⚠️';
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
    showOverlay('overlay-gameover');
  }

  function retryModule() {
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
    hideAllOverlays();
    showScreen('screen-home');
    renderModulesGrid();
    updateWeakAlert();
  }

  function closeLevelUp() {
    hideAllOverlays();
  }

  function showOverlay(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'flex';
  }

  function hideAllOverlays() {
    document.querySelectorAll('.overlay').forEach(o => (o.style.display = 'none'));
  }

  // ══ ESTATÍSTICAS E PONTOS FRACOS ════════════════════
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
            🎯 Nenhum ponto fraco crítico detectado ainda! Continue respondendo simulados.
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
          item.onclick = () => startModule(mod.id);
          weakList.appendChild(item);
        });
      }
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

  // ══ PEGADINHAS DO DETRAN ════════════════════════════
  const PEGADINHAS = [
    {
      tag: 'Legislação',
      question: 'O motorista pode usar o celular no viva-voz enquanto dirige?',
      trap: '❌ Armadilha: Muita gente acha que viva-voz libera o uso.',
      answer: '✅ Não! Qualquer uso de celular ao volante sem suporte fixo e mãos livres é infração gravíssima.'
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
      question: 'Em rodovias de pista simples, a velocidade máxima para automóveis é 120 km/h?',
      trap: '❌ Armadilha: Confundir o limite de pista simples com o de pista dupla.',
      answer: '✅ Não! Em pista simples o limite é 100 km/h. 120 km/h é exclusivo para rodovias de pista dupla.'
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
  };
})();

// Boot quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
