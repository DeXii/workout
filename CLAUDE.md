# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ayanokoji System v3.2 - A vanilla JavaScript workout and life tracking PWA. Single-page application with Firebase sync, offline-first architecture, and comprehensive tracking for workouts, nutrition, schedule, sleep/recovery, achievements, personal records, and progressive overload. UI is in Russian.

**Tech Stack**: Vanilla JavaScript (ES6+), Firebase Realtime Database, Service Worker (offline-first), Chart.js, Vitest

## Development Commands

```bash
# Start local server
npm start          # http-server on port 8080

# Development with live reload
npm run dev        # live-server on port 8080

# Testing
npm test           # Run all tests with Vitest
npm run test:watch # Watch mode
npx vitest run tests/validation.test.js  # Run single test file

# Linting
npm run lint       # ESLint check
npm run lint:fix   # Auto-fix lint issues

# Formatting
npm run format     # Prettier format all files
npm run format:check # Check formatting
```

## Architecture

### Single-File Application

The entire UI is in `index.html` (~10,000+ lines). This is intentional for simplicity and offline-first performance. The file contains:
- Inline CSS (custom properties for theming)
- HTML structure with multiple sections (hidden/shown via `.active` class)
- Inline JavaScript for UI logic, Firebase sync, and rendering

### Core Modules (`js/core/`)

Extracted business logic that can be tested independently:

**`macros.js`** - Nutrition calculator
- `calculateMacros(input)` - Calculates BMR, TDEE, and macro targets based on Mifflin-St Jeor equation
- Supports goals: maintain, cut, bulk, recomp
- Returns protein (1.8g/kg), fat (0.9g/kg), carbs (remainder)

**`validation.js`** - Input sanitization
- `sanitizeWorkoutDate(rawValue)` - Validates YYYY-MM-DD format
- `sanitizeWorkoutSets(rawSets)` - Clamps sets to 0-200, filters zeros
- `sanitizeRunInput(input)` - Validates and clamps run data (distance, time, HR)

**`state.js`** - State management
- `updateState(mutator)` - Updates global `window.S` and triggers `saveLocal()`
- Minimal abstraction over direct state mutation

**`task-engine.js`** - Schedule-to-task conversion
- `mapScheduleToTasks(scheduleRows, dateKey)` - Converts schedule array to task objects
- `pickCurrentTask(tasks, statuses, nowMinutes)` - Finds next pending task
- `normalizeHm(value)` - Parses and normalizes HH:MM time strings
- Task sources: body (train, run, food), mind (study, chess, books), control (mind)

**`progressive-overload.js`** - Progressive overload system
- `calculate1RM(weight, reps)` - Calculates one-rep max using Epley formula
- `calculateRecommendedWeight(exerciseName, personalRecords, workoutLogs)` - Recommends next weight based on recent performance
- `detectPlateaus(exerciseName, workoutLogs, weeks)` - Detects training plateaus (no progress for N weeks)
- `getAllPlateaus(personalRecords, workoutLogs, weeks)` - Returns all exercises with plateaus
- `getProgressionPlan(exerciseName, currentWeight, targetWeight, weeks)` - Creates linear progression plan
- `estimateTimeToGoal(exerciseName, currentWeight, targetWeight, personalRecords, workoutLogs)` - Estimates weeks to reach target weight

**`achievements.js`** - Streak and gamification system
- `calculateStreak(doneObj)` - Calculates current workout streak from today backwards
- `calculateLongestStreak(doneObj)` - Finds longest historical streak
- `checkAchievements(state)` - Returns unlocked badges and milestones
- `calculatePersonalRecords(workoutLogs)` - Extracts max weight/reps/volume per exercise
- `isNewPR(exerciseName, weight, reps, currentPRs)` - Checks if a set is a new personal record

**`recovery.js`** - Sleep and recovery tracking
- `validateSleepEntry(input)` - Sanitizes sleep data (hours, quality, fatigue, soreness)
- `calculateRecoveryScore(sleepEntry)` - Weighted score (0-100) from sleep metrics
- `getRecoveryStatus(score)` - Returns status object with emoji and text
- `shouldDeload(sleepLogs, workoutLogs, days)` - Detects if user needs deload week
- `getSleepRecommendation(sleepEntry)` - Returns actionable sleep advice
- `calculateSleepDebt(sleepLogs, days)` - Calculates cumulative sleep deficit

### Additional Modules (`js/`)

