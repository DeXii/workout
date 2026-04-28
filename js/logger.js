/**
 * Ayanokoji System v2 - Logger
 * Centralized logging system with levels and error tracking
 */

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor(level = LogLevel.INFO) {
    this.level = level;
    this.prefix = '[Ayanokoji]';
    this.errorCount = 0;
    this.maxErrors = 100;
  }

  _shouldLog(level) {
    return level >= this.level;
  }

  _formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level] || 'UNKNOWN';
    let msg = `${this.prefix} [${levelStr}] ${timestamp}: ${message}`;
    if (data !== undefined) {
      msg += ' | Data:', data;
    }
    return msg;
  }

  debug(message, data) {
    if (this._shouldLog(LogLevel.DEBUG)) {
      console.debug(this._formatMessage(LogLevel.DEBUG, message), data || '');
    }
  }

  info(message, data) {
    if (this._shouldLog(LogLevel.INFO)) {
      console.info(this._formatMessage(LogLevel.INFO, message), data || '');
    }
  }

  warn(message, data) {
    if (this._shouldLog(LogLevel.WARN)) {
      console.warn(this._formatMessage(LogLevel.WARN, message), data || '');
    }
  }

  error(message, error, data) {
    if (this._shouldLog(LogLevel.ERROR)) {
      console.error(this._formatMessage(LogLevel.ERROR, message), error || '', data || '');
      this.errorCount++;
      
      // Prevent infinite error logging
      if (this.errorCount > this.maxErrors) {
        console.error(`${this.prefix} Max error count reached. Stopping error logs.`);
        this.level = LogLevel.ERROR + 1;
      }
    }
    
    // Store error for debugging
    this._storeError(message, error, data);
  }

  _storeError(message, error, data) {
    try {
      const errors = JSON.parse(localStorage.getItem('ayanokoji_errors') || '[]');
      errors.push({
        timestamp: new Date().toISOString(),
        message,
        error: error?.message || String(error),
        stack: error?.stack,
        data
      });
      
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.shift();
      }
      
      localStorage.setItem('ayanokoji_errors', JSON.stringify(errors));
    } catch (e) {
      // Silent fail to prevent error loops
    }
  }

  getErrors() {
    try {
      return JSON.parse(localStorage.getItem('ayanokoji_errors') || '[]');
    } catch (e) {
      return [];
    }
  }

  clearErrors() {
    localStorage.removeItem('ayanokoji_errors');
    this.errorCount = 0;
  }
}

// Create global logger instance
window.AyanokojiLogger = new Logger(LogLevel.INFO);

// Global error handler
window.addEventListener('error', (event) => {
  window.AyanokojiLogger.error(
    'Global error',
    event.error || new Error(event.message),
    { filename: event.filename, lineno: event.lineno, colno: event.colno }
  );
});

window.addEventListener('unhandledrejection', (event) => {
  window.AyanokojiLogger.error(
    'Unhandled promise rejection',
    event.reason,
    { promise: event.promise }
  );
});
