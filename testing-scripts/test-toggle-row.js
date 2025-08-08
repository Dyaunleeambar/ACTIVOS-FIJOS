/**
 * Prueba automatizada: toggle-row en la tabla de equipos
 * Ejecuta en el navegador con la app corriendo y consola abierta
 * Usa simulación DOM y verifica icono, título y visibilidad
 */

(async function testToggleRow() {
    function logResult(desc, ok) {
        const style = ok ? 'color:green' : 'color:red';
        console.log(`%c${ok ? '✔' : '✖'} ${desc}`, style);
    }
    
    // Busca la primera fila visible y su botón toggle
    const row = document.querySelector('tr[id^="equipment-row-"]:not([style*="display: none"])');
    if (!row) return logResult('No se encontró ninguna fila visible de equipo', false);
    const idMatch = row.id.match(/equipment-row-(\d+)/);
    if (!idMatch) return logResult('ID de fila no válido', false);
    const id = Number(idMatch[1]);
    const btn = row.querySelector('button[data-action="toggle-row"]');
    if (!btn) return logResult('No se encontró botón toggle-row en la fila', false);
    const icon = btn.querySelector('i');
    
    // Estado inicial
    const wasVisible = row.style.display !== 'none';
    const wasEye = icon.classList.contains('fa-eye');
    const wasTitle = btn.title === 'Ocultar fila';
    
    // Simula click para ocultar
    btn.click();
    setTimeout(() => {
        const nowHidden = row.style.display === 'none';
        const nowEyeSlash = icon.classList.contains('fa-eye-slash');
        const nowTitle = btn.title === 'Mostrar fila';
        logResult('Oculta la fila correctamente', nowHidden);
        logResult('Cambia el icono a fa-eye-slash', nowEyeSlash);
        logResult('Cambia el título a "Mostrar fila"', nowTitle);

        // Simula click para mostrar
        btn.click();
        setTimeout(() => {
            const nowVisible = row.style.display !== 'none';
            const nowEye = icon.classList.contains('fa-eye');
            const nowTitle2 = btn.title === 'Ocultar fila';
            logResult('Muestra la fila correctamente', nowVisible);
            logResult('Cambia el icono a fa-eye', nowEye);
            logResult('Cambia el título a "Ocultar fila"', nowTitle2);
        }, 300);
    }, 300);
})();
