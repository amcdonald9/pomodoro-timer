document.addEventListener('DOMContentLoaded', () => {
  // ====== Global Variables ======
  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const statusText = document.getElementById('status-text');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const progressIndicator = document.getElementById('progress-indicator');
  const volumeSlider = document.getElementById('volume-slider');
  const quoteDisplay = document.getElementById('quote-display');

  const workDuration = 25 * 60;
  const breakDuration = 5 * 60;
  let isBreak = false;
  let timer;
  let timeLeft = workDuration;
  let startTime;
  let sessionCount = 0;
  let volume = 0.5;
  let dailyResetKey = 'lastResetDate';

  // ====== Motivational Quotes ======
  const quotes = [
    "You’re capable of amazing things.",
    "Discipline is choosing what you want most over what you want now.",
    "Keep going. You're getting there.",
    "Progress, not perfection.",
    "Stay focused and never give up.",
    "Do your best today!",
    "One Pomodoro at a time.",
    "Stay strong. Finish strong.",
    "You're doing great!",
    "Greatness takes time and effort."
  ];

  function showRandomQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    if (quoteDisplay) quoteDisplay.textContent = quote;
  }

  // ====== Load/Save State ======
  function saveState() {
    localStorage.setItem('isBreak', isBreak);
    localStorage.setItem('timeLeft', timeLeft);
    localStorage.setItem('sessionCount', sessionCount);
    localStorage.setItem('startTime', startTime || '');
  }

  function loadState() {
    if (localStorage.getItem('timeLeft')) {
      isBreak = localStorage.getItem('isBreak') === 'true';
      timeLeft = parseInt(localStorage.getItem('timeLeft'), 10);
      sessionCount = parseInt(localStorage.getItem('sessionCount'), 10);
      startTime = localStorage.getItem('startTime') || null;
    }
  }

  // ====== Timer Display ======
  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
    statusText.textContent = isBreak ? 'Break time' : 'Work session';
    updateProgress();
  }

  function updateProgress() {
    const total = isBreak ? breakDuration : workDuration;
    const percent = timeLeft / total;
    const dashOffset = 829 * percent;
    progressIndicator.style.strokeDashoffset = dashOffset;
  }

  // ====== Timer Logic ======
  function startTimer() {
    if (!startTime) startTime = Date.now();
    timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const total = isBreak ? breakDuration : workDuration;
      timeLeft = total - elapsed;

      if (timeLeft <= 0) {
        clearInterval(timer);
        dingSound();
        switchMode();
      }

      updateDisplay();
      saveState();
    }, 1000);

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function pauseTimer() {
    clearInterval(timer);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const total = isBreak ? breakDuration : workDuration;
    timeLeft = total - elapsed;
    startTime = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  function resetTimer() {
    clearInterval(timer);
    timeLeft = isBreak ? breakDuration : workDuration;
    startTime = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    updateDisplay();
    saveState();
  }

  // ====== Session Switching ======
  function switchMode() {
    isBreak = !isBreak;
    timeLeft = isBreak ? breakDuration : workDuration;
    startTime = null;
    if (!isBreak) {
      sessionCount += 1;
      showRandomQuote();
    }
    updateDisplay();
    saveState();
    startTimer();
  }

  // ====== Sound Notification ======
  function dingSound() {
    const chime = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
    chime.volume = volume;
    chime.play();
  }

  // ====== Dark Mode ======
  darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
      darkModeToggle.textContent = "Light Mode";
    } else {
      darkModeToggle.textContent = "Dark Mode";
    }
  });

  // ====== Volume Control ======
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      volume = e.target.value;
    });
  }

  // ====== Reset Daily Counter ======
  function resetDailySessionCount() {
    const today = new Date().toLocaleDateString();
    if (localStorage.getItem(dailyResetKey) !== today) {
      sessionCount = 0;
      localStorage.setItem(dailyResetKey, today);
    }
  }

  // ====== Init ======
  function init() {
    loadState();
    resetDailySessionCount();
    updateDisplay();
    showRandomQuote();
  }

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  init();
});
