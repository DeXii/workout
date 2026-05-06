const {
  validateSleepEntry,
  calculateRecoveryScore,
  shouldDeload,
  calculateSleepDebt
} = require('../js/core/recovery');

describe('Recovery Module', () => {
  describe('validateSleepEntry', () => {
    it('clamps hours to 0-24 range', () => {
      expect(validateSleepEntry({ hours: 30 }).hours).toBe(24);
      expect(validateSleepEntry({ hours: -5 }).hours).toBe(0);
      expect(validateSleepEntry({ hours: 7.5 }).hours).toBe(7.5);
    });

    it('clamps quality to 1-10 range', () => {
      expect(validateSleepEntry({ quality: 15 }).quality).toBe(10);
      expect(validateSleepEntry({ quality: 0 }).quality).toBe(1);
    });

    it('truncates notes to 500 characters', () => {
      const longText = 'a'.repeat(600);
      expect(validateSleepEntry({ notes: longText }).notes.length).toBe(500);
    });
  });

  describe('calculateRecoveryScore', () => {
    it('returns high score for optimal recovery', () => {
      const entry = {
        hours: 8,
        quality: 9,
        fatigue: 2,
        soreness: 1
      };

      const score = calculateRecoveryScore(entry);
      expect(score).toBeGreaterThan(80);
    });

    it('returns low score for poor recovery', () => {
      const entry = {
        hours: 4,
        quality: 3,
        fatigue: 9,
        soreness: 8
      };

      const score = calculateRecoveryScore(entry);
      expect(score).toBeLessThan(40);
    });
  });

  describe('shouldDeload', () => {
    it('recommends deload for overtraining signs', () => {
      const sleepLogs = {};
      const workoutLogs = {};

      // 7 days of poor recovery and high workout frequency
      for (let i = 0; i < 7; i++) {
        const date = `2026-05-${String(i + 1).padStart(2, '0')}`;
        sleepLogs[date] = {
          hours: 5,
          quality: 4,
          fatigue: 8,
          soreness: 8
        };
        workoutLogs[date] = { type: 'push' };
      }

      expect(shouldDeload(sleepLogs, workoutLogs, 7)).toBe(true);
    });

    it('does not recommend deload for good recovery', () => {
      const sleepLogs = {};
      const workoutLogs = {};

      for (let i = 0; i < 7; i++) {
        const date = `2026-05-${String(i + 1).padStart(2, '0')}`;
        sleepLogs[date] = {
          hours: 8,
          quality: 8,
          fatigue: 3,
          soreness: 2
        };
        if (i % 2 === 0) workoutLogs[date] = { type: 'push' };
      }

      expect(shouldDeload(sleepLogs, workoutLogs, 7)).toBe(false);
    });
  });

  describe('calculateSleepDebt', () => {
    it('calculates accumulated sleep debt', () => {
      const sleepLogs = {
        '2026-05-01': { hours: 6 },
        '2026-05-02': { hours: 5 },
        '2026-05-03': { hours: 7 },
      };

      const debt = calculateSleepDebt(sleepLogs, 3);
      expect(debt).toBe(6); // (8-6) + (8-5) + (8-7) = 2 + 3 + 1 = 6
    });

    it('returns 0 when sleeping enough', () => {
      const sleepLogs = {
        '2026-05-01': { hours: 8 },
        '2026-05-02': { hours: 9 },
      };

      expect(calculateSleepDebt(sleepLogs, 2)).toBe(0);
    });
  });
});
