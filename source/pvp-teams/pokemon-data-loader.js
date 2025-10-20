// PVP Teams - Pokemon Data Loader (Moves & Items)
class PokemonDataLoader {
    constructor() {
        this.movesCache = null;
        this.itemsCache = null;
        this.abilitiesCache = {}; // Cache para habilidades individuales
        this.isLoadingMoves = false;
        this.isLoadingItems = false;
        
        // Gen 5 (PokeMMO) - hasta move ID 559
        this.MAX_MOVE_ID = 559;
        // Items comunes en PokeMMO - hasta item ID 537 (Gen 5)
        this.MAX_ITEM_ID = 537;
    }

    /**
     * Cargar todos los movimientos (Gen 1-5)
     */
    async loadAllMoves() {
        if (this.movesCache) {
            console.log('✅ Moves ya cargados desde caché');
            return this.movesCache;
        }

        if (this.isLoadingMoves) {
            console.log('⏳ Moves ya se están cargando...');
            // Esperar a que termine la carga actual
            while (this.isLoadingMoves) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.movesCache;
        }

        this.isLoadingMoves = true;
        console.log('🔄 Cargando movimientos de PokeAPI...');

        try {
            // Obtener lista completa de movimientos
            const response = await fetch(`https://pokeapi.co/api/v2/move?limit=${this.MAX_MOVE_ID}`);
            const data = await response.json();
            
            console.log(`📥 Cargando ${data.results.length} movimientos...`);
            
            // Cargar detalles de movimientos en lotes
            const moves = [];
            const batchSize = 50;
            
            for (let i = 0; i < data.results.length; i += batchSize) {
                const batch = data.results.slice(i, i + batchSize);
                const batchPromises = batch.map(move => 
                    fetch(move.url)
                        .then(res => res.json())
                        .catch(err => {
                            console.warn(`⚠️ Error cargando ${move.name}:`, err);
                            return null;
                        })
                );
                
                const batchResults = await Promise.all(batchPromises);
                moves.push(...batchResults.filter(m => m !== null));
                
                console.log(`📊 Progreso: ${Math.min(i + batchSize, data.results.length)}/${data.results.length}`);
            }
            
            // Filtrar y formatear movimientos
            this.movesCache = moves
                .filter(move => move.generation && this.getGenerationNumber(move.generation.name) <= 5)
                .map(move => ({
                    id: move.id,
                    name: move.name,
                    displayName: this.getTranslatedMoveName(move),
                    pp: move.pp,
                    power: move.power,
                    accuracy: move.accuracy,
                    type: move.type.name,
                    damageClass: move.damage_class.name,
                    generation: move.generation.name,
                    names: move.names // Guardar para traducción dinámica
                }))
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
            
            console.log(`✅ ${this.movesCache.length} movimientos cargados y cacheados`);
            this.isLoadingMoves = false;
            return this.movesCache;
            
        } catch (error) {
            console.error('❌ Error cargando movimientos:', error);
            this.isLoadingMoves = false;
            return [];
        }
    }

    /**
     * Cargar todos los objetos (solo holdables)
     */
    async loadAllItems() {
        if (this.itemsCache) {
            console.log('✅ Items ya cargados desde caché');
            return this.itemsCache;
        }

        if (this.isLoadingItems) {
            console.log('⏳ Items ya se están cargando...');
            while (this.isLoadingItems) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.itemsCache;
        }

        this.isLoadingItems = true;
        console.log('🔄 Cargando objetos de PokeAPI...');

        try {
            // Obtener lista completa de items
            const response = await fetch(`https://pokeapi.co/api/v2/item?limit=${this.MAX_ITEM_ID}`);
            const data = await response.json();
            
            console.log(`📥 Cargando ${data.results.length} objetos...`);
            
            // Cargar detalles de items en lotes
            const items = [];
            const batchSize = 50;
            
            for (let i = 0; i < data.results.length; i += batchSize) {
                const batch = data.results.slice(i, i + batchSize);
                const batchPromises = batch.map(item => 
                    fetch(item.url)
                        .then(res => res.json())
                        .catch(err => {
                            console.warn(`⚠️ Error cargando ${item.name}:`, err);
                            return null;
                        })
                );
                
                const batchResults = await Promise.all(batchPromises);
                items.push(...batchResults.filter(i => i !== null));
                
                console.log(`📊 Progreso: ${Math.min(i + batchSize, data.results.length)}/${data.results.length}`);
            }
            
            // Filtrar SOLO items holdables y formatear
            this.itemsCache = items
                .filter(item => {
                    // Verificar que tenga sprite y atributos
                    if (!item.sprites || !item.sprites.default || !item.attributes) return false;
                    
                    // Verificar que sea holdable o holdable-active
                    const isHoldable = item.attributes.some(attr => 
                        attr.name === 'holdable' || attr.name === 'holdable-active'
                    );
                    
                    return isHoldable;
                })
                .map(item => ({
                    id: item.id,
                    name: item.name,
                    displayName: this.getTranslatedItemName(item),
                    sprite: item.sprites.default,
                    cost: item.cost,
                    category: item.category ? item.category.name : 'unknown',
                    names: item.names // Guardar para traducción dinámica
                }))
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
            
            console.log(`✅ ${this.itemsCache.length} objetos holdables cargados y cacheados`);
            this.isLoadingItems = false;
            return this.itemsCache;
            
        } catch (error) {
            console.error('❌ Error cargando objetos:', error);
            this.isLoadingItems = false;
            return [];
        }
    }

