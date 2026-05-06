/**
 * Personal Records (PR) Tracker
 * Integrates with workout logging to detect and celebrate new PRs
 */

/* global notify, logAction */

// Initialize PRs in state (only if S exists)
function initPRState() {
  if (window.S && !window.S.personalRecords) {
    window.S.personalRecords = {};
  }
}

// Check for new PRs after workout save
function checkWorkoutPRs(workoutLog) {
  // Ensure state is initialized
  if (!window.S) {
    console.error('State not initialized');
    return [];
  }
  if (!window.ASCore?.achievements?.calculatePersonalRecords) {
    console.warn('Achievements module not loaded');
    return [];
  }

  const newPRs = [];
  const currentPRs = window.S.personalRecords;

  // Calculate PRs from all workout logs
  const allPRs = window.ASCore.achievements.calculatePersonalRecords(window.S.workoutLogs);

  // Compare with previous PRs to find new ones
  Object.keys(allPRs).forEach(exerciseName => {
    const newPR = allPRs[exerciseName];
    const oldPR = currentPRs[exerciseName];

    let isNew = false;
    let prType = '';

    if (!oldPR) {
      // First time doing this exercise
      isNew = true;
      prType = 'first';
    } else {
      // Check for weight PR
      if (newPR.maxWeight > oldPR.maxWeight) {
        isNew = true;
        prType = 'weight';
      }
      // Check for reps PR (at same or higher weight)
      else if (newPR.maxReps > oldPR.maxReps && newPR.maxWeight >= oldPR.maxWeight) {
        isNew = true;
        prType = 'reps';
      }
      // Check for volume PR
      else if (newPR.maxVolume > oldPR.maxVolume) {
        isNew = true;
        prType = 'volume';
      }
    }

    if (isNew) {
      newPRs.push({
        exercise: exerciseName,
        type: prType,
        old: oldPR,
        new: newPR,
        date: workoutLog.date
      });
    }
  });

  // Update stored PRs
  window.S.personalRecords = allPRs;

  return newPRs;
}

// Show PR notification
function showPRNotification(prs) {
  if (!prs || prs.length === 0) return;

  const messages = prs.map(pr => {
    if (pr.type === 'first') {
      return `🎉 Первый раз: ${pr.exercise}!`;
    } else if (pr.type === 'weight') {
      return `💪 Новый рекорд веса: ${pr.exercise} ${pr.new.maxWeight}кг (было ${pr.old.maxWeight}кг)`;
    } else if (pr.type === 'reps') {
      return `🔥 Новый рекорд повторений: ${pr.exercise} ${pr.new.maxReps} повт. (было ${pr.old.maxReps})`;
    } else if (pr.type === 'volume') {
      return `📈 Новый рекорд объёма: ${pr.exercise} ${pr.new.maxVolume}кг (было ${pr.old.maxVolume}кг)`;
    }
  });

  // Show each PR notification
  messages.forEach((msg, i) => {
    setTimeout(() => {
      notify(msg, 'success');
    }, i * 1500);
  });

  // Log to history
  if (prs.length > 0) {
    logAction(`🏆 Установлено ${prs.length} новых рекордов!`);
  }
}

// Render PRs section
function renderPRs() {
  const container = document.getElementById('pr-list');
  if (!container) return;

  const prs = window.S.personalRecords || {};
  const prArray = Object.keys(prs)
    .map(exercise => ({
      exercise,
      ...prs[exercise]
    }))
    .sort((a, b) => b.maxWeight - a.maxWeight);

  if (prArray.length === 0) {
    container.innerHTML = '<p style="font-size:.82em;color:var(--t2);">Начни тренироваться, чтобы установить первые рекорды!</p>';
    return;
  }

  const html = prArray.map(pr => `
    <div style="padding:12px;background:var(--bg3);border-radius:8px;margin-bottom:8px;border-left:3px solid var(--a1);">
      <div style="font-size:.88em;font-weight:600;margin-bottom:6px;color:var(--t1);">${pr.exercise}</div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:.78em;color:var(--t2);">
        <div>
          <span style="color:var(--t3);">Макс. вес:</span>
          <span style="font-weight:700;color:var(--a1);margin-left:4px;">${pr.maxWeight} кг</span>
        </div>
        <div>
          <span style="color:var(--t3);">Макс. повторений:</span>
          <span style="font-weight:700;color:var(--a4);margin-left:4px;">${pr.maxReps}</span>
        </div>
        <div>
          <span style="color:var(--t3);">Макс. объём:</span>
          <span style="font-weight:700;color:var(--a3);margin-left:4px;">${pr.maxVolume} кг</span>
        </div>
      </div>
      <div style="font-size:.72em;color:var(--t3);margin-top:6px;">
        Последнее обновление: ${pr.lastDate || '—'}
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

// Export functions
if (typeof window !== 'undefined') {
  window.initPRState = initPRState;
  window.checkWorkoutPRs = checkWorkoutPRs;
  window.showPRNotification = showPRNotification;
  window.renderPRs = renderPRs;
}
