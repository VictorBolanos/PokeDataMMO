// PokeDataMMO - Damage Calculator
// Calculadora de daños Pokémon completa

// Inicializar estructura global ANTES de cualquier otra cosa
if (!window.damageCalcData) {
    window.damageCalcData = {
        pokemons: [
            { availableMoves: [], moves: [null, null, null, null], item: null },
            { availableMoves: [], moves: [null, null, null, null], item: null }
        ]
    };
}

class DamageCalculator {
    constructor() {
        this.currentPokemon1 = null;
        this.currentPokemon2 = null;
        this.selectedMove = null;
        this.typeChart = null;
        this.customDropdowns = null;
        this.isRestoring = false; // Flag para saber si estamos restaurando
        
        // Constantes de límites (igual que PVP Teams)
        this.MAX_EV_INDIVIDUAL = 252;
        this.MAX_EV_TOTAL = 510;
        this.MAX_IV = 31;
        
        this.init();
    }

    async init() {
        this.loadTypeChart();
        await this.waitForDependencies();
        this.setupEventListeners();
        this.setupGlobalMoveUpdateListener();
        await this.loadFromCache();
    }

    // Esperar a que todas las dependencias estén cargadas
    async waitForDependencies() {
        const maxAttempts = 50;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            if (window.pokemonDataLoader && window.pvpTeamData && window.customDropdowns) {
                // Usar la instancia global de customDropdowns del PVP Teams
                this.customDropdowns = window.customDropdowns;
                await this.loadNatures();
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.error('❌ Error: Dependencias no cargadas');
        console.error('Estado:', {
            pokemonDataLoader: !!window.pokemonDataLoader,
            pvpTeamData: !!window.pvpTeamData,
            customDropdowns: !!window.customDropdowns
        });
    }

    // Cargar naturalezas desde natures.js
    async loadNatures() {
        try {
            const natures = await window.pvpTeamData.loadNatures();
            this.populateNatureSelects(natures);
        } catch (error) {
            console.error('Error loading natures:', error);
        }
    }

    // Obtener nombre corto de stat para naturalezas
    getShortStatName(stat, isSpanish) {
        const statNames = {
            'attack': isSpanish ? 'Atq' : 'Atk',
            'defense': isSpanish ? 'Def' : 'Def',
            'special-attack': isSpanish ? 'At.Esp' : 'Sp.Atk',
            'special-defense': isSpanish ? 'Def.Esp' : 'Sp.Def',
            'speed': isSpanish ? 'Vel' : 'Spe'
        };
        return statNames[stat] || stat;
    }

    // Poblar selectores de naturalezas
    populateNatureSelects(natures) {
        const isSpanish = window.languageManager?.getCurrentLanguage() === 'es';
        
        [1, 2].forEach(pokemonNum => {
            const select = document.getElementById(`pokemon${pokemonNum}Nature`);
            if (select) {
                const currentValue = select.value; // Guardar selección actual
                
                select.innerHTML = `<option value="">${isSpanish ? 'Seleccionar...' : 'Select...'}</option>`;
                natures.forEach(nature => {
                    const option = document.createElement('option');
                    option.value = nature.name;
                    
                    // Crear display name con stats modificados
                    let displayText = nature.displayName;
                    if (nature.increased_stat && nature.decreased_stat) {
                        const increased = this.getShortStatName(nature.increased_stat, isSpanish);
                        const decreased = this.getShortStatName(nature.decreased_stat, isSpanish);
                        displayText = `${nature.displayName} (+${increased} -${decreased})`;
                    }
                    
                    option.textContent = displayText;
                    option.dataset.increased = nature.increased_stat || '';
                    option.dataset.decreased = nature.decreased_stat || '';
                    select.appendChild(option);
                });
                
                // Restaurar selección
                if (currentValue) select.value = currentValue;
            }
        });
    }
    
    // Actualizar selectores de naturalezas con nuevas traducciones
    async updateNatureSelects() {
        if (!window.pvpTeamData) return;
        
        // Actualizar traducciones de naturalezas
        window.pvpTeamData.updateNatureTranslations();
        
        // Re-cargar naturalezas con nuevas traducciones
        const natures = await window.pvpTeamData.loadNatures();
        this.populateNatureSelects(natures);
    }

    // Cargar tabla de tipos
    loadTypeChart() {
        this.typeChart = {
            'normal': { 'rock': 0.5, 'ghost': 0, 'steel': 0.5 },
            'fire': { 'fire': 0.5, 'water': 0.5, 'grass': 2, 'ice': 2, 'bug': 2, 'rock': 0.5, 'dragon': 0.5, 'steel': 2 },
            'water': { 'fire': 2, 'water': 0.5, 'grass': 0.5, 'ground': 2, 'rock': 2, 'dragon': 0.5 },
            'electric': { 'water': 2, 'electric': 0.5, 'grass': 0.5, 'ground': 0, 'flying': 2, 'dragon': 0.5 },
            'grass': { 'fire': 0.5, 'water': 2, 'grass': 0.5, 'poison': 0.5, 'flying': 0.5, 'bug': 0.5, 'rock': 2, 'ground': 2, 'steel': 0.5, 'dragon': 0.5 },
            'ice': { 'fire': 0.5, 'water': 0.5, 'grass': 2, 'ice': 0.5, 'ground': 2, 'flying': 2, 'dragon': 2, 'steel': 0.5 },
            'fighting': { 'normal': 2, 'ice': 2, 'poison': 0.5, 'flying': 0.5, 'psychic': 0.5, 'bug': 0.5, 'rock': 2, 'ghost': 0, 'dark': 2, 'steel': 2, 'fairy': 0.5 },
            'poison': { 'grass': 2, 'poison': 0.5, 'ground': 0.5, 'rock': 0.5, 'ghost': 0.5, 'steel': 0, 'fairy': 2 },
            'ground': { 'fire': 2, 'electric': 2, 'grass': 0.5, 'poison': 2, 'flying': 0, 'bug': 0.5, 'rock': 2, 'steel': 2 },
            'flying': { 'electric': 0.5, 'grass': 2, 'ice': 0.5, 'fighting': 2, 'bug': 2, 'rock': 0.5, 'steel': 0.5 },
            'psychic': { 'fighting': 2, 'poison': 2, 'psychic': 0.5, 'dark': 0, 'steel': 0.5 },
            'bug': { 'fire': 0.5, 'grass': 2, 'fighting': 0.5, 'poison': 0.5, 'flying': 0.5, 'psychic': 2, 'ghost': 0.5, 'dark': 2, 'steel': 0.5, 'fairy': 0.5 },
            'rock': { 'fire': 2, 'ice': 2, 'fighting': 0.5, 'ground': 0.5, 'flying': 2, 'bug': 2, 'steel': 0.5 },
            'ghost': { 'normal': 0, 'psychic': 2, 'ghost': 2, 'dark': 0.5 },
            'dragon': { 'dragon': 2, 'steel': 0.5, 'fairy': 0 },
            'dark': { 'fighting': 0.5, 'psychic': 2, 'ghost': 2, 'dark': 0.5, 'fairy': 0.5 },
            'steel': { 'fire': 0.5, 'water': 0.5, 'electric': 0.5, 'ice': 2, 'rock': 2, 'steel': 0.5, 'fairy': 2 },
            'fairy': { 'fire': 0.5, 'fighting': 2, 'poison': 0.5, 'dragon': 2, 'dark': 2, 'steel': 0.5 }
        };
    }

    // Configurar event listeners
    setupEventListeners() {
        // Pokémon search inputs
        document.getElementById('pokemon1Search')?.addEventListener('input', (e) => {
            this.handlePokemonSearch(e, 1);
        });
        
        document.getElementById('pokemon2Search')?.addEventListener('input', (e) => {
            this.handlePokemonSearch(e, 2);
        });

        // Nature selects
        document.getElementById('pokemon1Nature')?.addEventListener('change', () => {
            this.updateStats(1);
            this.saveToCache();
        });
        
        document.getElementById('pokemon2Nature')?.addEventListener('change', () => {
            this.updateStats(2);
            this.saveToCache();
        });
        
        // Ability selects
        document.getElementById('pokemon1Ability')?.addEventListener('change', () => {
            this.saveToCache();
        });
        
        document.getElementById('pokemon2Ability')?.addEventListener('change', () => {
            this.saveToCache();
        });

        // Stats inputs
        this.setupStatsListeners(1);
        this.setupStatsListeners(2);

        // HP sliders
        this.setupHpSliderListeners();

        // Move selection buttons
        this.setupMoveSelectionListeners();

        // Field effects
        this.setupFieldEffectListeners();

        // Weather, battle type, and rare space
        this.setupFieldConditionListeners();
    }

    // Configurar listeners para stats
    setupStatsListeners(pokemonNum) {
        const stats = ['Hp', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spe'];
        
        stats.forEach(stat => {
            const evInput = document.getElementById(`pokemon${pokemonNum}${stat}Ev`);
            const ivInput = document.getElementById(`pokemon${pokemonNum}${stat}Iv`);
            
            if (evInput) {
                evInput.addEventListener('input', (e) => this.handleEVChange(e, pokemonNum, stat));
            }
            if (ivInput) {
                ivInput.addEventListener('input', (e) => this.handleIVChange(e, pokemonNum, stat));
            }
        });

        // Level input
        const levelInput = document.getElementById(`pokemon${pokemonNum}Level`);
        if (levelInput) {
            levelInput.addEventListener('input', () => this.updateStats(pokemonNum));
        }
    }

    // Manejar cambio de EV con validación
    handleEVChange(event, pokemonNum, stat) {
        const input = event.target;
        let value = parseInt(input.value) || 0;

        // Validar límite individual (252)
        if (value > this.MAX_EV_INDIVIDUAL) {
            value = this.MAX_EV_INDIVIDUAL;
            input.value = value;
        }

        // Validar total de EVs (510)
        const totalEVs = this.getTotalEVs(pokemonNum);
        if (totalEVs > this.MAX_EV_TOTAL) {
            // Revertir cambio si excede el total
            const currentValue = parseInt(input.value) || 0;
            const excess = totalEVs - this.MAX_EV_TOTAL;
            const newValue = Math.max(0, currentValue - excess);
            input.value = newValue;
        }

        // Actualizar stats y total EVs
        this.updateStats(pokemonNum);
        this.updateEVTotal(pokemonNum);
        this.saveToCache();
    }

    // Manejar cambio de IV con validación
    handleIVChange(event, pokemonNum, stat) {
        const input = event.target;
        let value = parseInt(input.value) || 0;

        // Validar límite (31)
        if (value > this.MAX_IV) {
            value = this.MAX_IV;
            input.value = value;
        }

        // Actualizar stats
        this.updateStats(pokemonNum);
        this.saveToCache();
    }

    // Obtener total de EVs de un Pokémon
    getTotalEVs(pokemonNum) {
        const stats = ['Hp', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spe'];
        let total = 0;
        
        stats.forEach(stat => {
            const input = document.getElementById(`pokemon${pokemonNum}${stat}Ev`);
            if (input) {
                total += parseInt(input.value) || 0;
            }
        });
        
        return total;
    }

    // Actualizar display del total de EVs
    updateEVTotal(pokemonNum) {
        const totalElement = document.getElementById(`pokemon${pokemonNum}EvTotal`);
        if (totalElement) {
            const totalEVs = this.getTotalEVs(pokemonNum);
            totalElement.textContent = totalEVs;
            
            // Colorear si excede el límite
            if (totalEVs > this.MAX_EV_TOTAL) {
                totalElement.style.color = '#ef4444';
                totalElement.style.fontWeight = 'bold';
            } else {
                totalElement.style.color = '#22c55e';
                totalElement.style.fontWeight = 'normal';
            }
        }
    }

    // Configurar listeners para sliders de HP
    setupHpSliderListeners() {
        const hpSliders = ['pokemon1HpSlider', 'pokemon2HpSlider'];
        
        hpSliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    this.handleHpSliderChange(e, sliderId);
                });
            }
        });
    }

    // Configurar listeners para selección de movimientos
    setupMoveSelectionListeners() {
        const moveButtons = document.querySelectorAll('.move-selection-btn');
        
        moveButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMoveSelection(button);
            });
        });
        
        // Listeners para toggles de crítico
        for (let p = 1; p <= 2; p++) {
            for (let m = 1; m <= 4; m++) {
                const critToggle = document.getElementById(`crit${p}-${m}`);
                if (critToggle) {
                    critToggle.addEventListener('change', () => {
                        // Solo recalcular si este movimiento está seleccionado
                        if (this.selectedMove && 
                            this.selectedMove.pokemon === p.toString() && 
                            this.selectedMove.move === m.toString()) {
                            this.selectedMove.isCrit = critToggle.checked;
                            this.calculateDamage();
                        }
                    });
                }
            }
        }
    }

    // Configurar listeners para efectos de campo
    setupFieldEffectListeners() {
        const fieldButtons = document.querySelectorAll('.field-effect-btn');
        
        fieldButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                button.classList.toggle('active');
                this.calculateDamage();
            });
        });
    }

    // Configurar listeners para condiciones de campo
    setupFieldConditionListeners() {
        const weatherRadios = document.querySelectorAll('input[name="weather"]');
        const battleTypeRadios = document.querySelectorAll('input[name="battleType"]');
        const rareSpaceToggle = document.getElementById('rareSpaceToggle');
        
        weatherRadios.forEach(radio => {
            radio.addEventListener('change', () => this.calculateDamage());
        });
        
        battleTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.calculateDamage());
        });

        if (rareSpaceToggle) {
            rareSpaceToggle.addEventListener('change', () => this.calculateDamage());
        }
    }

    // Manejar búsqueda de Pokémon usando el sistema de PVP Teams
    async handlePokemonSearch(event, pokemonNum) {
        const query = event.target.value.toLowerCase();
        const dropdown = document.getElementById(`pokemon${pokemonNum}Dropdown`);
        
        if (query.length < 2) {
            dropdown.classList.remove('show');
            return;
        }

        try {
            const pokemonList = await this.getAllPokemonNames();
            const filteredPokemon = pokemonList.filter(pokemon => 
                pokemon.name.toLowerCase().includes(query) || 
                pokemon.id.toString().includes(query)
            );

            this.populateDropdown(dropdown, filteredPokemon.slice(0, 10), pokemonNum);
        } catch (error) {
            console.error('Error searching Pokémon:', error);
            dropdown.classList.remove('show');
        }
    }

    // Obtener lista de todos los Pokémon
    async getAllPokemonNames() {
        const cacheKey = 'damage_calc_pokemon_names_list';
        let cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const parsedCache = JSON.parse(cached);
            const hasRotomVariants = parsedCache.some(p => p.id >= 10008 && p.id <= 10012);
            if (hasRotomVariants) {
                return parsedCache;
            } else {
                localStorage.removeItem(cacheKey);
            }
        }
        
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=649');
            const data = await response.json();
            const pokemonList = data.results.map((pokemon, index) => ({
                id: index + 1,
                name: pokemon.name,
                url: pokemon.url
            }));
            
            const rotomVariants = [
                { id: 10008, name: 'Rotom', url: 'rotom-heat' },
                { id: 10009, name: 'Rotom', url: 'rotom-wash' },
                { id: 10010, name: 'Rotom', url: 'rotom-frost' },
                { id: 10011, name: 'Rotom', url: 'rotom-fan' },
                { id: 10012, name: 'Rotom', url: 'rotom-mow' }
            ];
            
            const allPokemon = [...pokemonList, ...rotomVariants];
            localStorage.setItem(cacheKey, JSON.stringify(allPokemon));
            return allPokemon;
        } catch (error) {
            console.error('Error fetching Pokémon list:', error);
            return [];
        }
    }

    // Poblar dropdown
    populateDropdown(dropdown, pokemonList, pokemonNum) {
        dropdown.innerHTML = '';
        
        pokemonList.forEach(pokemon => {
            const item = document.createElement('div');
            item.className = 'pokemon-dropdown-item';
            
            // Formatear nombre para variantes de Rotom
            let displayName = pokemon.name;
            if (pokemon.id >= 10008 && pokemon.id <= 10012) {
                const rotomForms = {
                    10008: 'Heat',
                    10009: 'Wash',
                    10010: 'Frost',
                    10011: 'Fan',
                    10012: 'Mow'
                };
                displayName = `Rotom [${rotomForms[pokemon.id]}]`;
            }
            
            item.textContent = displayName;
            item.addEventListener('click', () => {
                this.selectPokemon(pokemon, pokemonNum);
                dropdown.classList.remove('show');
            });
            dropdown.appendChild(item);
        });
        
        dropdown.classList.add('show');
    }

    // Seleccionar Pokémon
    async selectPokemon(pokemon, pokemonNum) {
        const searchInput = document.getElementById(`pokemon${pokemonNum}Search`);
        const sprite = document.getElementById(`pokemon${pokemonNum}Sprite`);
        
        searchInput.value = pokemon.name;
        
        try {
            const localData = window.pokemonDataLoader?.getPokemonData(pokemon.id);
            
            if (!localData) {
                console.error(`❌ No se encontró Pokémon #${pokemon.id}`);
                return;
            }
            
            const pokemonIdNum = parseInt(localData.id);
            // Usar artwork oficial (imagen artística) en lugar del sprite
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonIdNum}.png`;
            
            sprite.src = spriteUrl;
            sprite.alt = pokemon.name;
            sprite.style.opacity = '1';
            
            const baseStats = {
                'hp': localData.baseStats.hp,
                'attack': localData.baseStats.attack,
                'defense': localData.baseStats.defense,
                'special-attack': localData.baseStats.specialAttack,
                'special-defense': localData.baseStats.specialDefense,
                'speed': localData.baseStats.speed
            };
            
            const pokemonObj = {
                id: pokemonIdNum,
                name: pokemonIdNum >= 10008 && pokemonIdNum <= 10012 ? 'Rotom' : localData.name,
                sprite: spriteUrl,
                baseStats: baseStats,
                types: localData.types || ['normal'],
                abilities: localData.abilities || [],
                availableMoves: localData.moves || []
            };
            
            this.updateBaseStats(pokemonNum, baseStats);
            
            if (pokemonNum === 1) {
                this.currentPokemon1 = pokemonObj;
            } else {
                this.currentPokemon2 = pokemonObj;
            }
            
            // Poblar habilidades
            this.populateAbilities(pokemonNum, pokemonObj.abilities);
            
            // Inicializar dropdowns custom
            await this.initCustomDropdowns(pokemonNum, pokemonObj);
            
            this.updateStats(pokemonNum);
            this.calculateDamage();
            
            // Solo guardar si NO estamos restaurando
            if (!this.isRestoring) {
                this.saveToCache();
            }
            
        } catch (error) {
            console.error('Error selecting Pokémon:', error);
        }
    }

    // Poblar selector de habilidades
    populateAbilities(pokemonNum, abilities) {
        const isSpanish = window.languageManager?.getCurrentLanguage() === 'es';
        const select = document.getElementById(`pokemon${pokemonNum}Ability`);
        
        if (select) {
            const currentValue = select.value; // Guardar selección actual
            
            select.innerHTML = `<option value="">${isSpanish ? 'Seleccionar...' : 'Select...'}</option>`;
            
            abilities.forEach(abilityObj => {
                const option = document.createElement('option');
                option.value = abilityObj.name;
                
                // Buscar traducción de la habilidad
                if (typeof abilitiesData !== 'undefined') {
                    const abilityData = abilitiesData.find(a => 
                        a.EnglishName.toLowerCase() === abilityObj.name.toLowerCase()
                    );
                    option.textContent = isSpanish && abilityData 
                        ? abilityData.SpanishName 
                        : abilityObj.name;
                } else {
                    option.textContent = abilityObj.name;
                }
                
                select.appendChild(option);
            });
            
            // Restaurar selección
            if (currentValue) select.value = currentValue;
        }
    }
    
    // Actualizar habilidades de ambos Pokémon con nuevas traducciones
    updateAbilitySelects() {
        if (this.currentPokemon1) {
            this.populateAbilities(1, this.currentPokemon1.abilities);
        }
        if (this.currentPokemon2) {
            this.populateAbilities(2, this.currentPokemon2.abilities);
        }
    }

    // Inicializar dropdowns custom (objetos y movimientos)
    async initCustomDropdowns(pokemonNum, pokemon) {
        const slotIndex = pokemonNum - 1;
        
        // GUARDAR valores existentes
        const existingMoves = window.damageCalcData.pokemons[slotIndex].moves || [null, null, null, null];
        const existingItem = window.damageCalcData.pokemons[slotIndex].item || null;
        
        // Actualizar datos del Pokémon en la estructura global
        window.damageCalcData.pokemons[slotIndex].availableMoves = pokemon.availableMoves || [];
        
        // RESTAURAR valores existentes (no resetear)
        window.damageCalcData.pokemons[slotIndex].moves = [...existingMoves];
        window.damageCalcData.pokemons[slotIndex].item = existingItem;

        // Dropdown de objetos
        const itemContainer = document.getElementById(`pokemon${pokemonNum}ItemContainer`);
        if (itemContainer) {
            itemContainer.innerHTML = this.customDropdowns.renderItemSelect(slotIndex);
            await this.customDropdowns.initItemSelect(slotIndex);
        }

        // Dropdowns de movimientos
        const movesContainer = document.getElementById(`pokemon${pokemonNum}MovesContainer`);
        if (movesContainer) {
            movesContainer.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const moveSlot = document.createElement('div');
                moveSlot.className = 'move-slot-custom';
                moveSlot.innerHTML = this.customDropdowns.renderMoveSelect(slotIndex, i);
                movesContainer.appendChild(moveSlot);
            }

            // Inicializar cada dropdown de movimiento
            for (let i = 0; i < 4; i++) {
                await this.customDropdowns.initMoveSelect(slotIndex, i);
            }
        }
        
    }
    
    // Configurar listener GLOBAL para actualizar movimientos en el panel central
    setupGlobalMoveUpdateListener() {
        // Escuchar eventos de cambio de movimiento
        window.addEventListener('damageCalcMoveChanged', (event) => {
            const { pokemonNum, moveNum, moveId } = event.detail;
            this.updateMoveSelectionButton(pokemonNum, moveNum, moveId);
            this.saveToCache();
        });
        
        // Escuchar eventos de cambio de item
        window.addEventListener('damageCalcItemChanged', (event) => {
            this.saveToCache();
        });
    }
    
    // Actualizar botón de selección de movimiento en el panel central
    updateMoveSelectionButton(pokemonNum, moveNum, moveId) {
        const button = document.querySelector(`.move-selection-btn[data-pokemon="${pokemonNum}"][data-move="${moveNum}"]`);
        if (!button) return;
        
        const moveNameSpan = button.querySelector('.move-name');
        if (!moveNameSpan) return;
        
        const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
        const noMoveText = currentLang === 'es' ? '(Sin movimiento)' : '(No move)';
        
        if (moveId && window.pokemonDataLoader?.movesCache) {
            const move = window.pokemonDataLoader.movesCache.find(m => m.id == moveId);
            if (move) {
                const displayName = currentLang === 'es' ? move.spanishName : move.name;
                moveNameSpan.textContent = displayName;
            } else {
                moveNameSpan.textContent = noMoveText;
            }
        } else {
            moveNameSpan.textContent = noMoveText;
        }
    }

    // Convertir nombre de stat a key de API
    getStatKey(stat) {
        const statMap = {
            'Hp': 'hp',
            'Atk': 'attack',
            'Def': 'defense',
            'SpAtk': 'special-attack',
            'SpDef': 'special-defense',
            'Spe': 'speed'
        };
        return statMap[stat] || stat.toLowerCase();
    }

    // Actualizar stats base
    updateBaseStats(pokemonNum, baseStats) {
        const stats = ['Hp', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spe'];
        
        stats.forEach(stat => {
            const baseElement = document.getElementById(`pokemon${pokemonNum}${stat}Base`);
            if (baseElement) {
                baseElement.textContent = baseStats[this.getStatKey(stat)];
            }
        });
    }

    // Actualizar stats calculados con naturaleza
    updateStats(pokemonNum) {
        const stats = ['Hp', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spe'];
        let totalEvs = 0;
        
        const level = parseInt(document.getElementById(`pokemon${pokemonNum}Level`).value) || 100;
        const natureSelect = document.getElementById(`pokemon${pokemonNum}Nature`);
        const selectedNature = natureSelect?.value;
        
        // Obtener modificadores de naturaleza
        let natureModifiers = {
            'hp': 1.0,
            'attack': 1.0,
            'defense': 1.0,
            'special-attack': 1.0,
            'special-defense': 1.0,
            'speed': 1.0
        };
        
        if (selectedNature && natureSelect) {
            const selectedOption = natureSelect.options[natureSelect.selectedIndex];
            const increased = selectedOption?.dataset.increased;
            const decreased = selectedOption?.dataset.decreased;
            
            if (increased) natureModifiers[increased] = 1.1;
            if (decreased) natureModifiers[decreased] = 0.9;
        }
        
        stats.forEach(stat => {
            const base = parseInt(document.getElementById(`pokemon${pokemonNum}${stat}Base`).textContent);
            const evs = parseInt(document.getElementById(`pokemon${pokemonNum}${stat}Ev`).value) || 0;
            const ivs = parseInt(document.getElementById(`pokemon${pokemonNum}${stat}Iv`).value) || 31;
            const statKey = this.getStatKey(stat);
            
            let finalStat;
            if (stat === 'Hp') {
                finalStat = Math.floor(((2 * base + ivs + Math.floor(evs / 4)) * level / 100) + level + 10);
            } else {
                const baseStat = Math.floor(((2 * base + ivs + Math.floor(evs / 4)) * level / 100) + 5);
                finalStat = Math.floor(baseStat * natureModifiers[statKey]);
            }
            
            document.getElementById(`pokemon${pokemonNum}${stat}Final`).textContent = finalStat;
            totalEvs += evs;
        });
        
        // Actualizar total EVs con coloreado
        this.updateEVTotal(pokemonNum);
        
        // Actualizar HP máximo y slider
        const maxHp = parseInt(document.getElementById(`pokemon${pokemonNum}HpFinal`).textContent);
        const slider = document.getElementById(`pokemon${pokemonNum}HpSlider`);
        slider.max = maxHp;
        
        // SIEMPRE actualizar a vida llena cuando cambian los stats
        slider.value = maxHp;
        this.updateHpBar(pokemonNum, maxHp, maxHp);
        
        this.calculateDamage();
        
        // Solo guardar si NO estamos restaurando
        if (!this.isRestoring) {
            this.saveToCache();
        }
    }

    // Manejar cambio en slider de HP
    handleHpSliderChange(event, sliderId) {
        const pokemonNum = sliderId.includes('1') ? 1 : 2;
        const currentHp = parseInt(event.target.value);
        const maxHp = parseInt(document.getElementById(`pokemon${pokemonNum}HpFinal`).textContent);
        
        this.updateHpBar(pokemonNum, currentHp, maxHp);
    }

    // Actualizar barra de HP
    updateHpBar(pokemonNum, currentHp, maxHp) {
        const fill = document.getElementById(`pokemon${pokemonNum}HpFill`);
        const text = document.getElementById(`pokemon${pokemonNum}HpText`);
        
        const percentage = (currentHp / maxHp) * 100;
        
        fill.style.width = `${percentage}%`;
        text.textContent = `${currentHp} / ${maxHp} (${percentage.toFixed(1)}%)`;
        
        this.calculateDamage();
    }

    // Manejar selección de movimiento
    handleMoveSelection(button) {
        document.querySelectorAll('.move-selection-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        button.classList.add('active');
        
        const pokemonNum = button.dataset.pokemon;
        const moveNum = button.dataset.move;
        
        // Obtener el estado del toggle de crit
        const critToggle = document.getElementById(`crit${pokemonNum}-${moveNum}`);
        
        this.selectedMove = {
            pokemon: pokemonNum,
            move: moveNum,
            isCrit: critToggle?.checked || false
        };
        
        this.calculateDamage();
    }

    // Cargar desde caché o iniciar vacío
    async loadFromCache() {
        try {
            const cached = localStorage.getItem('damageCalculatorState');
            if (cached) {
                const state = JSON.parse(cached);
                
                // ACTIVAR FLAG DE RESTAURACIÓN
                this.isRestoring = true;
                
                // RESTAURAR POKÉMON 1 PRIMERO (SECUENCIAL, NO PARALELO)
                if (state.pokemon1) {
                    await this.selectPokemon({ id: state.pokemon1.id, name: state.pokemon1.name }, 1);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await this.restoreFullPokemonState(1, state.pokemon1);
                }
                
                // RESTAURAR POKÉMON 2 DESPUÉS (SECUENCIAL)
                if (state.pokemon2) {
                    await this.selectPokemon({ id: state.pokemon2.id, name: state.pokemon2.name }, 2);
                    await new Promise(resolve => setTimeout(resolve, 300));
                    await this.restoreFullPokemonState(2, state.pokemon2);
                }
                
                // DESACTIVAR FLAG DE RESTAURACIÓN
                this.isRestoring = false;
                
                // GUARDAR UNA VEZ AL FINAL para confirmar
                this.saveToCache();
            }
        } catch (error) {
            console.error('❌ Error loading from cache:', error);
            this.isRestoring = false;
        }
    }
    
    // Restaurar estado completo de un Pokémon
    async restoreFullPokemonState(pokemonNum, pokemonData) {
        const slotIndex = pokemonNum - 1;
        
        // Restaurar naturaleza
        if (pokemonData.nature) {
            const natureSelect = document.getElementById(`pokemon${pokemonNum}Nature`);
            if (natureSelect) natureSelect.value = pokemonData.nature;
        }
        
        // Restaurar habilidad
        if (pokemonData.ability) {
            const abilitySelect = document.getElementById(`pokemon${pokemonNum}Ability`);
            if (abilitySelect) abilitySelect.value = pokemonData.ability;
        }
        
        // Restaurar nivel
        if (pokemonData.level) {
            const levelInput = document.getElementById(`pokemon${pokemonNum}Level`);
            if (levelInput) levelInput.value = pokemonData.level;
        }
        
        // Restaurar EVs e IVs
        this.restoreStatsValues(pokemonNum, pokemonData);
        
        // Restaurar movimientos
        if (pokemonData.moves) {
            window.damageCalcData.pokemons[slotIndex].moves = [...pokemonData.moves];
            
            // Actualizar UI de movimientos en panel central Y dropdowns
            for (let index = 0; index < pokemonData.moves.length; index++) {
                const moveId = pokemonData.moves[index];
                if (moveId) {
                    this.updateMoveSelectionButton(pokemonNum, index + 1, moveId);
                    await this.updateMoveDropdown(slotIndex, index, moveId);
                }
            }
        }
        
        // Restaurar objeto
        if (pokemonData.item) {
            window.damageCalcData.pokemons[slotIndex].item = pokemonData.item;
            await this.updateItemDropdown(slotIndex, pokemonData.item);
        }
    }
    
    // Restaurar valores de stats (EVs e IVs)
    restoreStatsValues(pokemonNum, pokemonData) {
        const stats = ['Hp', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spe'];
        
        stats.forEach(stat => {
            if (pokemonData.evs && pokemonData.evs[stat] !== undefined) {
                const evInput = document.getElementById(`pokemon${pokemonNum}${stat}Ev`);
                if (evInput) evInput.value = pokemonData.evs[stat];
            }
            
            if (pokemonData.ivs && pokemonData.ivs[stat] !== undefined) {
                const ivInput = document.getElementById(`pokemon${pokemonNum}${stat}Iv`);
                if (ivInput) ivInput.value = pokemonData.ivs[stat];
            }
        });
        
        // Recalcular stats
        this.updateStats(pokemonNum);
    }
    
    // Guardar estado actual en caché
    saveToCache() {
        try {
            const state = {
                pokemon1: this.currentPokemon1 ? {
                    id: this.currentPokemon1.id,
                    name: this.currentPokemon1.name,
                    nature: document.getElementById('pokemon1Nature')?.value,
                    ability: document.getElementById('pokemon1Ability')?.value,
                    level: document.getElementById('pokemon1Level')?.value,
                    evs: this.getStatsValues(1, 'Ev'),
                    ivs: this.getStatsValues(1, 'Iv'),
                    moves: window.damageCalcData?.pokemons?.[0]?.moves || [null, null, null, null],
                    item: window.damageCalcData?.pokemons?.[0]?.item || null
                } : null,
                pokemon2: this.currentPokemon2 ? {
                    id: this.currentPokemon2.id,
                    name: this.currentPokemon2.name,
                    nature: document.getElementById('pokemon2Nature')?.value,
                    ability: document.getElementById('pokemon2Ability')?.value,
                    level: document.getElementById('pokemon2Level')?.value,
                    evs: this.getStatsValues(2, 'Ev'),
                    ivs: this.getStatsValues(2, 'Iv'),
                    moves: window.damageCalcData?.pokemons?.[1]?.moves || [null, null, null, null],
                    item: window.damageCalcData?.pokemons?.[1]?.item || null
                } : null
            };
            
            localStorage.setItem('damageCalculatorState', JSON.stringify(state));
        } catch (error) {
            console.error('❌ Error saving to cache:', error);
        }
    }
    
    // Obtener valores de stats (EVs o IVs)
    getStatsValues(pokemonNum, type) {
        const stats = ['Hp', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spe'];
        const values = {};
        
        stats.forEach(stat => {
            const input = document.getElementById(`pokemon${pokemonNum}${stat}${type}`);
            values[stat] = input ? parseInt(input.value) || 0 : 0;
        });
        
        return values;
    }

    // Calcular daño
    calculateDamage() {
        const isSpanish = window.languageManager?.getCurrentLanguage() === 'es';
        
        if (!this.selectedMove) {
            this.updateDamageResult(isSpanish 
                ? 'Selecciona un movimiento para ver los resultados del daño' 
                : 'Select a move to see damage results');
            return;
        }

        const attacker = this.selectedMove.pokemon === '1' ? this.currentPokemon1 : this.currentPokemon2;
        const defender = this.selectedMove.pokemon === '1' ? this.currentPokemon2 : this.currentPokemon1;
        
        if (!attacker || !defender) {
            this.updateDamageResult(isSpanish 
                ? 'Error: Pokémon no encontrado' 
                : 'Error: Pokémon not found');
            return;
        }

        const moveData = this.getMoveData(this.selectedMove.move);
        if (!moveData) {
            this.updateDamageResult(isSpanish 
                ? 'Error: Movimiento no encontrado' 
                : 'Error: Move not found');
            return;
        }

        const attackerLevel = parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon}Level`).value) || 100;
        const defenderPokemonNum = this.selectedMove.pokemon === '1' ? '2' : '1';
        
        const attackStat = moveData.category === 'physical' ? 
            parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon}AtkFinal`).textContent) :
            parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon}SpAtkFinal`).textContent);
            
        const defenseStat = moveData.category === 'physical' ?
            parseInt(document.getElementById(`pokemon${defenderPokemonNum}DefFinal`).textContent) :
            parseInt(document.getElementById(`pokemon${defenderPokemonNum}SpDefFinal`).textContent);

        const baseDamage = this.calculateBaseDamage(attackerLevel, moveData.power, attackStat, defenseStat);
        const modifiers = this.calculateModifiers(attacker, defender, moveData);
        const finalDamage = Math.floor(baseDamage * modifiers);

        const minDamage = Math.floor(finalDamage * 0.85);
        const maxDamage = finalDamage;

        const defenderHp = parseInt(document.getElementById(`pokemon${defenderPokemonNum}HpFinal`).textContent);
        const minPercentage = ((minDamage / defenderHp) * 100).toFixed(1);
        const maxPercentage = ((maxDamage / defenderHp) * 100).toFixed(1);

        const result = this.formatDamageResult(
            attacker.name,
            defender.name,
            moveData.name,
            minDamage,
            maxDamage,
            minPercentage,
            maxPercentage,
            attackerLevel,
            attackStat,
            moveData.category
        );

        this.updateDamageResult(result);
    }

    calculateBaseDamage(level, power, attack, defense) {
        if (power === 0) return 0;
        const base = Math.floor((2 * level + 10) / 250);
        const damage = Math.floor(base * power * attack / defense) + 2;
        return damage;
    }

    calculateModifiers(attacker, defender, moveData) {
        let modifier = 1;

        if (attacker.types && attacker.types.includes(moveData.type)) {
            modifier *= 1.5;
        }

        const effectiveness = this.getTypeEffectiveness(moveData.type, defender.types);
        modifier *= effectiveness;

        if (this.selectedMove.isCrit) {
            modifier *= 1.5;
        }

        const weather = document.querySelector('input[name="weather"]:checked')?.value;
        if (weather === 'sun' && moveData.type === 'fire') {
            modifier *= 1.5;
        } else if (weather === 'sun' && moveData.type === 'water') {
            modifier *= 0.5;
        } else if (weather === 'rain' && moveData.type === 'water') {
            modifier *= 1.5;
        } else if (weather === 'rain' && moveData.type === 'fire') {
            modifier *= 0.5;
        }

        const rareSpaceToggle = document.getElementById('rareSpaceToggle');
        if (rareSpaceToggle?.checked) {
            modifier *= 1.0;
        }

        const fieldEffects = this.getActiveFieldEffects();
        if (fieldEffects.reflect && moveData.category === 'physical') {
            modifier *= 0.5;
        }
        if (fieldEffects.lightScreen && moveData.category === 'special') {
            modifier *= 0.5;
        }

        return modifier;
    }

    getTypeEffectiveness(attackType, defenseTypes) {
        let effectiveness = 1;
        if (!defenseTypes || !Array.isArray(defenseTypes)) return effectiveness;
        
        defenseTypes.forEach(defenseType => {
            const multiplier = this.typeChart[attackType]?.[defenseType] || 1;
            effectiveness *= multiplier;
        });
        
        return effectiveness;
    }

    getActiveFieldEffects() {
        const effects = {
            reflect: false,
            lightScreen: false
        };

        document.querySelectorAll('.field-effect-btn.active').forEach(button => {
            const effect = button.dataset.effect;
            if (effect === 'reflect') effects.reflect = true;
            if (effect === 'light-screen') effects.lightScreen = true;
        });

        return effects;
    }

    getMoveData(moveNum) {
        const slotIndex = parseInt(this.selectedMove.pokemon) - 1;
        const moveIndex = parseInt(moveNum) - 1;
        const moveId = window.damageCalcData?.pokemons?.[slotIndex]?.moves?.[moveIndex];
        
        if (!moveId || !window.pokemonDataLoader?.movesCache) {
            return null;
        }
        
        const move = window.pokemonDataLoader.movesCache.find(m => m.id == moveId);
        if (!move) return null;
        
        return {
            name: move.spanishName || move.name,
            type: move.type || 'normal',
            category: move.damageClass || 'physical',
            power: move.power || 0
        };
    }

    formatDamageResult(attacker, defender, move, minDmg, maxDmg, minPct, maxPct, attLevel, attStat, category) {
        const statName = category === 'physical' ? 'Atk' : 'SpA';
        const defStatName = category === 'physical' ? 'Def' : 'SpD';
        
        return `Lv. ${attLevel} ${attStat} ${statName} ${attacker} ${move} vs. 0 ${defStatName} ${defender}: ${minDmg}-${maxDmg} (${minPct} - ${maxPct}%) -- ${this.getDamageDescription(parseFloat(minPct), parseFloat(maxPct))}`;
    }

    getDamageDescription(minPct, maxPct) {
        if (maxPct >= 100) return 'guaranteed OHKO';
        if (minPct >= 100) return 'OHKO';
        if (maxPct >= 75) return 'possible OHKO';
        if (minPct >= 50) return 'guaranteed 2HKO';
        if (maxPct >= 50) return 'possible 2HKO';
        if (minPct >= 33.4) return 'guaranteed 3HKO';
        if (minPct >= 25) return 'guaranteed 4HKO';
        return 'minimal damage';
    }

    updateDamageResult(result) {
        const resultContent = document.getElementById('damageResultContent');
        if (resultContent) {
            resultContent.innerHTML = `<pre style="margin: 0; font-family: 'Courier New', monospace; font-size: 0.875rem;">${result}</pre>`;
        }
    }

    // Actualizar traducciones cuando se cambia el idioma
    updateTranslations() {
        const lm = window.languageManager;
        if (!lm) return;
        
        const isSpanish = lm.getCurrentLanguage() === 'es';
        
        // Actualizar labels de búsqueda de Pokémon
        const search1 = document.getElementById('pokemon1Search');
        const search2 = document.getElementById('pokemon2Search');
        if (search1) search1.placeholder = isSpanish ? 'Buscar Pokémon...' : 'Search Pokémon...';
        if (search2) search2.placeholder = isSpanish ? 'Buscar Pokémon...' : 'Search Pokémon...';
        
        // Actualizar labels de nivel
        const levelLabels = document.querySelectorAll('.pokemon-level .form-label');
        levelLabels.forEach(label => {
            label.textContent = isSpanish ? 'Nivel' : 'Level';
        });
        
        // Actualizar labels de vida actual
        const hpLabels = document.querySelectorAll('.pokemon-hp-bar .form-label');
        hpLabels.forEach(label => {
            label.textContent = isSpanish ? 'Vida Actual' : 'Current HP';
        });
        
        // Actualizar headers de tabla de stats
        const statsHeaders = document.querySelectorAll('.pokemon-stats-table th');
        if (statsHeaders.length >= 5) {
            statsHeaders[0].textContent = 'Stat';
            statsHeaders[1].textContent = 'Base';
            statsHeaders[2].textContent = 'EVs';
            statsHeaders[3].textContent = 'IVs';
            statsHeaders[4].textContent = isSpanish ? 'Final' : 'Final';
        }
        
        // Actualizar nombres de stats en las tablas
        this.updateStatsTableLabels(1, isSpanish);
        this.updateStatsTableLabels(2, isSpanish);
        
        // Actualizar labels de naturaleza, habilidad y objeto
        const natureLabels = document.querySelectorAll('.pokemon-details .form-label');
        if (natureLabels[0]) natureLabels[0].textContent = isSpanish ? 'Naturaleza' : 'Nature';
        if (natureLabels[1]) natureLabels[1].textContent = isSpanish ? 'Habilidad' : 'Ability';
        if (natureLabels[2]) natureLabels[2].textContent = isSpanish ? 'Objeto' : 'Item';
        
        // Actualizar opciones de naturaleza (re-cargar con traducciones actualizadas)
        this.updateNatureSelects();
        
        // Actualizar habilidades con traducciones
        this.updateAbilitySelects();
        
        // Actualizar label de movimientos
        const movesLabels = document.querySelectorAll('.pokemon-moves .form-label');
        movesLabels.forEach(label => {
            label.textContent = isSpanish ? 'Movimientos' : 'Moves';
        });
        
        // Actualizar campo central
        this.updateFieldConditionsLabels(isSpanish);
        
        // Actualizar nombres de movimientos en panel central
        this.refreshMoveSelectionButtons();
        
        // Actualizar resultado de daño si existe
        if (this.selectedMove) {
            this.calculateDamage();
        }
    }
    
    // Actualizar labels de stats en tabla
    updateStatsTableLabels(pokemonNum, isSpanish) {
        const statNames = isSpanish 
            ? ['PS', 'ATAQUE', 'DEFENSA', 'AT. ESP.', 'DEF. ESP.', 'VELOCIDAD']
            : ['HP', 'ATTACK', 'DEFENSE', 'SP. ATK', 'SP. DEF', 'SPEED'];
        
        const rows = document.querySelectorAll(`#pokemon${pokemonNum}HpBase`).length > 0 
            ? document.querySelectorAll(`.pokemon-panel:nth-child(${pokemonNum === 1 ? 1 : 3}) .pokemon-stats-table tbody tr`)
            : [];
        
        rows.forEach((row, index) => {
            const firstCell = row.querySelector('td:first-child');
            if (firstCell && statNames[index]) {
                firstCell.textContent = statNames[index];
            }
        });
        
        // Actualizar total de EVs
        const evTotalLabel = document.querySelector(`#pokemon${pokemonNum}EvTotal`)?.parentElement;
        if (evTotalLabel) {
            const totalValue = document.getElementById(`pokemon${pokemonNum}EvTotal`).textContent;
            evTotalLabel.innerHTML = isSpanish 
                ? `Total EVs: <span id="pokemon${pokemonNum}EvTotal">${totalValue}</span> / 510`
                : `Total EVs: <span id="pokemon${pokemonNum}EvTotal">${totalValue}</span> / 510`;
        }
    }
    
    // Actualizar labels del campo de batalla
    updateFieldConditionsLabels(isSpanish) {
        // Título del panel
        const fieldTitle = document.querySelector('.field-title');
        if (fieldTitle) {
            fieldTitle.textContent = isSpanish ? 'Estado del Campo' : 'Field Conditions';
        }
        
        // Tipo de combate
        const battleTypeLabel = document.querySelector('.field-section:nth-child(1) .form-label');
        if (battleTypeLabel) {
            battleTypeLabel.textContent = isSpanish ? 'Tipo de Combate' : 'Battle Type';
        }
        
        const battleTypeButtons = [
            { id: 'singles', es: 'Individual', en: 'Singles' },
            { id: 'doubles', es: 'Doble', en: 'Doubles' },
            { id: 'triples', es: 'Triple', en: 'Triples' }
        ];
        
        battleTypeButtons.forEach(btn => {
            const label = document.querySelector(`label[for="${btn.id}"]`);
            if (label) label.textContent = isSpanish ? btn.es : btn.en;
        });
        
        // Meteorología
        const weatherLabel = document.querySelector('.field-section:nth-child(2) .form-label');
        if (weatherLabel) {
            weatherLabel.textContent = isSpanish ? 'Meteorología' : 'Weather';
        }
        
        const weatherButtons = [
            { id: 'weather-none', es: 'Ninguno', en: 'None' },
            { id: 'weather-sun', es: 'Sol', en: 'Sun' },
            { id: 'weather-rain', es: 'Lluvia', en: 'Rain' },
            { id: 'weather-sandstorm', es: 'Tormenta Arena', en: 'Sandstorm' },
            { id: 'weather-hail', es: 'Granizo', en: 'Hail' }
        ];
        
        weatherButtons.forEach(btn => {
            const label = document.querySelector(`label[for="${btn.id}"]`);
            if (label) label.textContent = isSpanish ? btn.es : btn.en;
        });
        
        // Espacio Raro
        const rareSpaceLabel = document.querySelector('.field-section:nth-child(3) .form-label');
        if (rareSpaceLabel) {
            rareSpaceLabel.textContent = isSpanish ? 'Espacio Raro' : 'Trick Room';
        }
        
        const rareSpaceToggle = document.querySelector('label[for="rareSpaceToggle"]');
        if (rareSpaceToggle) {
            rareSpaceToggle.textContent = isSpanish ? 'Espacio Raro' : 'Trick Room';
        }
        
        // Estados de campo
        const fieldEffectsLabel = document.querySelector('.field-section:nth-child(4) .form-label');
        if (fieldEffectsLabel) {
            fieldEffectsLabel.textContent = isSpanish ? 'Estados de Campo' : 'Field Effects';
        }
        
        // Títulos de efectos por lado
        const leftTitle = document.querySelector('.field-effects-left .field-effects-title');
        const rightTitle = document.querySelector('.field-effects-right .field-effects-title');
        if (leftTitle) leftTitle.textContent = isSpanish ? 'Pokémon 1' : 'Pokémon 1';
        if (rightTitle) rightTitle.textContent = isSpanish ? 'Pokémon 2' : 'Pokémon 2';
        
        // Traducir botones de efectos de campo
        const fieldEffectTranslations = {
            'helping-hand': { es: 'Refuerzo', en: 'Helping Hand' },
            'reflect': { es: 'Reflejo', en: 'Reflect' },
            'light-screen': { es: 'Pantalla Luz', en: 'Light Screen' },
            'tailwind': { es: 'Viento Afín', en: 'Tailwind' },
            'sea-of-fire': { es: 'Mar de Fuego', en: 'Sea of Fire' },
            'swamp': { es: 'Pantano', en: 'Swamp' },
            'friend-guard': { es: 'Compiescolta', en: 'Friend Guard' },
            'stealth-rock': { es: 'Trampa Rocas', en: 'Stealth Rock' }
        };
        
        document.querySelectorAll('.field-effect-btn').forEach(btn => {
            const effect = btn.dataset.effect;
            if (fieldEffectTranslations[effect]) {
                btn.textContent = isSpanish 
                    ? fieldEffectTranslations[effect].es 
                    : fieldEffectTranslations[effect].en;
            }
        });
        
        // Traducir labels de Spikes
        const spikesLabels = document.querySelectorAll('.spikes-selector .form-label');
        spikesLabels.forEach(label => {
            label.textContent = isSpanish ? 'Púas' : 'Spikes';
        });
        
        // Movimientos seleccionados
        const movesSelectionLabel = document.querySelector('.field-section:last-child .form-label');
        if (movesSelectionLabel) {
            movesSelectionLabel.textContent = isSpanish ? 'Movimientos Seleccionados' : 'Selected Moves';
        }
        
        const leftMovesTitle = document.querySelector('.moves-selection-left .moves-selection-title');
        const rightMovesTitle = document.querySelector('.moves-selection-right .moves-selection-title');
        if (leftMovesTitle) leftMovesTitle.textContent = isSpanish ? 'Pokémon 1' : 'Pokémon 1';
        if (rightMovesTitle) rightMovesTitle.textContent = isSpanish ? 'Pokémon 2' : 'Pokémon 2';
        
        // Resultado de daño
        const resultHeader = document.querySelector('.damage-result-header h5');
        if (resultHeader) {
            resultHeader.textContent = isSpanish ? 'Resultado del Daño' : 'Damage Result';
        }
    }
    
    // Refrescar botones de movimientos con nombres traducidos
    refreshMoveSelectionButtons() {
        if (!window.damageCalcData) return;
        
        for (let p = 0; p < 2; p++) {
            const pokemonData = window.damageCalcData.pokemons[p];
            if (!pokemonData) continue;
            
            for (let m = 0; m < 4; m++) {
                const moveId = pokemonData.moves[m];
                if (moveId) {
                    this.updateMoveSelectionButton(p + 1, m + 1, moveId);
                }
            }
        }
    }
    
    // Actualizar dropdown de item visualmente
    async updateItemDropdown(slotIndex, itemName) {
        // Verificar que el dropdown existe antes de actualizar (retry rápido)
        let attempts = 0;
        while (attempts < 20) {
            const trigger = document.getElementById(`itemSelectTrigger_${slotIndex}`);
            if (trigger && window.customDropdowns) {
                await window.customDropdowns.updateItemDropdownTranslation(slotIndex);
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
    }
    
    // Actualizar dropdown de movimiento visualmente
    async updateMoveDropdown(slotIndex, moveIndex, moveId) {
        // Verificar que el dropdown existe antes de actualizar (retry rápido)
        let attempts = 0;
        while (attempts < 20) {
            const trigger = document.getElementById(`moveSelectTrigger_${slotIndex}_${moveIndex}`);
            if (trigger && window.customDropdowns) {
                await window.customDropdowns.updateMoveDropdownTranslation(slotIndex, moveIndex);
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
        }
    }
}

// Inicializar calculadora cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.damageCalculator = new DamageCalculator();
});