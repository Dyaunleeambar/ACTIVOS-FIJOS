/* ========================================
   DASHBOARD - Sistema de Gestión de Medios Informáticos
   ======================================== */

class Dashboard {
  constructor() {
    this.isDesktop = this.detectDesktop();
    this.init();
  }

  // Detectar si es dispositivo de escritorio
  detectDesktop() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    // Criterios para desktop:
    // - Ancho mínimo de 1024px
    // - Alto mínimo de 768px  
    // - Ratio de aspecto mayor a 1.2 (pantalla más ancha que alta)
    // - No es un dispositivo táctil o tiene pointer fine
    return width >= 1024 && 
           height >= 768 && 
           aspectRatio > 1.2 && 
           window.matchMedia('(pointer: fine)').matches;
  }

  init() {
    this.setupDesktopOptimizations();
    this.loadDashboardData();
    this.setupCharts();
    this.setupRealTimeUpdates();
    this.setupInteractions();
    this.initProgressBars();
  }

  // Configurar optimizaciones específicas para desktop
  setupDesktopOptimizations() {
    if (this.isDesktop) {
      // Agregar clase para desktop
      document.body.classList.add('desktop-view');
      
      // Optimizar layout para pantallas grandes
      this.optimizeLayoutForDesktop();
      
      // Configurar hover effects más elaborados
      this.setupDesktopHoverEffects();
      
      // Configurar shortcuts de teclado
      this.setupKeyboardShortcuts();
    }
  }

  // Optimizar layout para desktop
  optimizeLayoutForDesktop() {
    const dashboardPage = document.getElementById('dashboard-page');
    if (dashboardPage) {
      // Usar ancho completo para aprovechar mejor el espacio
      dashboardPage.style.maxWidth = 'none';
      dashboardPage.style.width = '100%';
      dashboardPage.style.margin = '0';
      
      // Mejorar espaciado entre secciones
      const sections = dashboardPage.querySelectorAll('.alerts-section, .dashboard-grid, .performance-metrics, .dashboard-charts, .security-metrics, .state-summary, .recent-activity, .quick-actions');
      sections.forEach(section => {
        section.style.marginBottom = 'var(--spacing-8)';
        section.style.width = '100%';
      });
    }
  }

  // Configurar efectos hover para desktop
  setupDesktopHoverEffects() {
    const cards = document.querySelectorAll('.card-stats');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px) scale(1.02)';
        card.style.boxShadow = 'var(--shadow-xl)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'var(--shadow-md)';
      });
    });
  }

  // Configurar shortcuts de teclado para desktop
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + R para refrescar
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        this.refresh();
      }
      
      // Ctrl/Cmd + E para exportar
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        this.exportDashboard('pdf');
      }
      
      // Ctrl/Cmd + A para accesibilidad
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (window.AccessibilityValidator) {
          const validator = new AccessibilityValidator();
          validator.showReport();
        }
      }
      
      // Ctrl/Cmd + P para performance
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        if (window.PerformanceOptimizer) {
          const optimizer = new PerformanceOptimizer();
          optimizer.showPerformanceReport();
        }
      }
    });
  }

  // Cargar datos del dashboard
  async loadDashboardData() {
    try {
      // Simular carga de datos
      const data = await this.fetchDashboardData();
      this.updateDashboard(data);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      this.showError('Error cargando datos del dashboard');
    }
  }

  // Obtener datos del dashboard
  async fetchDashboardData() {
    // Simular datos para demostración
    return {
      stats: {
        totalEquipment: 25,
        activeEquipment: 20,
        maintenanceEquipment: 3,
        totalAssignments: 18,
        disposalProposals: 2,
        outOfService: 2
      },
      alerts: [
        {
          type: 'warning',
          message: '3 equipos requieren mantenimiento preventivo',
          time: 'hace 2 horas',
          icon: 'fas fa-tools'
        },
        {
          type: 'warning',
          message: '1 propuesta de baja pendiente de aprobación',
          time: 'hace 4 horas',
          icon: 'fas fa-exclamation-triangle'
        },
        {
          type: 'success',
          message: 'Sistema funcionando correctamente',
          time: 'hace 0 minutos',
          icon: 'fas fa-check-circle'
        }
      ],
      security: {
        securityEquipment: 15,
        accessLogs: 12,
        updatedCredentials: 3,
        securityAlerts: 0
      }
    };
  }

  // Actualizar dashboard con datos
  updateDashboard(data) {
    this.updateStats(data.stats);
    this.updateAlerts(data.alerts);
    this.updateSecurityMetrics(data.security);
  }

  // Actualizar estadísticas
  updateStats(stats) {
    const elements = {
      'total-equipment': stats.totalEquipment,
      'active-equipment': stats.activeEquipment,
      'maintenance-equipment': stats.maintenanceEquipment,
      'total-assignments': stats.totalAssignments,
      'disposal-proposals': stats.disposalProposals,
      'out-of-service': stats.outOfService
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  // Actualizar alertas
  updateAlerts(alerts) {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    container.innerHTML = alerts.map(alert => `
      <div class="alert alert-${alert.type}">
        <div class="alert-icon">
          <i class="${alert.icon}"></i>
        </div>
        <div class="alert-content">
          <div class="alert-message">${alert.message}</div>
          <div class="alert-time">${alert.time}</div>
        </div>
      </div>
    `).join('');
  }

  // Actualizar métricas de seguridad
  updateSecurityMetrics(security) {
    const elements = {
      'security-equipment': security.securityEquipment,
      'security-access-logs': security.accessLogs,
      'security-updated-credentials': security.updatedCredentials,
      'security-alerts': security.securityAlerts
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  // Inicializar barras de progreso
  initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
      const value = parseInt(bar.getAttribute('data-value'));
      const fill = bar.querySelector('.progress-fill');
      
      if (fill) {
        // Establecer el ancho inicial en 0
        fill.style.width = '0%';
        
        // Animar después de un pequeño delay
        setTimeout(() => {
          fill.style.width = `${value}%`;
        }, 500);
        
        // Agregar evento click para mostrar detalles
        bar.addEventListener('click', () => {
          this.showProgressDetails(bar, value);
        });
      }
    });
  }

  // Mostrar detalles de la barra de progreso
  showProgressDetails(bar, value) {
    const label = bar.closest('.metric-item').querySelector('.metric-label').textContent;
    
    // Crear modal con detalles
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3>${label}</h3>
          <button class="modal-close" data-modal-close>&times;</button>
        </div>
        <div class="modal-body">
          <div class="progress-details">
            <div class="progress-summary">
              <div class="progress-value">${value}%</div>
              <div class="progress-description">
                ${this.getProgressDescription(label, value)}
              </div>
            </div>
            <div class="progress-bar-large">
              <div class="progress-fill-large" style="width: ${value}%"></div>
            </div>
            <div class="progress-stats">
              ${this.getProgressStats(label, value)}
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal
    const closeBtn = modal.querySelector('[data-modal-close]');
    const overlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
      modal.remove();
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
  }

  // Obtener descripción del progreso
  getProgressDescription(label, value) {
    if (label === 'Tasa Operacional') {
      if (value >= 90) return 'Excelente rendimiento operacional';
      if (value >= 75) return 'Buen rendimiento operacional';
      if (value >= 60) return 'Rendimiento operacional aceptable';
      return 'Rendimiento operacional bajo';
    } else if (label === 'Tasa de Mantenimiento') {
      if (value <= 10) return 'Mantenimiento preventivo óptimo';
      if (value <= 20) return 'Mantenimiento preventivo adecuado';
      if (value <= 30) return 'Mantenimiento preventivo aceptable';
      return 'Requiere atención en mantenimiento';
    }
    return 'Métrica del sistema';
  }

  // Obtener estadísticas del progreso
  getProgressStats(label, value) {
    if (label === 'Tasa Operacional') {
      return `
        <div class="stat-item">
          <span class="stat-label">Equipos Activos:</span>
          <span class="stat-value">${Math.round(value * 0.25)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Eficiencia:</span>
          <span class="stat-value">${value}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Estado:</span>
          <span class="stat-value ${value >= 75 ? 'status-good' : 'status-warning'}">
            ${value >= 75 ? 'Óptimo' : 'Requiere atención'}
          </span>
        </div>
      `;
    } else if (label === 'Tasa de Mantenimiento') {
      return `
        <div class="stat-item">
          <span class="stat-label">Equipos en Mantenimiento:</span>
          <span class="stat-value">${Math.round(value * 0.25)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Tiempo Promedio:</span>
          <span class="stat-value">${Math.round(value * 2)} días</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Estado:</span>
          <span class="stat-value ${value <= 15 ? 'status-good' : 'status-warning'}">
            ${value <= 15 ? 'Controlado' : 'Requiere revisión'}
          </span>
        </div>
      `;
    }
    return '';
  }

  // Configurar gráficos
  setupCharts() {
    this.setupEquipmentTypeChart();
    this.setupEquipmentStateChart();
    this.setupEquipmentLocationChart();
  }

  // Gráfico de equipos por tipo
  setupEquipmentTypeChart() {
    const ctx = document.getElementById('equipment-type-chart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Desktop', 'Laptop', 'Printer', 'Server', 'Router', 'Switch'],
        datasets: [{
          data: [8, 6, 4, 3, 2, 2],
          backgroundColor: [
            '#3b82f6',
            '#8b5cf6',
            '#06b6d4',
            '#10b981',
            '#f59e0b',
            '#ef4444'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // Gráfico de equipos por estado
  setupEquipmentStateChart() {
    const ctx = document.getElementById('equipment-state-chart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Activo', 'Mantenimiento', 'Fuera de Servicio', 'Desechado'],
        datasets: [{
          label: 'Cantidad',
          data: [20, 3, 2, 0],
          backgroundColor: [
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#6b7280'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Gráfico de equipos por ubicación
  setupEquipmentLocationChart() {
    const ctx = document.getElementById('equipment-location-chart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Oficina Central', 'Sucursal Norte', 'Sucursal Sur', 'Almacén'],
        datasets: [{
          data: [12, 6, 4, 3],
          backgroundColor: [
            '#3b82f6',
            '#8b5cf6',
            '#06b6d4',
            '#10b981'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  // Configurar actualizaciones en tiempo real
  setupRealTimeUpdates() {
    // Actualizar cada 30 segundos
    setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  // Configurar interacciones
  setupInteractions() {
    // Click en cards para ver detalles
    const cards = document.querySelectorAll('.card-stats');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        this.showCardDetails(card);
      });
    });

    // Hover en gráficos para tooltips
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach(chart => {
      chart.addEventListener('mouseenter', () => {
        chart.style.transform = 'scale(1.02)';
      });
      
      chart.addEventListener('mouseleave', () => {
        chart.style.transform = 'scale(1)';
      });
    });
  }

  // Mostrar detalles de card
  showCardDetails(card) {
    const title = card.querySelector('.stats-label')?.textContent;
    const value = card.querySelector('.stats-number')?.textContent;
    
    if (title && value) {
      // Crear modal con detalles
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h3 class="modal-title">Detalles: ${title}</h3>
            <button class="modal-close" data-modal-close>
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Valor actual: <strong>${value}</strong></p>
            <p>Aquí se mostrarían más detalles específicos de ${title.toLowerCase()}.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" data-modal-close>Cerrar</button>
            <button class="btn btn-primary">Ver Reporte Completo</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      new Modal(modal);
    }
  }

  // Refrescar dashboard
  refresh() {
    this.loadDashboardData();
    this.showNotification('Dashboard actualizado', 'success');
  }

  // Exportar dashboard
  exportDashboard(format) {
    // Simular exportación
    this.showNotification(`Exportando dashboard en formato ${format.toUpperCase()}...`, 'info');
    
    setTimeout(() => {
      this.showNotification('Dashboard exportado exitosamente', 'success');
    }, 2000);
  }

  // Mostrar notificación
  showNotification(message, type = 'info') {
    if (window.Notification) {
      Notification.show(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  // Mostrar error
  showError(message) {
    this.showNotification(message, 'error');
  }
}

// Inicializar dashboard
window.Dashboard = new Dashboard();

// Detectar cambios de tamaño de ventana
window.addEventListener('resize', () => {
  const newIsDesktop = Dashboard.detectDesktop();
  if (newIsDesktop !== Dashboard.isDesktop) {
    Dashboard.isDesktop = newIsDesktop;
    Dashboard.setupDesktopOptimizations();
  }
});
