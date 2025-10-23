// Pokédex - API Wrapper for PokeAPI
class PokemonAPI {
    static baseURL = 'https://pokeapi.co/api/v2';
    static maxPokemon = 649; // Gen I-V for PokeMMO
    
    // Generic fetch method to reduce code duplication
    static async fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Data not found');
        return await response.json();
    }
    
    // Get Pokemon by ID or name
    static async getPokemon(idOrName) {
        return this.fetchData(`${this.baseURL}/pokemon/${idOrName}`);
    }
    
    // Get Pokemon species (for evolution chain and description)
    static async getPokemonSpecies(idOrName) {
        return this.fetchData(`${this.baseURL}/pokemon-species/${idOrName}`);
    }
    
    // Get evolution chain
    static async getEvolutionChain(chainId) {
        return this.fetchData(`${this.baseURL}/evolution-chain/${chainId}`);
    }
    
    // Get type data
    static async getType(typeName) {
        return this.fetchData(`${this.baseURL}/type/${typeName}`);
    }
    
    // Get ability data
    static async getAbility(abilityName) {
        return this.fetchData(`${this.baseURL}/ability/${abilityName}`);
    }
    
    // Get move data
    static async getMove(moveName) {
        return this.fetchData(`${this.baseURL}/move/${moveName}`);
    }

    // Get item data
    static async getItem(idOrName) {
        return this.fetchData(`${this.baseURL}/item/${idOrName}/`);
    }
    
    // Search Pokemon by name (for autocomplete)
    static async searchPokemon(query, limit = 10) {
        const pokemonList = await this.getAllPokemonNames();
        return pokemonList
            .filter(pokemon => 
                pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
                pokemon.id.toString().includes(query)
            )
            .slice(0, limit);
    }
    
    // Get all Pokemon names (cached)
    static async getAllPokemonNames() {
        const cacheKey = 'pokemon_names_list';
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            return JSON.parse(cached);
        }
        
        const response = await fetch(`${this.baseURL}/pokemon?limit=${this.maxPokemon}`);
        const data = await response.json();
        const pokemonList = data.results.map((pokemon, index) => ({
            id: index + 1,
            name: pokemon.name,
            url: pokemon.url
        }));
        
        localStorage.setItem(cacheKey, JSON.stringify(pokemonList));
        return pokemonList;
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
