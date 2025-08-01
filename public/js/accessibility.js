/* ========================================
   ACCESIBILIDAD - Sistema de Gestión de Medios Informáticos
   ======================================== */

class AccessibilityValidator {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  // Validar contraste de colores
  validateColorContrast() {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, label, button, a');
    const issues = [];

    textElements.forEach(element => {
      const style = window.getComputedStyle(element);
      const backgroundColor = style.backgroundColor;
      const color = style.color;
      
      // Verificar si hay suficiente contraste
      const contrast = this.calculateContrastRatio(color, backgroundColor);
      if (contrast < 4.5) {
        issues.push({
          element: element,
          type: 'contrast',
          message: `Contraste insuficiente: ${contrast.toFixed(2)}:1 (mínimo 4.5:1)`,
          severity: 'error'
        });
      }
    });

    return issues;
  }

  // Calcular ratio de contraste
  calculateContrastRatio(color1, color2) {
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  // Obtener luminancia de un color
  getLuminance(color) {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Convertir hex a RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Validar navegación por teclado
  validateKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const issues = [];

    focusableElements.forEach(element => {
      // Verificar si tiene focus visible
      if (!this.hasVisibleFocus(element)) {
        issues.push({
          element: element,
          type: 'focus',
          message: 'Elemento no tiene focus visible',
          severity: 'error'
        });
      }

      // Verificar si tiene aria-label o texto descriptivo
      if (!this.hasAccessibleName(element)) {
        issues.push({
          element: element,
          type: 'label',
          message: 'Elemento no tiene nombre accesible',
          severity: 'warning'
        });
      }
    });

    return issues;
  }

  // Verificar si tiene focus visible
  hasVisibleFocus(element) {
    const style = window.getComputedStyle(element);
    return style.outline !== 'none' || style.boxShadow !== 'none';
  }

  // Verificar si tiene nombre accesible
  hasAccessibleName(element) {
    return element.getAttribute('aria-label') || 
           element.getAttribute('aria-labelledby') ||
           element.textContent.trim() ||
           element.alt;
  }

  // Validar imágenes
  validateImages() {
    const images = document.querySelectorAll('img');
    const issues = [];

    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        issues.push({
          element: img,
          type: 'image',
          message: 'Imagen sin texto alternativo',
          severity: 'error'
        });
      }
    });

    return issues;
  }

  // Validar formularios
  validateForms() {
    const forms = document.querySelectorAll('form');
    const issues = [];

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        // Verificar si tiene label asociado
        if (!this.hasAssociatedLabel(input)) {
          issues.push({
            element: input,
            type: 'form',
            message: 'Campo sin label asociado',
            severity: 'error'
          });
        }

        // Verificar si tiene aria-describedby para errores
        if (input.hasAttribute('aria-invalid') && !input.getAttribute('aria-describedby')) {
          issues.push({
            element: input,
            type: 'form',
            message: 'Campo con error sin descripción',
            severity: 'warning'
          });
        }
      });
    });

    return issues;
  }

  // Verificar si tiene label asociado
  hasAssociatedLabel(input) {
    const id = input.id;
    if (id && document.querySelector(`label[for="${id}"]`)) {
      return true;
    }

    const label = input.closest('label');
    if (label) {
      return true;
    }

    return input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
  }

  // Validar estructura semántica
  validateSemanticStructure() {
    const issues = [];

    // Verificar si hay un h1
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      issues.push({
        element: document.body,
        type: 'structure',
        message: 'Página sin encabezado principal (h1)',
        severity: 'error'
      });
    } else if (h1s.length > 1) {
      issues.push({
        element: h1s[1],
        type: 'structure',
        message: 'Múltiples h1 en la página',
        severity: 'warning'
      });
    }

    // Verificar jerarquía de encabezados
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > currentLevel + 1) {
        issues.push({
          element: heading,
          type: 'structure',
          message: `Salto en jerarquía de encabezados: h${currentLevel} → h${level}`,
          severity: 'warning'
        });
      }
      currentLevel = level;
    });

    return issues;
  }

  // Validar landmarks
  validateLandmarks() {
    const landmarks = [
      'main', 'nav', 'header', 'footer', 'aside',
      '[role="main"]', '[role="navigation"]', '[role="banner"]', 
      '[role="contentinfo"]', '[role="complementary"]'
    ];
    
    const foundLandmarks = [];
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(landmark);
      elements.forEach(el => foundLandmarks.push(el));
    });

    const issues = [];
    
    // Verificar si hay main
    const mainElements = document.querySelectorAll('main, [role="main"]');
    if (mainElements.length === 0) {
      issues.push({
        element: document.body,
        type: 'landmark',
        message: 'Página sin landmark principal',
        severity: 'error'
      });
    }

    // Verificar si hay navigation
    const navElements = document.querySelectorAll('nav, [role="navigation"]');
    if (navElements.length === 0) {
      issues.push({
        element: document.body,
        type: 'landmark',
        message: 'Página sin landmark de navegación',
        severity: 'warning'
      });
    }

    return issues;
  }

  // Ejecutar todas las validaciones
  runAllValidations() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];

    const validations = [
      { name: 'Contraste de Colores', fn: this.validateColorContrast },
      { name: 'Navegación por Teclado', fn: this.validateKeyboardNavigation },
      { name: 'Imágenes', fn: this.validateImages },
      { name: 'Formularios', fn: this.validateForms },
      { name: 'Estructura Semántica', fn: this.validateSemanticStructure },
      { name: 'Landmarks', fn: this.validateLandmarks }
    ];

    validations.forEach(validation => {
      try {
        const results = validation.fn.call(this);
        results.forEach(result => {
          if (result.severity === 'error') {
            this.issues.push(result);
          } else {
            this.warnings.push(result);
          }
        });
      } catch (error) {
        console.error(`Error en validación ${validation.name}:`, error);
      }
    });

    return {
      issues: this.issues,
      warnings: this.warnings,
      total: this.issues.length + this.warnings.length
    };
  }

  // Generar reporte de accesibilidad
  generateReport() {
    const results = this.runAllValidations();
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.total,
        errors: results.issues.length,
        warnings: results.warnings.length,
        passed: results.total === 0
      },
      details: {
        errors: results.issues,
        warnings: results.warnings
      }
    };

    return report;
  }

  // Mostrar reporte en la interfaz
  showReport() {
    const report = this.generateReport();
    
    const modal = document.createElement('div');
    modal.className = 'modal accessibility-report-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Reporte de Accesibilidad</h3>
          <button class="modal-close" data-modal-close>
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="accessibility-summary">
            <div class="summary-item ${report.summary.passed ? 'passed' : 'failed'}">
              <i class="fas ${report.summary.passed ? 'fa-check-circle' : 'fa-times-circle'}"></i>
              <span>Estado: ${report.summary.passed ? 'Cumple' : 'No cumple'} WCAG 2.1 AA</span>
            </div>
            <div class="summary-item">
              <i class="fas fa-exclamation-circle"></i>
              <span>Errores: ${report.summary.errors}</span>
            </div>
            <div class="summary-item">
              <i class="fas fa-exclamation-triangle"></i>
              <span>Advertencias: ${report.summary.warnings}</span>
            </div>
          </div>
          
          ${this.renderIssuesList(report.details.errors, 'Errores')}
          ${this.renderIssuesList(report.details.warnings, 'Advertencias')}
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" data-modal-close>Cerrar</button>
          <button class="btn btn-primary" onclick="AccessibilityValidator.exportReport()">
            <i class="fas fa-download"></i> Exportar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    new Modal(modal);
  }

  // Renderizar lista de problemas
  renderIssuesList(issues, title) {
    if (issues.length === 0) return '';

    return `
      <div class="issues-section">
        <h4>${title} (${issues.length})</h4>
        <div class="issues-list">
          ${issues.map(issue => `
            <div class="issue-item">
              <div class="issue-header">
                <span class="issue-type">${issue.type}</span>
                <span class="issue-severity">${issue.severity}</span>
              </div>
              <p class="issue-message">${issue.message}</p>
              <button class="btn btn-sm btn-outline" onclick="AccessibilityValidator.highlightElement('${issue.element.tagName.toLowerCase()}')">
                <i class="fas fa-eye"></i> Ver elemento
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Resaltar elemento en la página
  static highlightElement(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.outline = '2px solid red';
      el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      
      setTimeout(() => {
        el.style.outline = '';
        el.style.backgroundColor = '';
      }, 3000);
    });
  }

  // Exportar reporte
  static exportReport() {
    const validator = new AccessibilityValidator();
    const report = validator.generateReport();
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `accessibility-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }
}

// Inicializar validador de accesibilidad
window.AccessibilityValidator = AccessibilityValidator;

// Agregar botón de validación de accesibilidad al header
document.addEventListener('DOMContentLoaded', () => {
  const headerActions = document.querySelector('.page-actions');
  if (headerActions) {
    const accessibilityBtn = document.createElement('button');
    accessibilityBtn.className = 'btn btn-outline';
    accessibilityBtn.innerHTML = '<i class="fas fa-universal-access"></i> Accesibilidad';
    accessibilityBtn.onclick = () => {
      const validator = new AccessibilityValidator();
      validator.showReport();
    };
    headerActions.appendChild(accessibilityBtn);
  }
}); 
