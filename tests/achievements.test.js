const { calculateStreak, calculateLongestStreak, checkAchievements, isNewPR } = require('../js/core/achievements');

describe('Achievements Module', () => {
  describe('calculateStreak', () => {
    it('calculates current streak correctly', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const doneObj = {};

      // Add last 5 days including today
      for (let i = 0; i < 5; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        doneObj[d.toISOString().split('T')[0]] = true;
      }

      expect(calculateStreak(doneObj)).toBe(5);
    });

    it('returns 0 for empty done object', () => {
      expect(calculateStreak({})).toBe(0);
    });

    it('stops counting at first gap', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const doneObj = {};

      // Today and yesterday
      doneObj[today.toISOString().split('T')[0]] = true;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      doneObj[yesterday.toISOString().split('T')[0]] = true;

      // Skip 2 days ago
      // 3 days ago
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      doneObj[threeDaysAgo.toISOString().split('T')[0]] = true;

      expect(calculateStreak(doneObj)).toBe(2);
    });
  });

  describe('calculateLongestStreak', () => {
    it('finds longest streak in history', () => {
      const doneObj = {
        '2026-01-01': true,
        '2026-01-02': true,
        '2026-01-03': true,
        '2026-01-05': true,
        '2026-01-06': true,
        '2026-01-07': true,
        '2026-01-08': true,
        '2026-01-09': true,
      };

      expect(calculateLongestStreak(doneObj)).toBe(5); // Jan 5-9
    });

    it('returns 0 for empty object', () => {
      expect(calculateLongestStreak({})).toBe(0);
    });
  });

  describe('checkAchievements', () => {
    it('unlocks workout milestone achievements', () => {
      const state = {
        done: {}
      };

      // Add 50 workouts
      for (let i = 0; i < 50; i++) {
        state.done[`2026-01-${String(i + 1).padStart(2, '0')}`] = true;
      }

      const achievements = checkAchievements(state);
      const workoutAchievements = achievements.filter(a => a.category === 'workouts');

      expect(workoutAchievements.length).toBeGreaterThan(0);
      expect(workoutAchievements.some(a => a.count === 10)).toBe(true);
      expect(workoutAchievements.some(a => a.count === 50)).toBe(true);
    });
  });

  describe('isNewPR', () => {
    it('detects new weight PR', () => {
      const currentPRs = {
        'Bench Press': { maxWeight: 100, maxReps: 10, maxVolume: 1000 }
      };

      expect(isNewPR('Bench Press', 105, 8, currentPRs)).toBe(true);
      expect(isNewPR('Bench Press', 95, 10, currentPRs)).toBe(false);
    });

    it('returns true for first time exercise', () => {
      expect(isNewPR('Squat', 100, 10, {})).toBe(true);
    });
  });
});
