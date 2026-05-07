# Ayanokoji System v3.3 - Руководство по интеграции

## Быстрый старт

### 1. Подключение модулей в index.html

Добавьте следующие скрипты в `<head>` секцию **перед** основным скриптом приложения:

```html
<!-- Core modules -->
<script src="./js/core/macros.js"></script>
<script src="./js/core/validation.js"></script>
<script src="./js/core/state.js"></script>
<script src="./js/core/task-engine.js"></script>
<script src="./js/core/achievements.js"></script>
<script src="./js/core/recovery.js"></script>
<script src="./js/core/progressive-overload.js"></script>

<!-- UI modules -->
<script src="./js/pr-tracker.js"></script>
<script src="./js/achievements-ui.js"></script>
<script src="./js/export.js"></script>
<script src="./js/notifications.js"></script>
<script src="./js/heatmap.js"></script>
<script src="./js/theme.js"></script>
<script src="./js/dashboard.js"></script>
<script src="./js/dashboard-enhanced.js"></script>
```

### 2. Инициализация при загрузке

В основном скрипте приложения добавьте инициализацию:

```javascript
// После загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Инициализация темы (должна быть первой)
  if (window.themeModule) {
    window.themeModule.initTheme();
  }

  // Инициализация уведомлений
  if (window.notificationModule) {
    window.notificationModule.initNotifications();
  }

  // Автоматический бэкап
  if (typeof setupAutoBackup === 'function') {
    setupAutoBackup();
  }

  // Остальная инициализация приложения...
});
```

### 3. Добавление UI элементов

#### Dashboard секция

```html
<section id="dashboard" class="sec active">
  <div class="wrap">
    <!-- Enhanced Dashboard -->
    <div id="dashboard-enhanced"></div>
  </div>
</section>
```

#### Achievements секция

```html
<section id="achievements" class="sec">
  <div class="wrap">
    <h2>🏆 Достижения</h2>
    
    <!-- Streak Counter -->
    <div id="streak-counter" style="margin-bottom:20px;"></div>
    
    <!-- Achievements List -->
    <div id="achievements-list"></div>
  </div>
</section>
```

#### Analytics секция (с тепловой картой)

```html
<section id="analytics" class="sec">
  <div class="wrap">
    <h2>📊 Аналитика</h2>
    
    <!-- Heatmap -->
    <div class="card" style="margin-bottom:20px;">
      <div id="heatmap-year-selector"></div>
      <div id="heatmap-container"></div>
    </div>
    
    <!-- Other analytics... -->
  </div>
</section>
```

#### Settings секция (с экспортом и темой)

```html
<section id="settings" class="sec">
  <div class="wrap">
    <h2>⚙️ Настройки</h2>
    
    <!-- Theme Toggle -->
    <div class="card" style="margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:600;margin-bottom:4px;">Тема оформления</div>
          <div style="font-size:.8em;color:var(--t2);">Светлая или темная тема</div>
        </div>
        <div id="theme-toggle-container"></div>
      </div>
    </div>
    
    <!-- Export/Import -->
    <div class="card">
      <div style="font-weight:600;margin-bottom:12px;">Экспорт и импорт данных</div>
      <div style="display:grid;gap:10px;">
        <button class="btn btn-p" onclick="exportAllDataToJSON()">
          💾 Экспорт всех данных (JSON)
        </button>
        <button class="btn btn-g" onclick="exportWorkoutsToCSV()">
          📊 Экспорт тренировок (CSV)
        </button>
        <button class="btn btn-v" onclick="exportRunsToCSV()">
          🏃 Экспорт пробежек (CSV)
        </button>
        <button class="btn btn-o" onclick="exportSleepToCSV()">
          😴 Экспорт сна (CSV)
        </button>
        <button class="btn btn-gh" onclick="importFromJSON()">
          📥 Импорт данных (JSON)
        </button>
      </div>
    </div>
  </div>
</section>
```

#### Навигация (добавить кнопку темы)

