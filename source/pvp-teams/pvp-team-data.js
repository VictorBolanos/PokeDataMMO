// PVP Teams - Data Configuration and Constants
class PVPTeamData {
    constructor() {
        this.MAX_TEAM_SIZE = 6;
        this.MAX_MOVES = 4;
        this.MAX_EV_INDIVIDUAL = 252;
        this.MAX_EV_TOTAL = 510;
        this.MAX_IV = 31;
        this.POKEMON_LEVEL = 100;  // Nivel competitivo
        
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
                        increased_stat: detail.increased_stat?.name || null,
                        decreased_stat: detail.decreased_stat?.name || null
                    };
                })
            );
            
            return this.naturesCache;
        } catch (error) {
            console.error('❌ Error loading natures:', error);
            return [];
        }
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
        
        this.statsOrder.forEach(statName => {
            const base = baseStats[statName] || 0;
            const ev = evs[statName] || 0;
            const iv = ivs[statName] || 31;
            
            if (statName === 'hp') {
                stats[statName] = this.calculateHP(base, iv, ev, this.POKEMON_LEVEL);
            } else {
                const natureMultiplier = this.getNatureMultiplier(nature, statName);
                stats[statName] = this.calculateStat(base, iv, ev, natureMultiplier, this.POKEMON_LEVEL);
            }
        });
        
        return stats;
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

