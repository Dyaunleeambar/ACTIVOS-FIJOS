/* ========================================
   COMPONENTES - Sistema de Gestión de Medios Informáticos
   ======================================== */

// Clase base para componentes
class Component {
  constructor(element) {
    this.element = element;
    this.init();
  }

  init() {
    // Método a sobrescribir en las clases hijas
  }

  destroy() {
    // Método para limpiar recursos
  }
}

// ========================================
// MODAL
// ========================================

class Modal extends Component {
  constructor(element) {
    super(element);
    this.isOpen = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Botones de cerrar (pueden existir múltiples)
    const closeBtns = this.element.querySelectorAll('[data-modal-close]');
    if (closeBtns && closeBtns.length) {
      closeBtns.forEach(btn => btn.addEventListener('click', () => this.close()));
    }

    // Overlay para cerrar (si existe)
    const overlay = this.element.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.close());
    }
    // Cerrar haciendo clic fuera del contenido aunque no exista overlay
    this.element.addEventListener('click', (e) => {
      const content = this.element.querySelector('.modal-container');
      if (content && !content.contains(e.target)) {
        this.close();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.element.style.display = 'flex';
    this.element.classList.add('show');
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
    
    // Focus en el modal
    const focusableElement = this.element.querySelector('button, input, textarea, select');
    if (focusableElement) {
      focusableElement.focus();
    }
  }

  close() {
    this.element.style.display = 'none';
    this.element.classList.remove('show');
    this.isOpen = false;
    document.body.style.overflow = '';
    // Si el modal fue creado dinámicamente, eliminarlo del DOM para evitar fugas
    if (this.element && this.element.dataset && this.element.dataset.dynamic === 'true') {
      try {
        this.element.parentNode && this.element.parentNode.removeChild(this.element);
      } catch (_) {}
    }
  }

  static create(content, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.dataset.dynamic = 'true';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">${options.title || 'Modal'}</h3>
          <button class="modal-close" data-modal-close>
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${options.showFooter !== false ? `
          <div class="modal-footer">
            <button class="btn btn-outline" data-modal-close>Cerrar</button>
            ${options.footerButtons || ''}
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(modal);
    const modalInstance = new Modal(modal);
    modalInstance.open();
    return modalInstance;
  }
}

// ========================================
// TOOLTIP
// ========================================

class Tooltip extends Component {
  constructor(element) {
    super(element);
    this.tooltip = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.element.addEventListener('mouseenter', () => this.show());
    this.element.addEventListener('mouseleave', () => this.hide());
    this.element.addEventListener('focus', () => this.show());
    this.element.addEventListener('blur', () => this.hide());
  }

  show() {
    const text = this.element.getAttribute('data-tooltip');
    if (!text) return;

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.textContent = text;

    document.body.appendChild(this.tooltip);
    this.positionTooltip();
  }

  hide() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  positionTooltip() {
    const rect = this.element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();

    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 8;

    // Ajustar si se sale de la pantalla
    if (left < 0) left = 8;
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top < 0) {
      top = rect.bottom + 8;
    }

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  }
}

// ========================================
// ALERT
// ========================================

class Alert extends Component {
  constructor(element) {
    super(element);
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = this.element.querySelector('.alert-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Auto-cerrar después de 5 segundos para alerts de info
    if (this.element.classList.contains('alert-info')) {
      setTimeout(() => this.close(), 5000);
    }
  }

  close() {
    this.element.style.opacity = '0';
    setTimeout(() => {
      this.element.remove();
    }, 300);
  }

  static show(message, type = 'info', options = {}) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
      <div class="alert-icon">
        <i class="fas fa-${this.getIcon(type)}"></i>
      </div>
      <div class="alert-content">
        <div class="alert-message">${message}</div>
        ${options.details ? `<div class="alert-details">${options.details}</div>` : ''}
      </div>
      <button class="alert-close" aria-label="Cerrar alerta">
        <i class="fas fa-times"></i>
      </button>
    `;

    const container = options.container || document.body;
    container.appendChild(alert);

    // Animar entrada
    setTimeout(() => alert.style.opacity = '1', 10);

    return new Alert(alert);
  }

  static getIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }
}

// ========================================
// LOADING
// ========================================

class Loading {
  static show(container, message = 'Cargando...') {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(loading);
    return loading;
  }

  static hide(loading) {
    if (loading && loading.parentNode) {
      loading.remove();
    }
  }
}

// ========================================
// NOTIFICATION
// ========================================

class Notification {
  static show(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas fa-${this.getIcon(type)}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" aria-label="Cerrar notificación">
        <i class="fas fa-times"></i>
      </button>
    `;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => notification.style.transform = 'translateX(0)', 10);

    // Auto-cerrar
    if (duration > 0) {
      setTimeout(() => this.hide(notification), duration);
    }

    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.hide(notification));

    return notification;
  }

  static hide(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }

  static getIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }
}

// ========================================
// DROPDOWN
// ========================================

class Dropdown extends Component {
  constructor(element) {
    super(element);
    this.isOpen = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const toggle = this.element.querySelector('.dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.element.classList.add('active');
    this.isOpen = true;
  }

  close() {
    this.element.classList.remove('active');
    this.isOpen = false;
  }
}

// ========================================
// TAB
// ========================================

class Tab extends Component {
  constructor(element) {
    super(element);
    this.activeTab = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    const tabs = this.element.querySelectorAll('.tab-nav-item');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        this.activateTab(tab);
      });
    });

    // Activar primera tab por defecto
    const firstTab = tabs[0];
    if (firstTab) {
      this.activateTab(firstTab);
    }
  }

  activateTab(tab) {
    const target = tab.getAttribute('data-tab');
    if (!target) return;

    // Desactivar tab actual
    if (this.activeTab) {
      this.activeTab.classList.remove('active');
    }

    // Ocultar contenido actual
    const currentContent = this.element.querySelector('.tab-content.active');
    if (currentContent) {
      currentContent.classList.remove('active');
    }

    // Activar nueva tab
    tab.classList.add('active');
    this.activeTab = tab;

    // Mostrar nuevo contenido
    const newContent = this.element.querySelector(`[data-tab-content="${target}"]`);
    if (newContent) {
      newContent.classList.add('active');
    }
  }
}

// ========================================
// FORM VALIDATION
// ========================================

class FormValidation extends Component {
  constructor(element) {
    super(element);
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.element.addEventListener('submit', (e) => {
      if (!this.validate()) {
        e.preventDefault();
      }
    });

    // Validación en tiempo real
    const inputs = this.element.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validate() {
    let isValid = true;
    const inputs = this.element.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');

    // Limpiar error previo
    this.clearFieldError(field);

    // Validar campo requerido
    if (required && !value) {
      this.showFieldError(field, 'Este campo es requerido');
      return false;
    }

    // Validar email
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(field, 'Email inválido');
        return false;
      }
    }

    // Validar longitud mínima
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
      this.showFieldError(field, `Mínimo ${minLength} caracteres`);
      return false;
    }

    return true;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// ========================================
// COLLAPSIBLE SECTION
// ========================================

class CollapsibleSection extends Component {
  constructor(element) {
    super(element);
    this.isCollapsed = this.element.getAttribute('data-collapsed') === 'true';
    this.setupEventListeners();
    this.updateState();
  }

  setupEventListeners() {
    const header = this.element.querySelector('.section-header');
    const toggle = this.element.querySelector('.collapse-toggle');
    
    if (header) {
      header.addEventListener('click', (e) => {
        // No colapsar si se hace click en el botón específico
        if (e.target.closest('.collapse-toggle')) {
          return;
        }
        this.toggle();
      });
    }

    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });
    }
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.updateState();
    this.saveState();
  }

  updateState() {
    this.element.setAttribute('data-collapsed', this.isCollapsed.toString());
    
    const toggle = this.element.querySelector('.collapse-toggle');
    if (toggle) {
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = this.isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-down';
      }
    }

    // Actualizar aria-label
    if (toggle) {
      const label = this.isCollapsed ? 'Expandir sección' : 'Colapsar sección';
      toggle.setAttribute('aria-label', label);
    }
  }

  saveState() {
    const sectionId = this.element.id || this.element.className;
    if (sectionId) {
      localStorage.setItem(`collapsible-${sectionId}`, this.isCollapsed.toString());
    }
  }

  static restoreState(element) {
    const sectionId = element.id || element.className;
    if (sectionId) {
      const savedState = localStorage.getItem(`collapsible-${sectionId}`);
      if (savedState !== null) {
        element.setAttribute('data-collapsed', savedState);
      }
    }
  }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar modales
  document.querySelectorAll('.modal').forEach(modal => {
    new Modal(modal);
  });

  // Inicializar tooltips
  document.querySelectorAll('[data-tooltip]').forEach(element => {
    new Tooltip(element);
  });

  // Inicializar dropdowns
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    new Dropdown(dropdown);
  });

  // Inicializar tabs
  document.querySelectorAll('.tab-container').forEach(tab => {
    new Tab(tab);
  });

  // Inicializar validación de formularios
  document.querySelectorAll('form[data-validate]').forEach(form => {
    new FormValidation(form);
  });

  // Inicializar secciones colapsables
  document.querySelectorAll('.collapsible-section').forEach(section => {
    CollapsibleSection.restoreState(section);
    new CollapsibleSection(section);
  });
});

// Exportar clases para uso global
window.Modal = Modal;
window.Alert = Alert;
window.Loading = Loading;
window.Notification = Notification;
window.Dropdown = Dropdown;
window.Tab = Tab;
window.FormValidation = FormValidation;
window.CollapsibleSection = CollapsibleSection; 
