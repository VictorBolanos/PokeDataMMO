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
 * Obtener la base URL del proyecto
 * @returns {string} Base URL
 */
function getBaseURL() {
    // Obtener la ruta base del proyecto (sin index.html)
    let basePath = window.location.pathname;
    if (basePath.endsWith('index.html')) {
        basePath = basePath.replace('index.html', '');
    } else if (!basePath.endsWith('/')) {
        basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
    }
    return window.location.origin + basePath;
}

/**
 * Obtener icono de tipo Pokémon
 * @param {string} typeName - Nombre del tipo
 * @returns {string} Ruta absoluta del icono
 */
function getTypeIcon(typeName) {
    // Usar ruta absoluta desde la raíz para evitar problemas de cache y compatibilidad cross-browser
    return `${getBaseURL()}img/res/poke-types/box/type-${typeName.toLowerCase()}-box-icon.png`;
}

/**
 * Traducir nombre de tipo Pokémon
 * @param {string} typeNameEn - Nombre del tipo en inglés
 * @returns {string} Nombre del tipo traducido
 */
function translateTypeName(typeNameEn) {
    if (!typeNameEn) return '';
    
    const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
    
    if (currentLang === 'en') {
        return formatName(typeNameEn);
    }
    
    // Traducciones de tipos al español
    const typeTranslations = {
        'normal': 'Normal',
        'fighting': 'Lucha',
        'flying': 'Volador',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'rock': 'Roca',
        'bug': 'Bicho',
        'ghost': 'Fantasma',
        'steel': 'Acero',
        'fire': 'Fuego',
        'water': 'Agua',
        'grass': 'Planta',
        'electric': 'Eléctrico',
        'psychic': 'Psíquico',
        'ice': 'Hielo',
        'dragon': 'Dragón',
        'dark': 'Siniestro'
    };
    
    return typeTranslations[typeNameEn.toLowerCase()] || formatName(typeNameEn);
}

// Exportar funciones globalmente
window.PokeUtils = {
    capitalizeFirst,
    formatName,
    getTranslatedName,
    debounce,
    getBaseURL,
    getTypeIcon,
    translateTypeName
};

