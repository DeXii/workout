const { calculateMacros } = require('../js/core/macros');

describe('calculateMacros', () => {
  it('returns stable macro output for standard male input', () => {
    const result = calculateMacros({
      weight: 80,
      height: 180,
      age: 30,
      sex: 'm',
      activity: 1.55,
      goal: 'maintain',
    });

    expect(result.tdee).toBeGreaterThan(2000);
    expect(result.protein).toBe(144);
    expect(result.fat).toBe(72);
    expect(result.carbs).toBeGreaterThan(0);
    expect(result.percents.protein + result.percents.fat + result.percents.carbs).toBeGreaterThan(95);
  });

  it('applies cut goal as calorie deficit', () => {
    const maintain = calculateMacros({
      weight: 70,
      height: 175,
      age: 25,
      sex: 'f',
      activity: 1.55,
      goal: 'maintain',
    });
    const cut = calculateMacros({
      weight: 70,
      height: 175,
      age: 25,
      sex: 'f',
      activity: 1.55,
      goal: 'cut',
    });

    expect(cut.target).toBeLessThan(maintain.target);
  });
});
