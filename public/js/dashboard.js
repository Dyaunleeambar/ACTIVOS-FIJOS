// Módulo del Dashboard
const Dashboard = {
    // Estado del dashboard
    stats: {},
    charts: {},
    
    // Inicializar dashboard
    init: function() {
        console.log('📊 Inicializando dashboard...');
    },
    
    // Cargar datos del dashboard
    loadDashboard: async function() {
        try {
            console.log('🔄 Cargando datos del dashboard...');
            
            // Mostrar loading
            UI.showLoading('#dashboard-page', 'Cargando estadísticas...');
            
            // Cargar estadísticas
            await this.loadStats();
            
            // Cargar gráficos
            await this.loadCharts();
            
            // Ocultar loading
            UI.hideLoading('#dashboard-page');
            
            console.log('✅ Dashboard cargado exitosamente');
            
        } catch (error) {
            console.error('Error cargando dashboard:', error);
            UI.hideLoading('#dashboard-page');
            UI.showError('#dashboard-page', 'Error cargando datos del dashboard');
            ApiUtils.handleError(error);
        }
    },
    
    // Cargar estadísticas
    loadStats: async function() {
        try {
            // En una implementación real, esto vendría de la API
            // Por ahora, usamos datos de ejemplo
            this.stats = {
                totalEquipment: 25,
                activeEquipment: 20,
                maintenanceEquipment: 3,
                totalAssignments: 18
            };
            
            // Actualizar UI
            this.updateStatsUI();
            
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            throw error;
        }
    },
    
    // Cargar gráficos
    loadCharts: async function() {
        try {
            // En una implementación real, esto vendría de la API
            // Por ahora, usamos datos de ejemplo
            this.charts = {
                equipmentByType: {
                    desktop: 8,
                    laptop: 6,
                    printer: 4,
                    server: 2,
                    router: 2,
                    switch: 1,
                    radio_communication: 1,
                    sim_chip: 1
                },
                equipmentByState: {
                    active: 20,
                    maintenance: 3,
                    out_of_service: 1,
                    disposed: 1
                }
            };
            
            // Crear gráficos
            this.createCharts();
            
        } catch (error) {
            console.error('Error cargando gráficos:', error);
            throw error;
        }
    },
    
    // Actualizar UI de estadísticas
    updateStatsUI: function() {
        const elements = {
            'total-equipment': this.stats.totalEquipment,
            'active-equipment': this.stats.activeEquipment,
            'total-assignments': this.stats.totalAssignments,
            'maintenance-equipment': this.stats.maintenanceEquipment
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
    },
    
    // Crear gráficos
    createCharts: function() {
        this.createEquipmentTypeChart();
        this.createEquipmentStateChart();
    },
    
    // Crear gráfico de equipos por tipo
    createEquipmentTypeChart: function() {
        const ctx = document.getElementById('equipment-type-chart');
        if (!ctx) return;
        
        const data = this.charts.equipmentByType;
        const labels = Object.keys(data).map(type => CONFIG.EQUIPMENT_TYPES[type]);
        const values = Object.values(data);
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe',
                        '#43e97b',
                        '#38f9d7'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    },
    
    // Crear gráfico de equipos por estado
    createEquipmentStateChart: function() {
        const ctx = document.getElementById('equipment-state-chart');
        if (!ctx) return;
        
        const data = this.charts.equipmentByState;
        const labels = Object.keys(data).map(status => CONFIG.EQUIPMENT_STATUS[status]);
        const values = Object.values(data);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad de Equipos',
                    data: values,
                    backgroundColor: [
                        '#28a745',
                        '#ffc107',
                        '#dc3545',
                        '#6c757d'
                    ],
                    borderColor: [
                        '#28a745',
                        '#ffc107',
                        '#dc3545',
                        '#6c757d'
                    ],
                    borderWidth: 1
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
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },
    
    // Actualizar estadísticas en tiempo real
    updateStats: function(newStats) {
        this.stats = { ...this.stats, ...newStats };
        this.updateStatsUI();
    },
    
    // Refrescar dashboard
    refresh: async function() {
        await this.loadDashboard();
    },
    
    // Obtener estadísticas rápidas
    getQuickStats: function() {
        return {
            totalEquipment: this.stats.totalEquipment || 0,
            activeEquipment: this.stats.activeEquipment || 0,
            maintenanceEquipment: this.stats.maintenanceEquipment || 0,
            totalAssignments: this.stats.totalAssignments || 0
        };
    },
    
    // Exportar datos del dashboard
    exportDashboard: function(format = 'pdf') {
        try {
            const data = {
                stats: this.stats,
                charts: this.charts,
                generatedAt: new Date().toISOString()
            };
            
            if (format === 'pdf') {
                // TODO: Implementar exportación a PDF
                UI.showNotification('Exportación a PDF en desarrollo', 'info');
            } else if (format === 'excel') {
                // TODO: Implementar exportación a Excel
                UI.showNotification('Exportación a Excel en desarrollo', 'info');
            }
            
        } catch (error) {
            console.error('Error exportando dashboard:', error);
            UI.showNotification('Error al exportar dashboard', 'error');
        }
    }
};

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});

// Exportar módulo del dashboard
window.Dashboard = Dashboard; 
