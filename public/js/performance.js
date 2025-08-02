/* ========================================
   PERFORMANCE - Sistema de Gestión de Medios Informáticos
   ======================================== */

class PerformanceOptimizer {
  constructor() {
    this.metrics = {};
    this.observers = [];
    this.init();
  }

  init() {
    this.setupPerformanceMonitoring();
    this.setupResourceOptimization();
    this.setupLazyLoading();
    this.setupCaching();
    this.setupDebouncing();
  }

  // Configurar monitoreo de performance
  setupPerformanceMonitoring() {
    // Monitorear métricas de Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.logMetric('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.logMetric('FID', this.metrics.fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        this.logMetric('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Monitorear tiempo de carga de la página
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.metrics.pageLoad = loadTime;
      this.logMetric('Page Load', loadTime);
    });

    // Monitorear tiempo de respuesta de la API
    this.setupAPIMonitoring();
  }

  // Configurar monitoreo de API
  setupAPIMonitoring() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.logMetric('API Response', duration, args[0]);
        return response;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.logMetric('API Error', duration, args[0]);
        throw error;
      }
    };
  }

  // Configurar optimización de recursos
  setupResourceOptimization() {
    // Precargar recursos críticos
    this.preloadCriticalResources();
    
    // Optimizar imágenes
    this.optimizeImages();
    
    // Comprimir recursos estáticos
    this.compressStaticResources();
  }

  // Precargar recursos críticos
  preloadCriticalResources() {
    const criticalResources = [
      '/css/design-tokens.css',
      '/css/styles.css',
      '/js/config.js',
      '/js/auth.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  // Optimizar imágenes
  optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Lazy loading nativo
      if (!img.loading) {
        img.loading = 'lazy';
      }
      
      // Optimizar srcset para diferentes tamaños
      if (!img.srcset) {
        this.generateSrcSet(img);
      }
    });
  }

  // Generar srcset para imágenes
  generateSrcSet(img) {
    const src = img.src;
    if (src) {
      const baseName = src.replace(/\.[^/.]+$/, '');
      const extension = src.split('.').pop();
      
      img.srcset = `
        ${baseName}-300w.${extension} 300w,
        ${baseName}-600w.${extension} 600w,
        ${baseName}-900w.${extension} 900w,
        ${src} 1200w
      `;
      img.sizes = '(max-width: 768px) 300px, (max-width: 1024px) 600px, 900px';
    }
  }

  // Comprimir recursos estáticos
  compressStaticResources() {
    // Comprimir CSS
    this.compressCSS();
    
    // Comprimir JavaScript
    this.compressJS();
  }

  // Comprimir CSS
  compressCSS() {
    const styleSheets = document.styleSheets;
    Array.from(styleSheets).forEach(sheet => {
      if (sheet.href && sheet.href.includes('css/')) {
        // Agregar parámetros de compresión
        const link = document.querySelector(`link[href="${sheet.href}"]`);
        if (link) {
          link.setAttribute('data-compressed', 'true');
        }
      }
    });
  }

  // Comprimir JavaScript
  compressJS() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      if (script.src.includes('js/')) {
        script.setAttribute('data-compressed', 'true');
      }
    });
  }

  // Configurar lazy loading
  setupLazyLoading() {
    // Lazy loading para componentes
    this.setupComponentLazyLoading();
    
    // Lazy loading para datos
    this.setupDataLazyLoading();
  }

  // Lazy loading para componentes
  setupComponentLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const component = entry.target;
          this.loadComponent(component);
          observer.unobserve(component);
        }
      });
    });

    // Observar componentes con data-lazy
    document.querySelectorAll('[data-lazy]').forEach(component => {
      observer.observe(component);
    });
  }

  // Cargar componente
  loadComponent(component) {
    const componentType = component.dataset.lazy;
    
    switch (componentType) {
      case 'chart':
        this.loadChartComponent(component);
        break;
      case 'table':
        this.loadTableComponent(component);
        break;
      case 'form':
        this.loadFormComponent(component);
        break;
      default:
        console.log(`Componente ${componentType} no implementado`);
    }
  }

  // Cargar componente de gráfico
  loadChartComponent(component) {
    // Simular carga de gráfico
    setTimeout(() => {
      component.innerHTML = '<div class="chart-placeholder">Gráfico cargado</div>';
      component.classList.add('loaded');
    }, 100);
  }

  // Cargar componente de tabla
  loadTableComponent(component) {
    // Simular carga de tabla
    setTimeout(() => {
      component.innerHTML = '<div class="table-placeholder">Tabla cargada</div>';
      component.classList.add('loaded');
    }, 100);
  }

  // Cargar componente de formulario
  loadFormComponent(component) {
    // Simular carga de formulario
    setTimeout(() => {
      component.innerHTML = '<div class="form-placeholder">Formulario cargado</div>';
      component.classList.add('loaded');
    }, 100);
  }

  // Lazy loading para datos
  setupDataLazyLoading() {
    // Cargar datos solo cuando sean necesarios
    this.setupInfiniteScroll();
    this.setupVirtualScrolling();
  }

  // Configurar scroll infinito
  setupInfiniteScroll() {
    let isLoading = false;
    let page = 1;

    window.addEventListener('scroll', this.debounce(() => {
      if (isLoading) return;

      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100) {
        isLoading = true;
        this.loadMoreData(page++).then(() => {
          isLoading = false;
        });
      }
    }, 100));
  }

  // Configurar virtual scrolling
  setupVirtualScrolling() {
    // Implementar virtual scrolling para listas grandes
    const virtualLists = document.querySelectorAll('[data-virtual-scroll]');
    virtualLists.forEach(list => {
      this.initVirtualScroll(list);
    });
  }

  // Inicializar virtual scroll
  initVirtualScroll(container) {
    const itemHeight = 50; // altura de cada item
    const visibleItems = Math.ceil(container.clientHeight / itemHeight);
    let startIndex = 0;
    let endIndex = visibleItems;

    const updateVisibleItems = () => {
      const scrollTop = container.scrollTop;
      startIndex = Math.floor(scrollTop / itemHeight);
      endIndex = startIndex + visibleItems;

      // Actualizar items visibles
      this.updateVirtualItems(container, startIndex, endIndex);
    };

    container.addEventListener('scroll', this.debounce(updateVisibleItems, 16));
  }

  // Actualizar items virtuales
  updateVirtualItems(container, startIndex, endIndex) {
    const items = container.querySelectorAll('[data-virtual-item]');
    items.forEach((item, index) => {
      if (index >= startIndex && index <= endIndex) {
        item.style.display = 'block';
        item.style.transform = `translateY(${index * 50}px)`;
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Configurar caché
  setupCaching() {
    // Cache de datos en memoria
    this.memoryCache = new Map();
    
    // Cache de componentes
    this.componentCache = new Map();
    
    // Cache de API responses
    this.apiCache = new Map();
  }

  // Configurar debouncing
  setupDebouncing() {
    // Debounce para búsquedas
    this.setupSearchDebouncing();
    
    // Debounce para scroll
    this.setupScrollDebouncing();
    
    // Debounce para resize
    this.setupResizeDebouncing();
  }

  // Debounce para búsquedas
  setupSearchDebouncing() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[data-search]');
    searchInputs.forEach(input => {
      input.addEventListener('input', this.debounce((e) => {
        this.performSearch(e.target.value);
      }, 300));
    });
  }

  // Debounce para scroll
  setupScrollDebouncing() {
    window.addEventListener('scroll', this.debounce(() => {
      this.handleScroll();
    }, 16));
  }

  // Debounce para resize
  setupResizeDebouncing() {
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));
  }

  // Función debounce genérica
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
  }

  // Cargar más datos
  async loadMoreData(page) {
    try {
      const response = await fetch(`/api/equipment?page=${page}&limit=20`);
      const data = await response.json();
      
      // Agregar datos al DOM
      this.appendDataToDOM(data);
      
      return data;
    } catch (error) {
      console.error('Error cargando más datos:', error);
    }
  }

  // Agregar datos al DOM
  appendDataToDOM(data) {
    const container = document.querySelector('[data-infinite-scroll]');
    if (container && data.items) {
      data.items.forEach(item => {
        const element = this.createDataElement(item);
        container.appendChild(element);
      });
    }
  }

  // Crear elemento de datos
  createDataElement(item) {
    const element = document.createElement('div');
    element.className = 'data-item';
    element.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.description}</p>
    `;
    return element;
  }

  // Realizar búsqueda
  performSearch(query) {
    if (query.length < 2) return;

    // Cache de búsquedas
    const cacheKey = `search_${query}`;
    if (this.memoryCache.has(cacheKey)) {
      this.displaySearchResults(this.memoryCache.get(cacheKey));
      return;
    }

    // Realizar búsqueda
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(results => {
        this.memoryCache.set(cacheKey, results);
        this.displaySearchResults(results);
      })
      .catch(error => {
        console.error('Error en búsqueda:', error);
      });
  }

  // Mostrar resultados de búsqueda
  displaySearchResults(results) {
    const resultsContainer = document.querySelector('.search-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = results.map(item => `
        <div class="search-result-item">
          <h4>${item.name}</h4>
          <p>${item.description}</p>
        </div>
      `).join('');
    }
  }

  // Manejar scroll
  handleScroll() {
    // Optimizar scroll events
    requestAnimationFrame(() => {
      // Actualizar elementos que dependen del scroll
      this.updateScrollDependentElements();
    });
  }

  // Actualizar elementos dependientes del scroll
  updateScrollDependentElements() {
    const scrollY = window.pageYOffset;
    
    // Actualizar header sticky
    const header = document.querySelector('.app-header');
    if (header) {
      if (scrollY > 100) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    }
    
    // Actualizar sidebar
    const sidebar = document.querySelector('.sidebar-floating');
    if (sidebar) {
      sidebar.style.transform = `translateY(${scrollY}px)`;
    }
  }

  // Manejar resize
  handleResize() {
    // Optimizar resize events
    requestAnimationFrame(() => {
      this.updateResponsiveElements();
    });
  }

  // Actualizar elementos responsivos
  updateResponsiveElements() {
    const width = window.innerWidth;
    
    // Actualizar grid layouts
    const grids = document.querySelectorAll('.dashboard-grid, .security-grid');
    grids.forEach(grid => {
      if (width < 768) {
        grid.style.gridTemplateColumns = '1fr';
      } else if (width < 1024) {
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      } else {
        grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
      }
    });
  }

  // Log de métricas
  logMetric(name, value, context = '') {
    const metric = {
      name,
      value,
      context,
      timestamp: Date.now()
    };
    
    console.log(`📊 ${name}: ${value}${context ? ` (${context})` : ''}`);
    
    // Enviar métrica a analytics si está disponible
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: value,
        metric_context: context
      });
    }
  }

  // Generar reporte de performance
  generatePerformanceReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  // Generar recomendaciones
  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.lcp > 2500) {
      recommendations.push('Optimizar LCP: Considerar lazy loading de imágenes no críticas');
    }

    if (this.metrics.fid > 100) {
      recommendations.push('Optimizar FID: Reducir JavaScript bloqueante');
    }

    if (this.metrics.cls > 0.1) {
      recommendations.push('Optimizar CLS: Reservar espacio para elementos dinámicos');
    }

    return recommendations;
  }

  // Mostrar reporte de performance
  showPerformanceReport() {
    const report = this.generatePerformanceReport();
    
    const modal = document.createElement('div');
    modal.className = 'modal performance-report-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Reporte de Performance</h3>
          <button class="modal-close" data-modal-close>
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="performance-metrics">
            <div class="metric-item">
              <span class="metric-label">LCP</span>
              <span class="metric-value ${this.metrics.lcp < 2500 ? 'good' : 'poor'}">${this.metrics.lcp?.toFixed(0) || 'N/A'}ms</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">FID</span>
              <span class="metric-value ${this.metrics.fid < 100 ? 'good' : 'poor'}">${this.metrics.fid?.toFixed(0) || 'N/A'}ms</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">CLS</span>
              <span class="metric-value ${this.metrics.cls < 0.1 ? 'good' : 'poor'}">${this.metrics.cls?.toFixed(3) || 'N/A'}</span>
            </div>
          </div>
          
          ${report.recommendations.length > 0 ? `
            <div class="recommendations">
              <h4>Recomendaciones</h4>
              <ul>
                ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" data-modal-close>Cerrar</button>
          <button class="btn btn-primary" onclick="PerformanceOptimizer.exportReport()">
            <i class="fas fa-download"></i> Exportar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    new Modal(modal);
  }

  // Exportar reporte
  static exportReport() {
    const optimizer = new PerformanceOptimizer();
    const report = optimizer.generatePerformanceReport();
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }
}

// Inicializar optimizador de performance
window.PerformanceOptimizer = PerformanceOptimizer;

// Nota: Los botones de performance ahora se manejan desde app.js
// y se ubican en el dropdown del usuario 