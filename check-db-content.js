/**
 * Script para verificar el contenido actual de la base de datos
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database-sqlite');

const checkDatabaseContent = () => {
    console.log('🔍 Verificando contenido actual de la base de datos...');
    
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('❌ Error conectando a la base de datos:', err.message);
            return;
        }
        console.log('✅ Conectado a la base de datos SQLite');
        
        // Verificar equipos
        db.all("SELECT * FROM equipment", [], (err, rows) => {
            if (err) {
                console.error('❌ Error consultando equipos:', err.message);
                return;
            }
            console.log('📊 Equipos en la base de datos:', rows.length);
            rows.forEach((row, index) => {
                console.log(`  ${index + 1}. ID: ${row.id}, Inventario: ${row.inventory_number}, Nombre: ${row.name}, Tipo: ${row.type}, Estado: ${row.status}`);
            });
            
            // Verificar estados
            db.all("SELECT * FROM states", [], (err, stateRows) => {
                if (err) {
                    console.error('❌ Error consultando estados:', err.message);
                    return;
                }
                console.log('📊 Estados en la base de datos:', stateRows.length);
                stateRows.forEach((row, index) => {
                    console.log(`  ${index + 1}. ID: ${row.id}, Nombre: ${row.name}, Código: ${row.code}`);
                });
                
                db.close((err) => {
                    if (err) {
                        console.error('❌ Error cerrando base de datos:', err.message);
                    } else {
                        console.log('✅ Base de datos cerrada');
                    }
                });
            });
        });
    });
};

checkDatabaseContent(); 