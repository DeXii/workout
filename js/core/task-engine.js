function normalizeHm(value) {
  const src = String(value || "").trim();
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(src);
  if (!m) return null;
  return `${m[1].padStart(2, "0")}:${m[2]}`;
}

function toMinutes(hm) {
  const parsed = normalizeHm(hm);
  if (!parsed) return null;
  const [h, m] = parsed.split(":").map((v) => parseInt(v, 10));
  return h * 60 + m;
}

function sourceGroup(tag) {
  const body = new Set(["train", "run", "food"]);
  const mind = new Set(["study", "chess", "knowledge", "books"]);
  const control = new Set(["mind"]);
  if (body.has(tag)) return "body";
  if (mind.has(tag)) return "mind";
  if (control.has(tag)) return "control";
  return "control";
}

function sourceLabel(group) {
  if (group === "body") return "Тело";
  if (group === "mind") return "Ум";
  if (group === "control") return "Контроль";
  return "Трекеры";
}

function createTaskId(dateKey, item, idx) {
  const core = String(item?.[1] || "task")
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .slice(0, 40);
  return `${dateKey}::${idx}::${core}`;
}

function mapScheduleToTasks(scheduleRows, dateKey) {
  return (scheduleRows || [])
    .map((row, idx) => {
      const hm = normalizeHm(row?.[0]);
      const tag = row?.[2] || "rest";
      if (!hm) return null;
      if (tag === "work" || tag === "sleep" || tag === "rest") return null;
      return {
        id: createTaskId(dateKey, row, idx),
        dateKey,
        time: hm,
        sortMinutes: toMinutes(hm),
        title: row?.[3] || "Задача",
        description: row?.[1] || "",
        durationText: "",
        tag,
        source: sourceGroup(tag),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sortMinutes - b.sortMinutes);
}

function pickCurrentTask(tasks, statuses, nowMinutes) {
  const pending = tasks.filter((t) => !statuses?.[t.id]);
  if (pending.length === 0) return null;
  const upcoming = pending.find((t) => t.sortMinutes >= nowMinutes);
  return upcoming || pending[0];
}

if (typeof window !== "undefined") {
  window.ASCore = window.ASCore || {};
  window.ASCore.taskEngine = {
    normalizeHm,
    toMinutes,
    sourceLabel,
    mapScheduleToTasks,
    pickCurrentTask,
  };
}