```html
<div class="nav-inner">
  <div class="logo">⚡ Ayanokoji</div>
  
  <!-- Existing nav buttons... -->
  
  <!-- Theme toggle button -->
  <button
    id="theme-toggle"
    class="btn btn-gh btn-sm"
    onclick="toggleTheme()"
    title="Переключить тему"
    style="font-size:1.2em;padding:6px 10px;margin-left:auto;"
  >
    🌙
  </button>
</div>
```

### 4. Интеграция с существующим кодом

#### После сохранения тренировки

```javascript
function saveWorkout(workoutData) {
  // Существующая логика сохранения...
  window.S.workoutLogs[date] = workoutData;
  saveLocal();
  
  // NEW: Проверка на новые PR
  if (typeof checkWorkoutPRs === 'function') {
    const newPRs = checkWorkoutPRs(workoutData);
    if (newPRs.length > 0) {
      showPRNotification(newPRs);
      
      // Уведомление через notifications module
      if (window.notificationModule) {
        newPRs.forEach(pr => {
          window.notificationModule.notifyNewPR(pr.exercise, pr.type, pr.new.maxWeight);
        });
      }
    }
  }
  
  // NEW: Проверка на milestone серии
  if (window.ASCore?.achievements && window.notificationModule) {
    const currentStreak = window.ASCore.achievements.calculateStreak(window.S.done);
    const milestones = [7, 14, 30, 60, 100, 365];
    if (milestones.includes(currentStreak)) {
      window.notificationModule.notifyStreakMilestone(currentStreak);
    }
  }
}
```

#### В функции refreshAll()

```javascript
function refreshAll() {
  // Существующие рендеры...
  
  // NEW: Render enhanced dashboard
  if (typeof renderEnhancedDashboard === 'function') {
    renderEnhancedDashboard();
  }
  
  // NEW: Render achievements
  if (typeof renderAchievements === 'function') {
    renderAchievements();
  }
  
  // NEW: Render PRs
  if (typeof renderPRs === 'function') {
    renderPRs();
  }
}
```

### 5. Инициализация состояния

Добавьте новые поля в `window.S`:

```javascript
window.S = window.S || {
  done: {},
  workouts: [],
  runs: [],
  workoutLogs: {},           // Детальные логи тренировок
  sleepLogs: {},             // Логи сна
  personalRecords: {},       // Личные рекорды
  customSchedule: null,
  history: [],
  taskStatuses: {},          // Статусы задач
  // ... остальные поля
};
```

---

## 🌬️ Интеграция таймеров дыхания (NEW in v3.3)

Таймеры дыхания встроены напрямую в `index.html` и не требуют внешних файлов.

### Резонансное дыхание

```html
<!-- HTML контейнер -->
<div id="resonant-timer" class="breath-resonant-container">
  <div class="breath-resonant-circle" id="resonant-circle"></div>
  <div class="breath-resonant-phase" id="resonant-phase">Нажмите Start</div>
  <div class="breath-resonant-count" id="resonant-count">0</div>
  <div class="breath-resonant-controls">
    <button onclick="startResonantBreathing()" class="btn btn-p">Start</button>
    <button onclick="stopResonantBreathing()" class="btn btn-gh">Stop</button>
  </div>
</div>
```

```javascript
// Управление таймером
startResonantBreathing();  // Запуск
stopResonantBreathing();   // Остановка
```

### Квадратное дыхание

```html
<!-- HTML контейнер -->
<div id="box-timer" class="breath-box-container">
  <div class="breath-box-wrapper">
    <div class="breath-box-square" id="box-square">
      <div class="breath-box-fill" id="box-fill"></div>
    </div>
  </div>
  <div class="breath-box-phase" id="box-phase">👃 Вдох</div>
  <div class="breath-box-count" id="box-count">0</div>
  <div class="breath-box-controls">
    <button onclick="startBoxBreathing()" class="btn btn-p">Start</button>
    <button onclick="stopBoxBreathing()" class="btn btn-gh">Stop</button>
  </div>
</div>
```

