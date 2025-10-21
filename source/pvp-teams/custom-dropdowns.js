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
            // Buscar el movimiento en la caché
            const moves = window.pokemonDataLoader.movesCache || [];
            move = moves.find(m => m.name === move) || { 
                name: move, 
                displayName: window.PokeUtils.formatName(move),
                type: 'normal'
            };
        }

        // ✅ FILTRO CRÍTICO: No renderizar movimientos tipo Fairy (Gen VI+)
        if (move.type === 'fairy') {
            return ''; // Devolver vacío para que no se renderice
        }

        const typeIcon = window.pokemonDataLoader.getTypeIcon(move.type);
        const className = isTrigger ? 'custom-move-option-trigger' : 'custom-move-option';
        
        return `
            <div class="${className}" data-move-name="${move.name}">
                <span class="move-name">${move.displayName}</span>
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
                sprite: 'img/res/poke-types/box/type-normal-box-icon.png' // Placeholder
            };
        }

        const className = isTrigger ? 'custom-item-option-trigger' : 'custom-item-option';
        
        return `
            <div class="${className}" data-item-name="${item.name}">
                <img src="${item.sprite}" alt="${item.displayName}" class="item-sprite">
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

        // Cargar movimientos
        const moves = await window.pokemonDataLoader.loadAllMoves();

        // Renderizar opciones iniciales
        this.renderMoveOptions(finalOptionsContainer, moves);

        // Toggle dropdown - SOLO UN LISTENER
        finalTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(finalDropdown);
        });

        // Búsqueda
        if (finalSearchInput) {
            finalSearchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                const filtered = query ? window.pokemonDataLoader.searchMoves(query) : moves;
                this.renderMoveOptions(finalOptionsContainer, filtered);
            });
        }

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!finalDropdown.contains(e.target) && !finalTrigger.contains(e.target)) {
                finalDropdown.style.display = 'none';
            }
        });

        // Reposicionar dropdown cuando se hace scroll o resize
        const repositionHandler = () => {
            if (finalDropdown.style.display === 'block') {
                this.positionDropdown(finalDropdown);
            }
        };
        
        window.addEventListener('scroll', repositionHandler, true);
        window.addEventListener('resize', repositionHandler);
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
                const moveName = e.currentTarget.dataset.moveName;
                this.selectMove(container, moveName);
            });
        });
    }

    /**
     * Seleccionar movimiento
     */
    selectMove(container, moveName) {
        const wrapper = container.closest('.custom-move-select-wrapper');
        const slotIndex = parseInt(wrapper.dataset.slot);
        const moveIndex = parseInt(wrapper.dataset.moveIndex);
        
        const trigger = document.getElementById(`moveSelectTrigger_${slotIndex}_${moveIndex}`);
        const dropdown = document.getElementById(`moveSelectDropdown_${slotIndex}_${moveIndex}`);
        
        // Actualizar trigger
        const move = window.pokemonDataLoader.movesCache.find(m => m.name === moveName);
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
        }
        
        // Actualizar datos en PVP Teams UI
        if (window.pvpTeamsUI) {
            window.pvpTeamsUI.currentTeam.pokemons[slotIndex].moves[moveIndex] = moveName;
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
            }
        });

        // Reposicionar dropdown cuando se hace scroll o resize
        const repositionHandler = () => {
            if (finalDropdown.style.display === 'block') {
                this.positionDropdown(finalDropdown);
            }
        };
        
        window.addEventListener('scroll', repositionHandler, true);
        window.addEventListener('resize', repositionHandler);
    }

    /**
     * Renderizar opciones de objetos
     */
    renderItemOptions(container, items) {
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
        const slotIndex = parseInt(wrapper.dataset.slot);
        
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
        }
        
        // Actualizar datos en PVP Teams UI
        if (window.pvpTeamsUI) {
            window.pvpTeamsUI.currentTeam.pokemons[slotIndex].item = itemName;
            window.pvpTeams.scheduleAutoSave();
        }
    }

    /**
     * Toggle dropdown
     */
    toggleDropdown(dropdown) {
        // Cerrar otros dropdowns abiertos
        document.querySelectorAll('.custom-move-select-dropdown, .custom-item-select-dropdown').forEach(d => {
            if (d !== dropdown) {
                d.style.display = 'none';
            }
        });

        // Toggle actual dropdown
        const isCurrentlyHidden = dropdown.style.display === 'none';
        
        if (isCurrentlyHidden) {
            // Abrir dropdown
            // Posicionar correctamente antes de mostrar
            this.positionDropdown(dropdown);
            
            // Mostrar con requestAnimationFrame para asegurar posicionamiento
            requestAnimationFrame(() => {
                dropdown.style.display = 'block';
                
                // Focus en el input de búsqueda después de mostrar
                setTimeout(() => {
                    const searchInput = dropdown.querySelector('.custom-select-search-input');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 50);
            });
        } else {
            // Cerrar dropdown
            dropdown.style.display = 'none';
        }
    }

    /**
     * Posicionar dropdown correctamente con detección inteligente de espacio
     */
    positionDropdown(dropdown) {
        // Encontrar el trigger correspondiente
        const triggerId = dropdown.id.replace('Dropdown', 'Trigger');
        const trigger = document.getElementById(triggerId);
        
        if (!trigger) {
            return;
        }

        const triggerRect = trigger.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const dropdownHeight = 300; // max-height del dropdown
        const dropdownWidth = Math.max(triggerRect.width, 250); // Ancho mínimo
        
        // 🎯 DETECCIÓN INTELIGENTE DE ESPACIO DISPONIBLE
        const spaceBelow = viewportHeight - triggerRect.bottom - 20; // Espacio disponible abajo
        const spaceAbove = triggerRect.top - 20; // Espacio disponible arriba
        
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
        
        // 🎯 DECISIÓN: PVP DROPDOWNS SIEMPRE ARRIBA
        let top, opensUpward;
        
        // 🎯 PVP DROPDOWNS: FORZAR ARRIBA SIEMPRE
        const isPvpDropdown = dropdown.classList.contains('custom-move-select-dropdown') || 
                             dropdown.classList.contains('custom-item-select-dropdown');
        
        console.log(`🔍 Debug: Dropdown classes = ${dropdown.className}, isPvpDropdown = ${isPvpDropdown}`);
        
        if (isPvpDropdown) {
            // PVP: SIEMPRE ARRIBA
            opensUpward = true;
            top = triggerRect.top - dropdownHeight - 8; // 8px de separación hacia arriba
        } else {
            // Otros dropdowns: lógica normal
            const isBottomRow = triggerRect.bottom > viewportHeight * 0.6;
            if (isBottomRow || spaceBelow < dropdownHeight || spaceAbove > spaceBelow) {
                opensUpward = true;
                top = triggerRect.top - dropdownHeight - 8;
            } else {
                opensUpward = false;
                top = triggerRect.bottom + 8;
            }
        }
        
        // 🎯 AJUSTE DE ALTURA SI NO CABE COMPLETO
        let finalHeight = dropdownHeight;
        if (opensUpward && top < 10) {
            // No cabe arriba, ajustar altura
            finalHeight = Math.min(dropdownHeight, triggerRect.top - 20);
            top = triggerRect.top - finalHeight - 8;
        } else if (!opensUpward && top + dropdownHeight > viewportHeight - 10) {
            // No cabe abajo, ajustar altura
            finalHeight = Math.min(dropdownHeight, viewportHeight - top - 20);
        }
        
        // Asegurar que no se salga por arriba
        if (top < 10) {
            top = 10;
        }
        
        // 🎯 APLICAR POSICIONAMIENTO
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;
        dropdown.style.width = `${dropdownWidth}px`;
        dropdown.style.maxHeight = `${finalHeight}px`;
        dropdown.style.zIndex = '10000'; // Z-index alto para estar por encima
        
        // 🎯 AÑADIR CLASE PARA ESTILOS DIRECCIONALES (opcional)
        dropdown.classList.remove('dropdown-opens-upward', 'dropdown-opens-downward');
        dropdown.classList.add(opensUpward ? 'dropdown-opens-upward' : 'dropdown-opens-downward');
        
        console.log(`🎯 PVP Dropdown ${isPvpDropdown ? 'FORZADO ARRIBA' : 'NORMAL'}: ${opensUpward ? 'ARRIBA' : 'ABAJO'}`);
    }


    /**
     * Re-renderizar todos los dropdowns con traducciones actualizadas
     */
    async updateAllDropdownTranslations() {
        // Re-renderizar dropdowns de items
        document.querySelectorAll('.custom-item-select-wrapper').forEach(async wrapper => {
            const slotIndex = parseInt(wrapper.dataset.slot);
            await this.updateItemDropdownTranslation(slotIndex);
        });
        
        // Re-renderizar dropdowns de movimientos
        document.querySelectorAll('.custom-move-select-wrapper').forEach(async wrapper => {
            const slotIndex = parseInt(wrapper.dataset.slot);
            const moveIndex = parseInt(wrapper.dataset.moveIndex);
            await this.updateMoveDropdownTranslation(slotIndex, moveIndex);
        });
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
        
        // Obtener valor actual
        const currentMoveName = window.pvpTeamsUI?.currentTeam?.pokemons?.[slotIndex]?.moves?.[moveIndex];
        
        // Actualizar trigger si hay movimiento seleccionado
        if (currentMoveName) {
            const move = window.pokemonDataLoader.movesCache.find(m => m.name === currentMoveName);
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

