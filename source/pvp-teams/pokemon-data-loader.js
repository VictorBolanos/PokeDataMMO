// PVP Teams - Pokemon Data Loader (Moves & Items)
class PokemonDataLoader {
    constructor() {
        this.movesCache = null;
        this.itemsCache = null;
        this.abilitiesCache = {}; // Cache para habilidades individuales
        this.allAbilitiesCache = null; // Cache de TODAS las habilidades
        this.isLoadingAbilities = false;
        this.isLoadingMoves = false;
        this.isLoadingItems = false;
        
        // Gen 5 (PokeMMO) - hasta move ID 559
        this.MAX_MOVE_ID = 559;
        // Items - Sin límite de generación (PokeMMO incluye items de todas las generaciones)
        this.MAX_ITEM_ID = 9999;
    }

    /**
     * Formatear nombre de forma segura
     */
    safeFormatName(name) {
        if (!name) return '';
        // Si PokeUtils está disponible, usarlo
        if (window.PokeUtils && typeof window.PokeUtils.formatName === 'function') {
            return window.PokeUtils.formatName(name);
        }
        // Fallback: capitalizar manualmente
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    }

    /**
     * Obtener nombre traducido de forma segura
     */
    safeGetTranslatedName(obj, fallbackName) {
        if (window.PokeUtils && typeof window.PokeUtils.getTranslatedName === 'function') {
            return window.PokeUtils.getTranslatedName(obj, fallbackName);
        }
        // Fallback simple
        return fallbackName || obj?.name || '';
    }