    /**
     * Obtener número de generación
     */
    getGenerationNumber(generationName) {
        const match = generationName.match(/generation-([ivx]+)/i);
        if (!match) return 99;
        
        const romanToNumber = {
            'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5,
            'vi': 6, 'vii': 7, 'viii': 8, 'ix': 9
        };
        
        return romanToNumber[match[1].toLowerCase()] || 99;
    }

    /**
     * Formatear nombre (capitalize y reemplazar guiones)
     */
    formatName(name) {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Buscar movimientos por texto
     */
    searchMoves(query) {
        if (!this.movesCache) return [];
        
        const lowerQuery = query.toLowerCase();
        return this.movesCache.filter(move => 
            move.displayName.toLowerCase().includes(lowerQuery) ||
            move.name.toLowerCase().includes(lowerQuery) ||
            move.type.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Buscar objetos por texto
     */
    searchItems(query) {
        if (!this.itemsCache) return [];
        
        const lowerQuery = query.toLowerCase();
        return this.itemsCache.filter(item => 
            item.displayName.toLowerCase().includes(lowerQuery) ||
            item.name.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Obtener icono de tipo
     */
    getTypeIcon(typeName) {
        return `img/res/poke-types/box/type-${typeName}-box-icon.png`;
    }

    /**
     * Obtener nombre traducido de movimiento
     */
    getTranslatedMoveName(move) {
        if (!move || !move.names) return this.formatName(move.name || '');
        
        const lang = window.languageManager ? window.languageManager.getApiLanguage() : 'en';
        const nameEntry = move.names.find(entry => entry.language.name === lang);
        
        return nameEntry ? nameEntry.name : this.formatName(move.name);
    }

    /**
     * Obtener nombre traducido de objeto
     */
    getTranslatedItemName(item) {
        if (!item || !item.names) return this.formatName(item.name || '');
        
        const lang = window.languageManager ? window.languageManager.getApiLanguage() : 'en';
        const nameEntry = item.names.find(entry => entry.language.name === lang);
        
        return nameEntry ? nameEntry.name : this.formatName(item.name);
    }

    /**
     * Actualizar traducciones de items cacheados
     */
    updateItemTranslations() {
        if (!this.itemsCache) return;
        
        this.itemsCache.forEach(item => {
            item.displayName = this.getTranslatedItemName(item);
        });
        
        // Re-ordenar alfabéticamente
        this.itemsCache.sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        console.log('✅ Traducciones de items actualizadas');
    }

    /**
     * Actualizar traducciones de movimientos cacheados
     */
    updateMoveTranslations() {
        if (!this.movesCache) return;
        
        this.movesCache.forEach(move => {
            move.displayName = this.getTranslatedMoveName(move);
        });
        
        // Re-ordenar alfabéticamente
        this.movesCache.sort((a, b) => a.displayName.localeCompare(b.displayName));
        
        console.log('✅ Traducciones de movimientos actualizadas');
    }

    /**
     * Cargar habilidad individual
     */
    async loadAbility(abilityName) {
        // Si ya está en caché, devolver
        if (this.abilitiesCache[abilityName]) {
            return this.abilitiesCache[abilityName];
        }

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
            const abilityData = await response.json();
            
            // Guardar en caché con traducción
            this.abilitiesCache[abilityName] = {
                name: abilityData.name,
                displayName: this.getTranslatedAbilityName(abilityData),
                names: abilityData.names
            };
            
            return this.abilitiesCache[abilityName];
        } catch (error) {
            console.error(`❌ Error cargando habilidad ${abilityName}:`, error);
            return {
                name: abilityName,
                displayName: this.formatName(abilityName),
                names: []
            };
        }
    }

    /**
     * Cargar múltiples habilidades
     */
    async loadAbilities(abilityNames) {
        const promises = abilityNames.map(name => this.loadAbility(name));
        return await Promise.all(promises);
    }

    /**
     * Obtener nombre traducido de habilidad
     */
    getTranslatedAbilityName(ability) {
        if (!ability || !ability.names) {
            return this.formatName(ability.name || '');
        }
        
        const lang = window.languageManager ? window.languageManager.getApiLanguage() : 'en';
        const nameEntry = ability.names.find(entry => entry.language.name === lang);
        
        return nameEntry ? nameEntry.name : this.formatName(ability.name);
    }

    /**
     * Actualizar traducciones de habilidades cacheadas
     */
    updateAbilityTranslations() {
        Object.keys(this.abilitiesCache).forEach(abilityName => {
            const ability = this.abilitiesCache[abilityName];
            ability.displayName = this.getTranslatedAbilityName(ability);
        });
        
        console.log('✅ Traducciones de habilidades actualizadas');
    }

    /**
     * Actualizar todas las traducciones
     */
    updateAllTranslations() {
        this.updateItemTranslations();
        this.updateMoveTranslations();
        this.updateAbilityTranslations();
        
        // También actualizar naturalezas
        if (window.pvpTeamData) {
            window.pvpTeamData.updateNatureTranslations();
        }
    }

    /**
     * Precargar datos al inicio
     */
    async preloadData() {
        console.log('🚀 Precargando datos de PokeAPI...');
        await Promise.all([
            this.loadAllMoves(),
            this.loadAllItems()
        ]);
        console.log('✅ Datos precargados completamente');
    }
}

// Exportar instancia global
window.pokemonDataLoader = new PokemonDataLoader();

