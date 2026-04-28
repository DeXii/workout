/**
 * Ayanokoji System v2 - App Initialization
 * Main entry point for application initialization
 */

const App = {
  initialized: false,
  
  async init() {
    if (this.initialized) {
      window.AyanokojiLogger.warn('App already initialized');
      return;
    }

    try {
      window.AyanokojiLogger.info('Initializing Ayanokoji System v2...');
      
      // Initialize Firebase
      if (window.AYANOKOJI_FEATURES?.enableFirebaseSync) {
        await this.initFirebase();
      }
      
      // Load state from storage
      await this.loadState();
      
      // Setup event handlers
      this.setupEventHandlers();
      
      // Setup UI
      this.setupUI();
      
      // Mark as initialized
      this.initialized = true;
      
      window.AyanokojiLogger.info('Ayanokoji System initialized successfully');
      
      // Hide loading screen
      this.hideLoadingScreen();
      
      // Play startup sound
      if (window.AYANOKOJI_FEATURES?.enableAudioFeedback) {
        this.playStartupSound();
      }
      
    } catch (error) {
      window.AyanokojiLogger.error('Failed to initialize app', error);
      this.showError('Ошибка инициализации приложения');
    }
  },

  async initFirebase() {
    try {
      const success = await window.FirebaseSync.init();
      if (success) {
        // Check for stored user ID
        const storedUid = localStorage.getItem('ayanokoji_uid');
        if (storedUid) {
          window.FirebaseSync.setUserId(storedUid);
          window.AyanokojiStore.setState({ user: { uid: storedUid } });
        }
      }
    } catch (error) {
      window.AyanokojiLogger.error('Firebase initialization failed', error);
    }
  },

  async loadState() {
    // Try Firebase first if connected
    if (window.FirebaseSync.connected && window.FirebaseSync.userId) {
      await window.AyanokojiStore.loadFromFirebase();
    }
    
    // Fallback to localStorage
    window.AyanokojiStore.loadFromLocal();
  },

  setupEventHandlers() {
    // Navigation handlers will be attached here
    window.AyanokojiLogger.debug('Event handlers setup complete');
  },

  setupUI() {
    // Initial UI rendering
    this.updateConnectionStatus();
  },

  updateConnectionStatus() {
    const statusEl = document.getElementById('connection-status');
    if (statusEl) {
      const isConnected = window.FirebaseSync?.connected || false;
      statusEl.className = `sst ${isConnected ? 'on' : 'off'}`;
      statusEl.textContent = isConnected ? 'Синхронизация включена' : 'Офлайн режим';
    }
  },

  hideLoadingScreen() {
    const loadingEl = document.querySelector('.loading');
    if (loadingEl) {
      setTimeout(() => {
        loadingEl.classList.add('done');
        setTimeout(() => loadingEl.remove(), 500);
      }, 500);
    }
  },

  showError(message) {
    if (window.UI) {
      window.UI.showToast(message, 'error', 5000);
    } else {
      alert(message);
    }
  },

  playStartupSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      [0, 0.3, 0.6].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = 432;
        gain.gain.setValueAtTime(0.5, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 2.5);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 2.5);
      });
    } catch (e) {
      window.AyanokojiLogger.debug('Audio not supported', e);
    }
  },

  setUserId(uid) {
    localStorage.setItem('ayanokoji_uid', uid);
    window.FirebaseSync?.setUserId(uid);
    window.AyanokojiStore.setState({ user: { uid } });
    window.AyanokojiLogger.info('User ID set', { uid });
  },

  logout() {
    localStorage.removeItem('ayanokoji_uid');
    window.FirebaseSync?.disconnect();
    window.AyanokojiStore.setState({ 
      user: { uid: null, name: '', createdAt: null },
      settings: { theme: 'dark', language: 'ru', notifications: true, firebaseSync: true }
    });
    window.AyanokojiLogger.info('User logged out');
    location.reload();
  }
};

// Export globally
window.App = App;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
