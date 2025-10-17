// Pokédex - Evolution Chain Component
class PokemonEvolution {
    constructor(pokemonId, speciesData) {
        this.pokemonId = pokemonId;
        this.speciesData = speciesData;
    }
    
    async renderEvolutionChain() {
        try {
            const evolutionChain = await PokemonAPI.getEvolutionChain(this.speciesData.evolution_chain.id);
            return this.buildEvolutionHTML(evolutionChain.chain);
        } catch (error) {
            console.error('Error loading evolution chain:', error);
            return `
                <div class="error">
                    Error loading evolution chain
                </div>
            `;
        }
    }
    
    buildEvolutionHTML(chain) {
        let html = '';
        
        if (chain.evolves_to.length === 0) {
            // Single Pokemon (no evolutions)
            html = `
                <div class="evolution-item">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.extractPokemonId(chain.species.url)}.png" 
                         alt="${chain.species.name}" 
                         class="evolution-sprite">
                    <div class="evolution-name">${this.capitalizeFirst(chain.species.name)}</div>
                    <div class="evolution-condition">No evolutions</div>
                </div>
            `;
        } else {
            // Multiple evolutions
            html = this.buildEvolutionChainRecursive(chain);
        }
        
        return html;
    }
    
    buildEvolutionChainRecursive(chain) {
        let html = '';
        
        // Current Pokemon
        html += `
            <div class="evolution-item">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.extractPokemonId(chain.species.url)}.png" 
                     alt="${chain.species.name}" 
                     class="evolution-sprite">
                <div class="evolution-name">${this.capitalizeFirst(chain.species.name)}</div>
            </div>
        `;
        
        // Evolution details
        if (chain.evolves_to.length > 0) {
            const evolution = chain.evolves_to[0];
            const condition = this.getEvolutionCondition(evolution.evolution_details[0]);
            
            html += `
                <div class="evolution-arrow">
                    <div class="evolution-condition">${condition}</div>
                </div>
            `;
            
            // Recursive call for next evolution
            html += this.buildEvolutionChainRecursive(evolution);
        }
        
        return html;
    }
    
    getEvolutionCondition(details) {
        if (!details) return 'Unknown';
        
        const conditions = [];
        
        // Level
        if (details.min_level) {
            conditions.push(`Level ${details.min_level}`);
        }
        
        // Item
        if (details.item) {
            conditions.push(`Use ${this.capitalizeFirst(details.item.name.replace('-', ' '))}`);
        }
        
        // Time of day
        if (details.time_of_day) {
            conditions.push(`${this.capitalizeFirst(details.time_of_day)}`);
        }
        
        // Location
        if (details.location) {
            conditions.push(`At ${this.capitalizeFirst(details.location.name.replace('-', ' '))}`);
        }
        
        // Known move
        if (details.known_move) {
            conditions.push(`Knows ${this.capitalizeFirst(details.known_move.name.replace('-', ' '))}`);
        }
        
        // Known move type
        if (details.known_move_type) {
            conditions.push(`Knows ${this.capitalizeFirst(details.known_move_type.name)} move`);
        }
        
        // Minimum happiness
        if (details.min_happiness) {
            conditions.push(`Happiness ${details.min_happiness}+`);
        }
        
        // Minimum beauty
        if (details.min_beauty) {
            conditions.push(`Beauty ${details.min_beauty}+`);
        }
        
        // Gender
        if (details.gender) {
            conditions.push(`Gender: ${details.gender === 1 ? 'Female' : 'Male'}`);
        }
        
        // Party species
        if (details.party_species) {
            conditions.push(`With ${this.capitalizeFirst(details.party_species.name)}`);
        }
        
        // Party type
        if (details.party_type) {
            conditions.push(`With ${this.capitalizeFirst(details.party_type.name)} type`);
        }
        
        // Trade
        if (details.trade_species) {
            conditions.push(`Trade for ${this.capitalizeFirst(details.trade_species.name)}`);
        }
        
        // Turn upside down
        if (details.turn_upside_down) {
            conditions.push('Turn device upside down');
        }
        
        // Physical stats
        if (details.relative_physical_stats) {
            const stats = details.relative_physical_stats;
            if (stats > 0) {
                conditions.push('Attack > Defense');
            } else if (stats < 0) {
                conditions.push('Defense > Attack');
            } else {
                conditions.push('Attack = Defense');
            }
        }
        
        // Needs overworld rain
        if (details.needs_overworld_rain) {
            conditions.push('In rain');
        }
        
        // Needs overworld rain
        if (details.needs_overworld_rain) {
            conditions.push('In rain');
        }
        
        return conditions.join(' + ') || 'Unknown condition';
    }
    
    // Helper methods
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    extractPokemonId(url) {
        const matches = url.match(/\/(\d+)\//);
        return matches ? matches[1] : '0';
    }
}
