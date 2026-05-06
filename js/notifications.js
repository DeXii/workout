/**
 * Push Notifications Module
 * Handles workout reminders, motivational messages, and achievement notifications
 */

/* global notify, logAction, nav */

let notificationPermission = 'default';

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    notificationPermission = 'granted';
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    notificationPermission = permission;
    return permission === 'granted';
  }

  return false;
}

function showNotification(title, options = {}) {
  if (notificationPermission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  const defaultOptions = {
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'ayanokoji-notification',
    requireInteraction: false
  };

  const notificationOptions = { ...defaultOptions, ...options };

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Use service worker for persistent notifications
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, notificationOptions);
    });
  } else {
    // Fallback to regular notification
    new Notification(title, notificationOptions);
  }
}

function scheduleWorkoutReminder(time, workoutName) {
  // Schedule notification for specific time
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

  // If time has passed today, schedule for tomorrow
  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime - now;

  setTimeout(() => {
    showNotification('⏰ Время тренировки!', {
      body: `Пора начинать: ${workoutName}`,
      tag: 'workout-reminder',
      requireInteraction: true,
      actions: [
        { action: 'start', title: 'Начать' },
        { action: 'snooze', title: 'Отложить на 10 мин' }
      ]
    });
  }, delay);

  console.log(`Workout reminder scheduled for ${scheduledTime.toLocaleTimeString()}`);
}

function scheduleWaterReminder() {
  // Remind to drink water every 2 hours
  const interval = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  setInterval(() => {
    const now = new Date();
    const hour = now.getHours();

    // Only during waking hours (6am - 10pm)
    if (hour >= 6 && hour < 22) {
      showNotification('💧 Время пить воду!', {
        body: 'Не забывай про гидратацию',
        tag: 'water-reminder',
        icon: '💧'
      });
    }
  }, interval);
}

function notifyMissedWorkout() {
  const today = new Date().toISOString().split('T')[0];
  const todayWorkout = window.S?.done?.[today];

  if (!todayWorkout) {
    const now = new Date();
    const hour = now.getHours();

    // Check at 8pm if workout was missed
    if (hour === 20) {
      showNotification('⚠️ Пропущена тренировка', {
        body: 'Сегодня ты еще не тренировался. Не прерывай серию!',
        tag: 'missed-workout',
        requireInteraction: true
      });
    }
  }
}

function notifyAchievement(achievement) {
  showNotification(`🏆 ${achievement.title}`, {
    body: achievement.desc,
    tag: 'achievement',
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200]
  });
}

function notifyNewPR(exercise, prType, value) {
  const messages = {
    weight: `Новый рекорд веса: ${value}кг!`,
    reps: `Новый рекорд повторений: ${value}!`,
    volume: `Новый рекорд объёма: ${value}кг!`
  };

  showNotification(`💪 ${exercise}`, {
    body: messages[prType] || 'Новый личный рекорд!',
    tag: 'new-pr',
    requireInteraction: true,
    vibrate: [300, 100, 300]
  });
}

function notifyStreakMilestone(streak) {
  const milestones = {
    7: { emoji: '🔥', message: 'Неделя без пропусков!' },
    14: { emoji: '🔥🔥', message: 'Две недели подряд!' },
    30: { emoji: '⭐', message: 'Месяц дисциплины!' },
    60: { emoji: '⭐⭐', message: 'Два месяца подряд!' },
    100: { emoji: '💯', message: 'Сотня дней!' },
    365: { emoji: '🎯', message: 'Год без пропусков!' }
  };

  const milestone = milestones[streak];
  if (milestone) {
    showNotification(`${milestone.emoji} ${streak} дней подряд!`, {
      body: milestone.message,
      tag: 'streak-milestone',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200, 100, 200]
    });
  }
}

function setupDailyNotifications() {
  // Check for missed workouts daily at 8pm
  const checkTime = new Date();
  checkTime.setHours(20, 0, 0, 0);

  const now = new Date();
  let delay = checkTime - now;

  if (delay < 0) {
    // If 8pm has passed, schedule for tomorrow
    delay += 24 * 60 * 60 * 1000;
  }

  setTimeout(() => {
    notifyMissedWorkout();
    // Repeat daily
    setInterval(notifyMissedWorkout, 24 * 60 * 60 * 1000);
  }, delay);
}

function initNotifications() {
  requestNotificationPermission().then(granted => {
    if (granted) {
      console.log('Notifications enabled');

      // Setup daily checks
      setupDailyNotifications();

      // Setup water reminders if enabled
      const waterRemindersEnabled = localStorage.getItem('ay_water_reminders') === 'true';
      if (waterRemindersEnabled) {
        scheduleWaterReminder();
      }

      // Schedule workout reminders based on custom schedule
      if (window.S?.customSchedule) {
        const schedule = window.S.customSchedule.trainDay || [];
        schedule.forEach(block => {
          if (block[2] === 'train') {
            scheduleWorkoutReminder(block[0], block[3] || 'Тренировка');
          }
        });
      }
    } else {
      console.log('Notification permission denied');
    }
  });
}

// Service Worker message handler for notification actions
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data.type === 'notification-action') {
      const action = event.data.action;

      if (action === 'start') {
        // Navigate to workout section
        if (typeof nav === 'function') {
          nav('workout');
        }
      } else if (action === 'snooze') {
        // Snooze for 10 minutes
        setTimeout(() => {
          showNotification('⏰ Напоминание о тренировке', {
            body: 'Пора начинать тренировку!',
            tag: 'workout-reminder-snooze'
          });
        }, 10 * 60 * 1000);
      }
    }
  });
}

// Export functions
if (typeof window !== 'undefined') {
  window.notificationModule = {
    requestNotificationPermission,
    showNotification,
    scheduleWorkoutReminder,
    scheduleWaterReminder,
    notifyMissedWorkout,
    notifyAchievement,
    notifyNewPR,
    notifyStreakMilestone,
    initNotifications
  };
}
