// PVP Teams - Custom Dropdowns (Moves & Items)
class CustomDropdowns {
    constructor() {
        this.activeDropdown = null;
    }

    /**
     * Renderizar dropdown de movimientos
     */
    renderMoveSelect(slotIndex, moveIndex, selectedMove = '') {
        return `
            <div class="custom-move-select-wrapper" data-slot="${slotIndex}" data-move-index="${moveIndex}">
                <div class="custom-move-select-trigger" id="moveSelectTrigger_${slotIndex}_${moveIndex}">
                    ${selectedMove ? this.renderMoveOption(selectedMove, true) : `
                        <span class="custom-select-placeholder">
                            ${window.languageManager.getCurrentLanguage() === 'es' ? 'Seleccionar movimiento...' : 'Select move...'}
                        </span>
                    `}
                    <svg class="custom-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="custom-move-select-dropdown" id="moveSelectDropdown_${slotIndex}_${moveIndex}" style="display: none;">
                    <div class="custom-select-search">
                        <input type="text" 
                               class="custom-select-search-input" 
                               placeholder="${window.languageManager.getCurrentLanguage() === 'es' ? 'Buscar...' : 'Search...'}"
                               id="moveSearch_${slotIndex}_${moveIndex}">
                    </div>
                    <div class="custom-select-options" id="moveOptions_${slotIndex}_${moveIndex}">
                        <div class="custom-select-loading">
                            ${window.languageManager.getCurrentLanguage() === 'es' ? 'Cargando movimientos...' : 'Loading moves...'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar opción de movimiento
     */
    renderMoveOption(move, isTrigger = false) {
        if (typeof move === 'string') {
            // Buscar el movimiento en la caché POR ID
            const moves = window.pokemonDataLoader.movesCache || [];
            move = moves.find(m => m.id === move || m.name === move) || { 
                id: move,
                name: move, 
                displayName: window.PokeUtils.formatName(move),
                type: 'normal'
            };
        }

        const typeIcon = window.pokemonDataLoader.getTypeIcon(move.type);
        const className = isTrigger ? 'custom-move-option-trigger' : 'custom-move-option';
        
        // Para Hidden Power, mostrar el tipo en el nombre
        let displayName = move.displayName;
        if (move.name === 'Hidden Power' && move.type && move.type.toLowerCase() !== 'normal') {
            const currentLang = window.languageManager?.getCurrentLanguage() || 'es';
            const typeTranslated = window.PokeUtils.translateTypeName(move.type);
            displayName = currentLang === 'es' 
                ? `Poder Oculto [${typeTranslated}]` 
                : `Hidden Power [${typeTranslated}]`;
        }
        
        return `
            <div class="${className}" data-move-id="${move.id}">
                <span class="move-name">${displayName}</span>
                <img src="${typeIcon}" 
                     alt="${move.type}" 
                     class="move-type-icon" 
                     title="${window.PokeUtils.formatName(move.type)}"
                     onerror="this.style.display='none'">
            </div>
        `;
    }

    /**
     * Renderizar dropdown de objetos
     */
    renderItemSelect(slotIndex, selectedItem = '') {
        return `
            <div class="custom-item-select-wrapper" data-slot="${slotIndex}">
                <div class="custom-item-select-trigger" id="itemSelectTrigger_${slotIndex}">
                    ${selectedItem ? this.renderItemOption(selectedItem, true) : `
                        <span class="custom-select-placeholder">
                            ${window.languageManager.getCurrentLanguage() === 'es' ? 'Seleccionar objeto...' : 'Select item...'}
                        </span>
                    `}
                    <svg class="custom-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="custom-item-select-dropdown" id="itemSelectDropdown_${slotIndex}" style="display: none;">
                    <div class="custom-select-search">
                        <input type="text" 
                               class="custom-select-search-input" 
                               placeholder="${window.languageManager.getCurrentLanguage() === 'es' ? 'Buscar...' : 'Search...'}"
                               id="itemSearch_${slotIndex}">
                    </div>
                    <div class="custom-select-options" id="itemOptions_${slotIndex}">
                        <div class="custom-select-loading">
                            ${window.languageManager.getCurrentLanguage() === 'es' ? 'Cargando objetos...' : 'Loading items...'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Renderizar opción de objeto
     */
    renderItemOption(item, isTrigger = false) {
        if (typeof item === 'string') {
            // Buscar el objeto en la caché
            const items = window.pokemonDataLoader.itemsCache || [];
            item = items.find(i => i.name === item) || { 
                name: item, 
                displayName: window.PokeUtils.formatName(item),
                sprite: window.PokeUtils.getTypeIcon('normal') // Placeholder usando función centralizada
            };
        }

        const className = isTrigger ? 'custom-item-option-trigger' : 'custom-item-option';
        
        // Usar el sprite correcto (ya viene formateado desde loadAllItems)
        const spriteUrl = item.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.spriteName || 'unknown'}.png`;
        const fallbackIcon = window.PokeUtils.getTypeIcon('normal');
        
        return `
            <div class="${className}" data-item-name="${item.name}">
                <img src="${spriteUrl}" alt="${item.displayName}" class="item-sprite" onerror="this.src='${fallbackIcon}'">
                <span class="item-name">${item.displayName}</span>
            </div>
        `;
    }

    /**
     * Inicializar dropdown de movimientos
     */
    async initMoveSelect(slotIndex, moveIndex, selectedMove = '') {
        const trigger = document.getElementById(`moveSelectTrigger_${slotIndex}_${moveIndex}`);
        const dropdown = document.getElementById(`moveSelectDropdown_${slotIndex}_${moveIndex}`);
        const searchInput = document.getElementById(`moveSearch_${slotIndex}_${moveIndex}`);
        const optionsContainer = document.getElementById(`moveOptions_${slotIndex}_${moveIndex}`);

        if (!trigger || !dropdown) return;

        // ✅ SOLUCIÓN: Remover listeners existentes para evitar duplicados
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        const newDropdown = dropdown.cloneNode(true);
        dropdown.parentNode.replaceChild(newDropdown, dropdown);
        
        // Actualizar referencias
        const finalTrigger = document.getElementById(`moveSelectTrigger_${slotIndex}_${moveIndex}`);
        const finalDropdown = document.getElementById(`moveSelectDropdown_${slotIndex}_${moveIndex}`);
        const finalSearchInput = document.getElementById(`moveSearch_${slotIndex}_${moveIndex}`);
        const finalOptionsContainer = document.getElementById(`moveOptions_${slotIndex}_${moveIndex}`);

        // Obtener movimientos específicos del Pokémon
        const pokemon = window.pvpTeamsUI?.currentTeam?.pokemons?.[slotIndex];
        let moves = [];
        
        if (pokemon && pokemon.availableMoves) {
            // Usar SOLO los movimientos del Pokémon específico
            const allMoves = await window.pokemonDataLoader.loadAllMoves();
            const hasHiddenPower = pokemon.availableMoves.includes('Hidden Power');
            
            moves = allMoves.filter(move => {
                // Si puede aprender Hidden Power, mostrar TODAS las variantes
                if (hasHiddenPower && move.name === 'Hidden Power') {
                    return true;
                }
                // Para el resto, filtrar normalmente
                return pokemon.availableMoves.includes(move.name);
            });
        } else {
            // Fallback: cargar todos si no hay Pokémon específico
            moves = await window.pokemonDataLoader.loadAllMoves();
        }

        // Renderizar opciones iniciales
        this.renderMoveOptions(finalOptionsContainer, moves);

        // Toggle dropdown - SOLO UN LISTENER
        finalTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(finalDropdown);
        });

        // Búsqueda - Solo en los movimientos del Pokémon
        if (finalSearchInput) {
            finalSearchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = moves.filter(move => 
                    move.displayName.toLowerCase().includes(query) ||
                    move.name.toLowerCase().includes(query) ||
                    move.type.toLowerCase().includes(query)
                );
                this.renderMoveOptions(finalOptionsContainer, filtered);
            });
        }

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!finalDropdown.contains(e.target) && !finalTrigger.contains(e.target)) {
                finalDropdown.style.display = 'none';
                // Limpiar eventos de scroll/resize
                if (finalDropdown._cleanupFunction && typeof finalDropdown._cleanupFunction === 'function') {
                    finalDropdown._cleanupFunction();
                    delete finalDropdown._cleanupFunction;
                }
                // Limpiar del body cuando se cierra
                if (finalDropdown.parentNode === document.body) {
                    finalDropdown.parentNode.removeChild(finalDropdown);
                }
            }
        });
    }

    /**
     * Renderizar opciones de movimientos
     */
    renderMoveOptions(container, moves) {
        if (moves.length === 0) {
            container.innerHTML = `
                <div class="custom-select-no-results">
                    ${window.languageManager.getCurrentLanguage() === 'es' ? 'No se encontraron movimientos' : 'No moves found'}
                </div>
            `;
            return;
        }

        container.innerHTML = moves.map(move => this.renderMoveOption(move)).join('');

        // Agregar eventos de click
        container.querySelectorAll('.custom-move-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const moveId = e.currentTarget.dataset.moveId;
                // ✅ SOLUCIÓN: Pasar el container y el ID del movimiento
                this.selectMove(container, moveId);
            });
        });
    }

    /**
     * Seleccionar movimiento (ahora usa IDs para soportar Hidden Power)
     */
    selectMove(container, moveId) {
        // Extraer slotIndex y moveIndex del ID del container
        const containerId = container.id;
        
        if (!containerId || !containerId.startsWith('moveOptions_')) {
            console.error(`❌ ERROR: Container ID inválido:`, containerId);
            return;
        }
        
        // Extraer slotIndex y moveIndex del ID: "moveOptions_0_1" -> slotIndex=0, moveIndex=1
        const parts = containerId.split('_');
        if (parts.length !== 3) {
            console.error(`❌ ERROR: Formato de ID inválido:`, containerId);
            return;
        }
        
        const slotIndex = parseInt(parts[1]);
        const moveIndex = parseInt(parts[2]);
        
        const trigger = document.getElementById(`moveSelectTrigger_${slotIndex}_${moveIndex}`);
        const dropdown = document.getElementById(`moveSelectDropdown_${slotIndex}_${moveIndex}`);
        
        // Buscar movimiento por ID
        const move = window.pokemonDataLoader.movesCache.find(m => m.id == moveId);
        if (move && trigger) {
            trigger.innerHTML = this.renderMoveOption(move, true) + `
                <svg class="custom-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
        
        // Cerrar dropdown
        if (dropdown) {
            dropdown.style.display = 'none';
            // Limpiar eventos de scroll/resize
            if (dropdown._cleanupFunction && typeof dropdown._cleanupFunction === 'function') {
                dropdown._cleanupFunction();
                delete dropdown._cleanupFunction;
            }
            // Limpiar del body cuando se cierra
            if (dropdown.parentNode === document.body) {
                dropdown.parentNode.removeChild(dropdown);
            }
        }
        
        // Actualizar datos en PVP Teams UI - GUARDAR EL ID
        if (window.pvpTeamsUI && move) {
            window.pvpTeamsUI.currentTeam.pokemons[slotIndex].moves[moveIndex] = moveId;
            window.pvpTeams.scheduleAutoSave();
        }
    }

    /**
     * Inicializar dropdown de objetos
     */
    async initItemSelect(slotIndex, selectedItem = '') {
        const trigger = document.getElementById(`itemSelectTrigger_${slotIndex}`);
        const dropdown = document.getElementById(`itemSelectDropdown_${slotIndex}`);
        const searchInput = document.getElementById(`itemSearch_${slotIndex}`);
        const optionsContainer = document.getElementById(`itemOptions_${slotIndex}`);

        if (!trigger || !dropdown) {
            return;
        }

        // ✅ SOLUCIÓN: Remover listeners existentes para evitar duplicados
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        const newDropdown = dropdown.cloneNode(true);
        dropdown.parentNode.replaceChild(newDropdown, dropdown);
        
        // Actualizar referencias
        const finalTrigger = document.getElementById(`itemSelectTrigger_${slotIndex}`);
        const finalDropdown = document.getElementById(`itemSelectDropdown_${slotIndex}`);
        const finalSearchInput = document.getElementById(`itemSearch_${slotIndex}`);
        const finalOptionsContainer = document.getElementById(`itemOptions_${slotIndex}`);

        // Cargar objetos (garantizado)
        let items = window.pokemonDataLoader.itemsCache;
        
        if (!items || items.length === 0) {
            try {
                items = await window.pokemonDataLoader.loadAllItems();
            } catch (error) {
                items = [];
            }
        }

        // Renderizar opciones iniciales si hay datos
        if (items && items.length > 0) {
            this.renderItemOptions(finalOptionsContainer, items);
        }

        // Toggle dropdown - SOLO UN LISTENER
        finalTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Lazy render: si aún no hay opciones, intentar cargar ahora
            if (!finalOptionsContainer || finalOptionsContainer.children.length === 0) {
                (async () => {
                    let list = window.pokemonDataLoader.itemsCache;
                    if (!list || list.length === 0) {
                        try {
                            list = await window.pokemonDataLoader.loadAllItems();
                        } catch (error) {
                            list = [];
                        }
                    }
                    this.renderItemOptions(finalOptionsContainer, list);
                    this.toggleDropdown(finalDropdown);
                })();
                return;
            }
            this.toggleDropdown(finalDropdown);
        });