    /**
     * Cargar todos los movimientos (Gen 1-5)
     */
    async loadAllMoves() {
        if (this.movesCache) return this.movesCache;

        if (this.isLoadingMoves) {
            while (this.isLoadingMoves) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.movesCache;
        }

        this.isLoadingMoves = true;

        try {
            if (typeof movesData === 'undefined') {
                console.error('❌ ERROR CRÍTICO: movesData NO está definido');
                this.isLoadingMoves = false;
                return [];
            }

            const currentLang = window.languageManager?.getCurrentLanguage() || 'es';

            this.movesCache = movesData
                .filter(move => move.id !== "000" && move.type?.toLowerCase() !== 'fairy')
                .map(move => ({
                    id: move.id,
                    name: move.EnglishName,
                    spanishName: move.SpanishName,
                    displayName: currentLang === 'es' ? move.SpanishName : move.EnglishName,
                    pp: move.pp || 0,
                    power: move.power || 0,
                    accuracy: move.accuracy || 0,
                    type: move.type || 'normal',
                    damageClass: move.category || 'physical',
                    description: move.description || '',
                    names: [
                        { language: { name: 'en' }, name: move.EnglishName },
                        { language: { name: 'es' }, name: move.SpanishName }
                    ]
                }))
                .sort((a, b) => a.displayName.localeCompare(b.displayName));
            
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
        if (this.itemsCache) return this.itemsCache;

        if (this.isLoadingItems) {
            while (this.isLoadingItems) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.itemsCache;
        }

        this.isLoadingItems = true;

        try {
            if (typeof itemsData === 'undefined') {
                console.error('❌ ERROR CRÍTICO: itemsData NO está definido');
                this.isLoadingItems = false;
                return [];
            }

            const validItems = itemsData.filter(item => item.id !== "000");
            const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
            const itemsWithSprites = [];
            const batchSize = 30;
            
            for (let i = 0; i < validItems.length; i += batchSize) {
                const batch = validItems.slice(i, i + batchSize);
                const batchPromises = batch.map(async (item) => {
                    const apiName = item.EnglishName
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '');
                    
                    try {
                        const response = await fetch(`https://pokeapi.co/api/v2/item/${apiName}`);
                        const apiData = response.ok ? await response.json() : null;
                        
                        return {
                            id: parseInt(item.id),
                            name: item.EnglishName,
                            spanishName: item.SpanishName,
                            displayName: currentLang === 'es' ? item.SpanishName : item.EnglishName,
                            sprite: apiData?.sprites?.default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${apiName}.png`,
                            spriteName: apiData?.name || apiName,
                            description: item.description || '',
                            names: [
                                { language: { name: 'en' }, name: item.EnglishName },
                                { language: { name: 'es' }, name: item.SpanishName }
                            ]
                        };
                    } catch (error) {
                        return {
                            id: parseInt(item.id),
                            name: item.EnglishName,
                            spanishName: item.SpanishName,
                            displayName: currentLang === 'es' ? item.SpanishName : item.EnglishName,
                            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${apiName}.png`,
                            spriteName: apiName,
                            description: item.description || '',
                            names: [
                                { language: { name: 'en' }, name: item.EnglishName },
                                { language: { name: 'es' }, name: item.SpanishName }
                            ]
                        };
                    }
                });
                
                const batchResults = await Promise.all(batchPromises);
                itemsWithSprites.push(...batchResults.filter(item => item !== null));
            }

            this.itemsCache = itemsWithSprites.sort((a, b) => a.displayName.localeCompare(b.displayName));
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
            item.name.toLowerCase().includes(lowerQuery) ||
            item.spanishName.toLowerCase().includes(lowerQuery)
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
        // Para datos locales, usar directamente spanishName o name
        const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
        if (move.spanishName) {
            return currentLang === 'es' ? move.spanishName : move.name;
        }
        // Fallback para compatibilidad
        return this.safeGetTranslatedName(move, move?.name);
    }

    /**
     * Obtener nombre traducido de objeto
     */
    getTranslatedItemName(item) {
        // Para datos locales, usar directamente el nombre en español
        if (item.spanishName) {
            return item.spanishName;
        }
        
        // Fallback para compatibilidad con API
        return this.safeGetTranslatedName(item, item?.name);
    }

    /**
     * Actualizar traducciones de items cacheados
     */
    updateItemTranslations() {
        if (!this.itemsCache) return;
        
        // Obtener idioma actual
        const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
        
        this.itemsCache.forEach(item => {
            // Usar el nombre correspondiente al idioma actual
            if (currentLang === 'es') {
                item.displayName = item.spanishName || item.name;
            } else {
                item.displayName = item.name;
            }
        });
        
        // Re-ordenar alfabéticamente
        this.itemsCache.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    /**
     * Actualizar traducciones de movimientos cacheados
     */
    updateMoveTranslations() {
        if (!this.movesCache) return;
        
        const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
        
        this.movesCache.forEach(move => {
            // Usar directamente spanishName o name según el idioma
            move.displayName = currentLang === 'es' ? (move.spanishName || move.name) : move.name;
        });
        
        // Re-ordenar alfabéticamente
        this.movesCache.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    /**
     * Obtener datos de un Pokémon desde pokemon.js
     */
    getPokemonData(pokemonIdOrName) {
        // Verificar que pokemonData esté disponible
        if (typeof pokemonData === 'undefined') {
            console.error('❌ ERROR CRÍTICO: pokemonData NO está definido');
            console.error('❌ Asegúrate de que data/pokemon.js está cargado en index.html');
            return null;
        }

        // Buscar por ID o nombre
        const pokemon = pokemonData.find(p => {
            if (typeof pokemonIdOrName === 'number') {
                return parseInt(p.id) === pokemonIdOrName;
            }
            return p.name.toLowerCase() === pokemonIdOrName.toString().toLowerCase();
        });

        if (!pokemon) {
            console.warn(`⚠️ Pokémon no encontrado: "${pokemonIdOrName}"`);
            return null;
        }

        return pokemon;
    }

    /**
     * Cargar habilidad individual desde abilities.js (LOCAL)
     */
    async loadAbility(abilityName, isHidden = false) {
        // Si ya está en caché, devolver
        if (this.abilitiesCache[abilityName]) {
            return this.abilitiesCache[abilityName];
        }

        try {
            // Verificar que abilitiesData esté disponible
            if (typeof abilitiesData === 'undefined') {
                console.error('❌ abilitiesData NO está definido');
                return {
                    name: abilityName,
                    displayName: this.safeFormatName(abilityName),
                    names: [],
                    is_hidden: isHidden
                };
            }

            // Buscar en abilitiesData (por nombre en inglés)
            const abilityData = abilitiesData.find(a => 
                a.EnglishName.toLowerCase() === abilityName.toLowerCase()
            );

            if (!abilityData) {
                console.warn(`⚠️ Habilidad no encontrada en abilities.js: "${abilityName}"`);
                return {
                    name: abilityName,
                    displayName: this.safeFormatName(abilityName),
                    names: [],
                    is_hidden: isHidden
                };
            }

            // Obtener idioma actual
            const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
            
            // Guardar en caché con traducción
            this.abilitiesCache[abilityName] = {
                name: abilityData.EnglishName,
                displayName: currentLang === 'es' ? abilityData.SpanishName : abilityData.EnglishName,
                names: [
                    { language: { name: 'en' }, name: abilityData.EnglishName },
                    { language: { name: 'es' }, name: abilityData.SpanishName }
                ],
                is_hidden: isHidden
            };
            
            return this.abilitiesCache[abilityName];
        } catch (error) {
            console.error(`❌ Error cargando habilidad "${abilityName}":`, error);
            return {
                name: abilityName,
                displayName: this.safeFormatName(abilityName),
                names: [],
                is_hidden: isHidden
            };
        }
    }

    /**
     * Cargar múltiples habilidades
     */
    async loadAbilities(abilityData) {
        const promises = abilityData.map(data => {
            // Si es un string, mantener compatibilidad
            if (typeof data === 'string') {
                return this.loadAbility(data);
            }
            // Si es un objeto con name e is_hidden
            return this.loadAbility(data.name, data.is_hidden);
        });
        
        return await Promise.all(promises);
    }


    /**
     * Obtener nombre traducido de habilidad
     */
    getTranslatedAbilityName(ability) {
        return this.safeGetTranslatedName(ability, ability?.name);
    }

    /**
     * Actualizar traducciones de habilidades cacheadas
     */
    updateAbilityTranslations() {
        const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
        
        // Actualizar habilidades individuales en caché
        Object.keys(this.abilitiesCache).forEach(abilityName => {
            const ability = this.abilitiesCache[abilityName];
            if (ability.spanishName) {
                ability.displayName = currentLang === 'es' ? ability.spanishName : ability.name;
            } else {
                // Buscar en abilitiesData si no tiene spanishName
                if (typeof abilitiesData !== 'undefined') {
                    const abilityData = abilitiesData.find(a => 
                        a.EnglishName.toLowerCase() === ability.name.toLowerCase()
                    );
                    if (abilityData) {
                        ability.spanishName = abilityData.SpanishName;
                        ability.displayName = currentLang === 'es' ? abilityData.SpanishName : abilityData.EnglishName;
                    }
                }
            }
        });
        
        // Actualizar todas las habilidades en caché
        if (this.allAbilitiesCache) {
            this.allAbilitiesCache.forEach(ability => {
                if (ability.spanishName) {
                    ability.displayName = currentLang === 'es' ? ability.spanishName : ability.name;
                }
            });
            this.allAbilitiesCache.sort((a, b) => a.displayName.localeCompare(b.displayName));
        }
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
        try {
            await Promise.all([
                this.loadAllMoves(),    // Necesario para filtrado de movimientos
                this.loadAllItems()    // Necesario para sprites de items
            ]);
        } catch (error) {
            console.error('❌ Error en precarga:', error);
        }
    }
}

// Exportar instancia global
window.pokemonDataLoader = new PokemonDataLoader();

