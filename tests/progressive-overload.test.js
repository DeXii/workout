const {
  calculate1RM,
  calculateRecommendedWeight,
  detectPlateaus,
  getAllPlateaus,
  getProgressionPlan,
  estimateTimeToGoal
} = require('../js/core/progressive-overload');

describe('Progressive Overload Module', () => {
  describe('calculate1RM', () => {
    it('should return weight for 1 rep', () => {
      expect(calculate1RM(100, 1)).toBe(100);
    });

    it('should calculate 1RM using Epley formula', () => {
      const result = calculate1RM(100, 5);
      expect(result).toBeCloseTo(116.67, 1);
    });

    it('should handle high rep ranges', () => {
      const result = calculate1RM(50, 15);
      expect(result).toBeGreaterThan(50);
    });
  });

  describe('calculateRecommendedWeight', () => {
    const mockPRs = {
      'Bench Press': { maxWeight: 100, maxReps: 10, maxVolume: 1000 }
    };

    const mockWorkoutLogs = {
      '2026-05-01': {
        push: {
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { weight: 80, reps: 12 },
                { weight: 80, reps: 12 },
                { weight: 80, reps: 11 }
              ]
            }
          ]
        }
      },
      '2026-04-28': {
        push: {
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { weight: 80, reps: 13 },
                { weight: 80, reps: 12 },
                { weight: 80, reps: 12 }
              ]
            }
          ]
        }
      }
    };

    it('should recommend weight increase when doing 12+ reps', () => {
      const result = calculateRecommendedWeight('Bench Press', mockPRs, mockWorkoutLogs);
      expect(result).not.toBeNull();
      expect(result.recommended).toBeGreaterThan(result.current);
      expect(result.increment).toBe(2.5);
    });

    it('should return null for unknown exercise', () => {
      const result = calculateRecommendedWeight('Unknown Exercise', mockPRs, mockWorkoutLogs);
      expect(result).toBeNull();
    });

    it('should use larger increment for lower body exercises', () => {
      const mockPRsSquat = {
        'Приседания': { maxWeight: 150, maxReps: 10, maxVolume: 1500 }
      };
      const mockLogsSquat = {
        '2026-05-01': {
          legs: {
            exercises: [
              {
                name: 'Приседания',
                sets: [
                  { weight: 140, reps: 12 },
                  { weight: 140, reps: 12 },
                  { weight: 140, reps: 11 }
                ]
              }
            ]
          }
        }
      };

      const result = calculateRecommendedWeight('Приседания', mockPRsSquat, mockLogsSquat);
      expect(result.increment).toBe(5);
    });
  });

  describe('detectPlateaus', () => {
    const mockWorkoutLogs = {
      '2026-04-20': {
        push: {
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { weight: 80, reps: 10 },
                { weight: 80, reps: 9 }
              ]
            }
          ]
        }
      },
      '2026-04-27': {
        push: {
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { weight: 80, reps: 10 },
                { weight: 80, reps: 10 }
              ]
            }
          ]
        }
      },
      '2026-05-04': {
        push: {
          exercises: [
            {
              name: 'Bench Press',
              sets: [
                { weight: 80, reps: 9 },
                { weight: 80, reps: 9 }
              ]
            }
          ]
        }
      }
    };

    it('should detect plateau when no progress in 2 weeks', () => {
      const result = detectPlateaus('Bench Press', mockWorkoutLogs, 2);
      expect(result).not.toBeNull();
      expect(result.exercise).toBe('Bench Press');
      expect(result.suggestion).toContain('deload');
    });

    it('should return null for insufficient data', () => {
      const result = detectPlateaus('Unknown Exercise', mockWorkoutLogs, 2);
      expect(result).toBeNull();
    });
  });

  describe('getProgressionPlan', () => {
    it('should create 8-week progression plan', () => {
      const plan = getProgressionPlan('Bench Press', 80, 100, 8);
      expect(plan).toHaveLength(8);
      expect(plan[0].weight).toBeCloseTo(82.5, 0);
      expect(plan[7].weight).toBeCloseTo(100, 0);
    });

    it('should adjust rep ranges as weight increases', () => {
      const plan = getProgressionPlan('Bench Press', 80, 100, 8);
      expect(plan[0].reps).toBe('8-10');
      expect(plan[7].reps).toBe('6-8');
    });
  });

  describe('estimateTimeToGoal', () => {
    const mockPRs = {
      'Bench Press': { maxWeight: 100, maxReps: 10, maxVolume: 1000 }
    };

    const mockProgressingLogs = {
      '2026-04-01': {
        push: { exercises: [{ name: 'Bench Press', sets: [{ weight: 80, reps: 10 }] }] }
      },
      '2026-04-08': {
        push: { exercises: [{ name: 'Bench Press', sets: [{ weight: 82.5, reps: 10 }] }] }
      },
      '2026-04-15': {
        push: { exercises: [{ name: 'Bench Press', sets: [{ weight: 85, reps: 10 }] }] }
      },
      '2026-04-22': {
        push: { exercises: [{ name: 'Bench Press', sets: [{ weight: 87.5, reps: 10 }] }] }
      }
    };

    it('should estimate weeks to goal based on progression rate', () => {
      const result = estimateTimeToGoal('Bench Press', 87.5, 100, mockPRs, mockProgressingLogs);
      expect(result.weeks).toBeGreaterThan(0);
      expect(result.confidence).toBe('high');
    });

    it('should return low confidence for insufficient data', () => {
      const sparseLog = {
        '2026-05-01': {
          push: { exercises: [{ name: 'Bench Press', sets: [{ weight: 80, reps: 10 }] }] }
        }
      };
      const result = estimateTimeToGoal('Bench Press', 80, 100, mockPRs, sparseLog);
      expect(result.confidence).toBe('low');
    });
  });
});
