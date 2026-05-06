# Ayanokoji System - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.2.0] - 2026-05-06

### Added
- **🎯 Priorities System**: New main section ranking all 28 tasks by importance
  - Hierarchical ranking from 1 (most important) to 28
  - 4 color-coded categories: Very Important (🔴), Important (🟠), Medium (🟡), Secondary (🟢)
  - Dedicated navigation button in main nav, mobile nav, and bottom nav
  - Visual hierarchy with emoji indicators and detailed descriptions
  - Covers all aspects: physical training, mental development, nutrition, recovery, skills

- **⌘ Command Palette Enhancement**: Expanded to 86 commands with full hierarchy
  - Added Priorities section (28 task commands)
  - Mental section: HRV, Meditation, Journal, Chess, QCT, Biases, Tracker (15 commands)
  - Workout section: Push/Pull/Legs/HIFT, Progression, Alternatives (10 commands)
  - Schedule section: Monthly/Daily/Editor (3 commands)
  - Skills section: Thinking, Memory, Attention, Emotions, Communication, Physical (6 commands)
  - Food section: Breakfast, Lunch, Dinner, Snacks (4 commands)
  - Knowledge Base section: Science, Plan, Metrics (3 commands)
  - Progress section: Log workout/run, History, PRs, HRV, ACFT (7 commands)
  - Improved keyboard navigation with arrow keys and Enter
  - Fuzzy search across all sections and actions
  - Backdrop blur effect for better focus

- **📑 Tab Navigation Improvements**: All 9 sections reorganized with logical grouping
  - **Mental** (mn-*): 3 groups
    - Group 1: HRV Трекер, Медитация, Журнал самоконтроля
    - Group 2: Шахматы, QCT, Когнитивные искажения
    - Group 3: Ментальный трекер
  - **Workout** (wo-*): 2 groups
    - Group 1: Push — A, Pull — B, Ноги+Кор — C, Full HIFT — D
    - Group 2: Прогрессия, Альтернативы
  - **Schedule** (sc-*): Monthly, Daily, Editor with icons
  - **Skills** (sk-*): 2 groups
    - Group 1: Мышление, Память, Внимание
    - Group 2: Эмоции, Коммуникация, Физика
  - **Food** (fd-*): 2 groups with badges
    - Group 1: Завтрак, Обед
    - Group 2: Ужин, Перекусы
  - **Knowledge Base** (kb-*): 2 groups
    - Group 1: Научная база, План на 12-15 лет
    - Group 2: Метрики прогресса
  - **Progress** (pg-*): 3 groups
    - Group 1: Записать тренировку, Записать бег
    - Group 2: История тренировок, История бега
    - Group 3: Личные рекорды, HRV Трекер, ACFT
  - Sticky scroll positioning for all tabs (top: 70px)
  - Icon separation with `span.it-icon` for better visual hierarchy
  - Visual group separators with `it-group` class
  - Badge indicators with `it-badge` class for special tabs

### Changed
- Restored HRV Tracker to Progress section (was temporarily in Mental in v3.1)
- Updated search placeholder to "Поиск... (Ctrl+K)" for consistency
- Improved tab grouping logic across all sections for better UX
- Enhanced visual hierarchy with consistent spacing and separators
- Updated package.json to version 3.2.0 with new description

### Fixed
- Git merge conflicts in index.html resolved during rebase
- Module initialization timing issues (window.S must exist before modules access it)
- Command Palette navigation bugs (executeCommandByIndex function)
- Duplicate sections removed (HRV was in both Mental and Progress, Skills was duplicated)
- Firebase timeout handling improved (5-second timeout for loadCloud)

---

## [3.1.0] - 2026-05-03

### Added
- **⌘ Command Palette**: Keyboard-driven navigation system
  - Ctrl+K (or Cmd+K on Mac) shortcut to open
  - Search across all sections and actions with fuzzy matching
  - Arrow key navigation (↑/↓) and Enter to execute
  - ESC or click outside to close
  - Backdrop blur effect with dark overlay
  - 50+ initial commands covering main sections and subsections

