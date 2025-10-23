// Pokédex - Utility Functions
class PokeUtils {
    
    /**
     * Capitalize first letter of a string
     */
    static capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    /**
     * Format Pokemon name (capitalize and replace hyphens)
     */
    static formatName(name) {
        if (!name) return '';
        return name.split('-').map(word => this.capitalizeFirst(word)).join(' ');
    }
    
    /**
     * Get translated name from object with names array
     */
    static getTranslatedName(obj, fallbackName) {
        if (!obj || !obj.names) return fallbackName || '';
        
        const lang = window.languageManager?.getApiLanguage() || 'en';
        const nameEntry = obj.names.find(entry => entry.language.name === lang);
        return nameEntry ? nameEntry.name : (fallbackName || obj.name || '');
    }
    
    /**
     * Extract Pokemon ID from URL
     */
    static extractPokemonId(url) {
        if (!url) return '0';
        const matches = url.match(/\/(\d+)\/$/);
        return matches ? matches[1] : '0';
    }
    
    /**
     * Format evolution condition text
     */
    static formatEvolutionCondition(condition) {
        if (!condition) return '';
        return condition.replace(/-/g, ' ').split(' ').map(word => 
            this.capitalizeFirst(word)
        ).join(' ');
    }
    
    /**
     * Get type color for styling
     */
    static getTypeColor(typeName) {
        const colors = {
            'normal': '#A8A878',
            'fire': '#F08030',
            'water': '#6890F0',
            'electric': '#F8D030',
            'grass': '#78C850',
            'ice': '#98D8D8',
            'fighting': '#C03028',
            'poison': '#A040A0',
            'ground': '#E0C068',
            'flying': '#A890F0',
            'psychic': '#F85888',
            'bug': '#A8B820',
            'rock': '#B8A038',
            'ghost': '#705898',
            'dragon': '#7038F8',
            'dark': '#705848',
            'steel': '#B8B8D0',
            'fairy': '#EE99AC'
        };
        return colors[typeName.toLowerCase()] || '#68A090';
    }
    
    /**
     * Format stat name
     */
    static formatStatName(statName) {
        const statMap = {
            'hp': 'HP',
            'attack': 'Attack',
            'defense': 'Defense',
            'special-attack': 'Sp. Atk',
            'special-defense': 'Sp. Def',
            'speed': 'Speed'
        };
        return statMap[statName] || this.capitalizeFirst(statName);
    }
    
    /**
     * Calculate stat color based on value
     */
    static getStatColor(value) {
        if (value >= 100) return '#4CAF50'; // Green
        if (value >= 80) return '#8BC34A'; // Light green
        if (value >= 60) return '#FFC107'; // Yellow
        if (value >= 40) return '#FF9800'; // Orange
        return '#F44336'; // Red
    }
}

// Export to global scope
window.PokeUtils = PokeUtils;
