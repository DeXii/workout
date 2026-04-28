const {
  sanitizeWorkoutDate,
  sanitizeWorkoutSets,
  sanitizeRunInput,
} = require('../js/core/validation');

describe('validation helpers', () => {
  it('accepts valid workout date', () => {
    expect(sanitizeWorkoutDate('2026-04-28')).toBe('2026-04-28');
    expect(sanitizeWorkoutDate('28-04-2026')).toBeNull();
  });

  it('normalizes workout sets', () => {
    const sets = sanitizeWorkoutSets(['10', '0', '205', '-2', 'abc', '8']);
    expect(sets).toEqual([10, 200, 8]);
  });

  it('validates run payload with clamped numeric values', () => {
    const parsed = sanitizeRunInput({
      date: '2026-04-28',
      type: 'long',
      dist: '15.7',
      min: '75',
      sec: '70',
      hr: '300',
      note: '  test run  ',
    });

    expect(parsed.ok).toBe(true);
    expect(parsed.value.sec).toBe(59);
    expect(parsed.value.hr).toBe(260);
    expect(parsed.value.note).toBe('test run');
  });
});
