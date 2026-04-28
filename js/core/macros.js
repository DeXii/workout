function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

function calculateMacros(input) {
  const weight = clampNumber(input.weight, 30, 250, 70);
  const height = clampNumber(input.height, 120, 240, 175);
  const age = clampNumber(input.age, 10, 100, 22);
  const activity = clampNumber(input.activity, 1.2, 2.2, 1.55);
  const sex = input.sex === "f" ? "f" : "m";
  const goal = ["maintain", "cut", "bulk", "recomp"].includes(input.goal)
    ? input.goal
    : "maintain";

  const bmr =
    sex === "m"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = Math.round(bmr * activity);

  let target = tdee;
  if (goal === "cut") target = Math.round(tdee * 0.9);
  if (goal === "bulk") target = Math.round(tdee * 1.05);

  const protein = Math.round(weight * 1.8);
  const fat = Math.round(weight * 0.9);
  const proteinKcal = protein * 4;
  const fatKcal = fat * 9;
  const carbsKcal = Math.max(0, target - proteinKcal - fatKcal);
  const carbs = Math.round(carbsKcal / 4);
  const totalKcal = proteinKcal + fatKcal + carbsKcal;
  const bmi = Number((weight / (height / 100) ** 2).toFixed(1));

  const safePercent = (value) =>
    totalKcal > 0 ? Math.round((value / totalKcal) * 100) : 0;

  return {
    weight,
    height,
    age,
    activity,
    sex,
    goal,
    bmr: Math.round(bmr),
    tdee,
    target,
    protein,
    fat,
    carbs,
    bmi,
    proteinKcal,
    fatKcal,
    carbsKcal,
    totalKcal,
    percents: {
      protein: safePercent(proteinKcal),
      fat: safePercent(fatKcal),
      carbs: safePercent(carbsKcal),
    },
  };
}

if (typeof window !== "undefined") {
  window.ASCore = window.ASCore || {};
  window.ASCore.calculateMacros = calculateMacros;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { calculateMacros };
}
