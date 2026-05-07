# ⚡ Ayanokoji System v3.3

> Продвинутый трекер тренировок и личного развития с системой приоритетов, Command Palette и умной навигацией

[![Tests](https://img.shields.io/badge/tests-34%2F34%20passing-brightgreen)]()
[![Version](https://img.shields.io/badge/version-3.3.0-blue)]()
[![PWA](https://img.shields.io/badge/PWA-ready-purple)]()

## 🚀 Что нового в v3.3.0

### 🌬️ Новые таймеры дыхания
Полностью переработанные автономные таймеры для практик дыхания:

**Резонансное дыхание (HRV & Дыхание)**
- ✅ Анимированный круг с плавным расширением/сжатием
- ✅ Точные 5 секунд вдох, 5 секунд выдох
- ✅ Звуковые сигналы начала/конца фаз
- ✅ Счетчик циклов
- ✅ Wake Lock API (экран не гаснет на мобильных)

**Квадратное дыхание (Box Breathing)**
- ✅ 4 фазы по 4 секунды: вдох → задержка → выдох → задержка
- ✅ Анимация квадрата с заполнением по фазам
- ✅ Эмодзи-индикаторы текущей фазы (👃吸气 → ⏸️ задержка → 👃 выдох → ⏸️ задержка)
- ✅ Звуковые клики при смене фаз
- ✅ Пульсация на задержке

**Mori Breathing (Mori)**
- ✅ 3-ступенчатая техника: 10 сек вдох → 10 сек задержка → 10 сек выдох
- ✅ Аудио плеер с файлом MoriBreath.mp3
- ✅ Выбор стадии: Ступень 1 / Ступень 2 / Ступень 3
- ✅ Визуальный индикатор с анимацией

### 🗑️ Удалено
- ❌ QCT вкладка (дублировала функционал других разделов)
- ❌ Старый таймер breath-timer.js (заменен на встроенные таймеры)

<details>
<summary>📖 История изменений (предыдущие версии)</summary>

## 🚀 Что нового в v3.2.0

### 🎯 Система приоритетов
Иерархия всех 28 задач по важности:
- ✅ Ранжирование от 1 (самое важное) до 28
- ✅ 4 категории: Очень важные, Важные, Средние, Второстепенные
- ✅ Цветовая кодировка для быстрой навигации
- ✅ Отдельная главная вкладка "Приоритеты"

### ⌘ Command Palette (Ctrl+K)
Быстрая навигация по всему приложению:
- ✅ 86 команд с иконками и описаниями
- ✅ Fuzzy search по названиям и ключевым словам
- ✅ Навигация стрелками и Enter
- ✅ Backdrop blur эффект
- ✅ Иерархическая структура (разделы → подразделы → вкладки)

### 📑 Улучшенная навигация по вкладкам
Все 9 секций с улучшенной организацией:
- ✅ Sticky scroll для вкладок (остаются видимыми при прокрутке)
- ✅ Иконки для всех вкладок
- ✅ Логическая группировка с визуальными разделителями
- ✅ Badges для вкладок с особым статусом
- ✅ Удалены дубликаты (HRV, Skills)

## 🚀 Что нового в v3.1.0

### ⌘ Command Palette
Первая версия быстрой навигации:
- ✅ Keyboard-driven интерфейс (Ctrl+K)
- ✅ Поиск по всем разделам
- ✅ Быстрые действия

### 📑 Улучшенные вкладки
Косметические улучшения:
- ✅ Sticky positioning
- ✅ Иконки и группировка
- ✅ Улучшенная читаемость

## 🚀 Что нового в v3.0

### 📈 Progressive Overload System
Интеллектуальная система прогрессивной перегрузки:
- ✅ Автоматические рекомендации по весам (+2.5кг верх, +5кг низ)
- ✅ Детекция плато (нет прогресса 2+ недели)
- ✅ Калькулятор 1RM (формула Epley)
- ✅ План прогрессии на 8 недель
- ✅ Оценка времени до целевого веса

### 🏆 Система достижений
Геймификация для мотивации:
- ✅ Streak counter с эмодзи (💪 → 🔥 → 🔥🔥 → 🔥🔥🔥)
- ✅ Badges: 10, 50, 100, 250, 500, 1000 тренировок
- ✅ Milestone серий: 7, 14, 30, 60, 100, 365 дней
- ✅ Personal Records tracking (вес, повторения, объем)

### 🔔 Push-уведомления
Умные напоминания:
- ✅ Напоминания о тренировках по расписанию
- ✅ Напоминания о воде каждые 2 часа
- ✅ Уведомления о пропущенных тренировках (20:00)
- ✅ Празднование новых PR и достижений
- ✅ Вибрация и интерактивные действия

### 📊 Тепловая карта активности
GitHub-style визуализация:
- ✅ Годовая карта (365 дней)
- ✅ Месячный календарь
- ✅ Статистика и процент выполнения
- ✅ Интерактивные tooltip
- ✅ Селектор года (2020-2026)

### 🌓 Светлая/темная тема
Переключатель темы:
- ✅ Две темы (dark/light)
- ✅ Автоопределение системной темы
- ✅ Сохранение предпочтений
- ✅ Плавные переходы

### 💾 Экспорт и импорт
Полный контроль над данными:
- ✅ Экспорт в CSV (тренировки, пробежки, сон)
- ✅ Экспорт в JSON (полный бэкап)
- ✅ Импорт из JSON
- ✅ Автоматический бэкап раз в неделю

### 📈 Enhanced Dashboard
Комплексная панель:
- ✅ Быстрая статистика (серия, тренировки, объем, восстановление)
- ✅ Статус дня с кнопкой "Начать"
- ✅ Предупреждения о плато
- ✅ Рекомендации по весам
- ✅ Тепловая карта
- ✅ Быстрые действия

</details>

---

## 📦 Установка

### Локальный запуск

```bash
# Клонировать репозиторий
git clone <repo-url>
cd "workout-3 — копия"

# Установить зависимости
npm install

# Открыть в браузере
# Вариант 1: Прямое открытие
open index.html

# Вариант 2: Локальный сервер
npx serve
# или
python -m http.server 8000
```

### Требования

- Современный браузер с поддержкой:
  - Service Workers
  - Notifications API
  - LocalStorage
  - ES6+
  - Web Audio API (для таймеров дыхания)
  - Wake Lock API (опционально, для мобильных)
- Node.js 16+ (только для разработки/тестов)

---

## 🧪 Тестирование

```bash
# Запустить все тесты
npm test

# Запустить в watch режиме
npm run test:watch

# Линтинг
npm run lint

# Форматирование
npm run format
```

**Результаты**: 34/34 тестов проходят ✅

---

## 📁 Структура проекта

```
workout-3 — копия/
├── index.html                    # Главный файл приложения
├── sw.js                         # Service Worker v3
├── manifest.webmanifest          # PWA manifest
├── offline.html                  # Offline fallback
│
├── audio/                        # Аудио файлы
│   └── MoriBreath.mp3           # Аудио для Mori breathing
│
├── js/
│   ├── core/                     # Бизнес-логика (тестируемая)
│   │   ├── macros.js            # Калькулятор питания
│   │   ├── validation.js        # Валидация входных данных
│   │   ├── state.js             # Управление состоянием
│   │   ├── task-engine.js       # Конвертация расписания в задачи
│   │   ├── achievements.js      # Streak и badges
│   │   ├── recovery.js          # Сон и восстановление
│   │   └── progressive-overload.js  # Прогрессивная перегрузка
│   │
│   ├── pr-tracker.js            # Трекинг личных рекордов
│   ├── achievements-ui.js       # UI для достижений
│   ├── export.js                # Экспорт/импорт данных
│   ├── notifications.js         # Push-уведомления
│   ├── heatmap.js               # Тепловая карта
│   ├── theme.js                 # Переключатель темы
│   ├── dashboard.js             # Enhanced dashboard
│   └── dashboard-enhanced.js    # Дополнительные виджеты
│
├── tests/                        # Тесты (Vitest)
│   ├── macros.test.js           # 2 теста
│   ├── validation.test.js       # 3 теста
│   ├── achievements.test.js     # 8 тестов
│   ├── recovery.test.js         # 9 тестов
│   └── progressive-overload.test.js  # 12 тестов
│
├── CLAUDE.md                     # Документация для Claude Code
├── CHANGELOG.md                  # История изменений
├── INTEGRATION.md                # Руководство по интеграции
└── README.md                     # Этот файл
```

---

## 🎯 Основные возможности

### Тренировки
- ✅ Логирование тренировок (push/pull/legs/full)
- ✅ Детальные логи упражнений (сеты, повторения, вес)
- ✅ Трекинг личных рекордов (PR)
- ✅ Рекомендации по весам
- ✅ Детекция плато

### Пробежки
- ✅ Дистанция, время, темп
- ✅ Средний и максимальный пульс
- ✅ Типы: long/sprint

### Сон и восстановление
- ✅ Часы сна, качество (1-10)
- ✅ Уровень усталости (1-10)
- ✅ Боль в мышцах / DOMS (0-10)
- ✅ Recovery score (0-100%)
- ✅ Рекомендации по deload неделе

### Дыхательные практики
- ✅ Резонансное дыхание (5/5 сек)
- ✅ Квадратное дыхание (4/4/4/4 сек)
- ✅ Mori breathing (10/10/10 сек, 3 ступени)
- ✅ Звуковые сигналы и Wake Lock

### Питание
- ✅ Калькулятор макросов (BMR, TDEE)
- ✅ Цели: maintain, cut, bulk, recomp
- ✅ Формула Mifflin-St Jeor

### Расписание
- ✅ Кастомное расписание (trainDay/restDay)
- ✅ Конвертация в задачи
- ✅ Трекинг выполнения

### Аналитика
- ✅ Тепловая карта активности
- ✅ Графики прогресса (Chart.js)
- ✅ Статистика серий
- ✅ Объем за неделю

### Синхронизация
- ✅ Firebase Realtime Database
- ✅ Offline-first (Service Worker)
- ✅ Автоматический sync

---

## 🔧 API Reference

### Breathing Timers

```javascript
// Резонансное дыхание
startResonantBreathing();   // Запуск таймера
stopResonantBreathing();    // Остановка

// Квадратное дыхание
startBoxBreathing();        // Запуск таймера
stopBoxBreathing();         // Остановка

// Mori breathing
startMoriBreathing();       // Запуск таймера
stopMoriBreathing();        // Остановка
selectMoriStage(1);         // Выбор ступени (1-3)
```

### Progressive Overload

```javascript
// Рекомендация по весу
const rec = window.ASCore.progressiveOverload.calculateRecommendedWeight(
  'Bench Press',
  window.S.personalRecords,
  window.S.workoutLogs
);
// → { current: 80, recommended: 82.5, reason: "...", increment: 2.5 }

// Детекция плато
const plateaus = window.ASCore.progressiveOverload.getAllPlateaus(
  window.S.personalRecords,
  window.S.workoutLogs,
  2 // weeks
);

// Калькулятор 1RM
const oneRM = window.ASCore.progressiveOverload.calculate1RM(100, 5);
// → 116.67

// План прогрессии
const plan = window.ASCore.progressiveOverload.getProgressionPlan(
  'Bench Press',
  80,  // current
  100, // target
  8    // weeks
);
```

### Achievements

```javascript
// Текущая серия
const streak = window.ASCore.achievements.calculateStreak(window.S.done);

// Лучшая серия
const longest = window.ASCore.achievements.calculateLongestStreak(window.S.done);

// Все достижения
const achievements = window.ASCore.achievements.checkAchievements(window.S);

// Личные рекорды
const prs = window.ASCore.achievements.calculatePersonalRecords(window.S.workoutLogs);
```

### Notifications

```javascript
// Инициализация
window.notificationModule.initNotifications();

// Запланировать напоминание
window.notificationModule.scheduleWorkoutReminder('06:00', 'Утренняя тренировка');

// Уведомить о PR
window.notificationModule.notifyNewPR('Bench Press', 'weight', 100);

// Уведомить о milestone
window.notificationModule.notifyStreakMilestone(30);
```

### Heatmap

```javascript
// Годовая карта
window.heatmapModule.renderHeatmap('container-id', window.S.done, 2026);

// Месячная карта
window.heatmapModule.renderMonthlyHeatmap('container-id', window.S.done, 2026, 5);
```

### Theme

```javascript
// Переключить тему
window.toggleTheme();

// Применить конкретную тему
window.themeModule.applyTheme('light');

// Получить текущую тему
const theme = window.themeModule.getCurrentTheme(); // 'dark' | 'light'
```

### Export

```javascript
// Экспорт тренировок в CSV
window.exportWorkoutsToCSV();

// Полный бэкап в JSON
window.exportAllDataToJSON();

// Импорт из JSON
window.importFromJSON();
```

---

## 🎨 Кастомизация

### Изменение цветовой схемы

Отредактируйте `js/theme.js`:

```javascript
const themes = {
  dark: {
    bg1: '#0a0a0f',  // Основной фон
    a1: '#00d4ff',   // Акцентный цвет 1
    // ...
  },
  light: {
    bg1: '#ffffff',
    a1: '#0066cc',
    // ...
  }
};
```

### Изменение параметров дыхания

Параметры таймеров находятся в `index.html`:

```javascript
// Резонансное дыхание (миллисекунды)
const RESONANT_CONFIG = {
  INHALE_MS: 5000,
  EXHALE_MS: 5000
};

// Квадратное дыхание
const BOX_CONFIG = {
  INHALE_MS: 4000,
  HOLD_IN_MS: 4000,
  EXHALE_MS: 4000,
  HOLD_OUT_MS: 4000
};

// Mori breathing
const MORI_CONFIG = {
  INHALE_MS: 10000,
  HOLD_MS: 10000,
  EXHALE_MS: 10000
};
```

### Добавление нового типа достижения

Отредактируйте `js/core/achievements.js`:

```javascript
const workoutMilestones = [
  { count: 10, badge: '🥉', title: 'Первые 10', desc: '...' },
  { count: 2000, badge: '👑👑', title: 'Легенда 2.0', desc: '...' }, // NEW
];
```

---

## 📚 Документация

- **[CLAUDE.md](./CLAUDE.md)** - Полная документация для разработки
- **[CHANGELOG.md](./CHANGELOG.md)** - История изменений v3.0
- **[INTEGRATION.md](./INTEGRATION.md)** - Руководство по интеграции модулей

---

## 🐛 Известные ограничения

1. **Уведомления**: Работают только когда браузер открыт (ограничение PWA)
2. **Тепловая карта**: Не показывает интенсивность, только наличие/отсутствие
3. **Экспорт питания**: Пока не реализован (placeholder)
4. **Offline sync**: Firebase sync требует интернет-соединения
5. **Wake Lock API**: Поддерживается не всеми браузерами

---

## 🛣️ Roadmap

### v3.4 (Планируется)
- [ ] Шаблоны тренировок (сохранить и переиспользовать)
- [ ] Программы на 4-12 недель (5x5, PPL, Upper/Lower)
- [ ] Трекинг воды
- [ ] Meal timing

### v3.5 (Планируется)
- [ ] Сканер штрих-кодов для питания
- [ ] База продуктов (OpenFoodFacts API)
- [ ] Голосовой ввод
- [ ] Экспорт прогресса в изображение

### v4.0 (Будущее)
- [ ] AI/ML предсказания оптимального времени тренировки
- [ ] Детекция перетренированности
- [ ] Виджеты для Android/iOS
- [ ] Социальные функции (шаринг достижений)

---

## 🤝 Contributing

Проект разработан с использованием Claude Code (claude.ai/code).

### Как добавить новый модуль

1. Создайте файл в `js/` или `js/core/`
2. Экспортируйте через `window.ASCore.moduleName`
3. Добавьте в `sw.js` в `STATIC_CACHE`
4. Создайте тесты в `tests/`
5. Обновите документацию

### Запуск тестов

```bash
npm test
```

---

## 📄 Лицензия

Этот проект создан для личного использования.

---

## 🙏 Благодарности

- Вдохновлено философией Киётаки Аянокоджи из "Classroom of the Elite"
- Разработано с помощью Claude Code (claude.ai/code)
- Тестирование: Vitest
- Графики: Chart.js
- Backend: Firebase

---

## 📞 Поддержка

Для вопросов и предложений:
- Создайте issue в репозитории
- Или свяжитесь через [контакты]

---

**Версия**: 3.3.0  
**Дата релиза**: 2026-05-07  
**Тестов**: 34/34 ✅  
**Модулей**: 15  
**Строк кода**: ~3500+ (без index.html)

---

Made with ⚡ and 💪
