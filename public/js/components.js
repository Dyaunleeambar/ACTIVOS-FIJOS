/* ========================================
   COMPONENTES JAVASCRIPT - Sistema de Gestión de Medios Informáticos
   ======================================== */

// ========================================
// CLASE BASE PARA COMPONENTES
// ========================================

class Component {
  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...this.defaultOptions, ...options };
    this.init();
  }

  get defaultOptions() {
    return {};
  }

  init() {
    // Método a implementar en las clases hijas
  }

  destroy() {
    // Método a implementar en las clases hijas
  }
}

// ========================================
// MODAL COMPONENT
// ========================================

class Modal extends Component {
  constructor(element, options = {}) {
    super(element, options);
  }

  get defaultOptions() {
    return {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false
    };
  }

  init() {
    this.modal = this.element;
    this.overlay = this.modal.querySelector('.modal-overlay');
    this.container = this.modal.querySelector('.modal-container');
    this.closeButtons = this.modal.querySelectorAll('[data-modal-close]');
    this.focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    this.firstFocusableElement = this.focusableElements[0];
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

    this.bindEvents();
    
    if (this.options.show) {
      this.show();
    }
  }

  bindEvents() {
    // Cerrar con botones
    this.closeButtons.forEach(button => {
      button.addEventListener('click', () => this.hide());
    });

    // Cerrar con overlay
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.hide();
        }
      });
    }

    // Cerrar con Escape
    if (this.options.keyboard) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isVisible()) {
          this.hide();
        }
      });
    }

    // Manejo de focus
    if (this.options.focus) {
      this.modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          this.handleTabKey(e);
        }
      });
    }
  }

  handleTabKey(e) {
    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  }

  show() {
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    if (this.options.focus && this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }

    // Disparar evento personalizado
    this.modal.dispatchEvent(new CustomEvent('modal:show', {
      detail: { modal: this.modal }
    }));
  }

  hide() {
    this.modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Disparar evento personalizado
    this.modal.dispatchEvent(new CustomEvent('modal:hide', {
      detail: { modal: this.modal }
    }));
  }

  isVisible() {
    return this.modal.classList.contains('show');
  }

  destroy() {
    this.hide();
    // Limpiar event listeners si es necesario
  }
}

// ========================================
// TOOLTIP COMPONENT
// ========================================

class Tooltip extends Component {
  constructor(element, options = {}) {
    super(element, options);
  }

  get defaultOptions() {
    return {
      position: 'top',
      delay: 200,
      html: false,
      trigger: 'hover'
    };
  }

  init() {
    this.tooltip = null;
    this.timeout = null;
    this.bindEvents();
  }

  bindEvents() {
    if (this.options.trigger === 'hover') {
      this.element.addEventListener('mouseenter', () => this.show());
      this.element.addEventListener('mouseleave', () => this.hide());
    } else if (this.options.trigger === 'click') {
      this.element.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.tooltip) {
        this.hide();
      }
    });
  }

  createTooltip() {
    const text = this.element.getAttribute('data-tooltip') || this.element.title;
    if (!text) return;

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.setAttribute('role', 'tooltip');
    this.tooltip.innerHTML = `
      <div class="tooltip-content">
        ${this.options.html ? text : this.escapeHtml(text)}
      </div>
      <div class="tooltip-arrow"></div>
    `;

    document.body.appendChild(this.tooltip);
  }

  show() {
    if (this.tooltip) return;

    this.timeout = setTimeout(() => {
      this.createTooltip();
      this.positionTooltip();
      this.tooltip.classList.add('show');
    }, this.options.delay);
  }

  hide() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.tooltip) {
      this.tooltip.classList.remove('show');
      setTimeout(() => {
        if (this.tooltip && this.tooltip.parentNode) {
          this.tooltip.parentNode.removeChild(this.tooltip);
        }
        this.tooltip = null;
      }, 150);
    }
  }

  toggle() {
    if (this.tooltip && this.tooltip.classList.contains('show')) {
      this.hide();
    } else {
      this.show();
    }
  }

  positionTooltip() {
    if (!this.tooltip) return;

    const rect = this.element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    
    let top, left;

    switch (this.options.position) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + 8;
        break;
    }

    // Ajustar si se sale de la pantalla
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top < 8) top = 8;
    if (top + tooltipRect.height > window.innerHeight - 8) {
      top = window.innerHeight - tooltipRect.height - 8;
    }

    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  destroy() {
    this.hide();
  }
}

// ========================================
// ALERT COMPONENT
// ========================================

class Alert extends Component {
  constructor(element, options = {}) {
    super(element, options);
  }

  get defaultOptions() {
    return {
      autoClose: false,
      autoCloseDelay: 5000,
      dismissible: true
    };
  }

