/**
 * Enhanced Dashboard Functions
 * Integrates achievements, sleep tracking, and improved metrics
 */

/* global notify, saveLocal, refreshAll */

// Initialize sleep logs in state (only if S exists)
function initDashboardState() {
  if (window.S && !window.S.sleepLogs) {
    window.S.sleepLogs = {};
  }
}

// Save sleep log
function saveSleepLog() {
  // Ensure state is initialized
  if (!window.S) {
    console.error('State not initialized');
    return;
  }
  const date = document.getElementById('sleep-date')?.value;
  const hours = document.getElementById('sleep-hours')?.value;
  const quality = document.getElementById('sleep-quality')?.value;
  const fatigue = document.getElementById('sleep-fatigue')?.value;
  const soreness = document.getElementById('sleep-soreness')?.value;
  const notes = document.getElementById('sleep-notes')?.value;

  if (!date) {
    notify('⚠️ Выбери дату');
    return;
  }

  const entry = window.ASCore.recovery.validateSleepEntry({
    date,
    hours: parseFloat(hours) || 0,
    quality: parseInt(quality) || 5,
    fatigue: parseInt(fatigue) || 5,
    soreness: parseInt(soreness) || 0,
    notes
  });

  window.S.sleepLogs[date] = entry;
  saveLocal();

  renderEnhancedDashboard();
  notify('✅ Запись о сне сохранена!');

  // Clear form
  document.getElementById('sleep-hours').value = '';
  document.getElementById('sleep-quality').value = '';
  document.getElementById('sleep-fatigue').value = '';
  document.getElementById('sleep-soreness').value = '';
  document.getElementById('sleep-notes').value = '';
}

// Render enhanced dashboard
function renderEnhancedDashboard() {
  if (!window.ASCore?.achievements || !window.ASCore?.recovery) {
    console.warn('Core modules not loaded yet');
    return;
  }

  // Calculate streak
  const currentStreak = window.ASCore.achievements.calculateStreak(window.S.done);
  const longestStreak = window.ASCore.achievements.calculateLongestStreak(window.S.done);
  const streakEmoji = window.ASCore.achievements.getStreakEmoji(currentStreak);

  // Update streak display
  const streakEl = document.getElementById('streak-current');
  if (streakEl) streakEl.textContent = currentStreak;

  const longestEl = document.getElementById('streak-longest');
  if (longestEl) longestEl.textContent = longestStreak;

  const messageEl = document.getElementById('streak-message');
  if (messageEl) {
    if (currentStreak === 0) {
      messageEl.textContent = 'Начни новую серию сегодня!';
    } else if (currentStreak < 7) {
      messageEl.textContent = `${streakEmoji} Продолжай! До недели осталось ${7 - currentStreak} ${7 - currentStreak === 1 ? 'день' : 'дня'}`;
    } else if (currentStreak < 30) {
      messageEl.textContent = `${streakEmoji} Отлично! До месяца осталось ${30 - currentStreak} дней`;
    } else {
      messageEl.textContent = `${streakEmoji} Невероятно! Ты на пути к легенде!`;
    }
  }

  // Update quick stats
  const totalWorkouts = Object.keys(window.S.done).filter(k => window.S.done[k]).length;
  const totalEl = document.getElementById('dash-total-workouts');
  if (totalEl) totalEl.textContent = totalWorkouts;

  // Week count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  let weekCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = d.toISOString().split('T')[0];
    if (window.S.done[key]) weekCount++;
  }
  const weekEl = document.getElementById('dash-week-count');
  if (weekEl) weekEl.textContent = weekCount;

  // Recovery score
  const todayKey = today.toISOString().split('T')[0];
  const todaySleep = window.S.sleepLogs[todayKey];
  if (todaySleep) {
    const score = window.ASCore.recovery.calculateRecoveryScore(todaySleep);
    const status = window.ASCore.recovery.getRecoveryStatus(score);
    const scoreEl = document.getElementById('dash-recovery-score');
    if (scoreEl) scoreEl.textContent = `${status.emoji} ${score}`;
  }

  // Sleep debt
  const sleepDebt = window.ASCore.recovery.calculateSleepDebt(window.S.sleepLogs, 7);
  const debtEl = document.getElementById('dash-sleep-debt');
  if (debtEl) debtEl.textContent = sleepDebt.toFixed(1);

  // Render achievements
  renderAchievements();

  // Render recent sleep logs
  renderRecentSleepLogs();

  // Check for deload recommendation
  checkDeloadRecommendation();
}

// Render achievements
function renderAchievements() {
  const achievements = window.ASCore.achievements.checkAchievements(window.S);
  const container = document.getElementById('achievements-list');
  if (!container) return;

  const html = achievements
    .filter(a => a.unlocked && a.category !== 'current')
    .slice(0, 8) // Show top 8
    .map(a => `
      <div style="text-align:center;padding:12px;background:var(--bg3);border-radius:8px;border:1px solid rgba(0,212,255,.2);">
        <div style="font-size:2em;margin-bottom:4px;">${a.badge}</div>
        <div style="font-size:.75em;font-weight:600;margin-bottom:2px;">${a.title}</div>
        <div style="font-size:.68em;color:var(--t3);">${a.desc}</div>
      </div>
    `)
    .join('');

  container.innerHTML = html || '<p style="font-size:.82em;color:var(--t2);grid-column:1/-1;">Начни тренироваться, чтобы получить первые достижения!</p>';
}

// Render recent sleep logs
function renderRecentSleepLogs() {
  const container = document.getElementById('recent-sleep-logs');
  if (!container) return;

  const logs = Object.keys(window.S.sleepLogs)
    .sort()
    .reverse()
    .slice(0, 7);

  if (logs.length === 0) {
    container.innerHTML = '<p style="font-size:.82em;color:var(--t2);">Нет записей. Добавь первую!</p>';
    return;
  }

  const html = logs.map(date => {
    const log = window.S.sleepLogs[date];
    const score = window.ASCore.recovery.calculateRecoveryScore(log);
    const status = window.ASCore.recovery.getRecoveryStatus(score);

    return `
      <div style="padding:10px;background:var(--bg3);border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <div style="font-size:.85em;font-weight:600;margin-bottom:4px;">${new Date(date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}</div>
          <div style="font-size:.75em;color:var(--t2);">
            ⏰ ${log.hours}ч | ⭐ ${log.quality}/10 | 😴 ${log.fatigue}/10 | 💪 ${log.soreness}/10
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.2em;margin-bottom:2px;">${status.emoji}</div>
          <div style="font-size:.75em;color:var(--t2);">${score}</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

// Check deload recommendation
function checkDeloadRecommendation() {
  if (!window.S.sleepLogs || !window.S.workoutLogs) return;

  const needsDeload = window.ASCore.recovery.shouldDeload(
    window.S.sleepLogs,
    window.S.workoutLogs,
    7
  );

  if (needsDeload) {
    notify('⚠️ Рекомендуется deload неделя! Признаки перетренированности.', 'warning');
  }
}

// Set today's date on sleep form
function initSleepForm() {
  const dateInput = document.getElementById('sleep-date');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.initDashboardState = initDashboardState;
  window.saveSleepLog = saveSleepLog;
  window.renderEnhancedDashboard = renderEnhancedDashboard;
  window.initSleepForm = initSleepForm;
}
