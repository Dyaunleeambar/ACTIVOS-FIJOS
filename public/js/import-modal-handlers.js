/**
 * Manejadores de eventos para el modal de importación
 * Compatible con Content Security Policy
 */
const ImportModalHandlers = {
    
    // Inicializar todos los event listeners
    init: function() {
        console.log('🔧 Inicializando event listeners del modal de importación...');
        console.log('🔍 Verificando elementos del DOM...');
        
        const uploadZone = document.querySelector('.upload-zone');
        const fileInput = document.getElementById('excel-file');
        const closeBtn = document.querySelector('.modal-close');
        const downloadBtn = document.querySelector('button[data-action="download-template"]');
        
        console.log('📋 Elementos encontrados:');
        console.log('  - Upload zone:', !!uploadZone);
        console.log('  - File input:', !!fileInput);
        console.log('  - Close button:', !!closeBtn);
        console.log('  - Download button:', !!downloadBtn);
        
        this.setupFileUpload();
        this.setupModalButtons();
        this.setupImportSteps();
        this.setupGeneralHandlers();
        
        console.log('✅ Event listeners inicializados correctamente');
    },
    
    // Configurar el upload de archivos
    setupFileUpload: function() {
        const uploadZone = document.querySelector('.upload-zone');
        const fileInput = document.getElementById('excel-file');
        
        if (uploadZone && fileInput) {
            uploadZone.addEventListener('click', function(e) {
                e.preventDefault();
                fileInput.click();
            });
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    console.log('📁 Archivo seleccionado:', file.name);
                    if (window.Equipment && window.Equipment.handleFileUpload) {
                        window.Equipment.handleFileUpload(file);
                    } else {
                        console.error('❌ Equipment.handleFileUpload no disponible');
                    }
                }
            });
        }
    },
    
    // Configurar botones del modal
    setupModalButtons: function() {
        // Botón cerrar modal
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.Equipment && window.Equipment.closeImportModal) {
                    window.Equipment.closeImportModal();
                } else {
                    console.error('❌ Equipment.closeImportModal no disponible');
                }
            });
        }
        
        // Botón descargar plantilla
        const downloadBtn = document.querySelector('button[data-action="download-template"]');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.Equipment && window.Equipment.downloadTemplate) {
                    window.Equipment.downloadTemplate();
                } else {
                    console.error('❌ Equipment.downloadTemplate no disponible');
                }
            });
        }
    },
    
    // Configurar botones de pasos de importación
    setupImportSteps: function() {
        // Botón anterior
        const prevBtn = document.getElementById('prev-btn');
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.Equipment && window.Equipment.previousImportStep) {
                    window.Equipment.previousImportStep();
                } else {
                    console.error('❌ Equipment.previousImportStep no disponible');
                }
            });
        }
        
        // Botón siguiente
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.Equipment && window.Equipment.nextImportStep) {
                    window.Equipment.nextImportStep();
                } else {
                    console.error('❌ Equipment.nextImportStep no disponible');
                }
            });
        }
        
        // Botón confirmar
        const confirmBtn = document.getElementById('confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.Equipment && window.Equipment.confirmImport) {
                    window.Equipment.confirmImport();
                } else {
                    console.error('❌ Equipment.confirmImport no disponible');
                }
            });
        }
    },
    
    // Manejador general para atributos data-action
    setupGeneralHandlers: function() {
        document.addEventListener('click', function(e) {
            const action = e.target.getAttribute('data-action');
            if (!action) return;
            
            e.preventDefault();
            console.log('🔧 Ejecutando acción:', action);
            
            switch (action) {
                case 'upload-file':
                    const fileInput = document.getElementById('excel-file');
                    if (fileInput) fileInput.click();
                    break;
                    
                case 'download-template':
                    if (window.Equipment && window.Equipment.downloadTemplate) {
                        window.Equipment.downloadTemplate();
                    } else {
                        console.error('❌ Equipment.downloadTemplate no disponible');
                    }
                    break;
                    
                case 'close-modal':
                    if (window.Equipment && window.Equipment.closeImportModal) {
                        window.Equipment.closeImportModal();
                    } else {
                        console.error('❌ Equipment.closeImportModal no disponible');
                    }
                    break;
                    
                case 'previous-step':
                    if (window.Equipment && window.Equipment.previousImportStep) {
                        window.Equipment.previousImportStep();
                    } else {
                        console.error('❌ Equipment.previousImportStep no disponible');
                    }
                    break;
                    
                case 'next-step':
                    if (window.Equipment && window.Equipment.nextImportStep) {
                        window.Equipment.nextImportStep();
                    } else {
                        console.error('❌ Equipment.nextImportStep no disponible');
                    }
                    break;
                    
                case 'confirm-import':
                    if (window.Equipment && window.Equipment.confirmImport) {
                        window.Equipment.confirmImport();
                    } else {
                        console.error('❌ Equipment.confirmImport no disponible');
                    }
                    break;
                    
                default:
                    console.log('⚠️ Acción no reconocida:', action);
            }
        });
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    ImportModalHandlers.init();
});

// También inicializar cuando se muestre el modal (por si se carga dinámicamente)
document.addEventListener('importModalShown', function() {
    ImportModalHandlers.init();
}); 
