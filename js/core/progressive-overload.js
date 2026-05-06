/**
 * Progressive Overload Module
 * Calculates recommended weights, detects plateaus, tracks 1RM
 */

function calculate1RM(weight, reps) {
  // Epley formula: 1RM = weight × (1 + reps/30)
  if (reps === 1) return weight;
  if (reps > 12) return weight * (1 + reps / 30); // Less accurate for high reps
  return weight * (1 + reps / 30);
}

function calculateRecommendedWeight(exerciseName, personalRecords, workoutLogs) {
  const pr = personalRecords[exerciseName];
  if (!pr) return null;

  // Get last 3 workouts for this exercise
  const recentSets = [];
  const sortedDates = Object.keys(workoutLogs).sort().reverse().slice(0, 10);

  for (const date of sortedDates) {
    const dayWorkouts = workoutLogs[date];
    Object.values(dayWorkouts).forEach(workout => {
      if (!workout.exercises) return;
      workout.exercises.forEach(ex => {
        if (ex.name === exerciseName && ex.sets) {
          ex.sets.forEach(set => {
            recentSets.push({
              date,
              weight: set.weight || 0,
              reps: set.reps || 0
            });
          });
        }
      });
    });
    if (recentSets.length >= 9) break; // 3 workouts × 3 sets
  }

  if (recentSets.length === 0) return null;

  // Calculate average weight from last workout (most recent sets)
  const lastWorkoutSets = recentSets.slice(0, 3);
  const avgWeight = lastWorkoutSets.reduce((sum, set) => sum + set.weight, 0) / lastWorkoutSets.length;

  // Progressive overload: +2.5kg for upper body, +5kg for lower body
  const lowerBodyExercises = ['Приседания', 'Становая тяга', 'Жим ногами', 'Выпады', 'Squat', 'Deadlift', 'Leg Press'];
  const isLowerBody = lowerBodyExercises.some(ex => exerciseName.toLowerCase().includes(ex.toLowerCase()));
  const increment = isLowerBody ? 5 : 2.5;

  // Check if user hit target reps (8-12) with current weight
  const avgReps = lastWorkoutSets.reduce((sum, set) => sum + set.reps, 0) / lastWorkoutSets.length;

  let recommendation = {
    current: avgWeight,
    recommended: avgWeight,
    reason: 'Продолжай с текущим весом',
    increment: 0
  };

  if (avgReps > 11.5) {
    // User can do 12+ reps - time to increase weight
    recommendation.recommended = avgWeight + increment;
    recommendation.reason = `Увеличь вес на ${increment}кг (делаешь ${Math.round(avgReps)} повторений)`;
    recommendation.increment = increment;
  } else if (avgReps < 6) {
    // Struggling with current weight
    recommendation.recommended = avgWeight - increment;
    recommendation.reason = `Уменьши вес на ${increment}кг (делаешь только ${Math.round(avgReps)} повторений)`;
    recommendation.increment = -increment;
  }

  return recommendation;
}

function detectPlateaus(exerciseName, workoutLogs, weeks = 2) {
  // Check if no progress in last N weeks
  const today = new Date('2026-05-06');
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  const recentSets = [];
  const sortedDates = Object.keys(workoutLogs)
    .filter(date => date >= cutoffStr)
    .sort();

  for (const date of sortedDates) {
    const dayWorkouts = workoutLogs[date];
    Object.values(dayWorkouts).forEach(workout => {
      if (!workout.exercises) return;
      workout.exercises.forEach(ex => {
        if (ex.name === exerciseName && ex.sets) {
          ex.sets.forEach(set => {
            recentSets.push({
              date,
              weight: set.weight || 0,
              reps: set.reps || 0,
              volume: (set.weight || 0) * (set.reps || 0)
            });
          });
        }
      });
    });
  }

  if (recentSets.length < 4) return null; // Need at least 2 workouts with 2 sets each

  // Check if max weight/volume hasn't increased
  const firstHalf = recentSets.slice(0, Math.floor(recentSets.length / 2));
  const secondHalf = recentSets.slice(Math.floor(recentSets.length / 2));

  const maxWeightFirst = Math.max(...firstHalf.map(s => s.weight));
  const maxWeightSecond = Math.max(...secondHalf.map(s => s.weight));
  const maxVolumeFirst = Math.max(...firstHalf.map(s => s.volume));
  const maxVolumeSecond = Math.max(...secondHalf.map(s => s.volume));

  const isPlateauWeight = maxWeightSecond <= maxWeightFirst;
  const isPlateauVolume = maxVolumeSecond <= maxVolumeFirst * 1.05; // Allow 5% variance

  if (isPlateauWeight && isPlateauVolume) {
    return {
      exercise: exerciseName,
      weeks,
      maxWeight: maxWeightSecond,
      suggestion: 'Попробуй deload неделю (снизь вес на 10%) или смени упражнение'
    };
  }

  return null;
}