```javascript
// Управление таймером
startBoxBreathing();  // Запуск
stopBoxBreathing();   // Остановка
```

### Mori Breathing

```html
<!-- HTML контейнер -->
<div id="mori-timer" class="mori-container">
  <!-- Аудио плеер -->
  <div class="mori-audio-player">
    <audio id="mori-audio" src="./audio/MoriBreath.mp3"></audio>
    <button onclick="toggleMoriAudio()" class="btn btn-gh">▶️ Play Audio</button>
  </div>
  
  <!-- Селектор ступени -->
  <div class="mori-stage-selector">
    <button onclick="selectMoriStage(1)" class="btn btn-p">Ступень 1</button>
    <button onclick="selectMoriStage(2)" class="btn btn-gh">Ступень 2</button>
    <button onclick="selectMoriStage(3)" class="btn btn-gh">Ступень 3</button>
  </div>
  
  <!-- Визуальный индикатор -->
  <div class="breath-mori-circle" id="mori-circle"></div>
  <div class="mori-phase" id="mori-phase">Выберите ступень</div>
  
  <!-- Управление -->
  <div class="mori-controls">
    <button onclick="startMoriBreathing()" class="btn btn-p">Start</button>
    <button onclick="stopMoriBreathing()" class="btn btn-gh">Stop</button>
  </div>
</div>
```

```javascript
// Управление таймером
selectMoriStage(1);        // Выбор ступени (1-3)
startMoriBreathing();      // Запуск
stopMoriBreathing();       // Остановка
toggleMoriAudio();         // Воспроизведение/пауза аудио
```

### Настройка параметров

Параметры таймеров можно изменить в начале скрипта:

```javascript
// Резонансное дыхание (миллисекунды)
const RESONANT_CONFIG = {
  INHALE_MS: 5000,   // 5 секунд вдох
  EXHALE_MS: 5000    // 5 секунд выдох
};

// Квадратное дыхание
const BOX_CONFIG = {
  INHALE_MS: 4000,    // 4 секунды вдох
  HOLD_IN_MS: 4000,   // 4 секунды задержка на вдохе
  EXHALE_MS: 4000,    // 4 секунды выдох
  HOLD_OUT_MS: 4000   // 4 секунды задержка на выдохе
};

// Mori breathing
const MORI_CONFIG = {
  INHALE_MS: 10000,  // 10 секунд вдох
  HOLD_MS: 10000,    // 10 секунд задержка
  EXHALE_MS: 10000   // 10 секунд выдох
};
```

### Wake Lock API

Таймеры автоматически запрашивают Wake Lock для предотвращения засыпания экрана:

```javascript
// Wake Lock запрашивается при запуске таймера
let wakeLock = null;

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
    } catch (err) {
      console.log('Wake Lock not supported');
    }
  }
}

// Освобождается при остановке
function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }
}
```

---

## Примеры использования

### Progressive Overload в UI тренировки

```javascript
function renderExerciseInput(exerciseName) {
  let html = `<div class="exercise-input">`;
  html += `<label>${exerciseName}</label>`;
  
  // Получить рекомендацию
  if (window.ASCore?.progressiveOverload && window.S.personalRecords) {
    const rec = window.ASCore.progressiveOverload.calculateRecommendedWeight(
      exerciseName,
      window.S.personalRecords,
      window.S.workoutLogs
    );
    
    if (rec && rec.increment !== 0) {
      html += `
        <div style="font-size:.75em;color:var(--a3);margin-top:4px;">
          💡 ${rec.reason}
        </div>
      `;
    }
  }
  
  html += `<input type="number" placeholder="Вес (кг)">`;
  html += `</div>`;
  
  return html;
}
```

### Heatmap в аналитике

```javascript
function showAnalytics() {
  nav('analytics');
  
  // Render heatmap
  if (window.heatmapModule) {
    const currentYear = new Date().getFullYear();
    window.heatmapModule.renderYearSelector('heatmap-year-selector', currentYear);
    window.heatmapModule.renderHeatmap('heatmap-container', window.S.done, currentYear);
  }
}
```

