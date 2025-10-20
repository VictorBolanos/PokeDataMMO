// PVP Teams - Data Configuration and Constants
class PVPTeamData {
    constructor() {
        this.MAX_TEAM_SIZE = 6;
        this.MAX_MOVES = 4;
        this.MAX_EV_INDIVIDUAL = 252;
        this.MAX_EV_TOTAL = 510;
        this.MAX_IV = 31;
        this.POKEMON_LEVEL = 50;  // Nivel por defecto (50)
        this.SELECTED_LEVEL = 50; // Nivel seleccionado actualmente
        
        // Stats order
        this.statsOrder = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
        
        // Naturalezas cache (se cargará de PokeAPI)
        this.naturesCache = null;
    }

    /**
     * Cargar naturalezas desde PokeAPI
     */
    async loadNatures() {
        if (this.naturesCache) return this.naturesCache;

        try {
            const response = await fetch('https://pokeapi.co/api/v2/nature?limit=25');
            const data = await response.json();
            
            this.naturesCache = await Promise.all(
                data.results.map(async (nature) => {
                    const detailResponse = await fetch(nature.url);
                    const detail = await detailResponse.json();
                    return {
                        name: detail.name,
                        displayName: this.getTranslatedNatureName(detail),
                        increased_stat: detail.increased_stat?.name || null,
                        decreased_stat: detail.decreased_stat?.name || null,
                        names: detail.names // Guardar para traducción dinámica
                    };
                })
            );
            
            // Ordenar alfabéticamente por displayName
            this.naturesCache.sort((a, b) => a.displayName.localeCompare(b.displayName));
            
            return this.naturesCache;
        } catch (error) {
            return [];
        }
    }

    /**
     * Obtener nombre traducido de naturaleza
     */
    getTranslatedNatureName(nature) {
        return window.PokeUtils.getTranslatedName(nature, nature?.name);
    }

    /**
     * Actualizar traducciones de naturalezas
     */
    updateNatureTranslations() {
        if (!this.naturesCache) return;
        
        this.naturesCache.forEach(nature => {
            nature.displayName = this.getTranslatedNatureName(nature);
        });
        
        // Re-ordenar alfabéticamente
        this.naturesCache.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }


    /**
     * Obtener multiplicador de naturaleza para un stat
     */
    getNatureMultiplier(nature, statName) {
        if (!nature) return 1.0;
        
        if (nature.increased_stat === statName) return 1.1;
        if (nature.decreased_stat === statName) return 0.9;
        return 1.0;
    }

    /**
     * Calcular stat final de HP
     */
    calculateHP(base, iv, ev, level = 100) {
        return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    }

    /**
     * Calcular stat final (no HP)
     */
    calculateStat(base, iv, ev, nature, level = 100) {
        const baseStat = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;
        return Math.floor(baseStat * nature);
    }

    /**
     * Calcular todos los stats de un Pokémon
     */
    calculateAllStats(baseStats, evs, ivs, nature) {
        const stats = {};
        const level = this.SELECTED_LEVEL; // Usar nivel seleccionado
        
        this.statsOrder.forEach(statName => {
            const base = baseStats[statName] || 0;
            const ev = evs[statName] || 0;
            const iv = ivs[statName] || 31;
            
            if (statName === 'hp') {
                stats[statName] = this.calculateHP(base, iv, ev, level);
            } else {
                const natureMultiplier = this.getNatureMultiplier(nature, statName);
                stats[statName] = this.calculateStat(base, iv, ev, natureMultiplier, level);
            }
        });
        
        return stats;
    }

    /**
     * Cambiar nivel seleccionado
     */
    setSelectedLevel(level) {
        if (level === 50 || level === 100) {
            this.SELECTED_LEVEL = level;
            this.POKEMON_LEVEL = level;
            return true;
        }
        return false;
    }

    /**
     * Obtener nivel seleccionado
     */
    getSelectedLevel() {
        return this.SELECTED_LEVEL;
    }

    /**
     * Validar EVs totales
     */
    validateEVs(evs) {
        let total = 0;
        Object.values(evs).forEach(ev => {
            total += ev || 0;
        });
        return total <= this.MAX_EV_TOTAL;
    }

    /**
     * Obtener total de EVs
     */
    getTotalEVs(evs) {
        let total = 0;
        Object.values(evs).forEach(ev => {
            total += ev || 0;
        });
        return total;
    }

    /**
     * Crear Pokémon vacío
     */
    createEmptyPokemon() {
        return {
            id: null,
            name: '',
            sprite: '',
            baseStats: {
                hp: 0,
                attack: 0,
                defense: 0,
                'special-attack': 0,
                'special-defense': 0,
                speed: 0
            },
            evs: {
                hp: 0,
                attack: 0,
                defense: 0,
                'special-attack': 0,
                'special-defense': 0,
                speed: 0
            },
            ivs: {
                hp: 31,
                attack: 31,
                defense: 31,
                'special-attack': 31,
                'special-defense': 31,
                speed: 31
            },
            finalStats: {
                hp: 0,
                attack: 0,
                defense: 0,
                'special-attack': 0,
                'special-defense': 0,
                speed: 0
            },
            nature: null,
            ability: null,
            item: null,
            moves: [null, null, null, null]
        };
    }

    /**
     * Obtener nombre traducido de stat
     */
    getStatDisplayName(statName) {
        const lm = window.languageManager;
        const statNames = {
            'hp': lm.getCurrentLanguage() === 'es' ? 'PS' : 'HP',
            'attack': lm.getCurrentLanguage() === 'es' ? 'Ataque' : 'Attack',
            'defense': lm.getCurrentLanguage() === 'es' ? 'Defensa' : 'Defense',
            'special-attack': lm.getCurrentLanguage() === 'es' ? 'At. Esp.' : 'Sp. Atk',
            'special-defense': lm.getCurrentLanguage() === 'es' ? 'Def. Esp.' : 'Sp. Def',
            'speed': lm.getCurrentLanguage() === 'es' ? 'Velocidad' : 'Speed'
        };
        return statNames[statName] || statName;
    }
}

// Exportar instancia global
window.pvpTeamData = new PVPTeamData();