  init() {
    this.closeButton = this.element.querySelector('.alert-close');
    this.timeout = null;
    this.bindEvents();

    if (this.options.autoClose) {
      this.startAutoClose();
    }
  }

  bindEvents() {
    if (this.closeButton && this.options.dismissible) {
      this.closeButton.addEventListener('click', () => this.close());
    }
  }

  startAutoClose() {
    this.timeout = setTimeout(() => {
      this.close();
    }, this.options.autoCloseDelay);
  }

  close() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.element.classList.add('alert-closing');
    
    setTimeout(() => {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      
      // Disparar evento personalizado
      document.dispatchEvent(new CustomEvent('alert:close', {
        detail: { alert: this.element }
      }));
    }, 300);
  }

  destroy() {
    this.close();
  }
}

// ========================================
// LOADING COMPONENT
// ========================================

class Loading {
  static show(message = 'Cargando...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <p class="loading-text">${message}</p>
      </div>
    `;
    
    document.body.appendChild(overlay);
    return overlay;
  }

  static hide(overlay) {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  static showButton(button, text = 'Cargando...') {
    const originalText = button.innerHTML;
    button.classList.add('loading');
    button.disabled = true;
    button.setAttribute('data-original-text', originalText);
    button.innerHTML = text;
    
    return {
      hide: () => {
        button.classList.remove('loading');
        button.disabled = false;
        button.innerHTML = originalText;
      }
    };
  }
}

// ========================================
// NOTIFICATION COMPONENT
// ========================================

class Notification {
  static show(message, type = 'info', options = {}) {
    const defaultOptions = {
      duration: 5000,
      position: 'top-right',
      dismissible: true
    };

    const config = { ...defaultOptions, ...options };

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-header">
        <span class="notification-title">${this.getTitle(type)}</span>
        ${config.dismissible ? '<button class="notification-close">&times;</button>' : ''}
      </div>
      <div class="notification-message">${message}</div>
    `;

    // Posicionar
    this.positionNotification(notification, config.position);

    // Event listeners
    if (config.dismissible) {
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => this.hide(notification));
    }

    // Auto-close
    if (config.duration > 0) {
      setTimeout(() => this.hide(notification), config.duration);
    }

    return notification;
  }

  static hide(notification) {
    notification.classList.add('notification-hiding');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  static getTitle(type) {
    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    };
    return titles[type] || 'Notificación';
  }

  static positionNotification(notification, position) {
    let container = document.querySelector(`.notification-container-${position}`);
    
    if (!container) {
      container = document.createElement('div');
      container.className = `notification-container notification-container-${position}`;
      document.body.appendChild(container);
    }

    container.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.classList.add('notification-show');
    }, 10);
  }
}

// ========================================
// DROPDOWN COMPONENT
// ========================================

class Dropdown extends Component {
  constructor(element, options = {}) {
    super(element, options);
  }

  get defaultOptions() {
    return {
      trigger: 'click',
      position: 'bottom',
      autoClose: true
    };
  }

  init() {
    this.trigger = this.element;
    this.menu = this.element.querySelector('.dropdown-menu');
    this.isOpen = false;
    
    this.bindEvents();
  }

  bindEvents() {
    if (this.options.trigger === 'click') {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    } else if (this.options.trigger === 'hover') {
      this.trigger.addEventListener('mouseenter', () => this.show());
      this.trigger.addEventListener('mouseleave', () => this.hide());
    }

    // Cerrar al hacer clic fuera
    if (this.options.autoClose) {
      document.addEventListener('click', (e) => {
        if (!this.element.contains(e.target)) {
          this.hide();
        }
      });
    }

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.hide();
      }
    });
  }

  show() {
    if (this.isOpen) return;
    
    this.menu.classList.add('show');
    this.isOpen = true;
    this.positionMenu();
  }

  hide() {
    if (!this.isOpen) return;
    
    this.menu.classList.remove('show');
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  positionMenu() {
    const rect = this.trigger.getBoundingClientRect();
    const menuRect = this.menu.getBoundingClientRect();
    
    let top, left;

    switch (this.options.position) {
      case 'bottom':
        top = rect.bottom + 4;
        left = rect.left;
        break;
      case 'top':
        top = rect.top - menuRect.height - 4;
        left = rect.left;
        break;
      case 'left':
        top = rect.top;
        left = rect.left - menuRect.width - 4;
        break;
      case 'right':
        top = rect.top;
        left = rect.right + 4;
        break;
    }

    this.menu.style.top = `${top}px`;
    this.menu.style.left = `${left}px`;
  }

  destroy() {
    this.hide();
  }
}

// ========================================
// TAB COMPONENT
// ========================================

class Tab extends Component {
  constructor(element, options = {}) {
    super(element, options);
  }

  get defaultOptions() {
    return {
      activeTab: 0
    };
  }

