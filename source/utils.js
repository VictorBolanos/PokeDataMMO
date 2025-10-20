// PokeDataMMO - Utilidades Compartidas
// Funciones compartidas para evitar duplicación de código

/**
 * Capitalizar la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formatear nombre (capitalizar y reemplazar guiones)
 * @param {string} name - Nombre a formatear
 * @returns {string} Nombre formateado
 */
function formatName(name) {
    if (!name) return '';
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Obtener nombre traducido de un objeto con array de nombres
 * @param {Object} obj - Objeto con propiedad names
 * @param {string} fallbackName - Nombre de respaldo
 * @returns {string} Nombre traducido
 */
function getTranslatedName(obj, fallbackName) {
    if (!obj || !obj.names) return formatName(fallbackName || '');
    
    const lang = window.languageManager ? window.languageManager.getApiLanguage() : 'en';
    const nameEntry = obj.names.find(entry => entry.language.name === lang);
    
    return nameEntry ? nameEntry.name : formatName(obj.name || fallbackName);
}

/**
 * Debounce function para limitar llamadas de función
 * @param {Function} func - Función a debounce
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función debounced
 */
function debounce(func, wait) {
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

/**
 * Obtener icono de tipo Pokémon
 * @param {string} typeName - Nombre del tipo
 * @returns {string} Ruta del icono
 */
function getTypeIcon(typeName) {
    return `img/res/poke-types/box/type-${typeName}-box-icon.png`;
}

// Exportar funciones globalmente
window.PokeUtils = {
    capitalizeFirst,
    formatName,
    getTranslatedName,
    debounce,
    getTypeIcon
};

