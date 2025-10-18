// PokeDataMMO - Shared Utilities
// Funciones compartidas para evitar duplicación de código

// Capitalizar la primera letra de una cadena
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Exportar funciones globalmente
window.PokeUtils = {
    capitalizeFirst
};

