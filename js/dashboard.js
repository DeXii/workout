/**
 * Enhanced Dashboard Module
 * Comprehensive dashboard with key metrics, charts, and quick actions
 */

/* global renderStreakCounter, renderProgressiveOverloadRecommendations, renderPlateauWarnings, nav */

function renderEnhancedDashboard() {
  const container = document.getElementById('dashboard-enhanced');
  if (!container) return;

  let html = '';

  // Header with greeting
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Доброй ночи';
  if (hour >= 5 && hour < 12) greeting = 'Доброе утро';
  else if (hour >= 12 && hour < 18) greeting = 'Добрый день';
  else if (hour >= 18 && hour < 23) greeting = 'Добрый вечер';

  html += `
    <div style="margin-bottom:24px;">
      <h2 style="font-size:1.8em;font-weight:900;background:linear-gradient(90deg,#00d4ff,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;">
        ${greeting}, Аянокоджи
      </h2>
      <p style="font-size:.85em;color:var(--t2);">${now.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  `;

  // Quick stats cards
  html += '<div class="g4" style="margin-bottom:24px;">';

  // Current streak
  if (window.ASCore?.achievements) {
    const currentStreak = window.ASCore.achievements.calculateStreak(window.S.done);
    const emoji = window.ASCore.achievements.getStreakEmoji(currentStreak);
    html += `
      <div class="card card-sm" style="text-align:center;background:linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.1));border-color:rgba(0,212,255,0.3);">
        <div style="font-size:2em;margin-bottom:6px;">${emoji}</div>
        <div style="font-size:1.5em;font-weight:900;color:var(--a1);margin-bottom:2px;">${currentStreak}</div>
        <div style="font-size:.7em;color:var(--t2);text-transform:uppercase;letter-spacing:1px;">Серия</div>
      </div>
    `;
  }

  // Total workouts
  const totalWorkouts = Object.keys(window.S.done || {}).filter(k => window.S.done[k]).length;
  html += `
    <div class="card card-sm" style="text-align:center;background:linear-gradient(135deg, rgba(16,185,129,0.1), rgba(0,212,255,0.1));border-color:rgba(16,185,129,0.3);">
      <div style="font-size:2em;margin-bottom:6px;">💪</div>
      <div style="font-size:1.5em;font-weight:900;color:var(--a3);margin-bottom:2px;">${totalWorkouts}</div>
      <div style="font-size:.7em;color:var(--t2);text-transform:uppercase;letter-spacing:1px;">Тренировок</div>
    </div>
  `;

  // Weekly volume
  const weeklyVolume = calculateWeeklyVolume();
  html += `
    <div class="card card-sm" style="text-align:center;background:linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.1));border-color:rgba(245,158,11,0.3);">
      <div style="font-size:2em;margin-bottom:6px;">📊</div>
      <div style="font-size:1.5em;font-weight:900;color:var(--a4);margin-bottom:2px;">${weeklyVolume}</div>
      <div style="font-size:.7em;color:var(--t2);text-transform:uppercase;letter-spacing:1px;">Объем/неделя</div>
    </div>
  `;

  // Recovery score
  if (window.ASCore?.recovery && window.S.sleepLogs) {
    const today = now.toISOString().split('T')[0];
    const sleepEntry = window.S.sleepLogs[today];
    let recoveryScore = 0;
    let recoveryEmoji = '😴';

    if (sleepEntry) {
      recoveryScore = window.ASCore.recovery.calculateRecoveryScore(sleepEntry);
      const status = window.ASCore.recovery.getRecoveryStatus(recoveryScore);
      recoveryEmoji = status.emoji;
    }

    html += `
      <div class="card card-sm" style="text-align:center;background:linear-gradient(135deg, rgba(124,58,237,0.1), rgba(244,63,143,0.1));border-color:rgba(124,58,237,0.3);">
        <div style="font-size:2em;margin-bottom:6px;">${recoveryEmoji}</div>
        <div style="font-size:1.5em;font-weight:900;color:var(--a2);margin-bottom:2px;">${recoveryScore}%</div>
        <div style="font-size:.7em;color:var(--t2);text-transform:uppercase;letter-spacing:1px;">Восстановление</div>
      </div>
    `;
  }

  html += '</div>';

  // Today's status
  const today = now.toISOString().split('T')[0];
  const todayWorkout = window.S.done?.[today];

  html += '<div class="card" style="margin-bottom:20px;">';
  if (todayWorkout) {
    html += `
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="font-size:2.5em;">✅</div>
        <div style="flex:1;">
          <div style="font-size:1.1em;font-weight:700;color:var(--a3);margin-bottom:4px;">Тренировка выполнена!</div>
          <div style="font-size:.85em;color:var(--t2);">Тип: ${todayWorkout}</div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="font-size:2.5em;">⏰</div>
        <div style="flex:1;">
          <div style="font-size:1.1em;font-weight:700;color:var(--a4);margin-bottom:4px;">Тренировка еще не выполнена</div>
          <div style="font-size:.85em;color:var(--t2);">Не прерывай серию!</div>
        </div>
        <button class="btn btn-p" onclick="nav('workout')">Начать</button>
      </div>
    `;
  }
  html += '</div>';

  // Plateau warnings
  html += '<div id="plateau-warnings"></div>';

  // Progressive overload recommendations
  html += `
    <div class="card" style="margin-bottom:20px;">
      <div style="font-size:.95em;font-weight:700;color:var(--t1);margin-bottom:12px;">📈 Рекомендации по весам</div>
      <div id="progressive-overload-recommendations"></div>
    </div>
  `;

  // Streak counter
  html += `
    <div class="card" style="margin-bottom:20px;">
      <div style="font-size:.95em;font-weight:700;color:var(--t1);margin-bottom:12px;">🔥 Твоя серия</div>
      <div id="streak-counter"></div>
    </div>
  `;

  // Heatmap
  html += `
    <div class="card" style="margin-bottom:20px;">
      <div id="heatmap-year-selector"></div>
      <div id="heatmap-container"></div>
    </div>
  `;

  // Quick actions
  html += `
    <div class="card">
      <div style="font-size:.95em;font-weight:700;color:var(--t1);margin-bottom:12px;">⚡ Быстрые действия</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">
        <button class="btn btn-p btn-sm" onclick="nav('workout')">
          💪 Тренировка
        </button>
        <button class="btn btn-g btn-sm" onclick="nav('journal')">
          📝 Журнал
        </button>
        <button class="btn btn-v btn-sm" onclick="nav('metrics')">
          📊 Метрики
        </button>
        <button class="btn btn-o btn-sm" onclick="nav('analytics')">
          📈 Аналитика
        </button>
        <button class="btn btn-gh btn-sm" onclick="exportAllDataToJSON()">
          💾 Экспорт
        </button>
        <button class="btn btn-gh btn-sm" onclick="nav('settings')">
          ⚙️ Настройки
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Render sub-components
  if (typeof renderStreakCounter === 'function') {
    renderStreakCounter();
  }

  if (typeof renderProgressiveOverloadRecommendations === 'function') {
    renderProgressiveOverloadRecommendations();
  }

  if (typeof renderPlateauWarnings === 'function') {
    renderPlateauWarnings();
  }

  if (window.heatmapModule) {
    const currentYear = new Date().getFullYear();
    window.heatmapModule.renderYearSelector('heatmap-year-selector', currentYear);
    window.heatmapModule.renderHeatmap('heatmap-container', window.S.done, currentYear);
  }
}

function calculateWeeklyVolume() {
  if (!window.S.workoutLogs) return 0;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  let totalVolume = 0;

  Object.keys(window.S.workoutLogs).forEach(date => {
    if (date >= weekAgoStr) {
      const dayWorkouts = window.S.workoutLogs[date];
      Object.values(dayWorkouts).forEach(workout => {
        if (workout.exercises) {
          workout.exercises.forEach(exercise => {
            if (exercise.sets) {
              exercise.sets.forEach(set => {
                totalVolume += (set.weight || 0) * (set.reps || 0);
              });
            }
          });
        }
      });
    }
  });

  return Math.round(totalVolume);
}

function renderWeeklyChart() {
  // Placeholder for weekly progress chart
  // Would use Chart.js to render workout frequency, volume, etc.
}

// Export functions
if (typeof window !== 'undefined') {
  window.renderEnhancedDashboard = renderEnhancedDashboard;
  window.calculateWeeklyVolume = calculateWeeklyVolume;
  window.renderWeeklyChart = renderWeeklyChart;
}