**`pr-tracker.js`** - Personal records integration
- `checkWorkoutPRs(workoutLog)` - Detects new PRs after workout save
- `showPRNotification(prs)` - Displays PR celebration notifications
- `renderPRs()` - Renders PR list in UI

**`achievements-ui.js`** - Achievements UI rendering
- `renderStreakCounter()` - Renders current and longest streak cards
- `renderAchievements()` - Renders achievement badges and milestones
- `renderProgressiveOverloadRecommendations()` - Shows weight recommendations for exercises
- `renderPlateauWarnings()` - Displays plateau warnings with suggestions

**`export.js`** - Data export/import
- `exportWorkoutsToCSV()` - Exports workout data to CSV
- `exportRunsToCSV()` - Exports run data to CSV
- `exportSleepToCSV()` - Exports sleep data to CSV
- `exportAllDataToJSON()` - Full backup to JSON
- `importFromJSON()` - Import data from JSON backup
- `setupAutoBackup()` - Auto-backup once per week

**`notifications.js`** - Push notifications
- `requestNotificationPermission()` - Requests notification permission
- `showNotification(title, options)` - Shows browser notification
- `scheduleWorkoutReminder(time, workoutName)` - Schedules workout reminder
- `scheduleWaterReminder()` - Reminds to drink water every 2 hours
- `notifyMissedWorkout()` - Notifies about missed workouts at 8pm
- `notifyAchievement(achievement)` - Celebrates achievements
- `notifyNewPR(exercise, prType, value)` - Celebrates new personal records
- `notifyStreakMilestone(streak)` - Celebrates streak milestones
- `initNotifications()` - Initializes notification system

**`heatmap.js`** - GitHub-style activity heatmap
- `generateHeatmapData(doneObj, startDate, endDate)` - Generates heatmap data
- `getHeatmapColor(count, theme)` - Returns color for activity level
- `renderHeatmap(containerId, doneObj, year)` - Renders yearly heatmap
- `renderMonthlyHeatmap(containerId, doneObj, year, month)` - Renders monthly calendar
- `renderYearSelector(containerId, currentYear, onYearChange)` - Year selector buttons

**`theme.js`** - Light/Dark theme switcher
- `applyTheme(themeName)` - Applies theme (dark/light)
- `toggleTheme()` - Toggles between themes
- `initTheme()` - Initializes theme from saved preference or system
- `getCurrentTheme()` - Returns current theme name
- `createThemeToggleButton()` - Creates theme toggle button HTML

**`dashboard.js`** / **`dashboard-enhanced.js`** - Dashboard rendering
- `renderEnhancedDashboard()` - Renders comprehensive dashboard with greeting, streak, workout count, weekly volume, recovery score
- `calculateWeeklyVolume()` - Calculates total volume for last 7 days

### State Structure (`window.S`)

Global state object stored in `localStorage` and synced to Firebase:

```javascript
window.S = {
  done: {},              // { "2026-05-01": "push", ... } - workout completion
  workouts: [],          // Array of workout objects with sets/reps
  runs: [],              // Array of run objects with distance/time/HR
  sleepLogs: {},         // { "2026-05-01": { hours, quality, fatigue, soreness } }
  workoutLogs: {},       // { "2026-05-01": { push: { exercises: [...] } } }
  personalRecords: {},   // { "Bench Press": { maxWeight, maxReps, maxVolume } }
  customSchedule: null,  // { trainDay: [...], restDay: [...] } or null for default
  history: [],           // Action log for debugging
  taskStatuses: {},      // Task completion tracking
  // ... other tracking data
}
```

### Firebase Sync

- User ID stored in `localStorage` as `ay_uid`
- Sync triggered on state changes via `saveLocal()` → `saveCloud()`
- Bidirectional: `loadCloud()` merges remote state on load
- Firebase config embedded in `index.html`

### Service Worker (`sw.js`)

- Cache name: `ayanokoji-v3`
- Strategy: Network-first for HTML, stale-while-revalidate for assets
- Offline fallback: `offline.html`
- Handles notification clicks for workout reminders
- Caches all core modules and UI modules

### Navigation

- Desktop: Top navbar with `.nb` buttons
- Mobile: Hamburger menu (`.hamburger`) + bottom nav (`.bottom-nav`)
- Sections toggled via `.sec.active` class
- URL hash routing (e.g., `#workout`, `#food`, `#pyramid`)

## Key Conventions

### Date Format
- All dates use `YYYY-MM-DD` format
- Date keys in `S.done`, `S.sleepLogs`, `S.workoutLogs` objects: `"2026-05-01"`
- Validated via `sanitizeWorkoutDate()`

