// Módulo del Dashboard
const Dashboard = {
    // Estado del dashboard
    stats: {},
    charts: {},
    alerts: [],
    recentActivity: [],
    
    // Inicializar dashboard
    init: function() {
        console.log('📊 Inicializando dashboard...');
        this.setupAutoRefresh();
    },
    
    // Configurar auto-refresh
    setupAutoRefresh: function() {
        // Auto-refresh cada 30 segundos
        setInterval(() => {
            this.refreshStats();
        }, 30000);
    },
    
    // Cargar datos del dashboard
    loadDashboard: async function() {
        try {
            console.log('🔄 Cargando datos del dashboard...');
            
            // Mostrar loading
            UI.showLoading('#dashboard-page', 'Cargando estadísticas...');
            
            // Cargar todos los datos en paralelo
            await Promise.all([
                this.loadStats(),
                this.loadCharts(),
                this.loadAlerts(),
                this.loadRecentActivity(),
                this.loadSecurityMetrics(),
                this.loadStateSummary()
            ]);
            
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
            // Por ahora, usamos datos de ejemplo expandidos
            this.stats = {
                totalEquipment: 25,
                activeEquipment: 20,
                maintenanceEquipment: 3,
                outOfServiceEquipment: 2,
                totalAssignments: 18,
                disposalProposals: 2,
                availableEquipment: 5,
                utilizationRate: 85,
                operationalRate: 92,
                maintenanceRate: 8
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
            // Por ahora, usamos datos de ejemplo expandidos
            this.charts = {
                equipmentByType: {
                    desktop: 10,
                    laptop: 8,
                    printer: 3,
                    server: 2,
                    router: 1,
                    switch: 1
                },
                equipmentByState: {
                    active: 20,
                    maintenance: 3,
                    out_of_service: 2,
                    disposed: 0
                },
                equipmentByLocation: {
                    'Estado 1': 8,
                    'Estado 2': 6,
                    'Estado 3': 5,
                    'Estado 4': 4,
                    'Estado 5': 2
                }
            };
            
            // Crear gráficos
            this.createCharts();
            
        } catch (error) {
            console.error('Error cargando gráficos:', error);
            throw error;
        }
    },
    
    // Cargar alertas
    loadAlerts: async function() {
        try {
            this.alerts = [
                {
                    id: 1,
                    type: 'warning',
                    message: '3 equipos requieren mantenimiento preventivo',
                    icon: 'fas fa-tools',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
                },
                {
                    id: 2,
                    type: 'warning',
                    message: '1 propuesta de baja pendiente de aprobación',
                    icon: 'fas fa-exclamation-triangle',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 horas atrás
                },
                {
                    id: 3,
                    type: 'success',
                    message: 'Sistema funcionando correctamente',
                    icon: 'fas fa-check-circle',
                    timestamp: new Date()
                }
            ];
            
            this.updateAlertsUI();
            
        } catch (error) {
            console.error('Error cargando alertas:', error);
            throw error;
        }
    },
    
    // Cargar actividad reciente
    loadRecentActivity: async function() {
        try {
            this.recentActivity = [
                {
                    id: 1,
                    type: 'assignment',
                    title: 'PC Oficina Central asignado a Juan Pérez',
                    description: 'Equipo asignado para trabajo remoto',
                    icon: 'fas fa-user-plus',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    user: 'Admin'
                },
                {
                    id: 2,
                    type: 'movement',
                    title: 'Laptop Dell movido a Estado 2',
                    description: 'Transferencia de ubicación',
                    icon: 'fas fa-truck',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
                    user: 'Manager'
                },
                {
                    id: 3,
                    type: 'maintenance',
                    title: 'Impresora HP enviada a mantenimiento',
                    description: 'Mantenimiento preventivo programado',
                    icon: 'fas fa-tools',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    user: 'Admin'
                },
                {
                    id: 4,
                    type: 'registration',
                    title: 'Nuevo equipo Router Cisco registrado',
                    description: 'Equipo agregado al inventario',
                    icon: 'fas fa-plus-circle',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    user: 'Admin'
                }
            ];
            
            this.updateActivityUI();
            
        } catch (error) {
            console.error('Error cargando actividad reciente:', error);
            throw error;
        }
    },
    
    // Cargar métricas de seguridad
    loadSecurityMetrics: async function() {
        try {
            this.securityMetrics = {
                equipmentWithSecurityData: 15,
                accessLogsToday: 12,
                updatedCredentials: 3,
                securityAlerts: 0
            };
            
            this.updateSecurityUI();
            
        } catch (error) {
            console.error('Error cargando métricas de seguridad:', error);
            throw error;
        }
    },
    
    // Cargar resumen por estados
    loadStateSummary: async function() {
        try {
            this.stateSummary = {
                'Estado 1': { name: 'IT Central', count: 8, active: 7, maintenance: 1 },
                'Estado 2': { name: 'Oficina Principal', count: 6, active: 5, maintenance: 1 },
                'Estado 3': { name: 'Sucursal Norte', count: 5, active: 4, maintenance: 1 },
                'Estado 4': { name: 'Sucursal Sur', count: 4, active: 3, maintenance: 1 },
                'Estado 5': { name: 'Almacén', count: 2, active: 1, maintenance: 1 }
            };
            
            this.updateStateSummaryUI();
            
        } catch (error) {
            console.error('Error cargando resumen por estados:', error);
            throw error;
        }
    },
    
    // Actualizar UI de estadísticas
    updateStatsUI: function() {
        const elements = {
            'total-equipment': this.stats.totalEquipment,
            'active-equipment': this.stats.activeEquipment,
            'maintenance-equipment': this.stats.maintenanceEquipment,
            'total-assignments': this.stats.totalAssignments,
            'disposal-proposals': this.stats.disposalProposals,
            'out-of-service': this.stats.outOfServiceEquipment,
            'available-equipment': this.stats.availableEquipment,
            'utilization-rate': this.stats.utilizationRate + '%',
            'operational-rate': this.stats.operationalRate + '%',
            'maintenance-rate': this.stats.maintenanceRate + '%'
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
    },
    
    // Actualizar UI de alertas
    updateAlertsUI: function() {
        const alertsContainer = document.getElementById('alerts-container');
        if (!alertsContainer) return;
        
        alertsContainer.innerHTML = this.alerts.map(alert => `
            <div class="alert-item alert-${alert.type}">
                <div class="alert-icon">
                    <i class="${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${this.formatTimeAgo(alert.timestamp)}</div>
                </div>
            </div>
        `).join('');
    },
    
    // Actualizar UI de actividad reciente
    updateActivityUI: function() {
        const activityContainer = document.getElementById('recent-activity-container');
        if (!activityContainer) return;
        
        activityContainer.innerHTML = this.recentActivity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-meta">
                        <span class="activity-user">${activity.user}</span>
                        <span class="activity-time">${this.formatTimeAgo(activity.timestamp)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Actualizar UI de métricas de seguridad
    updateSecurityUI: function() {
        const elements = {
            'security-equipment': this.securityMetrics.equipmentWithSecurityData,
            'security-access-logs': this.securityMetrics.accessLogsToday,
            'security-updated-credentials': this.securityMetrics.updatedCredentials,
            'security-alerts': this.securityMetrics.securityAlerts
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
    },
    
    // Actualizar UI de resumen por estados
    updateStateSummaryUI: function() {
        const stateContainer = document.getElementById('state-summary-container');
        if (!stateContainer) return;
        
        stateContainer.innerHTML = Object.entries(this.stateSummary).map(([key, state]) => `
            <div class="state-summary-item">
                <div class="state-name">${state.name}</div>
                <div class="state-stats">
                    <span class="state-total">${state.count} equipos</span>
                    <span class="state-active">${state.active} activos</span>
                    <span class="state-maintenance">${state.maintenance} en mantenimiento</span>
                </div>
            </div>
        `).join('');
    },
    
    // Formatear tiempo relativo
    formatTimeAgo: function(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) {
            return `hace ${minutes} minutos`;
        } else if (hours < 24) {
            return `hace ${hours} horas`;
        } else {
            return `hace ${days} días`;
        }
    },
    
    // Crear gráficos
    createCharts: function() {
        this.createEquipmentTypeChart();
        this.createEquipmentStateChart();
        this.createEquipmentLocationChart();
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
                        '#00f2fe'
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
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
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
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
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
    
    // Crear gráfico de equipos por ubicación
    createEquipmentLocationChart: function() {
        const ctx = document.getElementById('equipment-location-chart');
        if (!ctx) return;
        
        const data = this.charts.equipmentByLocation;
        const labels = Object.keys(data);
        const values = Object.values(data);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Equipos por Ubicación',
                    data: values,
                    backgroundColor: '#667eea',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff'
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
    
    // Refrescar estadísticas en tiempo real
    refreshStats: async function() {
        try {
            await this.loadStats();
            await this.loadAlerts();
            console.log('🔄 Estadísticas actualizadas');
        } catch (error) {
            console.error('Error actualizando estadísticas:', error);
        }
    },
    
    // Actualizar estadísticas
    updateStats: function(newStats) {
        this.stats = { ...this.stats, ...newStats };
        this.updateStatsUI();
    },
    
    // Refrescar dashboard completo
    refresh: async function() {
        await this.loadDashboard();
    },
    
    // Obtener estadísticas rápidas
    getQuickStats: function() {
        return {
            totalEquipment: this.stats.totalEquipment || 0,
            activeEquipment: this.stats.activeEquipment || 0,
            maintenanceEquipment: this.stats.maintenanceEquipment || 0,
            totalAssignments: this.stats.totalAssignments || 0,
            utilizationRate: this.stats.utilizationRate || 0
        };
    },
    
    // Exportar datos del dashboard
    exportDashboard: function(format = 'pdf') {
        try {
            const data = {
                stats: this.stats,
                charts: this.charts,
                alerts: this.alerts,
                recentActivity: this.recentActivity,
                securityMetrics: this.securityMetrics,
                stateSummary: this.stateSummary,
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
