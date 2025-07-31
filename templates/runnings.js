module.exports = {
    header: function(currentPage, pageCount) {
        return '';
    },
    footer: function(currentPage, pageCount) {
        return '<div style="text-align: center; font-size: 10px; color: #718096; margin-top: 20px;">' +
               'Página ' + currentPage + ' de ' + pageCount + ' | Sistema de Gestión de Medios Informáticos' +
               '</div>';
    }
}; 