### Schedule Format
Schedule rows are arrays: `[time, description, tag, title]`
- `time`: "HH:MM" (24-hour)
- `tag`: "train", "study", "food", "mind", "rest", "sleep", "work", "run", "chess"
- Tags map to task sources: body/mind/control

Example:
```javascript
["06:00", "Утренняя тренировка", "train", "Тренировка"],
["08:00", "Завтрак", "food", "Еда"],
["09:00", "Учёба", "study", "Учебный блок"]
```

### Workout Types
- `push` - Push day (chest, shoulders, triceps)
- `pull` - Pull day (back, biceps)
- `legs` - Leg day
- `full` - Full body
- `rest` - Rest day

### Run Types
- `long` - Long distance run
- `sprint` - Sprint/interval training

### Task Status
Tasks derived from schedule have completion tracked in `S.taskStatuses[taskId]`

### Sleep Metrics
- `hours`: 0-24 (decimal allowed, e.g., 7.5)
- `quality`: 1-10 scale
- `fatigue`: 1-10 scale (higher = more fatigued)
- `soreness`: 0-10 scale (DOMS intensity)

### Achievement Categories
- `workouts` - Total workout count milestones (10, 50, 100, 250, 500, 1000)
- `streak` - Longest streak milestones (7, 14, 30, 60, 100, 365 days)
- `current` - Current active streak status

### Personal Records
Each exercise tracks three PR types:
- `maxWeight` - Heaviest single set weight
- `maxReps` - Most reps in a single set
- `maxVolume` - Highest weight × reps product

## Testing

Tests use Vitest (Node.js, not browser) with globals (`describe`, `it`, `expect`). Core modules export via both `window.ASCore` (browser) and `module.exports` (Node/Vitest).

Existing tests (34 total):
- `tests/macros.test.js` - Macro calculation logic
- `tests/validation.test.js` - Input sanitization
- `tests/achievements.test.js` - Streak and badge logic
- `tests/recovery.test.js` - Sleep/recovery scoring
- `tests/progressive-overload.test.js` - 1RM, plateau detection, recommendations

## Common Patterns

### Adding a New Tracker
1. Add section HTML in `index.html` with `.sec` class and unique ID
2. Add navigation button with `onclick="nav('section-id')"`
3. Create render function (e.g., `renderNewTracker()`)
4. Add state fields to `window.S` initialization
5. Call render function in `refreshAll()`

### Adding a New Core Module
1. Create `js/core/module-name.js`
2. Export via `window.ASCore.moduleName` for browser
3. Export via `module.exports` for tests
4. Add to service worker cache in `sw.js`
5. Include `<script>` tag in `index.html` before main script

### Modifying State
Always use `saveLocal()` after mutations:
```javascript
window.S.done[dateKey] = "push";
saveLocal(); // Triggers localStorage + Firebase sync
```

Or use the state helper:
```javascript
updateState(S => {
  S.done[dateKey] = "push";
});
```

### Checking for New PRs
After saving a workout:
```javascript
const newPRs = checkWorkoutPRs(workoutLog);
if (newPRs.length > 0) {
  showPRNotification(newPRs);
}
```

### Recovery Score Integration
When displaying workout recommendations:
```javascript
const todayDate = new Date().toISOString().split('T')[0];
const sleepEntry = window.S.sleepLogs[todayDate];
if (sleepEntry) {
  const score = window.ASCore.recovery.calculateRecoveryScore(sleepEntry);
  const status = window.ASCore.recovery.getRecoveryStatus(score);
  // Use status.emoji, status.text for UI
}
```

## Important Notes

- **No Build Step**: Open `index.html` directly or use `npm start` / `npm run dev`
- **Inline Everything**: CSS and main JS are inline in `index.html` for offline performance
- **Firebase Optional**: App works offline-first. Firebase sync is optional enhancement
- **Global State**: `window.S` is the single source of truth
- **Manual DOM**: No framework. Direct DOM manipulation via `document.querySelector` and `innerHTML`
- **Mobile-First**: Responsive design with hamburger menu and bottom nav for mobile
- **Dual Export Pattern**: All core modules export to both `window.ASCore` (browser) and `module.exports` (Node/tests). This is required for Vitest to work.
- **Service Worker Updates**: When adding new core modules, update `STATIC_CACHE` array in `sw.js`
- **ESLint/Prettier**: Both are configured. `npm run lint:fix` auto-fixes issues. `npm run format` formats all files.
