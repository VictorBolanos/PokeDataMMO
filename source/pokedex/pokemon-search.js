// Pokédex - Search and Autocomplete System
class PokemonSearch {
    constructor() {
        this.searchInput = document.getElementById('pokemonSearch');
        this.suggestionsContainer = document.getElementById('searchSuggestions');
        this.pokemonList = [];
        this.currentSuggestions = [];
        this.selectedIndex = -1;
        
        this.init();
    }
    
    async init() {
        // Load Pokemon list
        await this.loadPokemonList();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    async loadPokemonList() {
        try {
            this.pokemonList = await PokemonAPI.getAllPokemonNames();
            console.log(`Loaded ${this.pokemonList.length} Pokémon for search`);
        } catch (error) {
            console.error('Error loading Pokémon list:', error);
            this.pokemonList = [];
        }
    }
    
    setupEventListeners() {
        // Input event
        this.searchInput.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        // Keydown event for navigation
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // Focus event
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.length >= 2) {
                this.showSuggestions();
            }
        });
        
        // Blur event (with delay to allow clicks)
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        });
        
        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.pokemon-search-container')) {
                this.hideSuggestions();
            }
        });
    }
    
    handleInput(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        this.searchPokemon(trimmedQuery);
    }
    
    searchPokemon(query) {
        const results = this.pokemonList.filter(pokemon => {
            const nameMatch = pokemon.name.toLowerCase().includes(query.toLowerCase());
            const idMatch = pokemon.id.toString().includes(query);
            return nameMatch || idMatch;
        }).slice(0, 8); // Limit to 8 suggestions
        
        this.currentSuggestions = results;
        this.selectedIndex = -1;
        
        if (results.length > 0) {
            this.showSuggestions();
        } else {
            this.hideSuggestions();
        }
    }
    
    handleKeydown(e) {
        if (!this.suggestionsContainer.classList.contains('show')) {
            return;
        }
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSuggestions(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSuggestions(-1);
                break;
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectPokemon(this.currentSuggestions[this.selectedIndex]);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    
    navigateSuggestions(direction) {
        if (this.currentSuggestions.length === 0) return;
        
        this.selectedIndex += direction;
        
        if (this.selectedIndex < 0) {
            this.selectedIndex = this.currentSuggestions.length - 1;
        } else if (this.selectedIndex >= this.currentSuggestions.length) {
            this.selectedIndex = 0;
        }
        
        this.updateSelectedSuggestion();
    }
    
    updateSelectedSuggestion() {
        const suggestions = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        suggestions.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
    }
    
    showSuggestions() {
        if (this.currentSuggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.renderSuggestions();
        this.suggestionsContainer.classList.add('show');
    }
    
    hideSuggestions() {
        this.suggestionsContainer.classList.remove('show');
        this.selectedIndex = -1;
    }
    
    renderSuggestions() {
        this.suggestionsContainer.innerHTML = '';
        
        this.currentSuggestions.forEach((pokemon, index) => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.innerHTML = `
                <div class="suggestion-content">
                    <span class="suggestion-id">#${pokemon.id.toString().padStart(3, '0')}</span>
                    <span class="suggestion-name">${this.capitalizeFirst(pokemon.name)}</span>
                </div>
            `;
            
            suggestionItem.addEventListener('click', () => {
                this.selectPokemon(pokemon);
            });
            
            this.suggestionsContainer.appendChild(suggestionItem);
        });
    }
    
    selectPokemon(pokemon) {
        this.searchInput.value = pokemon.name;
        this.hideSuggestions();
        
        // Trigger Pokemon loading
        window.pokedex.loadPokemon(pokemon.id);
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pokemonSearch')) {
        window.pokemonSearch = new PokemonSearch();
    }
});
