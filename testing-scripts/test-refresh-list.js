// Prueba automática: Oculta varias filas, presiona "Actualizar" y valida que todas reaparezcan y los íconos/títulos estén correctos
(async function testRefreshListAndToggleRow() {
    function logResult(desc, ok) {
        const style = ok ? 'color:green' : 'color:red';
        console.log(`%c${ok ? '✔' : '✖'} ${desc}`, style);
    }

    // 1. Oculta hasta 3 filas visibles
    const rows = Array.from(document.querySelectorAll('tr[id^="equipment-row-"]:not([style*="display: none"])'));
    if (rows.length < 2) return logResult('Se requieren al menos 2 filas visibles para la prueba', false);
    const toHide = rows.slice(0, 3);
    const ids = toHide.map(row => Number(row.id.match(/equipment-row-(\d+)/)[1]));
    const btns = toHide.map(row => row.querySelector('button[data-action="toggle-row"]'));
    if (btns.some(b => !b)) return logResult('No se encontraron botones toggle-row en todas las filas', false);
    // Oculta filas
    btns.forEach(btn => btn.click());
    await new Promise(res => setTimeout(res, 400));
    // Verifica que están ocultas
    let allHidden = toHide.every(row => row.style.display === 'none');
    logResult('Las filas seleccionadas se ocultan correctamente', allHidden);
    // 2. Simula click en el botón actualizar
    let refreshBtn = document.querySelector('button[data-action="refresh-list"]');
    if (!refreshBtn) {
        // Busca por texto alternativo si no tiene data-action
        refreshBtn = Array.from(document.querySelectorAll('button')).find(b => b.title?.toLowerCase().includes('actualizar'));
    }
    if (!refreshBtn) return logResult('No se encontró botón "Actualizar"', false);
    refreshBtn.click();
    await new Promise(res => setTimeout(res, 700));
    // 3. Verifica que todas las filas reaparecen
    const rowsNow = ids.map(id => document.getElementById(`equipment-row-${id}`));
    const allVisible = rowsNow.every(row => row && row.style.display !== 'none');
    logResult('Todas las filas ocultas reaparecen tras actualizar', allVisible);
    // 4. Verifica íconos y tooltips
    let allOk = true;
    rowsNow.forEach(row => {
        const btn = row.querySelector('button[data-action="toggle-row"]');
        const icon = btn && btn.querySelector('i');
        const isEye = icon && icon.classList.contains('fa-eye');
        const isTitle = btn && btn.title === 'Ocultar fila';
        logResult(`Fila ${row.id}: icono fa-eye`, isEye);
        logResult(`Fila ${row.id}: título correcto`, isTitle);
        if (!isEye || !isTitle) allOk = false;
    });
    if (allVisible && allOk) {
        logResult('PRUEBA COMPLETA EXITOSA', true);
    } else {
        logResult('PRUEBA COMPLETA FALLIDA', false);
    }
})();
