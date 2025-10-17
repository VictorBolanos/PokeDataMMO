// Pokédex - Stats and Type Effectiveness Component
class PokemonStats {
    constructor(pokemonData) {
        this.pokemon = pokemonData;
        this.typeEffectiveness = null;
    }
    
    async calculateTypeEffectiveness() {
        if (this.typeEffectiveness) {
            return this.typeEffectiveness;
        }
        
        try {
            const types = this.pokemon.types.map(t => t.type.name);
            const effectiveness = {
                '4x': [],
                '2x': [],
                '1x': [],
                '0.5x': [],
                '0.25x': [],
                '0x': []
            };
            
            // Get all type data
            const typePromises = types.map(typeName => PokemonAPI.getType(typeName));
            const typeData = await Promise.all(typePromises);
            
            // Calculate effectiveness for each attacking type (Gen V - no Fairy type)
            const allTypes = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel'];
            
            for (const attackingType of allTypes) {
                let multiplier = 1;
                
                // Calculate multiplier for each defending type
                for (const typeInfo of typeData) {
                    const damageRelations = typeInfo.damage_relations;
                    
                    // Check for weaknesses
                    if (damageRelations.double_damage_from.some(t => t.name === attackingType)) {
                        multiplier *= 2;
                    }
                    // Check for resistances
                    else if (damageRelations.half_damage_from.some(t => t.name === attackingType)) {
                        multiplier *= 0.5;
                    }
                    // Check for immunities
                    else if (damageRelations.no_damage_from.some(t => t.name === attackingType)) {
                        multiplier *= 0;
                    }
                }
                
                // Categorize by multiplier
                if (multiplier === 0) {
                    effectiveness['0x'].push(attackingType);
                } else if (multiplier === 0.25) {
                    effectiveness['0.25x'].push(attackingType);
                } else if (multiplier === 0.5) {
                    effectiveness['0.5x'].push(attackingType);
                } else if (multiplier === 1) {
                    effectiveness['1x'].push(attackingType);
                } else if (multiplier === 2) {
                    effectiveness['2x'].push(attackingType);
                } else if (multiplier === 4) {
                    effectiveness['4x'].push(attackingType);
                }
            }
            
            this.typeEffectiveness = effectiveness;
            return effectiveness;
            
        } catch (error) {
            console.error('Error calculating type effectiveness:', error);
            return {
                '4x': [],
                '2x': [],
                '1x': [],
                '0.5x': [],
                '0.25x': [],
                '0x': []
            };
        }
    }
    
    renderTypeEffectiveness(effectiveness) {
        const effectivenessHTML = Object.entries(effectiveness).map(([multiplier, types]) => {
            if (types.length === 0) return '';
            
            const typesHTML = types.map(type => `
                <div class="effectiveness-type">
                    <img src="img/res/poke-types/box/type-${type}-box-icon.png" alt="${type}">
                    <span>${type}</span>
                </div>
            `).join('');
            
            return `
                <div class="effectiveness-category">
                    <div class="effectiveness-title">
                        <span class="effectiveness-multiplier">${multiplier}</span>
                        <span class="effectiveness-label">${this.getEffectivenessLabel(multiplier)}</span>
                    </div>
                    <div class="effectiveness-types">${typesHTML}</div>
                </div>
            `;
        }).filter(html => html !== '').join('');
        
        return effectivenessHTML || `
            <div class="text-center text-muted">
                Type effectiveness calculation not available
            </div>
        `;
    }
    
    renderStatsChart() {
        const stats = this.pokemon.stats;
        const maxStat = Math.max(...stats.map(stat => stat.base_stat));
        
        const statsHTML = stats.map(stat => {
            const percentage = (stat.base_stat / maxStat) * 100;
            const statName = this.getStatName(stat.stat.name);
            
            return `
                <div class="stat-item">
                    <div class="stat-header">
                        <span class="stat-name">${statName}</span>
                        <span class="stat-value">${stat.base_stat}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-bar-fill" style="width: ${percentage}%; background-color: ${this.getStatColor(stat.stat.name)};"></div>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="stats-chart">
                ${statsHTML}
            </div>
        `;
    }
    
    getStatName(statName) {
        const names = {
            'hp': 'HP',
            'attack': 'ATK',
            'defense': 'DEF',
            'special-attack': 'SPA',
            'special-defense': 'SPD',
            'speed': 'SPE'
        };
        return names[statName] || statName.toUpperCase();
    }
    
    getStatColor(statName) {
        const colors = {
            'hp': '#ff6b6b',
            'attack': '#4ecdc4',
            'defense': '#45b7d1',
            'special-attack': '#96ceb4',
            'special-defense': '#feca57',
            'speed': '#ff9ff3'
        };
        return colors[statName] || '#95a5a6';
    }
    
    getEffectivenessLabel(multiplier) {
        const labels = {
            '4x': 'Super Weak To',
            '2x': 'Weak To',
            '1x': 'Normal Damage',
            '0.5x': 'Resistant To',
            '0.25x': 'Super Resistant To',
            '0x': 'Immune To'
        };
        return labels[multiplier] || multiplier;
    }
    
    getEffectivenessColor(multiplier) {
        const colors = {
            '4x': '#e74c3c',
            '2x': '#f39c12',
            '1x': '#95a5a6',
            '0.5x': '#3498db',
            '0.25x': '#2ecc71',
            '0x': '#34495e'
        };
        return colors[multiplier] || '#95a5a6';
    }
}
