const { executeQuery } = require('./database');

const insertTestData = async () => {
    try {
        console.log('🚀 Insertando datos de prueba...');
        
        // Insertar estados
        const states = [
            { id: 1, name: 'Dirección' },
            { id: 2, name: 'Capital' },
            { id: 3, name: 'Carabobo' },
            { id: 4, name: 'Barinas' },
            { id: 5, name: 'Anzoátegui' },
            { id: 6, name: 'Bolívar' },
            { id: 7, name: 'Zulia' }
        ];
        
        for (const state of states) {
            await executeQuery(
                'INSERT IGNORE INTO states (id, name) VALUES (?, ?)',
                [state.id, state.name]
            );
        }
        
        // Insertar usuario de prueba
        await executeQuery(
            'INSERT IGNORE INTO users (id, username, email, full_name, role, state_id) VALUES (?, ?, ?, ?, ?, ?)',
            [1, 'admin', 'admin@test.com', 'Administrador', 'admin', 1]
        );
        
        // Insertar equipos de prueba
        const equipment = [
            {
                inventory_number: 'INV001',
                name: 'Laptop Dell XPS 13',
                type: 'laptop',
                brand: 'Dell',
                model: 'XPS 13',
                status: 'active',
                state_id: 1
            },
            {
                inventory_number: 'INV002',
                name: 'Desktop HP EliteDesk',
                type: 'desktop',
                brand: 'HP',
                model: 'EliteDesk 800',
                status: 'active',
                state_id: 2
            },
            {
                inventory_number: 'INV003',
                name: 'Impresora HP LaserJet',
                type: 'printer',
                brand: 'HP',
                model: 'LaserJet Pro',
                status: 'maintenance',
                state_id: 3
            }
        ];
        
        for (const item of equipment) {
            await executeQuery(
                'INSERT IGNORE INTO equipment (inventory_number, name, type, brand, model, status, state_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [item.inventory_number, item.name, item.type, item.brand, item.model, item.status, item.state_id]
            );
        }
        
        console.log('✅ Datos de prueba insertados correctamente');
        
    } catch (error) {
        console.error('❌ Error insertando datos de prueba:', error);
        throw error;
    }
};

// Ejecutar si se llama directamente
if (require.main === module) {
    insertTestData()
        .then(() => {
            console.log('✅ Script completado');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = { insertTestData }; 
