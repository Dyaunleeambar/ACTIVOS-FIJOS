// Módulo de API
const API = {
    // Configuración base
    baseURL: CONFIG.API_BASE_URL,
    timeout: CONFIG.API_TIMEOUT,
    
    // Realizar request HTTP
    request: async function(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        
        // Configuración por defecto
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...ConfigUtils.getAuthHeaders()
            },
            timeout: this.timeout
        };
        
        // Combinar opciones
        const requestOptions = { ...defaultOptions, ...options };
        
        try {
            // Crear timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout')), this.timeout);
            });
            
            // Realizar request
            const fetchPromise = fetch(url, requestOptions);
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            
            // Verificar si la respuesta es ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Parsear respuesta
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.error('API Error:', error);
            
            // Manejar errores específicos
            if (error.message.includes('401')) {
                // Token expirado o inválido
                Auth.handleLogout();
                throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
            }
            
            throw error;
        }
    },
    
    // GET request
    get: function(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET'
        });
    },
    
    // POST request
    post: function(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // PUT request
    put: function(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE request
    delete: function(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    },
    
    // Endpoints de Autenticación
    auth: {
        login: (credentials) => API.post('/auth/login', credentials),
        logout: () => API.post('/auth/logout'),
        verify: () => API.get('/auth/verify'),
        changePassword: (data) => API.post('/auth/change-password', data),
        getProfile: () => API.get('/auth/profile')
    },
    
    // Endpoints de Equipos
    equipment: {
        getAll: (params = {}) => API.get('/equipment', params),
        getById: (id) => API.get(`/equipment/${id}`),
        create: (data) => API.post('/equipment', data),
        update: (id, data) => API.put(`/equipment/${id}`, data),
        delete: (id) => API.delete(`/equipment/${id}`),
        getByState: (stateId, params = {}) => API.get(`/equipment/state/${stateId}`, params)
    },
    
    // Endpoints de Usuarios
    users: {
        getAll: (params = {}) => API.get('/users', params),
        getById: (id) => API.get(`/users/${id}`),
        create: (data) => API.post('/users', data),
        update: (id, data) => API.put(`/users/${id}`, data),
        delete: (id) => API.delete(`/users/${id}`)
    },
    
    // Endpoints de Estados
    states: {
        getAll: () => API.get('/states'),
        getById: (id) => API.get(`/states/${id}`)
    },
    
    // Endpoints de Asignaciones
    assignments: {
        getAll: (params = {}) => API.get('/assignments', params),
        getById: (id) => API.get(`/assignments/${id}`),
        create: (data) => API.post('/assignments', data),
        update: (id, data) => API.put(`/assignments/${id}`, data),
        delete: (id) => API.delete(`/assignments/${id}`),
        returnEquipment: (id, data) => API.put(`/assignments/${id}/return`, data)
    },
    
    // Endpoints de Movimientos
    movements: {
        getAll: (params = {}) => API.get('/movements', params),
        getById: (id) => API.get(`/movements/${id}`),
        create: (data) => API.post('/movements', data),
        getByEquipment: (equipmentId) => API.get(`/movements/equipment/${equipmentId}`)
    },
    
    // Endpoints de Seguridad
    security: {
        getByEquipment: (equipmentId) => API.get(`/security/equipment/${equipmentId}`),
        create: (data) => API.post('/security', data),
        update: (id, data) => API.put(`/security/${id}`, data),
        delete: (id) => API.delete(`/security/${id}`)
    },
    
    // Endpoints de Reportes
    reports: {
        inventory: (params = {}) => API.get('/reports/inventory', params),
        movements: (params = {}) => API.get('/reports/movements', params),
        assignments: (params = {}) => API.get('/reports/assignments', params),
        equipmentByState: (params = {}) => API.get('/reports/equipment-by-state', params),
        equipmentByType: (params = {}) => API.get('/reports/equipment-by-type', params),
        equipmentByEmployee: (params = {}) => API.get('/reports/equipment-by-employee', params),
        exportPDF: (params = {}) => API.get('/reports/export/pdf', params),
        exportExcel: (params = {}) => API.get('/reports/export/excel', params)
    },
    
    // Endpoints de Propuestas de Baja
    disposals: {
        getAll: (params = {}) => API.get('/disposals', params),
        getById: (id) => API.get(`/disposals/${id}`),
        create: (data) => API.post('/disposals', data),
        update: (id, data) => API.put(`/disposals/${id}`, data),
        approve: (id, data) => API.put(`/disposals/${id}/approve`, data),
        reject: (id, data) => API.put(`/disposals/${id}/reject`, data)
    },
    
    // Dashboard y estadísticas
    dashboard: {
        getStats: () => API.get('/dashboard/stats'),
        getCharts: () => API.get('/dashboard/charts'),
        getRecentActivity: () => API.get('/dashboard/recent-activity')
    }
};

// Utilidades de API
const ApiUtils = {
    // Manejar errores de API
    handleError: function(error) {
        console.error('API Error:', error);
        
        let message = 'Error de conexión';
        
        if (error.message.includes('401')) {
            message = 'Sesión expirada. Por favor inicie sesión nuevamente.';
            Auth.handleLogout();
        } else if (error.message.includes('403')) {
            message = 'No tiene permisos para realizar esta acción.';
        } else if (error.message.includes('404')) {
            message = 'Recurso no encontrado.';
        } else if (error.message.includes('422')) {
            message = 'Datos inválidos. Por favor verifique la información.';
        } else if (error.message.includes('500')) {
            message = 'Error interno del servidor.';
        } else if (error.message.includes('timeout')) {
            message = 'Tiempo de espera agotado. Intente nuevamente.';
        } else {
            message = error.message || 'Error desconocido.';
        }
        
        UI.showNotification(message, 'error');
        return message;
    },
    
    // Validar respuesta de API
    validateResponse: function(response) {
        if (!response) {
            throw new Error('Respuesta vacía del servidor');
        }
        
        if (response.error) {
            throw new Error(response.error);
        }
        
        return response;
    },
    
    // Formatear parámetros de consulta
    formatParams: function(params) {
        const formatted = {};
        
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (value !== null && value !== undefined && value !== '') {
                formatted[key] = value;
            }
        });
        
        return formatted;
    },
    
    // Crear filtros para consultas
    createFilters: function(filters) {
        const params = {};
        
        if (filters.search) {
            params.search = filters.search;
        }
        
        if (filters.type) {
            params.type = filters.type;
        }
        
        if (filters.status) {
            params.status = filters.status;
        }
        
        if (filters.state_id) {
            params.state_id = filters.state_id;
        }
        
        if (filters.start_date) {
            params.start_date = filters.start_date;
        }
        
        if (filters.end_date) {
            params.end_date = filters.end_date;
        }
        
        if (filters.page) {
            params.page = filters.page;
        }
        
        if (filters.limit) {
            params.limit = filters.limit;
        }
        
        return params;
    },
    
    // Descargar archivo
    downloadFile: function(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    // Subir archivo
    uploadFile: function(endpoint, file, onProgress) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    onProgress(percentComplete);
                }
            });
            
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error('Error parsing response'));
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed'));
            });
            
            xhr.open('POST', this.baseURL + endpoint);
            
            // Agregar headers de autenticación
            const token = ConfigUtils.getAuthToken();
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }
            
            xhr.send(formData);
        });
    }
};

// Exportar módulos
window.API = API;
window.ApiUtils = ApiUtils; 
