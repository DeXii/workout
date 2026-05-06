/**
 * Achievements UI Module
 * Renders achievements, streaks, and badges in the UI
 */

function renderStreakCounter() {
  const container = document.getElementById('streak-counter');
  if (!container) return;

  if (!window.ASCore?.achievements) {
    container.innerHTML = '<p style="color:var(--t3);font-size:.8em;">Модуль достижений не загружен</p>';
    return;
  }

  const currentStreak = window.ASCore.achievements.calculateStreak(window.S.done);
  const longestStreak = window.ASCore.achievements.calculateLongestStreak(window.S.done);
  const emoji = window.ASCore.achievements.getStreakEmoji(currentStreak);

  const html = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="card card-sm" style="text-align:center;background:linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.1));border-color:rgba(0,212,255,0.3);">
        <div style="font-size:2.5em;margin-bottom:8px;">${emoji}</div>
        <div style="font-size:1.8em;font-weight:900;color:var(--a1);margin-bottom:4px;">${currentStreak}</div>
        <div style="font-size:.75em;color:var(--t2);text-transform:uppercase;letter-spacing:1px;">Текущая серия</div>
        <div style="font-size:.7em;color:var(--t3);margin-top:6px;">
          ${currentStreak === 1 ? 'день' : currentStreak < 5 ? 'дня' : 'дней'} подряд
        </div>
      </div>

      <div class="card card-sm" style="text-align:center;background:linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.1));border-color:rgba(245,158,11,0.3);">
        <div style="font-size:2.5em;margin-bottom:8px;">🏆</div>
        <div style="font-size:1.8em;font-weight:900;color:var(--a4);margin-bottom:4px;">${longestStreak}</div>
        <div style="font-size:.75em;color:var(--t2);text-transform:uppercase;letter-spacing:1px;">Лучшая серия</div>
        <div style="font-size:.7em;color:var(--t3);margin-top:6px;">
          ${longestStreak === 1 ? 'день' : longestStreak < 5 ? 'дня' : 'дней'} подряд
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderAchievements() {
  const container = document.getElementById('achievements-list');
  if (!container) return;

  if (!window.ASCore?.achievements) {
    container.innerHTML = '<p style="color:var(--t3);font-size:.8em;">Модуль достижений не загружен</p>';
    return;
  }

  const achievements = window.ASCore.achievements.checkAchievements(window.S);

  // Group by category
  const workoutAchievements = achievements.filter(a => a.category === 'workouts');
  const streakAchievements = achievements.filter(a => a.category === 'streak');
  const currentStatus = achievements.find(a => a.category === 'current');

  let html = '';

  // Current status
  if (currentStatus) {
    html += `
      <div class="card" style="background:linear-gradient(135deg, rgba(16,185,129,0.15), rgba(0,212,255,0.15));border-color:rgba(16,185,129,0.4);margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="font-size:2.5em;">${currentStatus.badge}</div>
          <div style="flex:1;">
            <div style="font-size:1.1em;font-weight:700;color:var(--a3);margin-bottom:4px;">${currentStatus.title}</div>
            <div style="font-size:.85em;color:var(--t2);">${currentStatus.desc}</div>
          </div>
        </div>
      </div>
    `;
  }

  // Workout milestones
  if (workoutAchievements.length > 0) {
    html += '<div style="font-size:.9em;font-weight:700;color:var(--t1);margin-bottom:12px;margin-top:8px;">🎯 Тренировки</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:20px;">';

    workoutAchievements.forEach(ach => {
      html += `
        <div class="card card-sm" style="text-align:center;background:var(--bg3);border-color:rgba(0,212,255,0.2);">
          <div style="font-size:2em;margin-bottom:6px;">${ach.badge}</div>
          <div style="font-size:.8em;font-weight:600;color:var(--t1);margin-bottom:3px;">${ach.title}</div>
          <div style="font-size:.7em;color:var(--t3);">${ach.desc}</div>
        </div>
      `;
    });

    html += '</div>';
  }

  // Streak milestones
  if (streakAchievements.length > 0) {
    html += '<div style="font-size:.9em;font-weight:700;color:var(--t1);margin-bottom:12px;">🔥 Серии</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;">';

    streakAchievements.forEach(ach => {
      html += `
        <div class="card card-sm" style="text-align:center;background:var(--bg3);border-color:rgba(245,158,11,0.2);">
          <div style="font-size:2em;margin-bottom:6px;">${ach.badge}</div>
          <div style="font-size:.8em;font-weight:600;color:var(--t1);margin-bottom:3px;">${ach.title}</div>
          <div style="font-size:.7em;color:var(--t3);">${ach.desc}</div>
        </div>
      `;
    });

    html += '</div>';
  }

  if (achievements.length === 0) {
    html = '<p style="font-size:.85em;color:var(--t2);text-align:center;padding:20px;">Начни тренироваться, чтобы получить первые достижения!</p>';
  }

  container.innerHTML = html;
}

function renderProgressiveOverloadRecommendations() {
  const container = document.getElementById('progressive-overload-recommendations');
  if (!container) return;

  if (!window.ASCore?.progressiveOverload || !window.S.personalRecords || !window.S.workoutLogs) {
    container.innerHTML = '<p style="color:var(--t3);font-size:.8em;">Недостаточно данных для рекомендаций</p>';
    return;
  }

  const exercises = Object.keys(window.S.personalRecords).slice(0, 5); // Top 5 exercises
  let html = '';

  exercises.forEach(exerciseName => {
    const recommendation = window.ASCore.progressiveOverload.calculateRecommendedWeight(
      exerciseName,
      window.S.personalRecords,
      window.S.workoutLogs
    );

    if (!recommendation) return;

    const colorClass = recommendation.increment > 0 ? 'var(--a3)' :
                       recommendation.increment < 0 ? 'var(--a5)' : 'var(--t2)';
    const icon = recommendation.increment > 0 ? '📈' :
                 recommendation.increment < 0 ? '📉' : '➡️';

    html += `
      <div class="card card-sm" style="margin-bottom:10px;border-left:3px solid ${colorClass};">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="font-size:1.5em;">${icon}</div>
          <div style="flex:1;">
            <div style="font-size:.88em;font-weight:600;color:var(--t1);margin-bottom:3px;">${exerciseName}</div>
            <div style="font-size:.75em;color:var(--t2);margin-bottom:4px;">
              Текущий: ${recommendation.current}кг → Рекомендуемый: ${recommendation.recommended}кг
            </div>
            <div style="font-size:.72em;color:${colorClass};">${recommendation.reason}</div>
          </div>
        </div>
      </div>
    `;
  });

  if (html === '') {
    html = '<p style="font-size:.85em;color:var(--t2);">Начни тренироваться, чтобы получить рекомендации по весам</p>';
  }

  container.innerHTML = html;
}

function renderPlateauWarnings() {
  const container = document.getElementById('plateau-warnings');
  if (!container) return;

  if (!window.ASCore?.progressiveOverload || !window.S.personalRecords || !window.S.workoutLogs) {
    return;
  }

  const plateaus = window.ASCore.progressiveOverload.getAllPlateaus(
    window.S.personalRecords,
    window.S.workoutLogs,
    2
  );

  if (plateaus.length === 0) {
    container.innerHTML = '';
    return;
  }

  let html = '<div class="card" style="background:rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.3);margin-bottom:16px;">';
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
  html += '<div style="font-size:1.5em;">⚠️</div>';
  html += '<div style="font-size:.95em;font-weight:700;color:var(--a4);">Обнаружено плато</div>';
  html += '</div>';

  plateaus.forEach(plateau => {
    html += `
      <div style="padding:10px;background:var(--bg3);border-radius:8px;margin-bottom:8px;">
        <div style="font-size:.85em;font-weight:600;color:var(--t1);margin-bottom:4px;">${plateau.exercise}</div>
        <div style="font-size:.75em;color:var(--t2);margin-bottom:4px;">
          Нет прогресса ${plateau.weeks} ${plateau.weeks === 1 ? 'неделю' : 'недели'}
        </div>
        <div style="font-size:.72em;color:var(--a4);">💡 ${plateau.suggestion}</div>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Export functions
if (typeof window !== 'undefined') {
  window.renderStreakCounter = renderStreakCounter;
  window.renderAchievements = renderAchievements;
  window.renderProgressiveOverloadRecommendations = renderProgressiveOverloadRecommendations;
  window.renderPlateauWarnings = renderPlateauWarnings;
}
