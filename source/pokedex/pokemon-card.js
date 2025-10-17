// Pokédex - Pokemon Card Component
class PokemonCard {
    constructor(pokemonData, speciesData) {
        this.pokemon = pokemonData;
        this.species = speciesData;
        this.container = document.getElementById('pokemonCardContainer');
        this.lm = window.languageManager; // Language manager reference
    }
    
    // Get translated label
    t(key) {
        return this.lm.t(`pokedex.${key}`);
    }
    
    // Get Pokemon name in current language
    getPokemonName() {
        const lang = this.lm.getApiLanguage();
        const names = this.species.names;
        const nameEntry = names.find(entry => entry.language.name === lang);
        return nameEntry ? nameEntry.name : this.capitalizeFirst(this.pokemon.name);
    }
    
    // Get ability name in current language
    getAbilityName(abilityUrl) {
        // For now, return the English name capitalized
        // In future, could fetch ability details from API
        const abilityName = abilityUrl.split('/').slice(-2, -1)[0];
        return this.capitalizeFirst(abilityName.replace('-', ' '));
    }
    
    // Get egg group name in current language
    getEggGroupName(groupName) {
        const lang = this.lm.getCurrentLanguage();
        const translations = {
            'monster': { es: 'Monstruo', en: 'Monster' },
            'water1': { es: 'Agua 1', en: 'Water 1' },
            'water2': { es: 'Agua 2', en: 'Water 2' },
            'water3': { es: 'Agua 3', en: 'Water 3' },
            'bug': { es: 'Bicho', en: 'Bug' },
            'flying': { es: 'Volador', en: 'Flying' },
            'field': { es: 'Campo', en: 'Field' },
            'fairy': { es: 'Hada', en: 'Fairy' },
            'grass': { es: 'Planta', en: 'Grass' },
            'human-like': { es: 'Humanoide', en: 'Human-Like' },
            'mineral': { es: 'Mineral', en: 'Mineral' },
            'amorphous': { es: 'Amorfo', en: 'Amorphous' },
            'ditto': { es: 'Ditto', en: 'Ditto' },
            'dragon': { es: 'Dragón', en: 'Dragon' },
            'undiscovered': { es: 'Desconocido', en: 'Undiscovered' },
            'no-eggs': { es: 'Sin Huevos', en: 'No Eggs' }
        };
        return translations[groupName]?.[lang] || this.capitalizeFirst(groupName.replace('-', ' '));
    }
    
    // Get genus (category) in current language
    getGenus() {
        const lang = this.lm.getApiLanguage();
        const genera = this.species.genera;
        const genusEntry = genera.find(entry => entry.language.name === lang);
        return genusEntry ? genusEntry.genus : '';
    }
    
    render() {
        try {
            this.container.innerHTML = `
                <div class="pokemon-main-card">
                    <!-- First Card: Basic Info + Description + Stats -->
                    ${this.renderBasicInfoCard()}
                    
                    <!-- Second Card: Base Stats with Visual Bars -->
                    ${this.renderStatsCard()}
                    
                    <!-- Third Card: Moves (Generation V) -->
                    ${this.renderMovesCard()}
                    
                    <!-- Fourth Card: Type Effectiveness -->
                    ${this.renderTypeEffectivenessCard()}
                </div>
            `;
            
            
            // Initialize components AFTER HTML is in DOM
            this.initializeMoves();
            this.initializeEvolution();
            this.initializeTypeEffectiveness();
            
        } catch (error) {
            console.error('❌ Error in PokemonCard.render:', error);
            throw error;
        }
    }
    