### Уведомления при достижениях

```javascript
function unlockAchievement(achievementId) {
  const achievement = getAchievementById(achievementId);
  
  // Показать в UI
  notify(`🏆 ${achievement.title}`, 'success');
  
  // Push-уведомление
  if (window.notificationModule) {
    window.notificationModule.notifyAchievement(achievement);
  }
  
  // Конфетти эффект (опционально)
  if (typeof showConfetti === 'function') {
    showConfetti();
  }
}
```

---

## Troubleshooting

### Уведомления не работают

1. Проверьте разрешения браузера: `chrome://settings/content/notifications`
2. Убедитесь, что `initNotifications()` вызывается после загрузки DOM
3. Service Worker должен быть зарегистрирован

### Тема не применяется

1. Проверьте, что `initTheme()` вызывается **до** рендера UI
2. Убедитесь, что CSS переменные определены в `:root`
3. Проверьте localStorage: `localStorage.getItem('ay_theme')`

### Тепловая карта пустая

1. Убедитесь, что `window.S.done` содержит данные
2. Проверьте формат дат: должен быть `YYYY-MM-DD`
3. Контейнер должен существовать в DOM

### Progressive Overload не дает рекомендаций

1. Нужно минимум 3 тренировки с одним упражнением
2. Проверьте структуру `window.S.workoutLogs`
3. Убедитесь, что `personalRecords` заполнен

### Таймеры дыхания не воспроизводят звук

1. Проверьте поддержку Web Audio API в браузере
2. Убедитесь, что страница загружена через HTTPS или localhost
3. Звук генерируется программно — внешние файлы не нужны

### Wake Lock не работает

1. Wake Lock API требует HTTPS
2. Не все браузеры поддерживают Wake Lock
3. Wake Lock автоматически отключается при сворачивании браузера

---

## Performance Tips

1. **Lazy loading**: Рендерите тепловую карту только при открытии секции аналитики
2. **Debounce**: Используйте debounce для частых обновлений (например, при вводе)
3. **Virtual scrolling**: Для длинных списков достижений/PR
4. **IndexedDB**: Для больших объемов данных (>5MB) переходите с localStorage на IndexedDB
5. **requestAnimationFrame**: Таймеры дыхания используют rAF для плавной анимации

---

## Безопасность

1. **Не логируйте sensitive данные**: Пароли, токены Firebase
2. **Валидация**: Всегда валидируйте импортированные данные
3. **Санитизация**: Используйте `validation.js` для всех пользовательских вводов
4. **HTTPS**: PWA требует HTTPS для Service Worker и уведомлений
5. **Wake Lock**: Требует безопасного контекста (HTTPS)

---

## Дальнейшая разработка

### Добавление нового модуля

1. Создайте файл в `js/` или `js/core/`
2. Экспортируйте функции через `window.ASCore.moduleName` или `window.moduleName`
3. Добавьте в `sw.js` в массив `STATIC_CACHE`
4. Создайте тесты в `tests/module-name.test.js`
5. Обновите `CLAUDE.md`

### Добавление нового типа достижения

1. Откройте `js/core/achievements.js`
2. Добавьте milestone в соответствующий массив
3. Обновите `checkAchievements()` функцию
4. Добавьте тест в `tests/achievements.test.js`

### Добавление нового типа экспорта

1. Откройте `js/export.js`
2. Создайте функцию `exportXToCSV()`
3. Используйте `exportToCSV()` helper
4. Добавьте кнопку в Settings секцию

### Добавление нового таймера дыхания

1. Добавьте HTML контейнер в соответствующую секцию `index.html`
2. Добавьте CSS стили с анимациями
3. Создайте функции start/stop с Web Audio API
4. Используйте Date.now() для точного времени
5. Запрашивайте Wake Lock при старте

---

**Версия**: 3.3  
**Последнее обновление**: 2026-05-07
