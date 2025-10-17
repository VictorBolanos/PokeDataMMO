// Pokédex - Pokemon Card Component
class PokemonCard {
    constructor(pokemonData, speciesData) {
        this.pokemon = pokemonData;
        this.species = speciesData;
        this.container = document.getElementById('pokemonCardContainer');
    }
    
    render() {
        console.log('🔍 Starting PokemonCard render for:', this.pokemon.name);
        console.log('🔍 Pokemon data:', this.pokemon);
        console.log('🔍 Species data:', this.species);
        
        try {
            console.log('🔍 Rendering HTML template');
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
            
            console.log('🔍 HTML rendered successfully');
            
            // Initialize components AFTER HTML is in DOM
            console.log('🔍 Initializing components...');
            this.initializeMoves();
            this.initializeEvolution();
            this.initializeTypeEffectiveness();
            
            console.log('🔍 All components initialized');
        } catch (error) {
            console.error('❌ Error in PokemonCard.render:', error);
            throw error;
        }
    }
    
    renderBasicInfoCard() {
        console.log('🔍 Rendering basic info card for:', this.pokemon.name);
        console.log('🔍 Pokemon types:', this.pokemon.types);
        console.log('🔍 Pokemon abilities:', this.pokemon.abilities);
        console.log('🔍 Species egg groups:', this.species.egg_groups);
        
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
                ${ability.is_hidden ? '<span class="hidden-badge">(Hidden)</span>' : ''}
            </div>
        `).join('');
        
        const eggGroups = this.species.egg_groups.map(group => `
            <span class="egg-group-badge">${this.capitalizeFirst(group.name.replace('-', ' '))}</span>
        `).join('');
        
        const heldItems = this.pokemon.held_items.map(item => `
            <span class="held-item-badge">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.item.name}.png" 
                     alt="${item.item.name}" 
                     class="item-sprite">
                ${this.capitalizeFirst(item.item.name.replace('-', ' '))}
            </span>
        `).join('');
        
        return `
            <div class="pokemon-card-section">
                <h3 class="section-title">📋 Basic Information</h3>
                
                <!-- Row 1: Image + Info -->
                <div class="basic-info-row">
                    <div class="pokemon-image-column">
                        <img src="${this.pokemon.sprites.other['official-artwork'].front_default || this.pokemon.sprites.front_default}" 
                             alt="${this.pokemon.name}" 
                             class="pokemon-main-sprite">
                    </div>
                    <div class="pokemon-info-column">
                        <h1 class="pokemon-name">${this.capitalizeFirst(this.pokemon.name)}</h1>
                        <div class="pokemon-id">#${this.pokemon.id.toString().padStart(3, '0')}</div>
                        
                        <div class="info-section">
                            <h4>Types</h4>
                            <div class="pokemon-types">${types}</div>
                        </div>
                        
                        <div class="info-section">
                            <h4>Generation</h4>
                            <div class="generation-badge">
                                <img src="img/res/gen-icons/${this.getGenerationIcon(generation)}" alt="${genName}">
                                <span>Gen ${generation} - ${genName}</span>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h4>Abilities</h4>
                            <div class="abilities-list">${abilities}</div>
                        </div>
                        
                        <div class="info-section">
                            <h4>Egg Groups</h4>
                            <div class="egg-groups">${eggGroups}</div>
                        </div>
                        
