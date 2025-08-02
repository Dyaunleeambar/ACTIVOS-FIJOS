/**
 * Equipment Module - Sistema de Gestión de Medios Informáticos
 * Maneja toda la funcionalidad relacionada con equipos
 */

class Equipment {
    constructor() {
        this.currentStep = 1;
        this.excelData = null;
        this.mapping = {};
        this.validationResults = null;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filters = {
            search: '',
            type: '',
            status: '',
            state: ''
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadEquipmentList();
        this.loadFilterData();
    }

    setupEventListeners() {
        // Búsqueda en tiempo real
        const searchInput = document.getElementById('search-equipment');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.filters.search = searchInput.value;
                this.currentPage = 1;
                this.loadEquipmentList();
            }, 300));
        }

        // Filtros
        const filterInputs = ['filter-type', 'filter-status', 'filter-state'];
        filterInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.filters[id.replace('filter-', '')] = element.value;
                    this.currentPage = 1;
                    this.loadEquipmentList();
                });
            }
        });

        // Formulario de equipo
        const equipmentForm = document.getElementById('equipment-form');
        if (equipmentForm) {
            equipmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEquipment();
            });
        }

        // Archivo Excel
        const excelFile = document.getElementById('excel-file');
        if (excelFile) {
            excelFile.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
        }
    }

    // Cargar lista de equipos
    async loadEquipmentList() {
        try {
            const tbody = document.getElementById('equipment-tbody');
            const countElement = document.getElementById('equipment-count');
            
            // Mostrar loading
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando equipos...</td></tr>';
            
            // Construir parámetros de filtro
            const params = new URLSearchParams({
                page: this.currentPage,
                limit: this.itemsPerPage,
                ...this.filters
            });

            const response = await API.get(`/equipment?${params}`);
            
            if (response.success) {
                this.renderEquipmentTable(response.data.equipment);
                this.renderPagination(response.data.pagination);
                this.updateEquipmentCount(response.data.pagination.total);
            } else {
                throw new Error(response.message || 'Error cargando equipos');
            }
        } catch (error) {
            console.error('Error cargando equipos:', error);
            UI.showNotification('Error cargando equipos', 'error');
            this.renderEquipmentTable([]);
        }
    }

    // Renderizar tabla de equipos
    renderEquipmentTable(equipment) {
        const tbody = document.getElementById('equipment-tbody');
        
        if (!equipment || equipment.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">
                        <div style="padding: 40px;">
                            <i class="fas fa-inbox" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                            <p>No se encontraron equipos</p>
                            <button class="btn btn-primary" onclick="Equipment.showCreateForm()">
                                <i class="fas fa-plus"></i> Agregar primer equipo
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = equipment.map(item => `
            <tr>
                <td>
                    <strong>${item.inventory_number}</strong>
                </td>
                <td>
                    <div>
                        <div style="font-weight: 500;">${item.name}</div>
                        <small style="color: #666;">${item.brand || ''} ${item.model || ''}</small>
                    </div>
                </td>
                <td>
                    <span class="type-badge">${this.getTypeLabel(item.type)}</span>
                </td>
                <td>
                    <span class="status-badge status-${item.status}">
                        <i class="fas ${this.getStatusIcon(item.status)}"></i>
                        ${this.getStatusLabel(item.status)}
                    </span>
                </td>
                <td>
                    <div>
                        <div>${item.state_name || 'N/A'}</div>
                        <small style="color: #666;">${item.location_details || ''}</small>
                    </div>
                </td>
                <td>
                    ${item.assigned_to_name || '<span style="color: #999;">Sin asignar</span>'}
                </td>
                <td>
                    ${item.current_value ? `$${parseFloat(item.current_value).toLocaleString()}` : 'N/A'}
                </td>
                <td>
                    <div class="table-actions-cell">
                        <button class="action-btn view" onclick="Equipment.viewEquipment(${item.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="Equipment.showCreateForm(${item.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="Equipment.deleteEquipment(${item.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Renderizar paginación
    renderPagination(pagination) {
        const paginationElement = document.getElementById('equipment-pagination');
        
        if (!pagination || pagination.totalPages <= 1) {
            paginationElement.innerHTML = '';
            return;
        }

        const { currentPage, totalPages, total } = pagination;
        
        let paginationHTML = `
            <div class="pagination-info">
                Mostrando ${((currentPage - 1) * this.itemsPerPage) + 1} - ${Math.min(currentPage * this.itemsPerPage, total)} de ${total} equipos
            </div>
        `;

        // Botón anterior
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="Equipment.goToPage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Números de página
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="Equipment.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        // Botón siguiente
        paginationHTML += `
            <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="Equipment.goToPage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        paginationElement.innerHTML = paginationHTML;
    }

    // Ir a página específica
    goToPage(page) {
        this.currentPage = page;
        this.loadEquipmentList();
    }

    // Actualizar contador de equipos
    updateEquipmentCount(total) {
        const countElement = document.getElementById('equipment-count');
        if (countElement) {
            countElement.textContent = total;
        }
    }

    // Cargar datos para filtros
    async loadFilterData() {
        try {
            // Cargar estados
            const statesResponse = await API.get('/states');
            if (statesResponse.success) {
                const stateSelect = document.getElementById('filter-state');
                if (stateSelect) {
                    stateSelect.innerHTML = '<option value="">Todos los estados/regiones</option>';
                    statesResponse.data.forEach(state => {
                        stateSelect.innerHTML += `<option value="${state.id}">${state.name}</option>`;
                    });
                }
            }
        } catch (error) {
            console.error('Error cargando datos de filtros:', error);
        }
    }

    // Mostrar formulario de creación/edición
    async showCreateForm(equipmentId = null) {
        const modal = document.getElementById('equipment-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('equipment-form');
        
        if (equipmentId) {
            title.textContent = 'Editar Equipo';
            await this.loadEquipmentData(equipmentId);
        } else {
            title.textContent = 'Nuevo Equipo';
            form.reset();
        }
        
        modal.style.display = 'block';
        await this.loadFormData();
    }

    // Cargar datos del equipo para edición
    async loadEquipmentData(equipmentId) {
        try {
            const response = await API.get(`/equipment/${equipmentId}`);
            if (response.success) {
                const equipment = response.data;
                const form = document.getElementById('equipment-form');
                
                // Llenar formulario con datos del equipo
                Object.keys(equipment).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = equipment[key] || '';
                    }
                });
            }
        } catch (error) {
            console.error('Error cargando datos del equipo:', error);
            UI.showNotification('Error cargando datos del equipo', 'error');
        }
    }

    // Cargar datos para el formulario
    async loadFormData() {
        try {
            // Cargar estados
            const states = await API.get('/states');
            const stateSelect = document.getElementById('equipment-state');
            if (stateSelect && states.success) {
                stateSelect.innerHTML = '<option value="">Seleccionar estado</option>';
                states.data.forEach(state => {
                    stateSelect.innerHTML += `<option value="${state.id}">${state.name}</option>`;
                });
            }

            // Cargar usuarios
            const users = await API.get('/users');
            const userSelect = document.getElementById('assigned-to');
            if (userSelect && users.success) {
                userSelect.innerHTML = '<option value="">Sin asignar</option>';
                users.data.forEach(user => {
                    userSelect.innerHTML += `<option value="${user.id}">${user.full_name}</option>`;
                });
            }
        } catch (error) {
            console.error('Error cargando datos del formulario:', error);
        }
    }

    // Guardar equipo
    async saveEquipment() {
        try {
            const form = document.getElementById('equipment-form');
            const formData = new FormData(form);
            
            const equipmentData = {
                inventory_number: formData.get('inventory_number'),
                name: formData.get('name'),
                type: formData.get('type'),
                brand: formData.get('brand'),
                model: formData.get('model'),
                specifications: formData.get('specifications'),
                purchase_date: formData.get('purchase_date'),
                purchase_cost: parseFloat(formData.get('purchase_cost')) || 0,
                current_value: parseFloat(formData.get('current_value')) || 0,
                status: formData.get('status'),
                state_id: parseInt(formData.get('state_id')),
                assigned_to: formData.get('assigned_to') || null,
                location_details: formData.get('location_details'),
                security_username: formData.get('security_username'),
                security_password: formData.get('security_password'),
                access_details: formData.get('access_details')
            };

            // Determinar si es creación o edición
            const equipmentId = form.getAttribute('data-equipment-id');
            let response;
            
            if (equipmentId) {
                response = await API.put(`/equipment/${equipmentId}`, equipmentData);
            } else {
                response = await API.post('/equipment', equipmentData);
            }
            
            if (response.success) {
                UI.showNotification(
                    equipmentId ? 'Equipo actualizado exitosamente' : 'Equipo creado exitosamente', 
                    'success'
                );
                this.closeModal();
                this.loadEquipmentList();
            } else {
                throw new Error(response.message || 'Error guardando equipo');
            }
        } catch (error) {
            console.error('Error guardando equipo:', error);
            UI.showNotification('Error guardando equipo', 'error');
        }
    }

    // Cerrar modal
    closeModal() {
        const modal = document.getElementById('equipment-modal');
        modal.style.display = 'none';
        const form = document.getElementById('equipment-form');
        form.reset();
        form.removeAttribute('data-equipment-id');
    }

    // Ver detalles del equipo
    async viewEquipment(equipmentId) {
        try {
            const response = await API.get(`/equipment/${equipmentId}`);
            if (response.success) {
                this.showEquipmentDetails(response.data);
            }
        } catch (error) {
            console.error('Error cargando detalles del equipo:', error);
            UI.showNotification('Error cargando detalles del equipo', 'error');
        }
    }

    // Mostrar detalles del equipo
    showEquipmentDetails(equipment) {
        // Implementar modal de detalles
        console.log('Mostrar detalles:', equipment);
    }

    // Eliminar equipo
    async deleteEquipment(equipmentId) {
        const confirmed = await UI.showConfirmDialog(
            '¿Estás seguro de que quieres eliminar este equipo?',
            'Esta acción no se puede deshacer.'
        );
        
        if (confirmed) {
            try {
                const response = await API.delete(`/equipment/${equipmentId}`);
                if (response.success) {
                    UI.showNotification('Equipo eliminado exitosamente', 'success');
                    this.loadEquipmentList();
                } else {
                    throw new Error(response.message || 'Error eliminando equipo');
                }
            } catch (error) {
                console.error('Error eliminando equipo:', error);
                UI.showNotification('Error eliminando equipo', 'error');
            }
        }
    }

    // Importación desde Excel
    showImportModal() {
        const modal = document.getElementById('import-modal');
        modal.style.display = 'block';
        this.currentStep = 1;
        this.showImportStep(1);
    }

    // Manejar subida de archivo
    async handleFileUpload(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await API.post('/equipment/upload-excel', formData);
            
            if (response.success) {
                this.excelData = response.data;
                this.nextImportStep();
            } else {
                throw new Error(response.message || 'Error procesando archivo');
            }
        } catch (error) {
            console.error('Error procesando archivo:', error);
            UI.showNotification('Error procesando archivo Excel', 'error');
        }
    }

    // Generar mapeo de columnas
    generateColumnMapping() {
        const tbody = document.getElementById('mapping-tbody');
        tbody.innerHTML = '';

        const systemFields = [
            { key: 'inventory_number', label: 'Número de Inventario' },
            { key: 'name', label: 'Nombre del Equipo' },
            { key: 'type', label: 'Tipo' },
            { key: 'brand', label: 'Marca' },
            { key: 'model', label: 'Modelo' },
            { key: 'specifications', label: 'Especificaciones' },
            { key: 'purchase_date', label: 'Fecha de Compra' },
            { key: 'purchase_cost', label: 'Costo de Compra' },
            { key: 'current_value', label: 'Valor Actual' },
            { key: 'status', label: 'Estado' },
            { key: 'state_id', label: 'Estado/Región' },
            { key: 'location_details', label: 'Detalles de Ubicación' }
        ];

        systemFields.forEach(field => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <select class="column-mapping" data-field="${field.key}">
                        <option value="">Seleccionar columna</option>
                        ${this.excelData.columns.map(col => 
                            `<option value="${col}">${col}</option>`
                        ).join('')}
                    </select>
                </td>
                <td>${field.label}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Obtener mapeo de columnas
    getMapping() {
        const mapping = {};
        const selects = document.querySelectorAll('.column-mapping');
        selects.forEach(select => {
            const field = select.getAttribute('data-field');
            const value = select.value;
            if (value) {
                mapping[field] = value;
            }
        });
        return mapping;
    }

    // Validar datos de importación
    async validateImportData() {
        try {
            const mapping = this.getMapping();
            const validationData = {
                mapping: mapping,
                data: this.excelData.data
            };

            const response = await API.post('/equipment/validate-import', validationData);
            
            if (response.success) {
                this.validationResults = response.data;
                this.displayValidationResults();
                this.nextImportStep();
            } else {
                throw new Error(response.message || 'Error en validación');
            }
        } catch (error) {
            console.error('Error validando datos:', error);
            UI.showNotification('Error en validación de datos', 'error');
        }
    }

    // Mostrar resultados de validación
    displayValidationResults() {
        const validCount = document.getElementById('valid-count');
        const errorCount = document.getElementById('error-count');
        const errorsContainer = document.getElementById('validation-errors');

        if (validCount) validCount.textContent = this.validationResults.valid || 0;
        if (errorCount) errorCount.textContent = this.validationResults.errors?.length || 0;

        if (errorsContainer && this.validationResults.errors) {
            errorsContainer.innerHTML = this.validationResults.errors.map(error => 
                `<div class="error-item">${error}</div>`
            ).join('');
        }
    }

    // Confirmar importación
    async confirmImport() {
        try {
            const importData = {
                mapping: this.getMapping(),
                data: this.excelData.data,
                validation: this.validationResults
            };

            const response = await API.post('/equipment/import', importData);
            
            if (response.success) {
                UI.showNotification(
                    `Importación completada: ${response.data.imported} equipos`, 
                    'success'
                );
                this.closeImportModal();
                this.loadEquipmentList();
            } else {
                throw new Error(response.message || 'Error en importación');
            }
        } catch (error) {
            console.error('Error en importación:', error);
            UI.showNotification('Error en importación', 'error');
        }
    }

    // Descargar plantilla
    downloadTemplate() {
        const link = document.createElement('a');
        link.href = '/templates/equipment-template.xlsx';
        link.download = 'plantilla-equipos.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Exportar a Excel
    async exportToExcel() {
        try {
            const params = new URLSearchParams(this.filters);
            const response = await API.get(`/equipment/export?${params}`, { responseType: 'blob' });
            
            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `equipos-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            UI.showNotification('Exportación completada', 'success');
        } catch (error) {
            console.error('Error exportando:', error);
            UI.showNotification('Error en exportación', 'error');
        }
    }

    // Navegación de pasos de importación
    showImportStep(step) {
        // Ocultar todos los pasos
        document.querySelectorAll('.import-step').forEach(el => {
            el.classList.remove('active');
        });
        
        // Mostrar paso actual
        const currentStep = document.getElementById(`import-step-${step}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }

        // Actualizar botones
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const confirmBtn = document.getElementById('confirm-btn');

        if (prevBtn) prevBtn.style.display = step > 1 ? 'block' : 'none';
        if (nextBtn) nextBtn.style.display = step < 4 ? 'block' : 'none';
        if (confirmBtn) confirmBtn.style.display = step === 4 ? 'block' : 'none';
    }

    nextImportStep() {
        if (this.currentStep === 1) {
            this.generateColumnMapping();
        } else if (this.currentStep === 2) {
            this.validateImportData();
            return; // La validación maneja el siguiente paso
        }
        
        this.currentStep++;
        this.showImportStep(this.currentStep);
    }

    previousImportStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showImportStep(this.currentStep);
        }
    }

    closeImportModal() {
        const modal = document.getElementById('import-modal');
        modal.style.display = 'none';
        this.currentStep = 1;
        this.excelData = null;
        this.mapping = {};
        this.validationResults = null;
    }

    // Limpiar filtros
    clearFilters() {
        this.filters = {
            search: '',
            type: '',
            status: '',
            state: ''
        };
        
        // Limpiar inputs
        document.getElementById('search-equipment').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-state').value = '';
        
        this.currentPage = 1;
        this.loadEquipmentList();
    }

    // Actualizar lista
    refreshList() {
        this.loadEquipmentList();
    }

    // Utilidades
    getTypeLabel(type) {
        const types = {
            desktop: 'Desktop',
            laptop: 'Laptop',
            printer: 'Impresora',
            server: 'Servidor',
            router: 'Router',
            switch: 'Switch',
            radio_communication: 'Radio Comunicación',
            sim_chip: 'Chip SIM',
            roaming: 'Roaming',
            other: 'Otro'
        };
        return types[type] || type;
    }

    getStatusLabel(status) {
        const statuses = {
            active: 'Activo',
            maintenance: 'Mantenimiento',
            out_of_service: 'Fuera de servicio',
            disposed: 'Desechado'
        };
        return statuses[status] || status;
    }

    getStatusIcon(status) {
        const icons = {
            active: 'fa-check-circle',
            maintenance: 'fa-tools',
            out_of_service: 'fa-times-circle',
            disposed: 'fa-trash'
        };
        return icons[status] || 'fa-question-circle';
    }

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
}

// Inicializar módulo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.Equipment = new Equipment();
}); 
