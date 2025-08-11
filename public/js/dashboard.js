/* ========================================
   DASHBOARD - Sistema de Gestión de Medios Informáticos
   ======================================== */

class Dashboard {
  constructor() {
    this.isDesktop = this.detectDesktop();
    this.init();
  }

  // Animar conteo de números en KPIs
  animateNumber(element, from, to, duration = 800) {
    const start = performance.now();
    const range = to - from;
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(from + range * ease);
      element.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
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
      const sections = dashboardPage.querySelectorAll('.dashboard-grid, .performance-metrics, .dashboard-charts, .security-metrics, .state-summary, .recent-activity, .quick-actions');
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
    try {
      // Verificar autenticación
      if (!ConfigUtils.isAuthenticated()) {
        console.warn('Usuario no autenticado, usando datos simulados');
        return this.getMockData();
      }
      
      // Usar la configuración de la API correcta
      const apiUrl = ConfigUtils.getApiUrl('/dashboard/stats');
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ConfigUtils.getAuthToken()}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Token expirado o inválido, usando datos simulados');
          return this.getMockData();
        }
        throw new Error('Error al obtener datos del dashboard');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error);
      // Retornar datos simulados en caso de error
      return this.getMockData();
    }
  }

  // Datos simulados para el dashboard
  getMockData() {
    return {
      stats: {
        totalEquipment: 25,
        activeEquipment: 20,
        disposalProposals: 2
      },
                equipmentByType: {
        totalLaptops: 8,
        totalPcs: 12,
        totalMonitors: 15,
        totalPrinters: 5,
        totalSims: 20,
        totalRadios: 10
      },
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
    this.updateEquipmentByType(data.equipmentByType);
    this.updateSecurityMetrics(data.security);
  }

  // Actualizar estadísticas
  updateStats(stats) {
    const elements = {
      'total-equipment': stats.totalEquipment,
      'active-equipment': stats.activeEquipment,
      'disposal-proposals': stats.disposalProposals
    };

    Object.entries(elements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (!el) return;

      // Animación de conteo respetando reduced-motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const current = parseInt(el.textContent.replace(/[^0-9-]/g, '')) || 0;

      if (prefersReduced) {
        el.textContent = value;
      } else if (current !== value) {
        this.animateNumber(el, current, value, 800);
        // Efecto pulse sutil en el contenedor de la tarjeta
        const cardBody = el.closest('.card-body');
        if (cardBody) {
          cardBody.classList.add('kpi-pulse');
          setTimeout(() => cardBody.classList.remove('kpi-pulse'), 600);
        }
      }

      // Actualizar delta si existe un span asociado
      const deltaEl = document.getElementById(`${id}-delta`);
      if (deltaEl) {
        const delta = value - current;
        deltaEl.textContent = `${delta > 0 ? '+' : ''}${delta}`;
        deltaEl.classList.remove('positive', 'negative');
        if (delta > 0) deltaEl.classList.add('positive');
        if (delta < 0) deltaEl.classList.add('negative');
      }
    });
  }

  // Actualizar estadísticas por tipo de equipo
  updateEquipmentByType(equipmentByType) {
    const elements = {
      'total-laptops': equipmentByType.totalLaptops,
      'total-pcs': equipmentByType.totalPcs,
      'total-monitors': equipmentByType.totalMonitors,
      'total-printers': equipmentByType.totalPrinters,
      'total-sims': equipmentByType.totalSims,
      'total-radios': equipmentByType.totalRadios
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  // Se removió la sección de "Alertas del Sistema" del dashboard.

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
    }
    return '';
  }

  // Configurar gráficos
  setupCharts() {
    this.loadChartData();
  }

  // Cargar datos de gráficos desde el backend
  async loadChartData() {
    try {
      // Verificar autenticación
      if (!ConfigUtils.isAuthenticated()) {
        console.warn('Usuario no autenticado, usando gráficos simulados');
        this.setupEquipmentTypeChart();
        this.setupEquipmentStateChart();
        this.setupEquipmentLocationChart();
        this.setupOperationalRateChart();
        return;
      }
      
      // Usar la configuración de la API correcta
      const apiUrl = ConfigUtils.getApiUrl('/dashboard/charts');
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ConfigUtils.getAuthToken()}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Token expirado o inválido, usando gráficos simulados');
          this.setupEquipmentTypeChart();
          this.setupEquipmentStateChart();
          this.setupEquipmentLocationChart();
          this.setupOperationalRateChart();
          return;
        }
        throw new Error('Error al obtener datos de gráficos');
      }

      const chartData = await response.json();
      this.setupEquipmentTypeChart(chartData.data.typeChart);
      this.setupEquipmentStateChart(chartData.data.stateChart);
      this.setupEquipmentLocationChart(chartData.data.locationChart);
      this.setupOperationalRateChart(chartData.data.operationalRate);
    } catch (error) {
      console.error('Error al cargar datos de gráficos:', error);
      // Usar datos simulados en caso de error
      this.setupEquipmentTypeChart();
      this.setupEquipmentStateChart();
      this.setupEquipmentLocationChart();
      this.setupOperationalRateChart();
    }
  }

  // Gráfico de equipos por tipo
  setupEquipmentTypeChart(data) {
        const ctx = document.getElementById('equipment-type-chart');
        if (!ctx) return;
        
    // Usar datos del backend si están disponibles, sino usar datos simulados
    const chartData = data || [
      { type: 'desktop', count: 8 },
      { type: 'laptop', count: 6 },
      { type: 'printer', count: 4 },
      { type: 'server', count: 3 },
      { type: 'router', count: 2 },
      { type: 'switch', count: 2 }
    ];

    const labels = chartData.map(item => item.type.charAt(0).toUpperCase() + item.type.slice(1));
    const values = chartData.map(item => item.count);
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
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
  setupEquipmentStateChart(data) {
        const ctx = document.getElementById('equipment-state-chart');
        if (!ctx) return;
        
    // Usar datos del backend si están disponibles, sino usar datos simulados
    const chartData = data || [
      { status: 'active', count: 20 },
      { status: 'out_of_service', count: 2 },
      { status: 'disposed', count: 0 }
    ];

    const labels = chartData.map(item => {
      switch (item.status) {
        case 'active': return 'Activo';
        case 'out_of_service': return 'Fuera de Servicio';
        case 'disposed': return 'Desechado';
        default: return item.status;
      }
    });
    const values = chartData.map(item => item.count);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
          label: 'Cantidad',
                    data: values,
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
  setupEquipmentLocationChart(data) {
    const ctx = document.getElementById('equipment-location-chart');
    if (!ctx) return;

    // Usar datos del backend si están disponibles, sino usar datos simulados
    const chartData = data || [
      { location: 'Oficina Central', count: 12 },
      { location: 'Sucursal Norte', count: 6 },
      { location: 'Sucursal Sur', count: 4 },
      { location: 'Almacén', count: 3 }
    ];

    const labels = chartData.map(item => item.location);
    const values = chartData.map(item => item.count);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
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

  // Gráfico de anillo para Tasa Operacional
  setupOperationalRateChart(data) {
    const ctx = document.getElementById('operational-rate-chart');
    if (!ctx) return;

    // Usar datos del backend si están disponibles, sino usar datos simulados
    const operationalRate = data || 92; // Porcentaje de tasa operacional
    const remainingRate = 100 - operationalRate;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Operacional', 'No Operacional'],
        datasets: [{
          data: [operationalRate, remainingRate],
          backgroundColor: [
            '#22c55e', // Verde para operacional
            '#e5e7eb'  // Gris claro para no operacional
          ],
          borderWidth: 0,
          cutout: '70%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed}%`;
              }
            }
          }
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        }
      }
    });

    // Agregar el porcentaje en el centro del gráfico
    const centerText = document.createElement('div');
    centerText.className = 'chart-center-text';
    centerText.innerHTML = `
      <div class="center-percentage">${operationalRate}%</div>
      <div class="center-label">Tasa Operacional</div>
    `;
    centerText.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
    `;
    
    const centerPercentage = centerText.querySelector('.center-percentage');
    centerPercentage.style.cssText = `
      font-size: 2rem;
      font-weight: bold;
      color: var(--color-text-primary);
      line-height: 1;
    `;
    
    const centerLabel = centerText.querySelector('.center-label');
    centerLabel.style.cssText = `
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin-top: 0.5rem;
    `;

    ctx.parentElement.style.position = 'relative';
    ctx.parentElement.appendChild(centerText);
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
  const newIsDesktop = window.Dashboard.detectDesktop();
  if (newIsDesktop !== window.Dashboard.isDesktop) {
    window.Dashboard.isDesktop = newIsDesktop;
    window.Dashboard.setupDesktopOptimizations();
  }
});
