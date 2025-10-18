// Pokédex - API Wrapper for PokeAPI
class PokemonAPI {
    static baseURL = 'https://pokeapi.co/api/v2';
    static maxPokemon = 649; // Gen I-V for PokeMMO
    
    // Get Pokemon by ID or name
    static async getPokemon(idOrName) {
        try {
            const response = await fetch(`${this.baseURL}/pokemon/${idOrName}`);
            if (!response.ok) throw new Error('Pokémon not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
            throw error;
        }
    }
    
    // Get Pokemon species (for evolution chain and description)
    static async getPokemonSpecies(idOrName) {
        try {
            const response = await fetch(`${this.baseURL}/pokemon-species/${idOrName}`);
            if (!response.ok) throw new Error('Pokémon species not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching Pokémon species:', error);
            throw error;
        }
    }
    
    // Get evolution chain
    static async getEvolutionChain(chainId) {
        try {
            const response = await fetch(`${this.baseURL}/evolution-chain/${chainId}`);
            if (!response.ok) throw new Error('Evolution chain not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching evolution chain:', error);
            throw error;
        }
    }
    
    // Get type data
    static async getType(typeName) {
        try {
            const response = await fetch(`${this.baseURL}/type/${typeName}`);
            if (!response.ok) throw new Error('Type not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching type:', error);
            throw error;
        }
    }
    
    // Get ability data
    static async getAbility(abilityName) {
        try {
            const response = await fetch(`${this.baseURL}/ability/${abilityName}`);
            if (!response.ok) throw new Error('Ability not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching ability:', error);
            throw error;
        }
    }
    
    // Get move data
    static async getMove(moveName) {
        try {
            const response = await fetch(`${this.baseURL}/move/${moveName}`);
            if (!response.ok) throw new Error('Move not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching move:', error);
            throw error;
        }
    }

    // Get item data
    static async getItem(idOrName) {
        try {
            const response = await fetch(`${this.baseURL}/item/${idOrName}/`);
            if (!response.ok) throw new Error('Item not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching item:', error);
            throw error;
        }
    }
    
    // Search Pokemon by name (for autocomplete)
    static async searchPokemon(query, limit = 10) {
        try {
            // For now, we'll use a predefined list since PokeAPI doesn't have a search endpoint
            // In a real implementation, we'd cache all Pokemon names
            const pokemonList = await this.getAllPokemonNames();
            return pokemonList
                .filter(pokemon => 
                    pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
                    pokemon.id.toString().includes(query)
                )
                .slice(0, limit);
        } catch (error) {
            console.error('Error searching Pokémon:', error);
            return [];
        }
    }
    
    // Get all Pokemon names (cached)
    static async getAllPokemonNames() {
        const cacheKey = 'pokemon_names_list';
        let cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            return JSON.parse(cached);
        }
        
        try {
            const response = await fetch(`${this.baseURL}/pokemon?limit=${this.maxPokemon}`);
            const data = await response.json();
            const pokemonList = data.results.map((pokemon, index) => ({
                id: index + 1,
                name: pokemon.name,
                url: pokemon.url
            }));
            
            localStorage.setItem(cacheKey, JSON.stringify(pokemonList));
            return pokemonList;
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            return [];
        }
    }
    
    // Helper to get generation from Pokemon ID
    static getGenerationFromId(id) {
        if (id <= 151) return 1; // Kanto
        if (id <= 251) return 2; // Johto
        if (id <= 386) return 3; // Hoenn
        if (id <= 493) return 4; // Sinnoh
        if (id <= 649) return 5; // Unova
        return 1; // Default fallback
    }
    
    // Helper to get generation name
    static getGenerationName(genId) {
        const names = {
            1: 'Kanto',
            2: 'Johto', 
            3: 'Hoenn',
            4: 'Sinnoh',
            5: 'Unova'
        };
        return names[genId] || 'Unknown';
    }
}
