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
            <div class="pokemon-slot-card empty" data-slot="${slotIndex}" onclick="window.pokemonBuilder.openPokemonSearch(${slotIndex})">
                <div class="empty-pokemon-content">
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
                        <h5 class="pokemon-name-display">${window.PokeUtils.formatName(pokemon.name)}</h5>
                        
                        <!-- Level Selector (inline con el nombre) -->
                        <div class="level-selector-inline">
                            <span class="level-label">${lm.getCurrentLanguage() === 'es' ? 'Nivel:' : 'Level:'}</span>
                            <div class="btn-group btn-group-sm" role="group">
                                <input type="radio" class="btn-check" name="level-${slotIndex}" id="level50-${slotIndex}" value="50" ${window.pvpTeamData.getSelectedLevel() === 50 ? 'checked' : ''}>
                                <label class="btn btn-outline-custom" for="level50-${slotIndex}">50</label>
                                
                                <input type="radio" class="btn-check" name="level-${slotIndex}" id="level100-${slotIndex}" value="100" ${window.pvpTeamData.getSelectedLevel() === 100 ? 'checked' : ''}>
                                <label class="btn btn-outline-custom" for="level100-${slotIndex}">100</label>
                            </div>
                        </div>
                        
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
                        <span id="evTotal_${slotIndex}" class="ev-total-number">${data.getTotalEVs(pokemon.evs)}</span> / 510
                    </div>
                </div>

                <!-- Nature, Ability, Item -->
                <div class="pokemon-attributes-section">
                    <!-- Fila 1: Naturaleza y Habilidad -->
                    <div class="row g-2 mb-2">
                        <div class="col-md-6">
                            <label class="form-label-sm">${lm.getCurrentLanguage() === 'es' ? 'Naturaleza' : 'Nature'}</label>
                            <select class="form-control form-control-sm nature-select"
                                    data-slot="${slotIndex}" id="nature_${slotIndex}">
                                <option value="">--</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label-sm">${lm.getCurrentLanguage() === 'es' ? 'Habilidad' : 'Ability'}</label>
                            <select class="form-control form-control-sm ability-select"
                                    data-slot="${slotIndex}" id="ability_${slotIndex}">
                                <option value="">--</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Fila 2: Objeto (completa) -->
                    <div class="row g-2">
                        <div class="col-md-12">
                            <label class="form-label-sm">${lm.getCurrentLanguage() === 'es' ? 'Objeto' : 'Item'}</label>
                            ${window.customDropdowns.renderItemSelect(slotIndex, pokemon.item)}
                        </div>
                    </div>
                </div>

                <!-- Moves Section -->
                <div class="pokemon-moves-section">
                    <label class="form-label-sm mb-2">${lm.getCurrentLanguage() === 'es' ? 'Movimientos' : 'Moves'}</label>
                    <div class="moves-grid">
                        ${[0, 1, 2, 3].map(moveIndex => 
                            window.customDropdowns.renderMoveSelect(slotIndex, moveIndex, pokemon.moves[moveIndex] || '')
                        ).join('')}
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

        // Asegurar que, al seleccionar Pokémon y renderizar la card, se inicialicen dropdowns personalizados
        // Esto se hace en updatePokemonSlot, pero reforzamos la cadena
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
        const resultsGrid = document.getElementById('pokemonResultsGrid');
        
        try {
            // Obtener lista de Pokémon para búsqueda parcial
            const pokemonList = await this.getAllPokemonNames();
            
            // Filtrar por coincidencias parciales
            const matches = pokemonList.filter(pokemon => {
                const nameMatch = pokemon.name.toLowerCase().includes(query.toLowerCase());
                const idMatch = pokemon.id.toString().includes(query);
                return nameMatch || idMatch;
            }).slice(0, 12); // Limitar a 12 resultados
            
            if (matches.length > 0) {
                // Mostrar resultados en grid
                this.renderPokemonResults(matches, slotIndex);
            } else {
                // Mostrar mensaje de no encontrado
                this.showNoResults();
            }
            
        } catch (error) {
            this.showNoResults();
        }
    }
    
    /**
     * Obtener lista de todos los Pokémon (cached)
     */
    async getAllPokemonNames() {
        const cacheKey = 'pvp_pokemon_names_list';
        let cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            return JSON.parse(cached);
        }
        
        try {
            // Solo Pokémon de Gen I-V (1-649) para PokeMMO
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=649');
            const data = await response.json();
            const pokemonList = data.results.map((pokemon, index) => ({
                id: index + 1,
                name: pokemon.name,
                url: pokemon.url
            }));
            
            localStorage.setItem(cacheKey, JSON.stringify(pokemonList));
            return pokemonList;
        } catch (error) {
            return [];
        }
    }
    
    /**
     * Renderizar resultados de búsqueda
     */
    renderPokemonResults(pokemonList, slotIndex) {
        const resultsGrid = document.getElementById('pokemonResultsGrid');
        const suggestionsContainer = document.getElementById('modalSearchSuggestions');
        
        // Ocultar sugerencias
        suggestionsContainer.style.display = 'none';
        
        // Renderizar grid de resultados
        resultsGrid.innerHTML = pokemonList.map(pokemon => `
            <div class="pokemon-result-card" onclick="window.pokemonBuilder.selectPokemonFromSearch('${pokemon.name}', ${slotIndex})">
                <div class="pokemon-result-sprite">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" 
                         alt="${pokemon.name}" 
                         onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'">
                </div>
                <div class="pokemon-result-info">
                    <div class="pokemon-result-name">${window.PokeUtils.formatName(pokemon.name)}</div>
                    <div class="pokemon-result-id">#${pokemon.id}</div>
                </div>
            </div>
        `).join('');
        
        resultsGrid.style.display = 'grid';
    }
    
    /**
     * Mostrar mensaje de no encontrado
     */
    showNoResults() {
        const resultsGrid = document.getElementById('pokemonResultsGrid');
        const suggestionsContainer = document.getElementById('modalSearchSuggestions');
        
        suggestionsContainer.style.display = 'none';
        resultsGrid.innerHTML = `
            <div class="no-results-message">
                <div class="no-results-icon">🔍</div>
                <div class="no-results-text">
                    ${window.languageManager.getCurrentLanguage() === 'es' ? 'No se encontraron Pokémon' : 'No Pokémon found'}
                </div>
                <div class="no-results-hint">
                    ${window.languageManager.getCurrentLanguage() === 'es' ? 'Intenta con otro nombre o ID' : 'Try a different name or ID'}
                </div>
            </div>
        `;
        resultsGrid.style.display = 'flex';
    }
    
    /**
     * Seleccionar Pokémon desde búsqueda (SIMPLIFICADO - usa selectPokemon)
     */
    async selectPokemonFromSearch(pokemonName, slotIndex) {
        try {
            await this.selectPokemon(pokemonName, slotIndex);
        } catch (error) {
            console.error('❌ Error seleccionando Pokémon desde búsqueda:', error);
        }
    }

    // ✅ CÓDIGO MUERTO ELIMINADO: fetchPokemon ya no se usa

    /**
     * Seleccionar Pokémon y agregarlo al slot
     */
    async selectPokemon(pokemonId, slotIndex) {
        try {
            // Obtener datos de pokemon.js (para habilidades, movimientos y stats base)
            const localData = window.pokemonDataLoader.getPokemonData(pokemonId);
            
            if (!localData) {
                console.error(`❌ No se encontró Pokémon #${pokemonId} en pokemon.js`);
                return;
            }
            
            // Obtener sprite directamente (sin fetch a PokeAPI)
            const pokemonIdNum = parseInt(localData.id);
            const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIdNum}.png`;
            
            // 🎯 USAR STATS BASE DE pokemon.js (YA NO NECESITAMOS PokeAPI)
            const baseStats = {
                'hp': localData.baseStats.hp,
                'attack': localData.baseStats.attack,
                'defense': localData.baseStats.defense,
                'special-attack': localData.baseStats.specialAttack,
                'special-defense': localData.baseStats.specialDefense,
                'speed': localData.baseStats.speed
            };
            
            // Crear objeto Pokémon usando SOLO datos locales
            const pokemon = {
                id: pokemonIdNum,
                name: localData.name,
                sprite: sprite,
                baseStats: baseStats,  // 👈 De pokemon.js (local)
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
                ability: localData.abilities[0] || null,
                item: null,
                moves: [null, null, null, null],
                // USAR DATOS DE pokemon.js
                availableAbilities: (() => {
                    if (!localData.abilities || !Array.isArray(localData.abilities)) {
                        console.error(`❌ localData.abilities no es un array válido:`, localData.abilities);
                        return [];
                    }
                    return localData.abilities.map(abilityName => ({
                        name: abilityName,
                        is_hidden: false // No diferenciamos hidden en datos locales
                    }));
                })(),
                // USAR MOVIMIENTOS DE pokemon.js
                availableMoves: localData.moves
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
            console.error('❌ Error seleccionando Pokémon:', error);
        }
    }

}

// Exportar instancia global
window.pokemonBuilder = new PokemonBuilder();