                        <div class="info-section">
                            <h4>Held Items</h4>
                            <div class="held-items">${heldItems || '<span class="no-held-items">No held items</span>'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Row 2: Description -->
                <div class="description-row">
                    <h4>Pokédex Entry</h4>
                    <p class="pokemon-description">${this.getEnglishDescription()}</p>
                </div>
                
                <!-- Row 3: Evolution Chain -->
                <div class="evolution-row">
                    <h4>Evolution Chain</h4>
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
    
    renderAbilities() {
        const abilities = this.pokemon.abilities.map(ability => `
            <div class="ability-item">
                <div class="ability-name">
                    ${this.capitalizeFirst(ability.ability.name.replace('-', ' '))}
                    ${ability.is_hidden ? '<span style="color: #dc2626; margin-left: 5px;">(Hidden)</span>' : ''}
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
        const description = this.getEnglishDescription();
        
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
        console.log('🔍 Rendering stats card for:', this.pokemon.name);
        console.log('🔍 Pokemon stats:', this.pokemon.stats);
        
        const stats = this.pokemon.stats.map(stat => {
            const percentage = (stat.base_stat / 255) * 100; // Max stat is 255
            const statName = this.getStatName(stat.stat.name);
            const statColor = this.getStatColor(stat.stat.name);
            
            console.log(`🔍 Stat: ${statName} = ${stat.base_stat} (${percentage.toFixed(1)}%)`);
            
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
        
        return `
            <div class="pokemon-card-section">
                <h3 class="section-title">📊 Base Stats</h3>
                <div class="stats-container">
                    <div class="stats-grid">${stats}</div>
                    <div class="stats-note">
                        <small>Base stats out of 255 maximum</small>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderMovesCard() {
        return `
            <div class="pokemon-card-section">
                <h3 class="section-title">⚔️ Moves (Generation V)</h3>
                <div class="moves-container">
                    <div class="moves-tabs">
                        <button class="move-tab active" data-move-type="level-up">Level Up</button>
                        <button class="move-tab" data-move-type="tm-hm">TM/HM</button>
                        <button class="move-tab" data-move-type="tutor">Tutor</button>
                        <button class="move-tab" data-move-type="egg">Egg Moves</button>
                    </div>
                    <div class="moves-content" id="movesContent">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                            Loading moves...
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTypeEffectivenessCard() {
        console.log('🔍 renderTypeEffectivenessCard() called');
        return `
            <div class="pokemon-card-section">
                <h3 class="section-title">🛡️ Type Effectiveness</h3>
                <div class="effectiveness-container">
                    <div class="effectiveness-grid" id="typeEffectiveness">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                            Loading type effectiveness...
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTypeEffectiveness(effectiveness) {
        console.log('🔍 renderTypeEffectiveness called with:', effectiveness);
        console.log('🔍 effectiveness type:', typeof effectiveness);
        console.log('🔍 effectiveness is null?', effectiveness === null);
        console.log('🔍 effectiveness is undefined?', effectiveness === undefined);
        
        const effectivenessContainer = document.getElementById('typeEffectiveness');
        console.log('🔍 effectivenessContainer found:', effectivenessContainer);
        
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
                <div class="effectiveness-type-box" data-type="${type}" data-multiplier="${multiplier}">
                    <img src="img/res/poke-types/box/type-${type}-box-icon.png" alt="${type}">
                </div>
            `).join('');
            
            return `
                <div class="effectiveness-category" data-multiplier="${multiplier}">
                    <div class="effectiveness-header">
                        <span class="effectiveness-multiplier">${multiplier}</span>
                        <span class="effectiveness-label">${this.getEffectivenessLabel(multiplier)}</span>
                        <span class="effectiveness-count">(${types.length})</span>
                    </div>
                    <div class="effectiveness-types-grid">${typesHTML}</div>
                </div>
            `;
        }).filter(html => html !== '').join('');
        
        console.log('🔍 effectivenessHTML generated:', effectivenessHTML);
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
        return moves.filter(move => move !== null);
    }
    
    renderMovesList(moves, type) {
        const movesContent = document.getElementById('movesContent');
        
        if (moves.length === 0) {
            movesContent.innerHTML = `
                <div class="text-center text-muted">
                    No ${type} moves found for this Pokémon.
                </div>
            `;
            return;
        }
        
        const movesHTML = moves.map(move => `
            <div class="move-item">
                <div class="move-row-1">
                    <span class="move-name">${this.capitalizeFirst(move.name.replace('-', ' '))}</span>
                    <div class="move-type">
                        <img src="img/res/poke-types/long/type-${move.type.name}-long-icon.png" alt="${move.type.name}">
                    </div>
                    <img src="img/res/atack-class-icons/${this.getDamageClassFileName(move.damage_class.name)}-class.gif" 
                         alt="${move.damage_class.name}" 
                         class="move-class">
                    <span class="move-power">${move.power || '-'}</span>
                    <span class="move-pp">PP: ${move.pp}</span>
                </div>
                <div class="move-row-2">
                    <span class="move-description">${this.getMoveDescription(move)}</span>
                </div>
            </div>
        `).join('');
        
        movesContent.innerHTML = `
            <div class="moves-list">${movesHTML}</div>
        `;
    }
    
    async initializeEvolution() {
        const evolutionContainer = document.getElementById('evolutionChain');
        
        try {
            console.log('🔍 Initializing evolution chain for:', this.species.name);
            console.log('🔍 Evolution chain URL:', this.species.evolution_chain.url);
            
            // Extract evolution chain ID from URL
            const evolutionChainId = this.extractEvolutionChainId(this.species.evolution_chain.url);
            console.log('🔍 Extracted evolution chain ID:', evolutionChainId);
            
            const evolutionChain = await PokemonAPI.getEvolutionChain(evolutionChainId);
            console.log('🔍 Evolution chain data:', evolutionChain);
            
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
        console.log('🔍 Building evolution for:', chain.species.name);
        console.log('🔍 Chain data:', chain);
        
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
            console.log('🔍 Next evolution:', nextEvolution.species.name);
            console.log('🔍 Evolution details:', nextEvolution.evolution_details);
            
            const evolutionDetail = nextEvolution.evolution_details && nextEvolution.evolution_details.length > 0 ? nextEvolution.evolution_details[0] : null;
            
            html += `<div class="evolution-arrow">
                <div class="evolution-condition">${this.formatEvolutionCondition(evolutionDetail)}</div>
            </div>`;
            html += this.buildEvolutionChainRecursive(nextEvolution);
        }
        
        return html;
    }
    
    async initializeTypeEffectiveness() {
        console.log('🔍 initializeTypeEffectiveness called');
        
        try {
            console.log('🔍 Initializing type effectiveness for Pokemon:', this.pokemon.name);
            console.log('🔍 Pokemon types:', this.pokemon.types);
            
            const pokemonStats = new PokemonStats(this.pokemon);
            const effectiveness = await pokemonStats.calculateTypeEffectiveness();
            
            console.log('🔍 Calculated effectiveness:', effectiveness);
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
        console.log('🔍 renderTypeEffectiveness called with:', effectiveness);
        console.log('🔍 effectiveness type:', typeof effectiveness);
        console.log('🔍 effectiveness is null?', effectiveness === null);
        console.log('🔍 effectiveness is undefined?', effectiveness === undefined);
        
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
                <div class="effectiveness-category">
                    <div class="effectiveness-title">
                        <span>${multiplier}</span>
                        <span>${this.getEffectivenessLabel(multiplier)}</span>
                    </div>
                    <div class="effectiveness-types">${typesHTML}</div>
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
        const names = {
            'hp': 'PS',
            'attack': 'Attack',
            'defense': 'Defense',
            'special-attack': 'Special Attack',
            'special-defense': 'Special Defense',
            'speed': 'Speed'
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
    
    getEnglishDescription() {
        const flavorTexts = this.species.flavor_text_entries;
        const englishEntry = flavorTexts.find(entry => entry.language.name === 'en');
        return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : 'No description available';
    }
    
    getMoveDescription(move) {
        const englishEffect = move.effect_entries.find(entry => entry.language.name === 'en');
        return englishEffect ? englishEffect.short_effect : 'No description available';
    }
    
    extractPokemonId(url) {
        const matches = url.match(/\/(\d+)\//);
        return matches ? matches[1] : '0';
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
