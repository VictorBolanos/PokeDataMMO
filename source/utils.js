// PokeDataMMO - Utility Functions
// Funciones globales compartidas entre módulos

/**
 * Validar que un nombre es válido (no vacío, no solo espacios)
 * @param {string} name - Nombre a validar
 * @returns {boolean} - true si es válido
 */
function validateName(name) {
    return name && typeof name === 'string' && name.trim().length > 0;
}

/**
 * Debounce function - retrasa la ejecución hasta que pasen 'delay' ms sin llamadas
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} - Función debounced
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function - limita la frecuencia de ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Tiempo mínimo entre ejecuciones en ms
 * @returns {Function} - Función throttled
 */
function throttle(func, limit = 1000) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Formatear número con separadores de miles
 * @param {number} num - Número a formatear
 * @returns {string} - Número formateado
 */
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Capitalizar primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} - String capitalizado
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Generar ID único basado en timestamp
 * @returns {string} - ID único
 */
function generateUniqueId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Verificar si un objeto está vacío
 * @param {Object} obj - Objeto a verificar
 * @returns {boolean} - true si está vacío
 */
function isObjectEmpty(obj) {
    return Object.keys(obj || {}).length === 0;
}

/**
 * Deep clone de un objeto (usando JSON parse/stringify)
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} - Objeto clonado
 */
function deepClone(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (error) {
        console.error('Error clonando objeto:', error);
        return null;
    }
}

/**
 * Guardar en localStorage con manejo de errores
 * @param {string} key - Clave
 * @param {*} value - Valor a guardar
 * @returns {boolean} - true si se guardó exitosamente
 */
function saveToLocalStorage(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error(`Error guardando '${key}' en localStorage:`, error);
        return false;
    }
}

/**
 * Cargar desde localStorage con manejo de errores
 * @param {string} key - Clave
 * @param {*} defaultValue - Valor por defecto si no existe o hay error
 * @returns {*} - Valor deserializado o defaultValue
 */
function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error cargando '${key}' desde localStorage:`, error);
        return defaultValue;
    }
}

/**
 * Escapar HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Formatear fecha a string legible
 * @param {Date|string} date - Fecha a formatear
 * @param {string} locale - Locale a usar (default: 'es-ES')
 * @returns {string} - Fecha formateada
 */
function formatDate(date, locale = 'es-ES') {
    try {
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

/**
 * Obtener query parameter de la URL
 * @param {string} param - Nombre del parámetro
 * @returns {string|null} - Valor del parámetro o null
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Scroll suave a un elemento
 * @param {string|HTMLElement} element - Selector o elemento
 * @param {Object} options - Opciones de scroll
 */
function smoothScrollTo(element, options = {}) {
    const target = typeof element === 'string' 
        ? document.querySelector(element) 
        : element;
    
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            ...options
        });
    }
}

/**
 * Copiar texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} - true si se copió exitosamente
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback para navegadores viejos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            console.error('Error copiando al portapapeles:', err);
            return false;
        }
    }
}

/**
 * Esperar X milisegundos (útil para async/await)
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} - Promise que se resuelve después del delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Exportar funciones al scope global para compatibilidad
if (typeof window !== 'undefined') {
    window.PokeDataUtils = {
        validateName,
        debounce,
        throttle,
        formatNumber,
        capitalizeFirst,
        generateUniqueId,
        isObjectEmpty,
        deepClone,
        saveToLocalStorage,
        loadFromLocalStorage,
        escapeHTML,
        formatDate,
        getQueryParam,
        smoothScrollTo,
        copyToClipboard,
        sleep
    };
}

