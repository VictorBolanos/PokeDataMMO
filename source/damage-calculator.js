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

    // Poblar selectores de naturalezas
    populateNatureSelects(natures) {
        [1, 2].forEach(pokemonNum => {
            const select = document.getElementById(`pokemon${pokemonNum}Nature`);
            if (select) {
                select.innerHTML = '<option value="">Seleccionar...</option>';
                natures.forEach(nature => {
                    const option = document.createElement('option');
                    option.value = nature.name;
                    option.textContent = nature.displayName;
                    option.dataset.increased = nature.increased_stat || '';
                    option.dataset.decreased = nature.decreased_stat || '';
                    select.appendChild(option);
                });
            }
        });
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
                evInput.addEventListener('input', () => this.updateStats(pokemonNum));
            }
            if (ivInput) {
                ivInput.addEventListener('input', () => this.updateStats(pokemonNum));
            }
        });

        // Level input
        const levelInput = document.getElementById(`pokemon${pokemonNum}Level`);
        if (levelInput) {
            levelInput.addEventListener('input', () => this.updateStats(pokemonNum));
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
            item.textContent = pokemon.name;
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
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIdNum}.png`;
            
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
            this.saveToCache();
            
        } catch (error) {
            console.error('Error selecting Pokémon:', error);
        }
    }

    // Poblar selector de habilidades
    populateAbilities(pokemonNum, abilities) {
        const select = document.getElementById(`pokemon${pokemonNum}Ability`);
        if (select) {
            select.innerHTML = '<option value="">Seleccionar...</option>';
            abilities.forEach(ability => {
                const option = document.createElement('option');
                option.value = ability;
                option.textContent = ability;
                select.appendChild(option);
            });
        }
    }

    // Inicializar dropdowns custom (objetos y movimientos)
    async initCustomDropdowns(pokemonNum, pokemon) {
        const slotIndex = pokemonNum - 1;
        
        // Actualizar datos del Pokémon en la estructura global
        window.damageCalcData.pokemons[slotIndex].availableMoves = pokemon.availableMoves || [];
        
        // Mantener los movimientos e items ya seleccionados si existen
        if (!window.damageCalcData.pokemons[slotIndex].moves) {
            window.damageCalcData.pokemons[slotIndex].moves = [null, null, null, null];
        }
        if (!window.damageCalcData.pokemons[slotIndex].item) {
            window.damageCalcData.pokemons[slotIndex].item = null;
        }

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
        // Escuchar eventos de cambio de movimiento (GLOBAL, solo una vez)
        window.addEventListener('damageCalcMoveChanged', (event) => {
            const { pokemonNum, moveNum, moveId } = event.detail;
            console.log(`🎯 Movimiento cambiado: Pokemon ${pokemonNum}, Move ${moveNum}, ID: ${moveId}`);
            this.updateMoveSelectionButton(pokemonNum, moveNum, moveId);
            this.saveToCache();
        });
        
        // Escuchar eventos de cambio de item (GLOBAL, solo una vez)
        window.addEventListener('damageCalcItemChanged', (event) => {
            const { pokemonNum } = event.detail;
            console.log(`📦 Objeto cambiado: Pokemon ${pokemonNum}`);
            this.saveToCache();
        });
    }
    
    // Actualizar botón de selección de movimiento en el panel central
    updateMoveSelectionButton(pokemonNum, moveNum, moveId) {
        const button = document.querySelector(`.move-selection-btn[data-pokemon="${pokemonNum}"][data-move="${moveNum}"]`);
        if (!button) return;
        
        const moveNameSpan = button.querySelector('.move-name');
        if (!moveNameSpan) return;
        
        if (moveId && window.pokemonDataLoader?.movesCache) {
            const move = window.pokemonDataLoader.movesCache.find(m => m.id == moveId);
            if (move) {
                const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
                const displayName = currentLang === 'es' ? move.spanishName : move.name;
                moveNameSpan.textContent = displayName;
            } else {
                moveNameSpan.textContent = '(Sin movimiento)';
            }
        } else {
            moveNameSpan.textContent = '(Sin movimiento)';
        }
    }

    // Actualizar stats base
    updateBaseStats(pokemonNum, baseStats) {
        const stats = ['Hp', 'Atk', 'Def', 'SpAtk', 'SpDef', 'Spe'];
        
        stats.forEach(stat => {
            const baseElement = document.getElementById(`pokemon${pokemonNum}${stat}Base`);
            if (baseElement) {
                const statKey = stat === 'Hp' ? 'hp' : 
                               stat === 'Atk' ? 'attack' :
                               stat === 'Def' ? 'defense' :
                               stat === 'SpAtk' ? 'special-attack' :
                               stat === 'SpDef' ? 'special-defense' : 'speed';
                baseElement.textContent = baseStats[statKey];
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
            
            const statKey = stat === 'Hp' ? 'hp' : 
                           stat === 'Atk' ? 'attack' :
                           stat === 'Def' ? 'defense' :
                           stat === 'SpAtk' ? 'special-attack' :
                           stat === 'SpDef' ? 'special-defense' : 'speed';
            
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
        
        document.getElementById(`pokemon${pokemonNum}EvTotal`).textContent = totalEvs;
        
        // Actualizar HP máximo y slider
        const maxHp = parseInt(document.getElementById(`pokemon${pokemonNum}HpFinal`).textContent);
        const slider = document.getElementById(`pokemon${pokemonNum}HpSlider`);
        slider.max = maxHp;
        
        // SIEMPRE actualizar a vida llena cuando cambian los stats
        slider.value = maxHp;
        this.updateHpBar(pokemonNum, maxHp, maxHp);
        
        this.calculateDamage();
        this.saveToCache();
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
                
                // Restaurar Pokémon 1
                if (state.pokemon1) {
                    await this.selectPokemon({ id: state.pokemon1.id, name: state.pokemon1.name }, 1);
                    
                    // Restaurar naturaleza
                    if (state.pokemon1.nature) {
                        const natureSelect = document.getElementById('pokemon1Nature');
                        if (natureSelect) natureSelect.value = state.pokemon1.nature;
                    }
                    
                    // Restaurar habilidad
                    if (state.pokemon1.ability) {
                        const abilitySelect = document.getElementById('pokemon1Ability');
                        if (abilitySelect) abilitySelect.value = state.pokemon1.ability;
                    }
                    
                    // Restaurar nivel
                    if (state.pokemon1.level) {
                        const levelInput = document.getElementById('pokemon1Level');
                        if (levelInput) levelInput.value = state.pokemon1.level;
                    }
                    
                    // Restaurar EVs e IVs
                    this.restoreStatsValues(1, state.pokemon1);
                    
                    // Restaurar movimientos
                    if (state.pokemon1.moves) {
                        window.damageCalcData.pokemons[0].moves = state.pokemon1.moves;
                    }
                    
                    // Restaurar objeto
                    if (state.pokemon1.item) {
                        window.damageCalcData.pokemons[0].item = state.pokemon1.item;
                    }
                }
                
                // Restaurar Pokémon 2
                if (state.pokemon2) {
                    await this.selectPokemon({ id: state.pokemon2.id, name: state.pokemon2.name }, 2);
                    
                    if (state.pokemon2.nature) {
                        const natureSelect = document.getElementById('pokemon2Nature');
                        if (natureSelect) natureSelect.value = state.pokemon2.nature;
                    }
                    
                    if (state.pokemon2.ability) {
                        const abilitySelect = document.getElementById('pokemon2Ability');
                        if (abilitySelect) abilitySelect.value = state.pokemon2.ability;
                    }
                    
                    if (state.pokemon2.level) {
                        const levelInput = document.getElementById('pokemon2Level');
                        if (levelInput) levelInput.value = state.pokemon2.level;
                    }
                    
                    this.restoreStatsValues(2, state.pokemon2);
                    
                    if (state.pokemon2.moves) {
                        window.damageCalcData.pokemons[1].moves = state.pokemon2.moves;
                    }
                    
                    if (state.pokemon2.item) {
                        window.damageCalcData.pokemons[1].item = state.pokemon2.item;
                    }
                }
                
                console.log('✅ Estado restaurado desde caché');
            } else {
                console.log('ℹ️ Iniciando damage calculator vacío (sin caché)');
            }
        } catch (error) {
            console.error('Error loading from cache:', error);
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
            console.error('Error saving to cache:', error);
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
        if (!this.selectedMove) {
            this.updateDamageResult('Selecciona un movimiento para ver los resultados del daño');
            return;
        }

        const attacker = this.selectedMove.pokemon === '1' ? this.currentPokemon1 : this.currentPokemon2;
        const defender = this.selectedMove.pokemon === '1' ? this.currentPokemon2 : this.currentPokemon1;
        
        if (!attacker || !defender) {
            this.updateDamageResult('Error: Pokémon no encontrado');
            return;
        }

        const moveData = this.getMoveData(this.selectedMove.move);
        if (!moveData) {
            this.updateDamageResult('Error: Movimiento no encontrado');
            return;
        }

        const attackerLevel = parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon}Level`).value) || 100;
        const defenderLevel = parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon === '1' ? '2' : '1'}Level`).value) || 100;
        
        const attackStat = moveData.category === 'physical' ? 
            parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon}AtkFinal`).textContent) :
            parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon}SpAtkFinal`).textContent);
            
        const defenseStat = moveData.category === 'physical' ?
            parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon === '1' ? '2' : '1'}DefFinal`).textContent) :
            parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon === '1' ? '2' : '1'}SpDefFinal`).textContent);

        const baseDamage = this.calculateBaseDamage(attackerLevel, moveData.power, attackStat, defenseStat);
        const modifiers = this.calculateModifiers(attacker, defender, moveData);
        const finalDamage = Math.floor(baseDamage * modifiers);

        const minDamage = Math.floor(finalDamage * 0.85);
        const maxDamage = Math.floor(finalDamage * 1.0);

        const defenderHp = parseInt(document.getElementById(`pokemon${this.selectedMove.pokemon === '1' ? '2' : '1'}HpFinal`).textContent);
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
            defenderLevel,
            defenseStat
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
            lightScreen: false,
            helpingHand: false
        };

        document.querySelectorAll('.field-effect-btn.active').forEach(button => {
            const effect = button.dataset.effect;
            if (effect === 'reflect') effects.reflect = true;
            if (effect === 'light-screen') effects.lightScreen = true;
            if (effect === 'helping-hand') effects.helpingHand = true;
        });

        return effects;
    }

    getMoveData(moveNum) {
        const moveInput = document.getElementById(`pokemon${this.selectedMove.pokemon}Move${moveNum}`);
        const moveName = moveInput?.value || '';
        
        const moves = {
            'Belly Drum': { name: 'Belly Drum', type: 'normal', category: 'status', power: 0 },
            'Leaf Storm': { name: 'Leaf Storm', type: 'grass', category: 'special', power: 130 },
            'Aurora Veil': { name: 'Aurora Veil', type: 'ice', category: 'status', power: 0 },
            'Earth Power': { name: 'Earth Power', type: 'ground', category: 'special', power: 90 },
            'Absorb': { name: 'Absorb', type: 'grass', category: 'special', power: 20 }
        };

        return moves[moveName] || { name: moveName, type: 'normal', category: 'physical', power: 0 };
    }

    formatDamageResult(attacker, defender, move, minDmg, maxDmg, minPct, maxPct, attLevel, attStat, defLevel, defStat) {
        const moveData = this.getMoveData(this.selectedMove.move);
        const statName = moveData.category === 'physical' ? 'Atk' : 'SpA';
        
        return `Lv. ${attLevel} ${attStat}+ ${statName} ${attacker} ${move} vs. ${defLevel} HP / ${defStat} ${moveData.category === 'physical' ? 'Def' : 'SpD'} ${defender}: ${minDmg}-${maxDmg} (${minPct} - ${maxPct}%) -- ${this.getDamageDescription(minPct)}`;
    }

    getDamageDescription(percentage) {
        const pct = parseFloat(percentage);
        if (pct >= 100) return 'guaranteed OHKO';
        if (pct >= 75) return '75% chance to OHKO';
        if (pct >= 50) return '2HKO';
        if (pct >= 25) return '4HKO';
        return 'minimal damage';
    }

    updateDamageResult(result) {
        const resultContent = document.getElementById('damageResultContent');
        if (resultContent) {
            resultContent.innerHTML = `<pre style="margin: 0; font-family: 'Courier New', monospace; font-size: 0.875rem;">${result}</pre>`;
        }
    }
}

// Inicializar calculadora cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.damageCalculator = new DamageCalculator();
});