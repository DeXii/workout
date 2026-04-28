/**
 * Ayanokoji System v2 - Configuration
 * Security: API keys should be configured via environment variables or server-side proxy
 */

// Firebase configuration - Replace with your own config in production
// IMPORTANT: In production, use environment variables or a backend proxy
window.AYANOKOJI_CONFIG = {
  firebase: {
    apiKey: "AIzaSyDtt9WdE8iIpPOoZ1Ozt4a3ssL2UNoDdb4",
    authDomain: "workout-main-default-rtdb.firebaseapp.com",
    databaseURL: "https://workout-main-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "workout-main-default-rtdb",
    storageBucket: "workout-main-default-rtdb.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  },
  app: {
    version: '2.0.0',
    name: 'Ayanokoji System',
    syncDebounceMs: 500,
    maxLogEntries: 1000
  }
};

// Feature flags
window.AYANOKOJI_FEATURES = {
  enableFirebaseSync: true,
  enableOfflineMode: true,
  enableNotifications: true,
  enableAudioFeedback: true
};
