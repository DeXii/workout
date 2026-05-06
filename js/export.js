/**
 * Data Export Module
 * Exports workout, nutrition, sleep data to CSV and JSON formats
 */

/* global notify, saveLocal, logAction, refreshAll */

function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    if (typeof notify === 'function') {
      notify('Нет данных для экспорта', 'error');
    }
    return;
  }

  // Get all unique keys from all objects
  const allKeys = [...new Set(data.flatMap(obj => Object.keys(obj)))];

  // Create CSV header
  let csv = allKeys.join(',') + '\n';

  // Create CSV rows
  data.forEach(row => {
    const values = allKeys.map(key => {
      const value = row[key];
      if (value === null || value === undefined) return '';

      // Escape quotes and wrap in quotes if contains comma or newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
      }
      return stringValue;
    });
    csv += values.join(',') + '\n';
  });

  // Download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (typeof notify === 'function') {
    notify(`Экспортировано в ${filename}`, 'success');
  }
}

function exportWorkoutsToCSV() {
  const workouts = [];

  // Export from workoutLogs (detailed structure)
  if (window.S.workoutLogs) {
    Object.keys(window.S.workoutLogs).forEach(date => {
      const dayWorkouts = window.S.workoutLogs[date];
      Object.keys(dayWorkouts).forEach(workoutType => {
        const workout = dayWorkouts[workoutType];
        if (workout.exercises) {
          workout.exercises.forEach(exercise => {
            if (exercise.sets) {
              exercise.sets.forEach((set, setIndex) => {
                workouts.push({
                  date,
                  workoutType,
                  exercise: exercise.name,
                  setNumber: setIndex + 1,
                  weight: set.weight || 0,
                  reps: set.reps || 0,
                  volume: (set.weight || 0) * (set.reps || 0)
                });
              });
            }
          });
        }
      });
    });
  }

  // Fallback to simple done object
  if (workouts.length === 0 && window.S.done) {
    Object.keys(window.S.done).forEach(date => {
      workouts.push({
        date,
        workoutType: window.S.done[date],
        completed: true
      });
    });
  }

  const filename = `ayanokoji_workouts_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(workouts, filename);
}

function exportRunsToCSV() {
  if (!window.S.runs || window.S.runs.length === 0) {
    if (typeof notify === 'function') {
      notify('Нет данных о пробежках для экспорта', 'error');
    }
    return;
  }

  const runs = window.S.runs.map(run => ({
    date: run.date,
    type: run.type,
    distance: run.distance,
    time: run.time,
    pace: run.pace,
    avgHeartRate: run.avgHr || '',
    maxHeartRate: run.maxHr || '',
    notes: run.notes || ''
  }));

  const filename = `ayanokoji_runs_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(runs, filename);
}

function exportSleepToCSV() {
  if (!window.S.sleepLogs) {
    if (typeof notify === 'function') {
      notify('Нет данных о сне для экспорта', 'error');
    }
    return;
  }

  const sleepData = [];
  Object.keys(window.S.sleepLogs).forEach(date => {
    const entry = window.S.sleepLogs[date];
    sleepData.push({
      date,
      hours: entry.hours,
      quality: entry.quality,
      fatigue: entry.fatigue,
      soreness: entry.soreness,
      notes: entry.notes || ''
    });
  });

  if (sleepData.length === 0) {
    if (typeof notify === 'function') {
      notify('Нет данных о сне для экспорта', 'error');
    }
    return;
  }

  const filename = `ayanokoji_sleep_${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(sleepData, filename);
}

function exportNutritionToCSV() {
  // This would export nutrition data if tracked
  // Placeholder for future implementation
  if (typeof notify === 'function') {
    notify('Экспорт питания будет добавлен в следующей версии', 'info');
  }
}

function exportAllDataToJSON() {
  // Ensure state is initialized
  if (!window.S) {
    console.error('State not initialized');
    if (typeof notify === 'function') {
      notify('Ошибка: состояние не инициализировано', 'error');
    }
    return;
  }

  const exportData = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    data: {
      done: window.S.done || {},
      workouts: window.S.workouts || [],
      runs: window.S.runs || [],
      workoutLogs: window.S.workoutLogs || {},
      sleepLogs: window.S.sleepLogs || {},
      personalRecords: window.S.personalRecords || {},
      customSchedule: window.S.customSchedule || null,
      history: window.S.history || []
    }
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  const filename = `ayanokoji_backup_${new Date().toISOString().split('T')[0]}.json`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (typeof notify === 'function') {
    notify(`Полный бэкап сохранен: ${filename}`, 'success');
  }
  if (typeof logAction === 'function') {
    logAction(`📦 Экспорт всех данных в JSON`);
  }
}

function importFromJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importData = JSON.parse(event.target.result);

        if (!importData.data) {
          if (typeof notify === 'function') {
            notify('Неверный формат файла', 'error');
          }
          return;
        }

        // Confirm before overwriting
        if (!confirm('Импорт перезапишет текущие данные. Продолжить?')) {
          return;
        }

        // Merge imported data
        Object.keys(importData.data).forEach(key => {
          if (importData.data[key] !== undefined) {
            window.S[key] = importData.data[key];
          }
        });

        if (typeof saveLocal === 'function') {
          saveLocal();
        }
        if (typeof notify === 'function') {
          notify('Данные успешно импортированы', 'success');
        }
        if (typeof logAction === 'function') {
          logAction(`📥 Импорт данных из ${file.name}`);
        }

        // Refresh UI
        if (typeof refreshAll === 'function') {
          refreshAll();
        }
      } catch (error) {
        if (typeof notify === 'function') {
          notify('Ошибка при импорте: ' + error.message, 'error');
        }
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

function setupAutoBackup() {
  // Auto backup once per week
  const lastBackup = localStorage.getItem('ay_last_backup');
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  if (!lastBackup || (now - parseInt(lastBackup)) > oneWeek) {
    exportAllDataToJSON();
    localStorage.setItem('ay_last_backup', now.toString());
  }
}

// Export functions
if (typeof window !== 'undefined') {
  window.exportToCSV = exportToCSV;
  window.exportWorkoutsToCSV = exportWorkoutsToCSV;
  window.exportRunsToCSV = exportRunsToCSV;
  window.exportSleepToCSV = exportSleepToCSV;
  window.exportNutritionToCSV = exportNutritionToCSV;
  window.exportAllDataToJSON = exportAllDataToJSON;
  window.importFromJSON = importFromJSON;
  window.setupAutoBackup = setupAutoBackup;
}