- **📑 Tab Improvements**: Enhanced visual organization
  - Sticky positioning for tabs (position: sticky, top: 70px)
  - Icons for all tabs using emoji
  - Logical grouping with visual separators
  - Badge indicators for special tabs
  - Improved hover and active states
  - Better mobile responsiveness

### Changed
- Updated navigation structure for better UX
- Improved tab CSS with backdrop-filter blur
- Enhanced search input styling with Ctrl+K hint
- Added Command Palette button (⌘ K) to main navigation

### Fixed
- Module initialization order (window.S timing issue)
  - Wrapped dashboard-enhanced.js state init in function
  - Wrapped pr-tracker.js state init in function
  - Added safety checks in export.js
- Firebase timeout handling (5-second timeout for loadCloud with safeCallback)
- CORS issues with local development (created start-server.bat for http-server)

---

## [3.0.0] - 2026-05-01

### 🎯 Progressive Overload System
**Модуль**: `js/core/progressive-overload.js`

Интеллектуальная система прогрессивной перегрузки для оптимизации тренировочного прогресса:

- **Автоматические рекомендации по весам**: Анализирует последние 3 тренировки и рекомендует увеличение/уменьшение веса
  - +2.5кг для верха тела (жим, подтягивания)
  - +5кг для низа тела (приседания, становая)
  - Учитывает среднее количество повторений (цель: 8-12)

- **Детекция плато**: Автоматически обнаруживает отсутствие прогресса за 2+ недели
  - Сравнивает максимальный вес и объем между первой и второй половиной периода
  - Предлагает deload неделю или смену упражнения

- **Калькулятор 1RM**: Расчет одноповторного максимума по формуле Epley
  - `1RM = вес × (1 + повторения/30)`

- **План прогрессии**: Создает 8-недельный план линейной прогрессии от текущего веса к целевому
  - Автоматическая корректировка диапазона повторений (8-10 → 6-8)

- **Оценка времени до цели**: Прогнозирует количество недель до достижения целевого веса
  - Основано на исторической скорости прогресса
  - Уровни уверенности: high/low/insufficient_data

**Тесты**: 12 тестов в `tests/progressive-overload.test.js` ✅

---

### 🏆 Система достижений и streak counter
**Модули**: `js/core/achievements.js`, `js/achievements-ui.js`

Геймификация для мотивации:

- **Streak Counter**: Отслеживание текущей и лучшей серии тренировок
  - Эмодзи индикаторы: 💪 (1-2), ⚡ (3-6), 🔥 (7-29), 🔥🔥 (30-99), 🔥🔥🔥 (100+)
  - Визуальные карточки с градиентами

- **Badges (значки достижений)**:
  - **Тренировки**: 10 (🥉), 50 (🥈), 100 (🥇), 250 (💎), 500 (👑), 1000 (🏆)
  - **Серии**: 7 дней (🔥), 14 (🔥🔥), 30 (⭐), 60 (⭐⭐), 100 (💯), 365 (🎯)

- **Personal Records (PR) tracking**:
  - Автоматическое обнаружение новых рекордов по весу, повторениям, объему
  - Уведомления при установке PR
  - История максимумов по каждому упражнению

**Тесты**: 8 тестов в `tests/achievements.test.js` ✅

---

### 🔔 Push-уведомления
**Модуль**: `js/notifications.js`

Умные напоминания для поддержания дисциплины:

- **Напоминания о тренировках**: Автоматические уведомления по расписанию
  - Действия: "Начать" / "Отложить на 10 мин"
  - Интеграция с Service Worker для персистентности

- **Напоминания о воде**: Каждые 2 часа (6:00-22:00)

- **Пропущенные тренировки**: Проверка в 20:00, если тренировка не выполнена

- **Уведомления о достижениях**:
  - Новые PR (💪)
  - Milestone серий (🔥)
  - Разблокированные badges (🏆)

- **Вибрация**: Тактильная обратная связь при важных событиях

**Service Worker**: Обработка кликов по уведомлениям в `sw.js`

---

### 📊 Тепловая карта активности
**Модуль**: `js/heatmap.js`

GitHub-style визуализация тренировочной активности:

- **Годовая тепловая карта**: 365 дней на одном экране
  - Цветовая схема: от темного (нет тренировки) до яркого (есть тренировка)
  - Группировка по неделям
  - Tooltip с датой и типом тренировки

