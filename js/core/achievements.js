/**
 * Streak and Achievements Module
 * Tracks workout streaks, personal records, and gamification badges
 */

function calculateStreak(doneObj) {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    if (doneObj[key]) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(doneObj) {
  const sortedDates = Object.keys(doneObj)
    .filter(k => doneObj[k])
    .sort();

  if (sortedDates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function getStreakEmoji(streak) {
  if (streak >= 100) return '🔥🔥🔥';
  if (streak >= 30) return '🔥🔥';
  if (streak >= 7) return '🔥';
  if (streak >= 3) return '⚡';
  return '💪';
}

function checkAchievements(state) {
  const achievements = [];
  const totalWorkouts = Object.keys(state.done).filter(k => state.done[k]).length;
  const currentStreak = calculateStreak(state.done);
  const longestStreak = calculateLongestStreak(state.done);

  // Workout milestones
  const workoutMilestones = [
    { count: 10, badge: '🥉', title: 'Первые 10', desc: '10 тренировок завершено' },
    { count: 50, badge: '🥈', title: 'Полтинник', desc: '50 тренировок завершено' },
    { count: 100, badge: '🥇', title: 'Сотня', desc: '100 тренировок завершено' },
    { count: 250, badge: '💎', title: 'Четверть тысячи', desc: '250 тренировок завершено' },
    { count: 500, badge: '👑', title: 'Король дисциплины', desc: '500 тренировок завершено' },
    { count: 1000, badge: '🏆', title: 'Легенда', desc: '1000 тренировок завершено' }
  ];

  workoutMilestones.forEach(m => {
    if (totalWorkouts >= m.count) {
      achievements.push({ ...m, unlocked: true, category: 'workouts' });
    }
  });

  // Streak achievements
  const streakMilestones = [
    { count: 7, badge: '🔥', title: 'Неделя силы', desc: '7 дней подряд' },
    { count: 14, badge: '🔥🔥', title: 'Две недели', desc: '14 дней подряд' },
    { count: 30, badge: '⭐', title: 'Месяц дисциплины', desc: '30 дней подряд' },
    { count: 60, badge: '⭐⭐', title: 'Два месяца', desc: '60 дней подряд' },
    { count: 100, badge: '💯', title: 'Сотня дней', desc: '100 дней подряд' },
    { count: 365, badge: '🎯', title: 'Год без пропусков', desc: '365 дней подряд' }
  ];

  streakMilestones.forEach(m => {
    if (longestStreak >= m.count) {
      achievements.push({ ...m, unlocked: true, category: 'streak' });
    }
  });

  // Current streak status
  achievements.push({
    badge: getStreakEmoji(currentStreak),
    title: `Текущая серия: ${currentStreak} ${currentStreak === 1 ? 'день' : currentStreak < 5 ? 'дня' : 'дней'}`,
    desc: currentStreak > 0 ? 'Продолжай в том же духе!' : 'Начни новую серию сегодня!',
    unlocked: true,
    category: 'current',
    count: currentStreak
  });

  return achievements;
}

function calculatePersonalRecords(workoutLogs) {
  const prs = {};

  Object.keys(workoutLogs).forEach(date => {
    Object.keys(workoutLogs[date]).forEach(workoutType => {
      const workout = workoutLogs[date][workoutType];
      if (!workout.exercises) return;

      // Handle both array format [{name, sets: [{weight, reps}]}]
      // and object format { 'Exercise Name': [reps...] or [{weight, reps}...] }
      if (Array.isArray(workout.exercises)) {
        // Array format
        workout.exercises.forEach(ex => {
          const name = ex.name;
          if (!prs[name]) {
            prs[name] = { maxWeight: 0, maxReps: 0, maxVolume: 0, date: date };
          }

          const sets = ex.sets || [];
          sets.forEach(set => {
            const weight = set.weight || 0;
            const reps = set.reps || 0;
            const volume = weight * reps;

            if (weight > prs[name].maxWeight) {
              prs[name].maxWeight = weight;
              prs[name].maxWeightDate = date;
            }
            if (reps > prs[name].maxReps) {
              prs[name].maxReps = reps;
              prs[name].maxRepsDate = date;
            }
            if (volume > prs[name].maxVolume) {
              prs[name].maxVolume = volume;
              prs[name].maxVolumeDate = date;
            }
          });
        });
      } else {
        // Object format: { 'Exercise Name': [reps] or [{weight, reps}] }
        Object.keys(workout.exercises).forEach(name => {
          if (!prs[name]) {
            prs[name] = { maxWeight: 0, maxReps: 0, maxVolume: 0, date: date };
          }

          const sets = workout.exercises[name] || [];
          sets.forEach(set => {
            let weight = 0;
            let reps = 0;

            if (typeof set === 'object' && set !== null) {
              weight = set.weight || 0;
              reps = set.reps || 0;
            } else {
              reps = parseInt(set) || 0;
            }

            const volume = weight * reps;

            if (weight > prs[name].maxWeight) {
              prs[name].maxWeight = weight;
              prs[name].maxWeightDate = date;
            }
            if (reps > prs[name].maxReps) {
              prs[name].maxReps = reps;
              prs[name].maxRepsDate = date;
            }
            if (volume > prs[name].maxVolume) {
              prs[name].maxVolume = volume;
              prs[name].maxVolumeDate = date;
            }
          });
        });
      }
    });
  });

  return prs;
}

function isNewPR(exerciseName, weight, reps, currentPRs) {
  if (!currentPRs[exerciseName]) return true;

  const pr = currentPRs[exerciseName];
  const volume = weight * reps;

  return weight > pr.maxWeight || reps > pr.maxReps || volume > pr.maxVolume;
}

if (typeof window !== 'undefined') {
  window.ASCore = window.ASCore || {};
  window.ASCore.achievements = {
    calculateStreak,
    calculateLongestStreak,
    getStreakEmoji,
    checkAchievements,
    calculatePersonalRecords,
    isNewPR
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateStreak,
    calculateLongestStreak,
    getStreakEmoji,
    checkAchievements,
    calculatePersonalRecords,
    isNewPR
  };
}
