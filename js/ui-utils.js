/**
 * Ayanokoji System v2 - UI Utilities
 * Safe DOM manipulation and event handling utilities
 */

const UI = {
  /**
   * Safely set text content (prevents XSS)
   */
  setText(element, text) {
    if (!element) return;
    element.textContent = String(text);
  },

  /**
   * Create element with attributes and children
   */
  createElement(tag, attributes = {}, children = []) {
    const el = document.createElement(tag);
    
    // Set attributes safely
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'className') {
        el.className = value;
      } else if (key === 'textContent') {
        el.textContent = value;
      } else if (key.startsWith('data-')) {
        el.setAttribute(key, value);
      } else if (key !== 'innerHTML') { // Prevent innerHTML usage
        el.setAttribute(key, value);
      }
    }
    
    // Add children safely
    for (const child of children) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    }
    
    return el;
  },

  /**
   * Render HTML safely using template literal sanitization
   * For complex HTML, consider using a library like DOMPurify
   */
  renderHTML(container, htmlString) {
    if (!container) return;
    
    // Simple sanitization - remove script tags and event handlers
    const sanitized = htmlString
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/\son\w+="[^"]*"/g, '')
      .replace(/\son\w+='[^']*'/g, '');
    
    container.innerHTML = sanitized;
  },

  /**
   * Toggle visibility with animation
   */
  toggleVisibility(element, show) {
    if (!element) return;
    
    if (show) {
      element.style.display = '';
      element.style.opacity = '0';
      requestAnimationFrame(() => {
        element.style.transition = 'opacity 0.3s ease';
        element.style.opacity = '1';
      });
    } else {
      element.style.opacity = '0';
      setTimeout(() => {
        element.style.display = 'none';
      }, 300);
    }
  },

  /**
   * Add click handler with proper cleanup support
   */
  onClick(element, handler, options = {}) {
    if (!element) return () => {};
    
    element.addEventListener('click', handler, {
      passive: true,
      ...options
    });
    
    return () => element.removeEventListener('click', handler);
  },

  /**
   * Debounce function for performance
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function for scroll/resize events
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Format number with locale
   */
  formatNumber(num, locale = 'ru-RU', options = {}) {
    return new Intl.NumberFormat(locale, options).format(num);
  },

  /**
   * Format date
   */
  formatDate(date, options = {}) {
    const defaultOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(date).toLocaleDateString('ru-RU', { ...defaultOptions, ...options });
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Get element by ID with error handling
   */
  getById(id) {
    const el = document.getElementById(id);
    if (!el) {
      window.AyanokojiLogger.warn('Element not found', { id });
    }
    return el;
  },

  /**
   * Query selector with error handling
   */
  query(selector, parent = document) {
    const el = parent.querySelector(selector);
    if (!el) {
      window.AyanokojiLogger.debug('Element not found', { selector });
    }
    return el;
  },

  /**
   * Query all elements
   */
  queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  /**
   * Add class to element
   */
  addClass(element, className) {
    if (element && !element.classList.contains(className)) {
      element.classList.add(className);
    }
  },

  /**
   * Remove class from element
   */
  removeClass(element, className) {
    if (element && element.classList.contains(className)) {
      element.classList.remove(className);
    }
  },

  /**
   * Toggle class on element
   */
  toggleClass(element, className, force = null) {
    if (element) {
      element.classList.toggle(className, force);
    }
  },

  /**
   * Show loading state
   */
  setLoading(container, isLoading = true, message = 'Загрузка...') {
    if (!container) return;
    
    if (isLoading) {
      UI.addClass(container, 'loading');
      container.dataset.loadingMessage = message;
    } else {
      UI.removeClass(container, 'loading');
      delete container.dataset.loadingMessage;
    }
  },

  /**
   * Show toast notification
   */
  showToast(message, type = 'info', duration = 3000) {
    const toast = UI.createElement('div', {
      className: `toast toast-${type}`,
      role: 'alert',
      'aria-live': 'polite'
    }, [message]);
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Export for global use
window.UI = UI;