- **Месячная карта**: Календарный вид с номерами дней

- **Статистика**: Процент выполненных дней, общее количество тренировок

- **Интерактивность**: Клик по дню → детали тренировки

- **Селектор года**: Переключение между годами (2020-2026)

**Темы**: Поддержка темной и светлой цветовых схем

---

### 🌓 Светлая/темная тема
**Модуль**: `js/theme.js`

Переключатель темы с сохранением предпочтений:

- **Две темы**:
  - **Dark** (по умолчанию): Темный фон (#0a0a0f), яркие акценты
  - **Light**: Светлый фон (#ffffff), приглушенные акценты

- **Автоопределение**: Использует `prefers-color-scheme` при первом запуске

- **Персистентность**: Сохранение выбора в `localStorage`

- **Кнопка переключения**: ☀️ / 🌙 в навигации

- **CSS переменные**: Все цвета через `--bg1`, `--a1`, `--t1` и т.д.

---

### 💾 Экспорт и импорт данных
**Модуль**: `js/export.js`

Полный контроль над данными:

- **Экспорт в CSV**:
  - `exportWorkoutsToCSV()` - Детальные данные по сетам/повторениям/весам
  - `exportRunsToCSV()` - Пробежки с темпом и пульсом
  - `exportSleepToCSV()` - Сон и восстановление

- **Экспорт в JSON**: Полный бэкап всех данных
  - Включает: done, workouts, runs, workoutLogs, sleepLogs, personalRecords, customSchedule, history
  - Версионирование (v2.0)
  - Timestamp экспорта

- **Импорт из JSON**: Восстановление из бэкапа
  - Подтверждение перед перезаписью
  - Merge с текущими данными

- **Автоматический бэкап**: Раз в неделю автоматически создается JSON бэкап

---

### 📈 Enhanced Dashboard
**Модуль**: `js/dashboard.js`

Комплексная панель управления с ключевыми метриками:

- **Приветствие**: Динамическое приветствие в зависимости от времени суток

- **Быстрая статистика** (4 карточки):
  - Текущая серия с эмодзи
  - Общее количество тренировок
  - Объем за неделю (кг)
  - Процент восстановления

- **Статус дня**: Выполнена ли сегодняшняя тренировка
  - Если нет → кнопка "Начать"
  - Если да → тип тренировки

- **Предупреждения о плато**: Автоматические уведомления о застое в прогрессе

- **Рекомендации по весам**: Топ-5 упражнений с рекомендациями

- **Тепловая карта**: Годовая активность

- **Быстрые действия**: 6 кнопок для навигации

---

## Технические улучшения

### Service Worker v3
- Обновлен кэш до `ayanokoji-v3`
- Добавлены все новые модули в `STATIC_CACHE`
- Обработка notification clicks
- Поддержка notification actions (start, snooze)

### Тестирование
- **34 теста** проходят успешно
- Новые тесты для progressive-overload модуля
- Покрытие всех core модулей

### Архитектура
- Модульная структура: core модули + UI модули
- Разделение логики и представления
- Dual export pattern (browser + Node.js)

---

## Файловая структура

```
workout-3 — копия/
├── index.html                    # Главный файл (UI)
├── sw.js                         # Service Worker v3
├── manifest.webmanifest          # PWA manifest
├── package.json                  # Dependencies
├── CLAUDE.md                     # Документация для Claude
├── CHANGELOG.md                  # Этот файл
│
├── js/
│   ├── core/                     # Бизнес-логика (тестируемая)
│   │   ├── macros.js            # Калькулятор питания
│   │   ├── validation.js        # Валидация входных данных
│   │   ├── state.js             # Управление состоянием
│   │   ├── task-engine.js       # Конвертация расписания в задачи
│   │   ├── achievements.js      # Streak и badges
│   │   ├── recovery.js          # Сон и восстановление
│   │   └── progressive-overload.js  # NEW: Прогрессивная перегрузка
│   │
│   ├── pr-tracker.js            # Трекинг личных рекордов
│   ├── achievements-ui.js       # NEW: UI для достижений
│   ├── export.js                # NEW: Экспорт/импорт данных
│   ├── notifications.js         # NEW: Push-уведомления
│   ├── heatmap.js               # NEW: Тепловая карта
│   ├── theme.js                 # NEW: Переключатель темы
│   ├── dashboard.js             # NEW: Enhanced dashboard
│   └── dashboard-enhanced.js    # Дополнительные виджеты
│
└── tests/
    ├── macros.test.js           # 2 теста
    ├── validation.test.js       # 3 теста
    ├── achievements.test.js     # 8 тестов
    ├── recovery.test.js         # 9 тестов
    └── progressive-overload.test.js  # NEW: 12 тестов
```

---

## Как использовать новые функции

### Progressive Overload
```javascript
// Получить рекомендацию по весу
const recommendation = window.ASCore.progressiveOverload.calculateRecommendedWeight(
  'Bench Press',
  window.S.personalRecords,
  window.S.workoutLogs
);
// → { current: 80, recommended: 82.5, reason: "Увеличь вес на 2.5кг", increment: 2.5 }

// Проверить плато
const plateaus = window.ASCore.progressiveOverload.getAllPlateaus(
  window.S.personalRecords,
  window.S.workoutLogs,
  2 // недели
);
```

### Уведомления
```javascript
// Инициализация
window.notificationModule.initNotifications();

// Запланировать напоминание о тренировке
window.notificationModule.scheduleWorkoutReminder('06:00', 'Утренняя тренировка');

// Уведомить о новом PR
window.notificationModule.notifyNewPR('Bench Press', 'weight', 100);
```

### Тепловая карта
```javascript
// Отрисовать годовую карту
window.heatmapModule.renderHeatmap('heatmap-container', window.S.done, 2026);

// Отрисовать месячную карту
window.heatmapModule.renderMonthlyHeatmap('monthly-container', window.S.done, 2026, 5);
```

### Тема
```javascript
// Переключить тему
window.toggleTheme();

// Применить конкретную тему
window.themeModule.applyTheme('light');

// Получить текущую тему
const theme = window.themeModule.getCurrentTheme(); // 'dark' или 'light'
```

### Экспорт
```javascript
// Экспорт тренировок в CSV
window.exportWorkoutsToCSV();

// Полный бэкап в JSON
window.exportAllDataToJSON();

// Импорт из JSON
window.importFromJSON();
```

---

## Что дальше?

### Запланированные улучшения
- [ ] Шаблоны тренировок (сохранить и переиспользовать)
- [ ] Программы на 4-12 недель (5x5, PPL, Upper/Lower)
- [ ] Трекинг воды
- [ ] Сканер штрих-кодов для питания
- [ ] Голосовой ввод для быстрого логирования
- [ ] AI/ML предсказания оптимального времени тренировки
- [ ] Экспорт прогресса в изображение для соцсетей
- [ ] Виджеты для Android/iOS

### Известные ограничения
- Уведомления работают только когда браузер открыт (ограничение PWA)
- Тепловая карта не показывает интенсивность (только наличие/отсутствие)
- Экспорт питания пока не реализован (placeholder)

---

## Миграция с v2.0

1. Откройте приложение - данные сохранятся автоматически
2. Service Worker обновится до v3
3. Новые модули загрузятся в кэш
4. Рекомендуется сделать бэкап: Settings → Export All Data

**Совместимость**: Полная обратная совместимость с данными v2.0

---

## Благодарности

Разработано с использованием Claude Code (claude.ai/code)
Вдохновлено философией Киётаки Аянокоджи из "Classroom of the Elite"

**Текущая версия**: 3.2.0  
**Дата релиза**: 2026-05-06  
**Тестов**: 34/34 ✅

---

## Version History Summary

- **v3.2.0** (2026-05-06): Priorities System + Command Palette expansion + Tab reorganization
- **v3.1.0** (2026-05-03): Command Palette + Tab improvements + Module fixes
- **v3.0.0** (2026-05-01): Progressive Overload + Achievements + Notifications + Heatmap + Theme + Export

---

[3.2.0]: https://github.com/DeXii/workout/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/DeXii/workout/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/DeXii/workout/releases/tag/v3.0.0
