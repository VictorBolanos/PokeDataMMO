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
    
}
