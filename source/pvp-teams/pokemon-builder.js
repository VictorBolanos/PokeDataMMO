// PVP Teams - Pokémon Builder Component
class PokemonBuilder {
    constructor() {
        this.searchCache = new Map();
    }

    /**
     * Renderizar card de Pokémon vacío (con botón +)
     */
    renderEmptyCard(slotIndex) {
        const lm = window.languageManager;
        
        return `
            <div class="pokemon-slot-card empty" data-slot="${slotIndex}">
                <div class="empty-pokemon-content" onclick="window.pokemonBuilder.openPokemonSearch(${slotIndex})">
                    <div class="add-pokemon-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <p class="add-pokemon-text">
                        ${lm.getCurrentLanguage() === 'es' ? 'Click para agregar Pokémon' : 'Click to add Pokémon'}
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar card de Pokémon con datos
     */
    renderPokemonCard(pokemon, slotIndex) {
        const lm = window.languageManager;
        const data = window.pvpTeamData;
        
        return `
            <div class="pokemon-slot-card filled" data-slot="${slotIndex}">
                <!-- Header con sprite y nombre -->
                <div class="pokemon-card-header">
                    <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-sprite-large">
                    <div class="pokemon-card-title">
                        <h5 class="pokemon-name-display">${this.capitalizeName(pokemon.name)}</h5>
                        <button class="btn btn-sm btn-outline-danger remove-pokemon-btn" 
                                onclick="window.pvpTeamsUI.removePokemon(${slotIndex})">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Stats Table -->
                <div class="pokemon-stats-section">
                    <table class="pokemon-stats-table">
                        <thead>
                            <tr>
                                <th>${lm.getCurrentLanguage() === 'es' ? 'Stat' : 'Stat'}</th>
                                <th>${lm.getCurrentLanguage() === 'es' ? 'Base' : 'Base'}</th>
                                <th>EVs</th>
                                <th>IVs</th>
                                <th>${lm.getCurrentLanguage() === 'es' ? 'Final' : 'Final'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.statsOrder.map(statName => `
                                <tr>
                                    <td class="stat-name">${data.getStatDisplayName(statName)}</td>
                                    <td class="base-stat">${pokemon.baseStats[statName]}</td>
                                    <td>
                                        <input type="number" class="form-control form-control-sm ev-input" 
                                               data-slot="${slotIndex}" data-stat="${statName}"
                                               value="${pokemon.evs[statName]}" min="0" max="252">
                                    </td>
                                    <td>
                                        <input type="number" class="form-control form-control-sm iv-input"
                                               data-slot="${slotIndex}" data-stat="${statName}"
                                               value="${pokemon.ivs[statName]}" min="0" max="31">
                                    </td>
                                    <td class="final-stat" id="finalStat_${slotIndex}_${statName}">
                                        ${pokemon.finalStats[statName]}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="ev-total-display">
                        ${lm.getCurrentLanguage() === 'es' ? 'Total EVs:' : 'Total EVs:'}
                        <span id="evTotal_${slotIndex}" class="ev-total-number">0</span> / 510
                    </div>
                </div>

                <!-- Nature, Ability, Item -->
                <div class="pokemon-attributes-section">
                    <div class="row g-2">
                        <div class="col-md-4">
                            <label class="form-label-sm">${lm.getCurrentLanguage() === 'es' ? 'Naturaleza' : 'Nature'}</label>
                            <select class="form-control form-control-sm nature-select" 
                                    data-slot="${slotIndex}" id="nature_${slotIndex}">
                                <option value="">--</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label-sm">${lm.getCurrentLanguage() === 'es' ? 'Habilidad' : 'Ability'}</label>
                            <select class="form-control form-control-sm ability-select"
                                    data-slot="${slotIndex}" id="ability_${slotIndex}">
                                <option value="">--</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label-sm">${lm.getCurrentLanguage() === 'es' ? 'Objeto' : 'Item'}</label>
                            <select class="form-control form-control-sm item-select"
                                    data-slot="${slotIndex}" id="item_${slotIndex}">
                                <option value="">--</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Moves Section -->
                <div class="pokemon-moves-section">
                    <label class="form-label-sm mb-2">${lm.getCurrentLanguage() === 'es' ? 'Movimientos' : 'Moves'}</label>
                    <div class="moves-grid">
                        ${[0, 1, 2, 3].map(moveIndex => `
                            <select class="form-control form-control-sm move-select"
                                    data-slot="${slotIndex}" data-move-index="${moveIndex}"
                                    id="move_${slotIndex}_${moveIndex}">
                                <option value="">--</option>
                            </select>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Abrir popup de búsqueda de Pokémon
     */
    openPokemonSearch(slotIndex) {
        const lm = window.languageManager;
        
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'pokemon-search-modal';
        modal.innerHTML = `
            <div class="pokemon-search-modal-content">
                <div class="modal-header">
                    <h5>${lm.getCurrentLanguage() === 'es' ? 'Buscar Pokémon' : 'Search Pokémon'}</h5>
                    <button class="close-modal-btn" onclick="this.closest('.pokemon-search-modal').remove()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="search-input-wrapper mb-3">
                        <input type="text" class="form-control pokemon-modal-search" 
                               id="pokemonModalSearch"
                               placeholder="${lm.getCurrentLanguage() === 'es' ? 'Buscar por nombre o ID...' : 'Search by name or ID...'}"
                               autocomplete="off">
                        <div class="modal-search-suggestions" id="modalSearchSuggestions"></div>
                    </div>
                    <div class="pokemon-results-grid" id="pokemonResultsGrid">
                        <!-- Resultados aquí -->
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Configurar búsqueda
        this.setupModalSearch(slotIndex);
        
        // Cerrar con click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Configurar búsqueda en modal
     */
    setupModalSearch(slotIndex) {
        const searchInput = document.getElementById('pokemonModalSearch');
        const suggestionsContainer = document.getElementById('modalSearchSuggestions');
        
        let searchTimeout;
        
        searchInput.addEventListener('input', async (e) => {
            clearTimeout(searchTimeout);
            
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length < 2) {
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(async () => {
                await this.searchPokemon(query, slotIndex);
            }, 300);
        });
    }

    /**
     * Buscar Pokémon
     */
    async searchPokemon(query, slotIndex) {
        const suggestionsContainer = document.getElementById('modalSearchSuggestions');
        
        try {
            // Buscar por ID o nombre
            let pokemonData;
            
            if (!isNaN(query)) {
                // Buscar por ID
                pokemonData = await this.fetchPokemon(query);
            } else {
                // Buscar por nombre
                pokemonData = await this.fetchPokemon(query);
            }
            
            if (pokemonData) {
                suggestionsContainer.innerHTML = `
                    <div class="search-suggestion-item" onclick="window.pokemonBuilder.selectPokemon(${pokemonData.id}, ${slotIndex})">
                        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="suggestion-sprite">
                        <div class="suggestion-info">
                            <strong>#${pokemonData.id} ${this.capitalizeName(pokemonData.name)}</strong>
                        </div>
                    </div>
                `;
                suggestionsContainer.style.display = 'block';
            }
        } catch (error) {
            suggestionsContainer.innerHTML = `
                <div class="search-suggestion-item error">
                    ${window.languageManager.getCurrentLanguage() === 'es' ? 'No encontrado' : 'Not found'}
                </div>
            `;
            suggestionsContainer.style.display = 'block';
        }
    }

    /**
     * Fetch Pokémon data from API
     */
    async fetchPokemon(idOrName) {
        // Verificar cache
        if (this.searchCache.has(idOrName)) {
            return this.searchCache.get(idOrName);
        }
        
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
            const data = await response.json();
            
            // Guardar en cache
            this.searchCache.set(idOrName, data);
            this.searchCache.set(data.id, data);
            this.searchCache.set(data.name, data);
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Seleccionar Pokémon y agregarlo al slot
     */
    async selectPokemon(pokemonId, slotIndex) {
        try {
            const pokemonData = await this.fetchPokemon(pokemonId);
            
            // Extraer stats base
            const baseStats = {};
            pokemonData.stats.forEach(stat => {
                baseStats[stat.stat.name] = stat.base_stat;
            });
            
            // Crear objeto Pokémon
            const pokemon = {
                id: pokemonData.id,
                name: pokemonData.name,
                sprite: pokemonData.sprites.front_default,
                baseStats: baseStats,
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
                finalStats: {},
                nature: null,
                ability: pokemonData.abilities[0]?.ability.name || null,
                item: null,
                moves: [null, null, null, null],
                availableAbilities: pokemonData.abilities.map(a => a.ability.name),
                availableMoves: pokemonData.moves.slice(0, 50).map(m => m.move.name)  // Limitar a 50 moves
            };
            
            // Calcular stats finales
            pokemon.finalStats = window.pvpTeamData.calculateAllStats(
                pokemon.baseStats,
                pokemon.evs,
                pokemon.ivs,
                null
            );
            
            // Cerrar modal
            document.querySelector('.pokemon-search-modal')?.remove();
            
            // Actualizar en el equipo
            window.pvpTeamsUI.updatePokemonSlot(slotIndex, pokemon);
            
        } catch (error) {
            console.error('❌ Error selecting Pokémon:', error);
        }
    }

    /**
     * Capitalizar nombre de Pokémon
     */
    capitalizeName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
    }
}

// Exportar instancia global
window.pokemonBuilder = new PokemonBuilder();

