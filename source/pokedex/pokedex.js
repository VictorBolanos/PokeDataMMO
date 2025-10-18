// Pokédex - Main Application Class
class Pokedex {
    constructor() {
        this.currentPokemon = null;
        this.currentSpecies = null;
        this.isLoading = false;
        
        this.init();
    }
    
    async init() {
        console.log('Pokédex initialized');
        
        // Wait for search to be ready
        if (window.pokemonSearch) {
            console.log('Pokemon search ready');
        } else {
            // Wait a bit for search to initialize
            setTimeout(() => {
                console.log('Pokemon search ready (delayed)');
            }, 1000);
        }
    }
    
    async loadPokemon(idOrName) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();
        
        try {
            // Check cache first
            let pokemonData = window.pokemonCache.get(idOrName);
            let speciesData = window.pokemonCache.get(`${idOrName}-species`);
            
            if (!pokemonData || !speciesData) {
                // Fetch from API
                console.log(`Loading Pokémon: ${idOrName}`);
                
                const [pokemon, species] = await Promise.all([
                    PokemonAPI.getPokemon(idOrName),
                    PokemonAPI.getPokemonSpecies(idOrName)
                ]);
                
                // Cache the data
                window.pokemonCache.set(idOrName, pokemon);
                window.pokemonCache.set(`${idOrName}-species`, species);
                
                pokemonData = pokemon;
                speciesData = species;
            }
            
            this.currentPokemon = pokemonData;
            this.currentSpecies = speciesData;
            
            // Render the Pokemon card
            await this.renderPokemonCard();
            
        } catch (error) {
            console.error('Error loading Pokémon:', error);
            this.showError(`Error loading Pokémon: ${error.message}`);
        } finally {
            this.isLoading = false;
        }
    }
    
    showLoading() {
        const container = document.getElementById('pokemonCardContainer');
        container.innerHTML = `
            <div class="pokemon-card">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    Loading Pokémon data...
                </div>
            </div>
        `;
    }
    
    showError(message) {
        const container = document.getElementById('pokemonCardContainer');
        container.innerHTML = `
            <div class="pokemon-card">
                <div class="error">
                    ${message}
                </div>
            </div>
        `;
    }
    
    async renderPokemonCard() {
        if (!this.currentPokemon || !this.currentSpecies) {
            this.showError('No Pokémon data available');
            return;
        }
        
        try {
            const pokemonCard = new PokemonCard(this.currentPokemon, this.currentSpecies);
            await pokemonCard.render();
            
            // Initialize async components after render
            setTimeout(() => {
                pokemonCard.initializeEvolution();
                // Type effectiveness is already initialized in PokemonCard.render()
            }, 100);
            
        } catch (error) {
            console.error('Error rendering Pokémon card:', error);
            this.showError('Error rendering Pokémon card');
        }
    }
}

// Initialize Pokédex when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pokedex = new Pokedex();
});