    renderBasicInfoCard() {
        
        const types = this.pokemon.types
            .filter(type => type.type.name !== 'fairy') // Filter out Fairy type for Gen V
            .map(type => `
                <div class="type-badge">
                    <img src="img/res/poke-types/long/type-${type.type.name}-long-icon.png" alt="${type.type.name}">
                </div>
            `).join('');
        
        const generation = PokemonAPI.getGenerationFromId(this.pokemon.id);
        const genName = PokemonAPI.getGenerationName(generation);
        
        const abilities = this.pokemon.abilities.map(ability => `
            <div class="ability-item">
                <span class="ability-name">${this.capitalizeFirst(ability.ability.name.replace('-', ' '))}</span>
                ${ability.is_hidden ? '<span class="hidden-badge">💎</span>' : ''}
            </div>
        `).join('');
        
        const eggGroups = this.species.egg_groups.map(group => `
            <span class="egg-group-badge">${this.getEggGroupName(group.name)}</span>
        `).join('');
        
        const heldItems = this.pokemon.held_items.map(item => `
            <span class="held-item-badge">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.item.name}.png" 
                     alt="${item.item.name}" 
                     class="item-sprite">
                ${this.capitalizeFirst(item.item.name.replace('-', ' '))}
            </span>
        `).join('');
        
        const noHeldItems = this.t('noMoves').replace('movimientos', 'objetos').replace('moves', 'held items');
        
        return `
            <div class="pokemon-card-section">
                <h3 class="section-title">${this.t('basicInfo')}</h3>
                
                <!-- Row 1: Image + Info -->
                <div class="basic-info-row">
                    <div class="pokemon-image-column">
                        <img src="${this.pokemon.sprites.other['official-artwork'].front_default || this.pokemon.sprites.front_default}" 
                             alt="${this.pokemon.name}" 
                             class="pokemon-main-sprite">
                    </div>
                    <div class="pokemon-info-column">
                        <h1 class="pokemon-name">${this.getPokemonName()}</h1>
                        <div class="pokemon-id">#${this.pokemon.id.toString().padStart(3, '0')}</div>
                        
                        <div class="info-section">
                            <h4>${this.t('types')}</h4>
                            <div class="pokemon-types">${types}</div>
                        </div>
                        
                        <div class="info-section">
                            <h4>${this.t('generation')}</h4>
                            <div class="generation-badge">
                                <img src="img/res/gen-icons/${this.getGenerationIcon(generation)}" alt="${genName}">
                                <span>Gen ${generation} - ${genName}</span>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h4>${this.t('abilities')}</h4>
                            <div class="abilities-list">${abilities}</div>
                        </div>
                        
                        <div class="info-section">
                            <h4>${this.lm.getCurrentLanguage() === 'es' ? 'Objetos Equipados' : 'Held Items'}</h4>
                            <div class="held-items">${heldItems || `<span class="no-held-items">${this.lm.getCurrentLanguage() === 'es' ? 'Sin objetos equipados' : 'No held items'}</span>`}</div>
                        </div>
                        
                        <div class="info-section">
                            <h4>${this.t('eggGroups')}</h4>
                            <div class="egg-groups">${eggGroups}</div>
                        </div>
                        
                        <div class="info-section">
                            <h4>${this.t('height')} / ${this.t('weight')}</h4>
                            <div class="physical-stats">
                                <span class="physical-stat-badge">${this.pokemon.height / 10}m</span>
                                <span class="physical-stat-badge">${this.pokemon.weight / 10}kg</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Row 2: Description -->
                <div class="description-row">
                    <h4>${this.t('description')}</h4>
                    <p class="pokemon-description">${this.getDescription()}</p>
                </div>
                
                <!-- Row 3: Evolution Chain -->
                <div class="evolution-row">
                    <h4>${this.t('evolution')}</h4>
                    <div class="evolution-chain" id="evolutionChain">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                            ${this.lm.getCurrentLanguage() === 'es' ? 'Cargando cadena evolutiva...' : 'Loading evolution chain...'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderAbilities() {
        const abilities = this.pokemon.abilities.map(ability => `
            <div class="ability-item">
                <div class="ability-name">
                    ${this.capitalizeFirst(ability.ability.name.replace('-', ' '))}
                    ${ability.is_hidden ? '<span style="color: #dc2626; margin-left: 5px;">💎</span>' : ''}
                </div>
                <div class="ability-type">${ability.is_hidden ? 'Hidden Ability' : 'Normal Ability'}</div>
            </div>
        `).join('');
        
        return `
            <div class="pokemon-section">
                <h3 class="section-title">🔮 Abilities</h3>
                <div class="section-content">
                    <div class="abilities-list">${abilities}</div>
                </div>
            </div>
        `;
    }
    
    renderDescription() {
        const description = this.getDescription();
        
        return `
            <div class="pokemon-section">
                <h3 class="section-title">📖 Pokédex Entry</h3>
                <div class="section-content">
                    <p class="pokemon-description">${description}</p>
                </div>
            </div>
        `;
    }
    
    renderEvolution() {
        return `
            <div class="pokemon-section">
                <h3 class="section-title">🔄 Evolution Chain</h3>
                <div class="section-content">
                    <div class="evolution-chain" id="evolutionChain">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                            Loading evolution chain...
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderStatsCard() {
        
        const stats = this.pokemon.stats.map(stat => {
            const percentage = (stat.base_stat / 255) * 100; // Max stat is 255
            const statName = this.getStatName(stat.stat.name);
            const statColor = this.getStatColor(stat.stat.name);
            
            return `
                <div class="stat-item">
                    <div class="stat-header">
                        <span class="stat-name">${statName}</span>
                        <span class="stat-value">${stat.base_stat}</span>
                    </div>
                    <div class="stat-bar-container">
                        <div class="stat-bar">
                            <div class="stat-bar-fill" 
                                 style="width: ${percentage}%; background-color: ${statColor};"></div>
                        </div>
                        <span class="stat-percentage">${percentage.toFixed(1)}%</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Calcular el total de estadísticas base
        const totalStats = this.pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
        
        return `
            <div class="pokemon-card-section">
                <h3 class="section-title">${this.t('baseStats')}</h3>
                <div class="stats-container">
                    <div class="stats-grid">${stats}</div>
                    <div class="stats-note">
                        <small>${this.t('totalBaseStats')}: <strong>${totalStats}</strong></small>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderMovesCard() {
        const loadingText = this.lm.getCurrentLanguage() === 'es' ? 'Cargando movimientos...' : 'Loading moves...';
        
        return `
            <div class="pokemon-card-section">
                <h3 class="section-title">${this.t('moves')}</h3>
                <div class="moves-container">
                    <div class="moves-tabs">
                        <button class="move-tab active" data-move-type="level-up">${this.t('movesLevelUp')}</button>
                        <button class="move-tab" data-move-type="tm-hm">${this.t('movesMachine')}</button>
                        <button class="move-tab" data-move-type="tutor">${this.t('movesTutor')}</button>
                        <button class="move-tab" data-move-type="egg">${this.t('movesEgg')}</button>
                    </div>
                    <div class="moves-content" id="movesContent">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                            ${loadingText}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTypeEffectivenessCard() {
        const loadingText = this.lm.getCurrentLanguage() === 'es' ? 'Cargando efectividad de tipos...' : 'Loading type effectiveness...';
        
        return `
            <div class="pokemon-card-section">
                <h3 class="section-title">${this.t('effectiveness')}</h3>
                <div class="pokedex-effectiveness-container">
                    <div class="pokedex-effectiveness-grid" id="typeEffectiveness">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                            ${loadingText}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTypeEffectiveness(effectiveness) {
        
        const effectivenessContainer = document.getElementById('typeEffectiveness');
        
        if (!effectivenessContainer) {
            console.error('❌ typeEffectiveness element not found in DOM');
            return;
        }
        
        if (!effectiveness || typeof effectiveness !== 'object') {
            console.error('❌ effectiveness is not a valid object:', effectiveness);
            effectivenessContainer.innerHTML = `
                <div class="error">
                    Error: Type effectiveness data is invalid
                </div>
            `;
            return;
        }
        
        const effectivenessHTML = Object.entries(effectiveness).map(([multiplier, types]) => {
            if (types.length === 0 || multiplier === '1x') return ''; // Skip empty and 1x
            
            const typesHTML = types.map(type => `
                <div class="pokedex-effectiveness-type-box" data-type="${type}" data-multiplier="${multiplier}">
                    <img src="img/res/poke-types/box/type-${type}-box-icon.png" alt="${type}">
                </div>
            `).join('');
            
            return `
                <div class="pokedex-effectiveness-category" data-multiplier="${multiplier}">
                    <div class="pokedex-effectiveness-header">
                        <span class="pokedex-effectiveness-multiplier">${multiplier}</span>
                        <span class="pokedex-effectiveness-label">${this.getEffectivenessLabel(multiplier)}</span>
                        <span class="pokedex-effectiveness-count">(${types.length})</span>
                    </div>
                    <div class="pokedex-effectiveness-types-grid">${typesHTML}</div>
                </div>
            `;
        }).filter(html => html !== '').join('');
        
        effectivenessContainer.innerHTML = effectivenessHTML || `
            <div class="text-center text-muted">
                Type effectiveness calculation not available
            </div>
        `;
    }
    
    async initializeMoves() {
        const movesContent = document.getElementById('movesContent');
        const moveTabs = document.querySelectorAll('.move-tab');
        
        // Setup tab switching
        moveTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                moveTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.loadMovesForType(tab.dataset.moveType);
            });
        });
        
        // Load initial moves (level-up)
        await this.loadMovesForType('level-up');
    }
    
    async loadMovesForType(type) {
        const movesContent = document.getElementById('movesContent');
        movesContent.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                Loading ${type} moves...
            </div>
        `;
        
        try {
            const moves = await this.getMovesByType(type);
            this.renderMovesList(moves, type);
        } catch (error) {
            movesContent.innerHTML = `
                <div class="error">
                    Error loading ${type} moves
                </div>
            `;
        }
    }
    
    async getMovesByType(type) {
        // Filter moves based on type
        const filteredMoves = this.pokemon.moves.filter(move => {
            const versionDetails = move.version_group_details;
            return versionDetails.some(detail => {
                switch (type) {
                    case 'level-up':
                        return detail.move_learn_method.name === 'level-up';
                    case 'tm-hm':
                        return detail.move_learn_method.name === 'machine';
                    case 'tutor':
                        return detail.move_learn_method.name === 'tutor';
                    case 'egg':
                        return detail.move_learn_method.name === 'egg';
                    default:
                        return false;
                }
            });
        });
        
        // Get move details for Generation V (black-white, excluding Fairy type moves)
        const movePromises = filteredMoves.slice(0, 50).map(async moveData => {
            try {
                const move = await PokemonAPI.getMove(moveData.move.name);
                
                // Skip Fairy type moves (Gen V doesn't have Fairy type)
                if (move.type.name === 'fairy') return null;
                
                return {
                    ...move,
                    learnDetails: moveData.version_group_details.filter(
                        detail => detail.version_group.name === 'black-white'
                    )
                };
            } catch (error) {
                return null;
            }
        });
        
        const moves = await Promise.all(movePromises);
        const validMoves = moves.filter(move => move !== null);
        
        // Ordenar movimientos aprendidos por nivel en orden ascendente
        if (type === 'level-up') {
            validMoves.sort((a, b) => {
                const levelA = a.learnDetails.find(detail => detail.move_learn_method.name === 'level-up')?.level_learned_at || 0;
                const levelB = b.learnDetails.find(detail => detail.move_learn_method.name === 'level-up')?.level_learned_at || 0;
                return levelA - levelB;
            });
        }
        
        return validMoves;
    }
    
    renderMovesList(moves, type) {
        const movesContent = document.getElementById('movesContent');
        
        if (moves.length === 0) {
            movesContent.innerHTML = `
                <div class="text-center text-muted">
                    ${this.t('noMoves')}
                </div>
            `;
            return;
        }
        
        const movesHTML = moves.map(move => {
            // Obtener información del nivel para movimientos aprendidos por nivel
            let levelInfo = '';
            if (type === 'level-up' && move.learnDetails && move.learnDetails.length > 0) {
                const levelUpDetail = move.learnDetails.find(detail => detail.move_learn_method.name === 'level-up');
                if (levelUpDetail && levelUpDetail.level_learned_at) {
                    levelInfo = `<span class="move-level">${this.t('level')}: ${levelUpDetail.level_learned_at}</span>`;
                }
            }
            
            return `
                <div class="move-item">
                    <div class="move-row-1">
                        <span class="move-name">${this.capitalizeFirst(move.name.replace('-', ' '))}</span>
                        <div class="move-type">
                            <img src="img/res/poke-types/long/type-${move.type.name}-long-icon.png" alt="${move.type.name}">
                        </div>
                        <img src="img/res/atack-class-icons/${this.getDamageClassFileName(move.damage_class.name)}-class.gif" 
                             alt="${move.damage_class.name}" 
                             class="move-class">
                        ${levelInfo}
                        <span class="move-power">${this.t('power')}: ${move.power || '-'}</span>
                        <span class="move-accuracy">${this.t('accuracy')}: ${move.accuracy ? `${move.accuracy}%` : '-'}</span>
                        <span class="move-pp">${this.t('pp')}: ${move.pp}</span>
                    </div>
                    <div class="move-row-2">
                        <span class="move-description">${this.getMoveDescription(move)}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        movesContent.innerHTML = `
            <div class="moves-list">${movesHTML}</div>
        `;
    }
    
    async initializeEvolution() {
        const evolutionContainer = document.getElementById('evolutionChain');
        
        try {
            // Extract evolution chain ID from URL
            const evolutionChainId = this.extractEvolutionChainId(this.species.evolution_chain.url);
            
            const evolutionChain = await PokemonAPI.getEvolutionChain(evolutionChainId);
            
            this.renderEvolutionChain(evolutionChain.chain);
        } catch (error) {
            console.error('❌ Error loading evolution chain:', error);
            evolutionContainer.innerHTML = `
                <div class="error">
                    Error loading evolution chain: ${error.message}
                </div>
            `;
        }
    }
    
    extractEvolutionChainId(url) {
        const matches = url.match(/\/evolution-chain\/(\d+)\//);
        return matches ? parseInt(matches[1]) : null;
    }
    
    renderEvolutionChain(chain) {
        const evolutionContainer = document.getElementById('evolutionChain');
        const evolutionHTML = this.buildEvolutionHTML(chain);
        evolutionContainer.innerHTML = evolutionHTML;
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
        
        let html = `
            <div class="evolution-item">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.extractPokemonId(chain.species.url)}.png" 
                     alt="${chain.species.name}" 
                     class="evolution-sprite">
                <div class="evolution-name">${this.capitalizeFirst(chain.species.name)}</div>
            </div>
        `;
        
        if (chain.evolves_to.length > 0) {
            // Los evolution_details están en el Pokémon que evoluciona HACIA, no en el actual
            const nextEvolution = chain.evolves_to[0];
            
            const evolutionDetail = nextEvolution.evolution_details && nextEvolution.evolution_details.length > 0 ? nextEvolution.evolution_details[0] : null;
            
            html += `<div class="evolution-arrow">
                <div class="evolution-condition">${this.formatEvolutionCondition(evolutionDetail)}</div>
            </div>`;
            html += this.buildEvolutionChainRecursive(nextEvolution);
        }
        
        return html;
    }
    
    async initializeTypeEffectiveness() {
        
        try {
            
            const pokemonStats = new PokemonStats(this.pokemon);
            const effectiveness = await pokemonStats.calculateTypeEffectiveness();
            
            this.renderTypeEffectiveness(effectiveness);
        } catch (error) {
            console.error('❌ Error in initializeTypeEffectiveness:', error);
            const effectivenessContainer = document.getElementById('typeEffectiveness');
            if (effectivenessContainer) {
                effectivenessContainer.innerHTML = `
                    <div class="error">
                        Error calculating type effectiveness: ${error.message}
                    </div>
                `;
            }
        }
    }
    
    calculateTypeEffectiveness() {
        // This method is now handled by PokemonStats class
        // Keeping for backward compatibility
        return {
            '4x': [],
            '2x': [],
            '1x': [],
            '0.5x': [],
            '0.25x': [],
            '0x': []
        };
    }
    
    renderTypeEffectiveness(effectiveness) {
        
        const effectivenessContainer = document.getElementById('typeEffectiveness');
        
        if (!effectiveness || typeof effectiveness !== 'object') {
            console.error('❌ effectiveness is not a valid object:', effectiveness);
            effectivenessContainer.innerHTML = `
                <div class="error">
                    Error: Type effectiveness data is invalid
                </div>
            `;
            return;
        }
        
        const effectivenessHTML = Object.entries(effectiveness).map(([multiplier, types]) => {
            if (types.length === 0 || multiplier === '1x') return ''; // Skip empty and 1x
            
            const typesHTML = types.map(type => `
                <div class="effectiveness-type" title="${this.capitalizeFirst(type.replace('-', ' '))}">
                    <img src="img/res/poke-types/box/type-${type}-box-icon.png" alt="${type}">
                </div>
            `).join('');
            
            return `
                <div class="effectiveness-card effectiveness-category" data-multiplier="${multiplier}">
                    <div class="effectiveness-title">
                        <span>${multiplier}</span>
                        <span>${this.getEffectivenessLabel(multiplier)}</span>
                    </div>
                    <div class="pokedex-effectiveness-types-grid">${typesHTML}</div>
                </div>
            `;
        }).filter(html => html !== '').join('');
        
        effectivenessContainer.innerHTML = effectivenessHTML || `
            <div class="text-center text-muted">
                Type effectiveness calculation not available
            </div>
        `;
    }
    
    // Helper methods
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    getGenerationIcon(generation) {
        const icons = {
            1: 'first-gen.svg',
            2: 'second-gen.svg',
            3: 'third-gen.svg',
            4: 'fouth-gen.svg',
            5: 'fifth-gen.svg'
        };
        return icons[generation] || 'first-gen.svg';
    }
    
    getStatName(statName) {
        const mapping = {
            'hp': 'hp',
            'attack': 'attack',
            'defense': 'defense',
            'special-attack': 'spAttack',
            'special-defense': 'spDefense',
            'speed': 'speed'
        };
        const key = mapping[statName];
        return key ? this.t(key) : statName.toUpperCase();
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
    
    getDescription() {
        const lang = window.languageManager.getApiLanguage();
        const flavorTexts = this.species.flavor_text_entries;
        const entry = flavorTexts.find(entry => entry.language.name === lang);
        const noDescText = lang === 'es' ? 'Sin descripción disponible' : 'No description available';
        return entry ? entry.flavor_text.replace(/\f/g, ' ') : noDescText;
    }
    
    getMoveDescription(move) {
        const lang = window.languageManager.getApiLanguage();
        const effect = move.effect_entries.find(entry => entry.language.name === lang);
        const noDescText = lang === 'es' ? 'Sin descripción disponible' : 'No description available';
        return effect ? effect.short_effect : noDescText;
    }
    
    extractPokemonId(url) {
        const matches = url.match(/\/(\d+)\//);
        return matches ? matches[1] : '0';
    }
    
    getEffectivenessLabel(multiplier) {
        const mapping = {
            '4x': 'weak4x',
            '2x': 'weak2x',
            '1x': '',
            '0.5x': 'resistant05x',
            '0.25x': 'resistant025x',
            '0x': 'immune'
        };
        const key = mapping[multiplier];
        return key ? this.t(key) : multiplier;
    }

    getDamageClassFileName(damageClassName) {
        const mapping = {
            'physical': 'physic',
            'special': 'special',
            'status': 'status'
        };
        return mapping[damageClassName] || damageClassName;
    }

    formatEvolutionCondition(detail) {
        if (!detail) {
            return 'No evolutions';
        }
        
        const conditions = [];
        
        // Trigger type
        const trigger = detail.trigger.name;
        
        switch (trigger) {
            case 'level-up':
                if (detail.min_level) {
                    conditions.push(`Level ${detail.min_level}`);
                } else {
                    conditions.push('Level up');
                }
                break;
                
            case 'use-item':
                if (detail.item) {
                    conditions.push(`<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${detail.item.name}.png" alt="${detail.item.name}" class="evolution-item-sprite"> Use ${this.capitalizeFirst(detail.item.name.replace('-', ' '))}`);
                } else {
                    conditions.push('Use item');
                }
                break;
                
            case 'trade':
                if (detail.trade_species) {
                    conditions.push(`Trade with ${this.capitalizeFirst(detail.trade_species.name)}`);
                } else {
                    conditions.push('Trade');
                }
                break;
                
            case 'friendship':
                if (detail.min_happiness) {
                    conditions.push(`Friendship ${detail.min_happiness}+`);
                } else {
                    conditions.push('High friendship');
                }
                break;
                
            case 'shed':
                conditions.push('Shed (Nincada → Shedinja)');
                break;
                
            default:
                conditions.push(this.capitalizeFirst(trigger.replace('-', ' ')));
        }
        
        // Additional conditions
        if (detail.held_item) {
            conditions.push(`<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${detail.held_item.name}.png" alt="${detail.held_item.name}" class="evolution-item-sprite"> Holding ${this.capitalizeFirst(detail.held_item.name.replace('-', ' '))}`);
        }
        
        if (detail.time_of_day && detail.time_of_day !== '') {
            conditions.push(`During ${detail.time_of_day}`);
        }
        
        if (detail.known_move) {
            conditions.push(`Knows ${this.capitalizeFirst(detail.known_move.name.replace('-', ' '))}`);
        }
        
        if (detail.location) {
            conditions.push(`At ${this.capitalizeFirst(detail.location.name.replace('-', ' '))}`);
        }
        
        if (detail.needs_overworld_rain) {
            conditions.push('While raining');
        }
        
        if (detail.min_beauty) {
            conditions.push(`Beauty ${detail.min_beauty}+`);
        }
        
        if (detail.relative_physical_stats !== null) {
            const statRelation = detail.relative_physical_stats === 1 ? 'Attack > Defense' : 
                                detail.relative_physical_stats === 0 ? 'Attack = Defense' : 
                                'Attack < Defense';
            conditions.push(statRelation);
        }
        
        // Si no hay condiciones, significa que no evoluciona
        if (conditions.length === 0) {
            return 'No evolutions';
        }
        
        return conditions.join(' + ');
    }
}
