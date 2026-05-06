/**
 * Sleep and Recovery Tracking Module
 * Tracks sleep quality, hours, fatigue, muscle soreness (DOMS)
 */

function validateSleepEntry(input) {
  const hours = Math.max(0, Math.min(24, Number(input.hours) || 0));
  const quality = Math.max(1, Math.min(10, Number(input.quality) || 5));
  const fatigue = Math.max(1, Math.min(10, Number(input.fatigue) || 5));
  const soreness = Math.max(0, Math.min(10, Number(input.soreness) || 0));
  const notes = String(input.notes || '').trim().slice(0, 500);

  // Fix: if quality is 0 or less, clamp to 1
  const validQuality = input.quality !== undefined && Number(input.quality) <= 0 ? 1 : quality;

  return {
    hours: Math.round(hours * 10) / 10,
    quality: Math.round(validQuality),
    fatigue: Math.round(fatigue),
    soreness: Math.round(soreness),
    notes,
    date: input.date
  };
}

function calculateRecoveryScore(sleepEntry) {
  // Recovery score based on sleep quality, hours, and fatigue
  const optimalHours = 8;
  const hoursScore = Math.min(100, (sleepEntry.hours / optimalHours) * 100);
  const qualityScore = (sleepEntry.quality / 10) * 100;
  const fatigueScore = ((10 - sleepEntry.fatigue) / 10) * 100;
  const sorenessScore = ((10 - sleepEntry.soreness) / 10) * 100;

  // Weighted average
  const score = (
    hoursScore * 0.3 +
    qualityScore * 0.4 +
    fatigueScore * 0.2 +
    sorenessScore * 0.1
  );

  return Math.round(score);
}

function getRecoveryStatus(score) {
  if (score >= 80) return { status: 'excellent', emoji: '💚', text: 'Отличное восстановление' };
  if (score >= 60) return { status: 'good', emoji: '🟢', text: 'Хорошее восстановление' };
  if (score >= 40) return { status: 'moderate', emoji: '🟡', text: 'Среднее восстановление' };
  if (score >= 20) return { status: 'poor', emoji: '🟠', text: 'Плохое восстановление' };
  return { status: 'critical', emoji: '🔴', text: 'Критическое состояние' };
}

function shouldDeload(sleepLogs, workoutLogs, days = 7) {
  // Check if user needs a deload week based on recovery metrics
  const recentDates = Object.keys(sleepLogs)
    .sort()
    .slice(-days);

  if (recentDates.length < days) return false;

  const avgRecovery = recentDates.reduce((sum, date) => {
    const entry = sleepLogs[date];
    const score = calculateRecoveryScore(entry);
    return sum + score;
  }, 0) / recentDates.length;

  const avgSoreness = recentDates.reduce((sum, date) => {
    return sum + (sleepLogs[date].soreness || 0);
  }, 0) / recentDates.length;

  const workoutCount = recentDates.filter(date => workoutLogs[date]).length;

  // Deload if: low recovery + high soreness + high workout frequency
  return avgRecovery < 50 && avgSoreness > 6 && workoutCount >= 5;
}

function getSleepRecommendation(sleepEntry) {
  const recommendations = [];

  if (sleepEntry.hours < 7) {
    recommendations.push('⏰ Спи минимум 7-8 часов для оптимального восстановления');
  }

  if (sleepEntry.quality < 6) {
    recommendations.push('🌙 Улучши качество сна: темная комната, прохладная температура, без экранов за час до сна');
  }

  if (sleepEntry.fatigue > 7) {
    recommendations.push('😴 Высокая усталость - рассмотри легкую тренировку или день отдыха');
  }

  if (sleepEntry.soreness > 7) {
    recommendations.push('💪 Сильная боль в мышцах - добавь растяжку, массаж или активное восстановление');
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Отличные показатели! Продолжай в том же духе');
  }

  return recommendations;
}

function calculateSleepDebt(sleepLogs, days = 7) {
  const optimalHours = 8;
  const recentDates = Object.keys(sleepLogs)
    .sort()
    .slice(-days);

  const totalDebt = recentDates.reduce((debt, date) => {
    const hours = sleepLogs[date]?.hours || 0;
    const deficit = Math.max(0, optimalHours - hours);
    return debt + deficit;
  }, 0);

  return Math.round(totalDebt * 10) / 10;
}

if (typeof window !== 'undefined') {
  window.ASCore = window.ASCore || {};
  window.ASCore.recovery = {
    validateSleepEntry,
    calculateRecoveryScore,
    getRecoveryStatus,
    shouldDeload,
    getSleepRecommendation,
    calculateSleepDebt
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateSleepEntry,
    calculateRecoveryScore,
    getRecoveryStatus,
    shouldDeload,
    getSleepRecommendation,
    calculateSleepDebt
  };
}