  init() {
    this.tabs = this.element.querySelectorAll('[data-tab]');
    this.contents = this.element.querySelectorAll('[data-tab-content]');
    this.activeTab = this.options.activeTab;
    
    this.bindEvents();
    this.showTab(this.activeTab);
  }

  bindEvents() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.showTab(index);
      });
    });
  }

  showTab(index) {
    // Ocultar todos los tabs y contenidos
    this.tabs.forEach(tab => tab.classList.remove('active'));
    this.contents.forEach(content => content.classList.remove('active'));

    // Mostrar el tab activo
    if (this.tabs[index]) {
      this.tabs[index].classList.add('active');
    }
    if (this.contents[index]) {
      this.contents[index].classList.add('active');
    }

    this.activeTab = index;

    // Disparar evento personalizado
    this.element.dispatchEvent(new CustomEvent('tab:change', {
      detail: { 
        activeTab: index,
        tab: this.tabs[index],
        content: this.contents[index]
      }
    }));
  }

  destroy() {
    // Limpiar event listeners si es necesario
  }
}

// ========================================
// FORM VALIDATION COMPONENT
// ========================================

class FormValidation extends Component {
  constructor(element, options = {}) {
    super(element, options);
  }

  get defaultOptions() {
    return {
      validateOnInput: true,
      validateOnBlur: true,
      showErrors: true
    };
  }

  init() {
    this.form = this.element;
    this.fields = this.form.querySelectorAll('input, select, textarea');
    this.rules = this.getValidationRules();
    
    this.bindEvents();
  }

  bindEvents() {
    this.fields.forEach(field => {
      if (this.options.validateOnInput) {
        field.addEventListener('input', () => this.validateField(field));
      }
      
      if (this.options.validateOnBlur) {
        field.addEventListener('blur', () => this.validateField(field));
      }
    });

    this.form.addEventListener('submit', (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
      }
    });
  }

  getValidationRules() {
    const rules = {};
    
    this.fields.forEach(field => {
      const fieldRules = {};
      
      if (field.hasAttribute('required')) {
        fieldRules.required = true;
      }
      
      if (field.hasAttribute('minlength')) {
        fieldRules.minlength = parseInt(field.getAttribute('minlength'));
      }
      
      if (field.hasAttribute('maxlength')) {
        fieldRules.maxlength = parseInt(field.getAttribute('maxlength'));
      }
      
      if (field.hasAttribute('pattern')) {
        fieldRules.pattern = field.getAttribute('pattern');
      }
      
      if (field.type === 'email') {
        fieldRules.email = true;
      }
      
      rules[field.name] = fieldRules;
    });
    
    return rules;
  }

  validateField(field) {
    const fieldName = field.name;
    const rules = this.rules[fieldName] || {};
    const value = field.value.trim();
    const errors = [];

    // Validar required
    if (rules.required && !value) {
      errors.push('Este campo es requerido');
    }

    // Validar minlength
    if (rules.minlength && value.length < rules.minlength) {
      errors.push(`Mínimo ${rules.minlength} caracteres`);
    }

    // Validar maxlength
    if (rules.maxlength && value.length > rules.maxlength) {
      errors.push(`Máximo ${rules.maxlength} caracteres`);
    }

    // Validar email
    if (rules.email && value && !this.isValidEmail(value)) {
      errors.push('Email inválido');
    }

    // Validar pattern
    if (rules.pattern && value && !new RegExp(rules.pattern).test(value)) {
      errors.push('Formato inválido');
    }

    this.showFieldErrors(field, errors);
    return errors.length === 0;
  }

  validateForm() {
    let isValid = true;
    
    this.fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  showFieldErrors(field, errors) {
    // Remover errores existentes
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }

    // Mostrar nuevos errores
    if (errors.length > 0 && this.options.showErrors) {
      const errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.textContent = errors[0];
      field.parentNode.appendChild(errorElement);
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  destroy() {
    // Limpiar event listeners si es necesario
  }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar modales
  document.querySelectorAll('[data-modal]').forEach(modal => {
    new Modal(modal);
  });

  // Inicializar tooltips
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    new Tooltip(element);
  });

  // Inicializar dropdowns
  document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
    new Dropdown(dropdown);
  });

  // Inicializar tabs
  document.querySelectorAll('[data-tabs]').forEach(tabContainer => {
    new Tab(tabContainer);
  });

  // Inicializar alertas
  document.querySelectorAll('.alert').forEach(alert => {
    new Alert(alert);
  });

  // Inicializar validación de formularios
  document.querySelectorAll('form[data-validate]').forEach(form => {
    new FormValidation(form);
  });
});

// ========================================
// EXPORTAR PARA USO GLOBAL
// ========================================

window.Modal = Modal;
window.Tooltip = Tooltip;
window.Alert = Alert;
window.Loading = Loading;
window.Notification = Notification;
window.Dropdown = Dropdown;
window.Tab = Tab;
window.FormValidation = FormValidation; 
