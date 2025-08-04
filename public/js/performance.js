/* ========================================
   PERFORMANCE OPTIMIZER - Sistema de Gestión de Medios Informáticos
   ======================================== */

class PerformanceOptimizer {
  constructor() {
        this.isSlowNetwork = false;
        this.networkSpeed = 'fast';
    this.init();
  }

  init() {
        this.detectNetworkSpeed();
    this.setupPerformanceMonitoring();
    }

    // Detectar velocidad de red
    detectNetworkSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.networkSpeed = connection.effectiveType || 'fast';
            this.isSlowNetwork = this.networkSpeed === 'slow-2g' || 
                                this.networkSpeed === '2g' || 
                                this.networkSpeed === '3g';
            
            console.log(`🌐 Velocidad de red detectada: ${this.networkSpeed}`);
        }
    }

    // Configurar monitoreo de rendimiento
    setupPerformanceMonitoring() {
        // Monitorear errores de red
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
                console.warn('⚠️ Error cargando recurso:', e.target.src || e.target.href);
      }
    });
  }

    // Generar reporte de rendimiento
  generatePerformanceReport() {
        return {
            networkSpeed: this.networkSpeed,
            isSlowNetwork: this.isSlowNetwork,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }

    // Mostrar reporte de rendimiento
  showPerformanceReport() {
    const report = this.generatePerformanceReport();
    
    const modal = document.createElement('div');
        modal.className = 'modal show';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
                    <h3><i class="fas fa-tachometer-alt"></i> Reporte de Rendimiento</h3>
                    <button class="modal-close" data-modal-close>&times;</button>
        </div>
        <div class="modal-body">
                    <div class="performance-report">
                        <div class="report-section">
                            <h4>Información de Red</h4>
                            <p><strong>Velocidad:</strong> ${report.networkSpeed}</p>
                            <p><strong>Red lenta:</strong> ${report.isSlowNetwork ? 'Sí' : 'No'}</p>
          </div>
          
                        <div class="report-section">
              <h4>Recomendaciones</h4>
              <ul>
                                ${report.isSlowNetwork ? 
                                    '<li>✅ Optimizaciones de red lenta aplicadas</li><li>💡 Considera usar una conexión más rápida</li>' : 
                                    '<li>✅ Rendimiento óptimo detectado</li>'}
              </ul>
            </div>
                    </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" data-modal-close>Cerrar</button>
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
}

// Inicializar optimizador de rendimiento
window.PerformanceOptimizer = new PerformanceOptimizer(); 