        // Búsqueda
        if (finalSearchInput) {
            finalSearchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                const filtered = query ? window.pokemonDataLoader.searchItems(query) : items;
                this.renderItemOptions(finalOptionsContainer, filtered);
            });
        }

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!finalDropdown.contains(e.target) && !finalTrigger.contains(e.target)) {
                finalDropdown.style.display = 'none';
                // Limpiar eventos de scroll/resize
                if (finalDropdown._cleanupFunction && typeof finalDropdown._cleanupFunction === 'function') {
                    finalDropdown._cleanupFunction();
                    delete finalDropdown._cleanupFunction;
                }
                // Limpiar del body cuando se cierra
                if (finalDropdown.parentNode === document.body) {
                    finalDropdown.parentNode.removeChild(finalDropdown);
                }
            }
        });
    }

    /**
     * Renderizar opciones de objetos
     */
    renderItemOptions(container, items) {
        // Guardar slotIndex en el container antes de cualquier manipulación
        if (!container.dataset.slotIndex) {
            const slotIndex = container.id.replace('itemOptions_', '');
            container.dataset.slotIndex = slotIndex;
        }
        
        if (items.length === 0) {
            container.innerHTML = `
                <div class="custom-select-no-results">
                    ${window.languageManager.getCurrentLanguage() === 'es' ? 'No se encontraron objetos' : 'No items found'}
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => this.renderItemOption(item)).join('');

        // Agregar eventos de click
        const options = container.querySelectorAll('.custom-item-option');
        
        options.forEach((option, index) => {
            option.addEventListener('click', (e) => {
                const itemName = e.currentTarget.dataset.itemName;
                this.selectItem(container, itemName);
            });
        });
    }

    /**
     * Seleccionar objeto
     */
    selectItem(container, itemName) {
        const wrapper = container.closest('.custom-item-select-wrapper');
        
        let slotIndex;
        
        if (wrapper && wrapper.dataset.slot) {
            // Método normal: desde el wrapper
            slotIndex = parseInt(wrapper.dataset.slot);
        } else if (container.dataset.slotIndex) {
            // Método fallback: desde el container
            slotIndex = parseInt(container.dataset.slotIndex);
        } else {
            console.error('❌ No se encontró slotIndex en ningún lugar');
            return;
        }
        
        const trigger = document.getElementById(`itemSelectTrigger_${slotIndex}`);
        const dropdown = document.getElementById(`itemSelectDropdown_${slotIndex}`);
        
        // Actualizar trigger
        const item = window.pokemonDataLoader.itemsCache.find(i => i.name === itemName);
        if (item && trigger) {
            trigger.innerHTML = this.renderItemOption(item, true) + `
                <svg class="custom-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
        
        // Cerrar dropdown
        if (dropdown) {
            dropdown.style.display = 'none';
            // Limpiar eventos de scroll/resize
            if (dropdown._cleanupFunction && typeof dropdown._cleanupFunction === 'function') {
                dropdown._cleanupFunction();
                delete dropdown._cleanupFunction;
            }
            // Limpiar del body cuando se cierra
            if (dropdown.parentNode === document.body) {
                dropdown.parentNode.removeChild(dropdown);
            }
        }
        
        // Actualizar datos en PVP Teams UI
        if (window.pvpTeamsUI) {
            window.pvpTeamsUI.currentTeam.pokemons[slotIndex].item = itemName;
            window.pvpTeams.scheduleAutoSave();
        }
    }

    /**
     * Toggle dropdown - VERSIÓN SIMPLE SIN BUCLES
     */
    toggleDropdown(dropdown) {
        // Cerrar otros dropdowns abiertos
        document.querySelectorAll('.custom-move-select-dropdown, .custom-item-select-dropdown').forEach(d => {
            if (d !== dropdown) {
                d.style.display = 'none';
                // Remover del body si está ahí
                if (d.parentNode === document.body) {
                    d.parentNode.removeChild(d);
                }
            }
        });

        // Toggle actual dropdown
        const isCurrentlyHidden = dropdown.style.display === 'none' || dropdown.style.display === '';
        
        if (isCurrentlyHidden) {
            // 🎯 GUARDAR POSICIÓN DEL TRIGGER ANTES DE MOVER
            const triggerId = dropdown.id.replace('Dropdown', 'Trigger');
            const trigger = document.getElementById(triggerId);
            if (trigger) {
                const triggerRect = trigger.getBoundingClientRect();
                // Guardar posición en el dropdown para usarla después
                dropdown.dataset.triggerRect = JSON.stringify({
                    top: triggerRect.top,
                    left: triggerRect.left,
                    bottom: triggerRect.bottom,
                    width: triggerRect.width,
                    height: triggerRect.height
                });
            }
            
            // 🎯 MOVER DROPDOWN AL BODY para evitar overflow: hidden
            if (dropdown.parentNode !== document.body) {
                document.body.appendChild(dropdown);
            }
            
            // Abrir dropdown
            this.positionDropdown(dropdown);
            dropdown.style.display = 'block';
            
            // Focus en el input de búsqueda después de mostrar
            setTimeout(() => {
                const searchInput = dropdown.querySelector('.custom-select-search-input');
                if (searchInput) {
                    searchInput.focus();
                }
                
                // 🎯 AÑADIR REPOSICIONAMIENTO DINÁMICO
                const repositionHandler = () => {
                    if (dropdown.style.display === 'block') {
                        // Actualizar posición del trigger
                        const triggerId = dropdown.id.replace('Dropdown', 'Trigger');
                        const trigger = document.getElementById(triggerId);
                        if (trigger) {
                            const newTriggerRect = trigger.getBoundingClientRect();
                            dropdown.dataset.triggerRect = JSON.stringify({
                                top: newTriggerRect.top,
                                left: newTriggerRect.left,
                                bottom: newTriggerRect.bottom,
                                width: newTriggerRect.width,
                                height: newTriggerRect.height
                            });
                            this.positionDropdown(dropdown);
                        }
                    }
                };
                
                window.addEventListener('scroll', repositionHandler, { passive: true });
                window.addEventListener('resize', repositionHandler);
                
                // Limpiar eventos cuando se cierre el dropdown
                const cleanup = () => {
                    window.removeEventListener('scroll', repositionHandler);
                    window.removeEventListener('resize', repositionHandler);
                };
                
                // Limpiar después de 30 segundos o cuando se cierre
                setTimeout(cleanup, 30000);
                dropdown._cleanupFunction = cleanup;
            }, 100);
        } else {
            dropdown.style.display = 'none';
            
            // Limpiar eventos de scroll/resize
            if (dropdown._cleanupFunction && typeof dropdown._cleanupFunction === 'function') {
                dropdown._cleanupFunction();
                delete dropdown._cleanupFunction;
            }
        }
    }

    /**
     * Posicionar dropdown - VERSIÓN SIMPLE: PVP SIEMPRE ARRIBA
     */
    positionDropdown(dropdown) {
        // 🎯 USAR POSICIÓN GUARDADA DEL TRIGGER
        let triggerRect;
        if (dropdown.dataset.triggerRect) {
            triggerRect = JSON.parse(dropdown.dataset.triggerRect);
        } else {
            // Fallback: buscar trigger si no hay posición guardada
            const triggerId = dropdown.id.replace('Dropdown', 'Trigger');
            const trigger = document.getElementById(triggerId);
            
            if (!trigger) {
                return;
            }
            
            triggerRect = trigger.getBoundingClientRect();
        }
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const dropdownHeight = 300;
        const dropdownWidth = Math.max(triggerRect.width, 250);
        
        // Calcular posición horizontal
        let left = triggerRect.left;
        
        // Si no cabe a la derecha, ajustar hacia la izquierda
        if (left + dropdownWidth > viewportWidth - 10) {
            left = viewportWidth - dropdownWidth - 10;
        }
        
        // Asegurar que no se salga por la izquierda
        if (left < 10) {
            left = 10;
        }
        
        // 🎯 PVP DROPDOWNS: SIEMPRE ARRIBA
        const isPvpDropdown = dropdown.classList.contains('custom-move-select-dropdown') || 
                             dropdown.classList.contains('custom-item-select-dropdown');
        
        let top;
        if (isPvpDropdown) {
            // PVP: SIEMPRE ARRIBA
            top = triggerRect.top - dropdownHeight - 8;
            
            // Si no cabe arriba, ajustar altura
            if (top < 10) {
                const maxHeight = triggerRect.top - 20;
                dropdown.style.maxHeight = `${maxHeight}px`;
                top = triggerRect.top - maxHeight - 8;
            }
        } else {
            // Otros dropdowns: lógica normal
            const spaceBelow = viewportHeight - triggerRect.bottom - 20;
            if (spaceBelow >= dropdownHeight) {
                top = triggerRect.bottom + 8;
            } else {
                top = triggerRect.top - dropdownHeight - 8;
                if (top < 10) {
                    const maxHeight = triggerRect.top - 20;
                    dropdown.style.maxHeight = `${maxHeight}px`;
                    top = triggerRect.top - maxHeight - 8;
                }
            }
        }
        
        // Asegurar que no se salga por arriba
        if (top < 10) {
            top = 10;
        }
        
        // Aplicar posicionamiento CON FORZADO MÁXIMO
        dropdown.style.setProperty('position', 'fixed', 'important');
        dropdown.style.setProperty('top', `${top}px`, 'important');
        dropdown.style.setProperty('left', `${left}px`, 'important');
        dropdown.style.setProperty('width', `${dropdownWidth}px`, 'important');
        dropdown.style.setProperty('min-height', '200px', 'important');
        dropdown.style.setProperty('background-color', 'rgba(30, 30, 30, 0.98)', 'important');
        dropdown.style.setProperty('border', '2px solid var(--primary-color)', 'important');
        dropdown.style.setProperty('z-index', '99999', 'important');
        dropdown.style.setProperty('transform', 'none', 'important');
        dropdown.style.setProperty('margin', '0', 'important');
        dropdown.style.setProperty('padding', '0', 'important');
        
        // Añadir clase para estilos direccionales
        dropdown.classList.remove('dropdown-opens-upward', 'dropdown-opens-downward');
        const opensUpward = isPvpDropdown || top < triggerRect.top;
        dropdown.classList.add(opensUpward ? 'dropdown-opens-upward' : 'dropdown-opens-downward');
    }

    /**
     * Re-renderizar todos los dropdowns con traducciones actualizadas
     */
    async updateAllDropdownTranslations() {
        // Re-renderizar dropdowns de items
        const itemWrappers = document.querySelectorAll('.custom-item-select-wrapper');
        for (const wrapper of itemWrappers) {
            const slotIndex = parseInt(wrapper.dataset.slot);
            await this.updateItemDropdownTranslation(slotIndex);
        }
        
        // Re-renderizar dropdowns de movimientos
        const moveWrappers = document.querySelectorAll('.custom-move-select-wrapper');
        for (const wrapper of moveWrappers) {
            const slotIndex = parseInt(wrapper.dataset.slot);
            const moveIndex = parseInt(wrapper.dataset.moveIndex);
            await this.updateMoveDropdownTranslation(slotIndex, moveIndex);
        }
    }

    /**
     * Actualizar traducción de dropdown de items
     */
    async updateItemDropdownTranslation(slotIndex) {
        const trigger = document.getElementById(`itemSelectTrigger_${slotIndex}`);
        const optionsContainer = document.getElementById(`itemOptions_${slotIndex}`);
        
        if (!trigger || !optionsContainer) return;
        
        // Obtener valor actual
        const currentItemName = window.pvpTeamsUI?.currentTeam?.pokemons?.[slotIndex]?.item;
        
        // Actualizar trigger si hay item seleccionado
        if (currentItemName) {
            const item = window.pokemonDataLoader.itemsCache.find(i => i.name === currentItemName);
            if (item) {
                trigger.innerHTML = this.renderItemOption(item, true) + `
                    <svg class="custom-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        } else {
            // Actualizar placeholder
            trigger.querySelector('.custom-select-placeholder').textContent = 
                window.languageManager.getCurrentLanguage() === 'es' ? 'Seleccionar objeto...' : 'Select item...';
        }
        
        // Re-renderizar opciones si el dropdown está visible
        const dropdown = document.getElementById(`itemSelectDropdown_${slotIndex}`);
        if (dropdown && dropdown.style.display === 'block') {
            const items = window.pokemonDataLoader.itemsCache || [];
            this.renderItemOptions(optionsContainer, items);
        }
    }

    /**
     * Actualizar traducción de dropdown de movimientos
     */
    async updateMoveDropdownTranslation(slotIndex, moveIndex) {
        const trigger = document.getElementById(`moveSelectTrigger_${slotIndex}_${moveIndex}`);
        const optionsContainer = document.getElementById(`moveOptions_${slotIndex}_${moveIndex}`);
        
        if (!trigger || !optionsContainer) return;
        
        // Obtener valor actual (ahora es el ID del movimiento)
        const currentMoveId = window.pvpTeamsUI?.currentTeam?.pokemons?.[slotIndex]?.moves?.[moveIndex];
        
        // Actualizar trigger si hay movimiento seleccionado
        if (currentMoveId) {
            const move = window.pokemonDataLoader.movesCache.find(m => m.id == currentMoveId);
            if (move) {
                trigger.innerHTML = this.renderMoveOption(move, true) + `
                    <svg class="custom-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
            }
        } else {
            // Actualizar placeholder
            const placeholder = trigger.querySelector('.custom-select-placeholder');
            if (placeholder) {
                placeholder.textContent = 
                    window.languageManager.getCurrentLanguage() === 'es' ? 'Seleccionar movimiento...' : 'Select move...';
            }
        }
        
        // Re-renderizar opciones si el dropdown está visible
        const dropdown = document.getElementById(`moveSelectDropdown_${slotIndex}_${moveIndex}`);
        if (dropdown && dropdown.style.display === 'block') {
            const moves = window.pokemonDataLoader.movesCache || [];
            this.renderMoveOptions(optionsContainer, moves);
        }
    }
}

// Exportar instancia global
window.customDropdowns = new CustomDropdowns();