/**
 * Ayanokoji System v2 - State Management
 * Reactive state store with subscriptions and Firebase sync
 */

class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Map();
    this.subscriberId = 0;
    this.syncTimeout = null;
    this.syncDebounceMs = window.AYANOKOJI_CONFIG?.app?.syncDebounceMs || 500;
  }

  getState() {
    return { ...this.state };
  }

  setState(updates, skipSync = false) {
    const oldState = { ...this.state };
    
    // Deep merge for nested objects
    this._deepMerge(this.state, updates);
    
    // Notify listeners
    this._notifyListeners(updates, oldState);
    
    // Trigger Firebase sync with debounce
    if (!skipSync && window.AYANOKOJI_FEATURES?.enableFirebaseSync) {
      this._scheduleSync(updates);
    }
    
    return this.state;
  }

  _deepMerge(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          this._deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
  }

  subscribe(callback, keys = null) {
    const id = ++this.subscriberId;
    this.listeners.set(id, { callback, keys });
    window.AyanokojiLogger.debug('Store subscriber added', { id, keys });
    return () => this.unsubscribe(id);
  }

  unsubscribe(id) {
    this.listeners.delete(id);
    window.AyanokojiLogger.debug('Store subscriber removed', { id });
  }

  _notifyListeners(changes, oldState) {
    this.listeners.forEach(({ callback, keys }) => {
      if (!keys || Object.keys(changes).some(k => keys.includes(k))) {
        try {
          callback(this.state, changes, oldState);
        } catch (error) {
          window.AyanokojiLogger.error('Error in store listener', error, { listenerId: id });
        }
      }
    });
  }

  _scheduleSync(updates) {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    
    this.syncTimeout = setTimeout(() => {
      this._syncToFirebase();
    }, this.syncDebounceMs);
  }

  async _syncToFirebase() {
    if (!window.FirebaseSync) {
      window.AyanokojiLogger.warn('Firebase sync not available');
      return;
    }

    try {
      await window.FirebaseSync.saveState(this.state);
      window.AyanokojiLogger.info('State synced to Firebase');
    } catch (error) {
      window.AyanokojiLogger.error('Failed to sync state to Firebase', error);
    }
  }

  async loadFromFirebase() {
    if (!window.FirebaseSync) {
      window.AyanokojiLogger.warn('Firebase sync not available');
      return;
    }

    try {
      const data = await window.FirebaseSync.loadState();
      if (data) {
        this.setState(data, true); // Skip sync to prevent loop
        window.AyanokojiLogger.info('State loaded from Firebase');
      }
    } catch (error) {
      window.AyanokojiLogger.error('Failed to load state from Firebase', error);
    }
  }

  // Persist to localStorage as backup
  persistToLocal() {
    try {
      localStorage.setItem('ayanokoji_state', JSON.stringify(this.state));
      window.AyanokojiLogger.debug('State persisted to localStorage');
    } catch (error) {
      window.AyanokojiLogger.error('Failed to persist state to localStorage', error);
    }
  }

  loadFromLocal() {
    try {
      const data = localStorage.getItem('ayanokoji_state');
      if (data) {
        const parsed = JSON.parse(data);
        this.setState(parsed, true);
        window.AyanokojiLogger.info('State loaded from localStorage');
      }
    } catch (error) {
      window.AyanokojiLogger.error('Failed to load state from localStorage', error);
    }
  }
}

// Create global store instance with default state
window.AyanokojiStore = new Store({
  user: {
    uid: null,
    name: '',
    createdAt: null
  },
  settings: {
    theme: 'dark',
    language: 'ru',
    notifications: true,
    firebaseSync: true
  },
  workout: {
    logs: [],
    schedule: {},
    progress: {}
  },
  mental: {
    journal: [],
    mood: [],
    goals: []
  },
  nutrition: {
    meals: [],
    water: 0
  },
  ui: {
    activeSection: 'dashboard',
    loading: false
  }
});
