/**
 * Ayanokoji System v2 - Firebase Sync
 * Secure Firebase database synchronization with error handling
 */

class FirebaseSync {
  constructor() {
    this.db = null;
    this.connected = false;
    this.userId = null;
    this.listeners = new Map();
  }

  async init() {
    try {
      const config = window.AYANOKOJI_CONFIG?.firebase;
      
      if (!config) {
        window.AyanokojiLogger.warn('Firebase config not found');
        return false;
      }

      // Initialize Firebase
      firebase.initializeApp(config);
      this.db = firebase.database();
      
      // Monitor connection status
      const connectedRef = this.db.ref('.info/connected');
      connectedRef.on('value', (snap) => {
        this.connected = snap.val() === true;
        window.AyanokojiLogger.info('Firebase connection status:', { connected: this.connected });
        this._onConnectionChange(this.connected);
      });

      window.AyanokojiLogger.info('Firebase initialized successfully');
      return true;
    } catch (error) {
      window.AyanokojiLogger.error('Failed to initialize Firebase', error);
      return false;
    }
  }

  setUserId(uid) {
    this.userId = uid;
    window.AyanokojiLogger.debug('Firebase user ID set', { uid });
  }

  _getUserRef(path = '') {
    if (!this.userId) {
      throw new Error('User ID not set. Call setUserId() first.');
    }
    return this.db.ref(`users/${this.userId}/${path}`);
  }

  async saveState(state) {
    if (!this.connected || !this.userId) {
      window.AyanokojiLogger.debug('Skipping sync - not connected or no user');
      return;
    }

    try {
      const dataToSave = {
        ...state,
        lastUpdated: firebase.database.ServerValue.TIMESTAMP
      };
      
      await this._getUserRef().set(dataToSave);
      window.AyanokojiLogger.debug('State saved to Firebase');
    } catch (error) {
      window.AyanokojiLogger.error('Failed to save state to Firebase', error);
      throw error;
    }
  }

  async loadState() {
    if (!this.userId) {
      window.AyanokojiLogger.debug('No user ID for loading state');
      return null;
    }

    try {
      const snapshot = await this._getUserRef().once('value');
      const data = snapshot.val();
      
      if (data) {
        delete data.lastUpdated;
        window.AyanokojiLogger.debug('State loaded from Firebase');
      }
      
      return data;
    } catch (error) {
      window.AyanokojiLogger.error('Failed to load state from Firebase', error);
      return null;
    }
  }

  subscribe(path, callback) {
    if (!this.userId) {
      window.AyanokojiLogger.warn('Cannot subscribe without user ID');
      return () => {};
    }

    const ref = this._getUserRef(path);
    const listenerId = `sub_${Date.now()}_${Math.random()}`;
    
    const handler = (snapshot) => {
      try {
        callback(snapshot.val());
      } catch (error) {
        window.AyanokojiLogger.error('Error in Firebase subscription callback', error);
      }
    };

    ref.on('value', handler);
    this.listeners.set(listenerId, { ref, handler });
    
    window.AyanokojiLogger.debug('Firebase subscription created', { path, listenerId });
    
    return () => this.unsubscribe(listenerId);
  }

  unsubscribe(listenerId) {
    const listener = this.listeners.get(listenerId);
    if (listener) {
      listener.ref.off('value', listener.handler);
      this.listeners.delete(listenerId);
      window.AyanokojiLogger.debug('Firebase subscription removed', { listenerId });
    }
  }

  async updateData(path, data) {
    if (!this.connected || !this.userId) {
      window.AyanokojiLogger.debug('Skipping update - not connected or no user');
      return;
    }

    try {
      await this._getUserRef(path).update({
        ...data,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      });
      window.AyanokojiLogger.debug('Data updated in Firebase', { path });
    } catch (error) {
      window.AyanokojiLogger.error('Failed to update data in Firebase', error);
      throw error;
    }
  }

  async pushData(path, data) {
    if (!this.connected || !this.userId) {
      window.AyanokojiLogger.debug('Skipping push - not connected or no user');
      return null;
    }

    try {
      const result = await this._getUserRef(path).push({
        ...data,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      });
      window.AyanokojiLogger.debug('Data pushed to Firebase', { path, key: result.key });
      return result.key;
    } catch (error) {
      window.AyanokojiLogger.error('Failed to push data to Firebase', error);
      throw error;
    }
  }

  async removeData(path) {
    if (!this.connected || !this.userId) {
      window.AyanokojiLogger.debug('Skipping remove - not connected or no user');
      return;
    }

    try {
      await this._getUserRef(path).remove();
      window.AyanokojiLogger.debug('Data removed from Firebase', { path });
    } catch (error) {
      window.AyanokojiLogger.error('Failed to remove data from Firebase', error);
      throw error;
    }
  }

  _onConnectionChange(connected) {
    // Notify store or other components about connection change
    if (window.AyanokojiStore && connected) {
      // Trigger re-sync when connection is restored
      setTimeout(() => {
        window.AyanokojiStore.persistToLocal();
      }, 1000);
    }
  }

  disconnect() {
    if (this.db) {
      this.db.goOffline();
      window.AyanokojiLogger.info('Firebase disconnected');
    }
  }

  reconnect() {
    if (this.db) {
      this.db.goOnline();
      window.AyanokojiLogger.info('Firebase reconnection attempted');
    }
  }
}

// Create global instance
window.FirebaseSync = new FirebaseSync();
