/**
 * Heatmap Module
 * GitHub-style activity heatmap for workout tracking
 */

/* global showWorkoutDetails */

function generateHeatmapData(doneObj, startDate, endDate) {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split('T')[0];
    const hasWorkout = !!doneObj[dateKey];

    data.push({
      date: dateKey,
      count: hasWorkout ? 1 : 0,
      workoutType: doneObj[dateKey] || null
    });
  }

  return data;
}

function getHeatmapColor(count, theme = 'dark') {
  if (theme === 'dark') {
    if (count === 0) return '#0d1117';
    if (count === 1) return '#0e4429';
    if (count === 2) return '#006d32';
    if (count === 3) return '#26a641';
    return '#39d353';
  } else {
    if (count === 0) return '#ebedf0';
    if (count === 1) return '#9be9a8';
    if (count === 2) return '#40c463';
    if (count === 3) return '#30a14e';
    return '#216e39';
  }
}

function renderHeatmap(containerId, doneObj, year = new Date().getFullYear()) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const data = generateHeatmapData(doneObj, startDate, endDate);

  // Group by weeks
  const weeks = [];
  let currentWeek = [];

  data.forEach((day, index) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();

    // Start new week on Sunday
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentWeek.push(day);

    // Last day
    if (index === data.length - 1) {
      weeks.push(currentWeek);
    }
  });

  // Calculate stats
  const totalDays = data.length;
  const workoutDays = data.filter(d => d.count > 0).length;
  const percentage = Math.round((workoutDays / totalDays) * 100);

  // Render HTML
  let html = `
    <div style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div style="font-size:.9em;font-weight:700;color:var(--t1);">Активность за ${year} год</div>
        <div style="font-size:.75em;color:var(--t2);">
          ${workoutDays} тренировок из ${totalDays} дней (${percentage}%)
        </div>
      </div>
      <div style="overflow-x:auto;padding:10px 0;">
        <div style="display:flex;gap:3px;min-width:fit-content;">
  `;

  // Render weeks
  weeks.forEach((week, weekIndex) => {
    html += '<div style="display:flex;flex-direction:column;gap:3px;">';

    // Fill empty days at start of first week
    if (weekIndex === 0) {
      const firstDay = new Date(week[0].date).getDay();
      for (let i = 0; i < firstDay; i++) {
        html += '<div style="width:11px;height:11px;"></div>';
      }
    }

    week.forEach(day => {
      const color = getHeatmapColor(day.count);
      const date = new Date(day.date);
      const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      const tooltip = day.count > 0
        ? `${dateStr}: ${day.workoutType || 'Тренировка'}`
        : `${dateStr}: Нет тренировки`;

      html += `
        <div
          style="width:11px;height:11px;background:${color};border-radius:2px;cursor:pointer;"
          title="${tooltip}"
          data-date="${day.date}"
        ></div>
      `;
    });

    html += '</div>';
  });

  html += `
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:.7em;color:var(--t3);">
        <span>Меньше</span>
        <div style="display:flex;gap:3px;">
          <div style="width:11px;height:11px;background:${getHeatmapColor(0)};border-radius:2px;"></div>
          <div style="width:11px;height:11px;background:${getHeatmapColor(1)};border-radius:2px;"></div>
          <div style="width:11px;height:11px;background:${getHeatmapColor(2)};border-radius:2px;"></div>
          <div style="width:11px;height:11px;background:${getHeatmapColor(3)};border-radius:2px;"></div>
          <div style="width:11px;height:11px;background:${getHeatmapColor(4)};border-radius:2px;"></div>
        </div>
        <span>Больше</span>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll('[data-date]').forEach(cell => {
    cell.addEventListener('click', (e) => {
      const date = e.target.dataset.date;
      const dayData = data.find(d => d.date === date);

      if (dayData && dayData.count > 0) {
        // Show workout details for this day
        if (typeof showWorkoutDetails === 'function') {
          showWorkoutDetails(date);
        }
      }
    });
  });
}

function renderMonthlyHeatmap(containerId, doneObj, year, month) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const data = generateHeatmapData(
    doneObj,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  const monthName = startDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const workoutDays = data.filter(d => d.count > 0).length;

  let html = `
    <div style="margin-bottom:16px;">
      <div style="font-size:.9em;font-weight:700;color:var(--t1);margin-bottom:12px;">
        ${monthName} - ${workoutDays} тренировок
      </div>
      <div style="display:grid;grid-template-columns:repeat(7, 1fr);gap:4px;">
  `;

  // Day headers
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  dayNames.forEach(day => {
    html += `<div style="text-align:center;font-size:.7em;color:var(--t3);padding:4px 0;">${day}</div>`;
  });

  // Empty cells before first day
  const firstDayOfWeek = startDate.getDay();
  for (let i = 0; i < firstDayOfWeek; i++) {
    html += '<div></div>';
  }

  // Days
  data.forEach(day => {
    const color = getHeatmapColor(day.count);
    const date = new Date(day.date);
    const dayNum = date.getDate();
    const tooltip = day.count > 0
      ? `${dayNum}: ${day.workoutType || 'Тренировка'}`
      : `${dayNum}: Нет тренировки`;

    html += `
      <div
        style="aspect-ratio:1;background:${color};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.75em;color:var(--t1);cursor:pointer;position:relative;"
        title="${tooltip}"
        data-date="${day.date}"
      >
        ${dayNum}
      </div>
    `;
  });

  html += '</div></div>';
  container.innerHTML = html;
}

function renderYearSelector(containerId, currentYear, onYearChange) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const years = [];
  const startYear = 2020;
  const endYear = new Date().getFullYear();

  for (let y = endYear; y >= startYear; y--) {
    years.push(y);
  }

  let html = '<div style="display:flex;gap:6px;margin-bottom:16px;">';

  years.forEach(year => {
    const isActive = year === currentYear;
    html += `
      <button
        class="btn btn-sm ${isActive ? 'btn-p' : 'btn-gh'}"
        onclick="renderHeatmap('heatmap-container', window.S.done, ${year})"
        style="${isActive ? '' : 'opacity:0.7;'}"
      >
        ${year}
      </button>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Export functions
if (typeof window !== 'undefined') {
  window.heatmapModule = {
    generateHeatmapData,
    getHeatmapColor,
    renderHeatmap,
    renderMonthlyHeatmap,
    renderYearSelector
  };
}