function getAllPlateaus(personalRecords, workoutLogs, weeks = 2) {
  const plateaus = [];

  Object.keys(personalRecords).forEach(exerciseName => {
    const plateau = detectPlateaus(exerciseName, workoutLogs, weeks);
    if (plateau) {
      plateaus.push(plateau);
    }
  });

  return plateaus;
}

function getProgressionPlan(exerciseName, currentWeight, targetWeight, weeks = 8) {
  // Create a linear progression plan
  const totalIncrease = targetWeight - currentWeight;
  const weeklyIncrease = totalIncrease / weeks;

  const plan = [];
  for (let week = 1; week <= weeks; week++) {
    const weight = currentWeight + (weeklyIncrease * week);
    plan.push({
      week,
      weight: Math.round(weight * 2) / 2, // Round to nearest 0.5kg
      sets: 3,
      reps: week <= 4 ? '8-10' : '6-8' // Higher reps early, lower reps as weight increases
    });
  }

  return plan;
}

function estimateTimeToGoal(exerciseName, currentWeight, targetWeight, personalRecords, workoutLogs) {
  // Estimate weeks needed based on historical progression rate
  const recentSets = [];
  const sortedDates = Object.keys(workoutLogs).sort().slice(-20); // Last 20 workouts

  for (const date of sortedDates) {
    const dayWorkouts = workoutLogs[date];
    Object.values(dayWorkouts).forEach(workout => {
      if (!workout.exercises) return;
      workout.exercises.forEach(ex => {
        if (ex.name === exerciseName && ex.sets) {
          const maxWeight = Math.max(...ex.sets.map(s => s.weight || 0));
          if (maxWeight > 0) {
            recentSets.push({ date, weight: maxWeight });
          }
        }
      });
    });
  }

  if (recentSets.length < 4) {
    // Not enough data - use default progression rate
    const lowerBodyExercises = ['Приседания', 'Становая тяга', 'Жим ногами', 'Squat', 'Deadlift'];
    const isLowerBody = lowerBodyExercises.some(ex => exerciseName.toLowerCase().includes(ex.toLowerCase()));
    const weeklyGain = isLowerBody ? 2.5 : 1.25; // kg per week
    const weeksNeeded = Math.ceil((targetWeight - currentWeight) / weeklyGain);
    return { weeks: weeksNeeded, confidence: 'low' };
  }

  // Calculate actual progression rate
  const firstWeight = recentSets[0].weight;
  const lastWeight = recentSets[recentSets.length - 1].weight;
  const firstDate = new Date(recentSets[0].date);
  const lastDate = new Date(recentSets[recentSets.length - 1].date);
  const daysPassed = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
  const weeksPassed = daysPassed / 7;

  if (weeksPassed < 1) {
    return { weeks: null, confidence: 'insufficient_data' };
  }

  const weightGain = lastWeight - firstWeight;
  const weeklyRate = weightGain / weeksPassed;

  if (weeklyRate <= 0) {
    return { weeks: null, confidence: 'no_progress', message: 'Нет прогресса в последнее время' };
  }

  const weeksNeeded = Math.ceil((targetWeight - currentWeight) / weeklyRate);
  return { weeks: weeksNeeded, confidence: 'high', weeklyRate: Math.round(weeklyRate * 10) / 10 };
}

if (typeof window !== 'undefined') {
  window.ASCore = window.ASCore || {};
  window.ASCore.progressiveOverload = {
    calculate1RM,
    calculateRecommendedWeight,
    detectPlateaus,
    getAllPlateaus,
    getProgressionPlan,
    estimateTimeToGoal
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculate1RM,
    calculateRecommendedWeight,
    detectPlateaus,
    getAllPlateaus,
    getProgressionPlan,
    estimateTimeToGoal
  };
}
