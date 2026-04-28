function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeWorkoutDate(rawValue) {
  if (typeof rawValue !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    return null;
  }
  return rawValue;
}

function sanitizeText(rawValue, maxLength) {
  return String(rawValue || "").trim().slice(0, maxLength);
}

function sanitizeWorkoutSets(rawSets) {
  return rawSets
    .map((v) => clamp(Math.round(parseNumber(v, 0)), 0, 200))
    .filter((v) => v > 0);
}

function sanitizeRunInput(input) {
  const date = sanitizeWorkoutDate(input.date);
  if (!date) {
    return { ok: false, error: "⚠️ Выбери корректную дату!" };
  }
  const dist = clamp(parseNumber(input.dist, 0), 0, 1000);
  const min = clamp(Math.round(parseNumber(input.min, 0)), 0, 600);
  const sec = clamp(Math.round(parseNumber(input.sec, 0)), 0, 59);
  const hr = clamp(Math.round(parseNumber(input.hr, 0)), 0, 260);
  const note = sanitizeText(input.note, 300);
  const type = input.type === "sprint" ? "sprint" : "long";

  return { ok: true, value: { date, dist, min, sec, hr, note, type } };
}

if (typeof window !== "undefined") {
  window.ASCore = window.ASCore || {};
  window.ASCore.validation = {
    sanitizeWorkoutDate,
    sanitizeText,
    sanitizeWorkoutSets,
    sanitizeRunInput,
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    sanitizeWorkoutDate,
    sanitizeText,
    sanitizeWorkoutSets,
    sanitizeRunInput,
  };
}
