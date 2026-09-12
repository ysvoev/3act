// assets/scripts/game.js

(function() {
  document.addEventListener('DOMContentLoaded', init);

  // ==================== ДАННЫЕ ТЕМ ====================
  const themesData = [
    { id: "01", theme: "𓀡 персонаж" },
    { id: "02", theme: "𓀠 ценности" },
    { id: "03", theme: "𓀦 жилье" },
    { id: "04", theme: "𓁎 отношения" },
    { id: "05", theme: "𓁏 травма" },
    { id: "06", theme: "𓀀 ретравма" },
    { id: "07", theme: "𓀧 препятствие" },
    { id: "08", theme: "𓀢 желание" },
    { id: "09", theme: "𓀬 ситуации" },
    { id: "10", theme: "𓀿 конец" },
    { id: "11", theme: "𓀫 сборка" }
  ];

  // ==================== ДАННЫЕ ВОПРОСОВ ====================
  const questionsData = [
    { id: "01", order: "0101", question: "какой пол?" },
    { id: "02", order: "0102", question: "какой возраст?" },
    { id: "03", order: "0103", question: "какая работа?" },
    { id: "04", order: "0104", question: "какое образование?" },
    { id: "05", order: "0105", question: "какое хобби?" },
    { id: "06", order: "0106", question: "какая главная черта характера?" },
    { id: "07", order: "0201", question: "какое отношение к деньгам?" },
    { id: "08", order: "0202", question: "какое отношение к власти?" },
    { id: "09", order: "0203", question: "какое отношение к творчеству?" },
    { id: "10", order: "0204", question: "какое отношение к знаниям?" },
    { id: "11", order: "0205", question: "какое отношение к здоровью?" },
    { id: "12", order: "0206", question: "чего хочет больше всего?" },
    { id: "13", order: "0301", question: "где родился?" },
    { id: "14", order: "0302", question: "где живет?" },
    { id: "15", order: "0303", question: "какое описание жилья?" },
    { id: "16", order: "0304", question: "где хочет жить?" },
    { id: "17", order: "0401", question: "кем является персонажу?" },
    { id: "18", order: "0402", question: "какая степень близости?" },
    { id: "19", order: "0403", question: "кем является персонажу?" },
    { id: "20", order: "0404", question: "какая степень близости?" },
    { id: "21", order: "0405", question: "кем является персонажу?" },
    { id: "22", order: "0406", question: "какая степень близости?" },
    { id: "23", order: "0501", question: "что травмировало?" },
    { id: "24", order: "0502", question: "когда травмировало?" },
    { id: "25", order: "0503", question: "как персонаж отреагировал в момент травмы?" },
    { id: "26", order: "0504", question: "как персонаж относится к травме сейчас?" },
    { id: "27", order: "0601", question: "что ретравмировало?" },
    { id: "28", order: "0602", question: "где ретравмировало?" },
    { id: "29", order: "0603", question: "какое чувство вызвало у персонажа?" },
    { id: "30", order: "0701", question: "что или кто?" },
    { id: "31", order: "0702", question: "где возникает?" },
    { id: "32", order: "0703", question: "цена отказа?" },
    { id: "33", order: "0801", question: "чего не хватает персонажу в рутине?" },
    { id: "34", order: "0802", question: "чего не хватает персонажу фундаментально?" },
    { id: "35", order: "0901", question: "что случилось самое переломное?" },
    { id: "36", order: "0902", question: "что случилось повседневного?" },
    { id: "37", order: "0903", question: "что случилось?" },
    { id: "38", order: "0904", question: "что случилось, когда герой вынужден был действовать?" },
    { id: "39", order: "0905", question: "почему история начиается сейчас?" },
    { id: "40", order: "0906", question: "почему история начиается в этом месте?" },
    { id: "41", order: "1001", question: "что в итоге чувствует персонаж?" },
    { id: "42", order: "1002", question: "какой тип концовки?" },
    { id: "43", order: "1103", question: "что собирает историю?" }
  ];

  // ==================== НАБОРЫ ТЕМ ДЛЯ ИГР ====================
  // Игра 1 — все темы
  const GAME_1_THEMES = ["01","02","03","04","05","06","07","08","09","10","11"];

  // Игра 2 — только сюжет
  const GAME_2_THEMES = ["05","06","07","08","09","10","11"];

  // Игра 3 — только персонаж
  const GAME_3_THEMES = ["01","02","03","04"];

  const GAMES = {
    "1": GAME_1_THEMES,
    "2": GAME_2_THEMES,
    "3": GAME_3_THEMES
  };

  // =========================================================

  let themes = [];
  let questions = [];        // вопросы текущей игры
  let answersMap = new Map(); // order -> answer
  let shuffledIndices = [];
  let currentQuestionIndex = 0;

  let currentPlainText = '';

  let rulesBlock, gameBlock, resultsBlock;
  let nextBtn, copyBtn, resetBtn;
  let questionEl, numberEl, answerTextarea, resultsEl, themeEl;

  let copyTimeout = null;

  function escapeHtml(unsafe) {
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function init() {
    themes = themesData;

    rulesBlock   = document.getElementById('rules');
    gameBlock    = document.getElementById('game');
    resultsBlock = document.getElementById('results');
    nextBtn      = document.getElementById('next');
    copyBtn      = document.getElementById('copy');
    resetBtn     = document.getElementById('reset');
    questionEl   = document.getElementById('question');
    numberEl     = document.getElementById('number');
    themeEl      = document.getElementById('theme');
    answerTextarea = document.getElementById('answer');
    resultsEl    = document.querySelector('#results .results');

    if (!rulesBlock || !gameBlock || !resultsBlock || !nextBtn || !copyBtn || !resetBtn ||
        !questionEl || !numberEl || !themeEl || !answerTextarea || !resultsEl) {
      console.error('Не найдены необходимые элементы DOM.');
      return;
    }

    updateGameCounts();

    showScreen('rules');

    document.getElementById('start-1').addEventListener('click', () => startGame('1'));
    document.getElementById('start-2').addEventListener('click', () => startGame('2'));
    document.getElementById('start-3').addEventListener('click', () => startGame('3'));

    nextBtn.addEventListener('click', nextQuestion);
    copyBtn.addEventListener('click', handleCopy);
    resetBtn.addEventListener('click', resetGame);

    document.addEventListener('keydown', handleEnterKey);
  }

  function updateGameCounts() {
    Object.keys(GAMES).forEach(gameId => {
      const el = document.getElementById('count-' + gameId);
      if (!el) return;
      el.textContent = getQuestionsForGame(gameId).length;
    });
  }

  function showScreen(screen) {
    rulesBlock.classList.add('none');
    gameBlock.classList.add('none');
    resultsBlock.classList.add('none');

    if (screen === 'rules') {
      rulesBlock.classList.remove('none');
    } else if (screen === 'game') {
      gameBlock.classList.remove('none');
      answerTextarea.focus();
    } else if (screen === 'results') {
      resultsBlock.classList.remove('none');
    }
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getQuestionsForGame(gameId) {
    const themeIds = GAMES[gameId];
    if (!themeIds) return [];
    return questionsData.filter(q => themeIds.includes(q.order.substring(0, 2)));
  }

  function startGame(gameId) {
    answersMap.clear();
    currentPlainText = '';

    questions = getQuestionsForGame(gameId);

    if (!questions.length) {
      console.error('Нет вопросов для игры', gameId);
      return;
    }

    shuffledIndices = Array.from({ length: questions.length }, (_, i) => i);
    shuffleArray(shuffledIndices);
    currentQuestionIndex = 0;

    showScreen('game');
    updateQuestionDisplay();
  }

  function updateQuestionDisplay() {
    const qIndex = shuffledIndices[currentQuestionIndex];
    const currentQ = questions[qIndex];

    questionEl.textContent = currentQ.question;
    numberEl.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;

    const themeId = currentQ.order.substring(0, 2);
    const themeObj = themes.find(t => t.id === themeId);
    themeEl.textContent = themeObj ? themeObj.theme : '';

    answerTextarea.value = '';
    answerTextarea.focus();
  }

  function nextQuestion() {
    const qIndex = shuffledIndices[currentQuestionIndex];
    const currentQ = questions[qIndex];
    const answer = answerTextarea.value.trim();

    answersMap.set(currentQ.order, answer);

    if (currentQuestionIndex + 1 < shuffledIndices.length) {
      currentQuestionIndex++;
      updateQuestionDisplay();
    } else {
      displayResults();
    }
  }

  // ==================== РЕЗУЛЬТАТЫ ====================
  function displayResults() {
    // какие темы участвуют в текущей игре
    const usedThemeIds = [...new Set(questions.map(q => q.order.substring(0, 2)))].sort();

    const modulesHtml = [];
    const plainParts = [];

    usedThemeIds.forEach(themeId => {
      const themeObj = themes.find(t => t.id === themeId);
      if (!themeObj) return;

      const themeQuestions = questions
        .filter(q => q.order.startsWith(themeId))
        .sort((a, b) => a.order.localeCompare(b.order));

      if (!themeQuestions.length) return;

      // --- HTML одного module ---
      const inner = themeQuestions.map(q => {
        const answer = answersMap.get(q.order) || '';
        return `
          <p class="description">${escapeHtml(q.question)}</p>
          <p>${escapeHtml(answer)}</p>
        `;
      }).join('');

      modulesHtml.push(`
        <div class="module">
          <h3>${escapeHtml(themeObj.theme)}</h3>
          ${inner}
        </div>
      `);

      // --- plain text одного блока ---
      plainParts.push(themeObj.theme);
      plainParts.push('');
      themeQuestions.forEach(q => {
        const answer = answersMap.get(q.order) || '';
        plainParts.push(q.question);
        plainParts.push(answer);
        plainParts.push('');
      });
    });

    // HTML
    resultsEl.innerHTML = `<h2>результаты</h2>${modulesHtml.join('')}`;

    // plain для копирования
    currentPlainText =
      'сценарная игра\n\n' +
      plainParts.join('\n').replace(/\n+$/,'') +
      '\n\nпридумано в ysvoev.ru/3act';

    showScreen('results');
  }

  function handleCopy() {
    navigator.clipboard.writeText(currentPlainText).catch(err => {
      console.error('Не удалось скопировать:', err);
      alert('Не удалось скопировать. Попробуйте вручную.');
    });

    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'скопировано';

    if (copyTimeout) clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copyBtn.textContent = originalText;
      copyTimeout = null;
    }, 2000);
  }

  function resetGame() {
    answersMap.clear();
    currentPlainText = '';

    if (copyTimeout) {
      clearTimeout(copyTimeout);
      copyTimeout = null;
      copyBtn.textContent = 'скопировать';
    }

    showScreen('rules');
  }

  function handleEnterKey(e) {
    if (e.key !== 'Enter') return;
    if (!gameBlock.classList.contains('none')) {
      if (document.activeElement === answerTextarea) e.preventDefault();
      nextQuestion();
    }
  }
})();