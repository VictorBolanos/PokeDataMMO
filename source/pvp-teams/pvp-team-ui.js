// PVP Teams - User Interface
class PVPTeamUI {
    constructor() {
        this.currentTeam = null;  // Datos del equipo actual
    }

    /**
     * Renderizar UI inicial con Load/New
     */
    async renderInitialUI() {
        const pvpTab = document.getElementById('pvp');
        if (!pvpTab) return;

        const lm = window.languageManager;
        const isAuthenticated = window.authManager && window.authManager.isAuthenticated();

        if (!isAuthenticated) {
            pvpTab.innerHTML = `
                <div class="pvp-teams-container">
                    <div class="pvp-teams-header text-center">
                        <h2 class="mb-3" id="pvpTeamsTitle">
                            ⚔️ ${lm.getCurrentLanguage() === 'es' ? 'Equipos PVP' : 'PVP Teams'}
                        </h2>
                        <p class="lead mb-4" id="pvpTeamsSubtitle">
                            ${lm.getCurrentLanguage() === 'es' 
                                ? 'Sistema de gestión de equipos competitivos' 
                                : 'Competitive team management system'}
                        </p>
                        <div class="alert alert-warning">
                            <strong>${lm.getCurrentLanguage() === 'es' ? '⚠️ Inicio de sesión requerido' : '⚠️ Login Required'}</strong><br>
                            ${lm.getCurrentLanguage() === 'es' 
                                ? 'Debes iniciar sesión para gestionar tus equipos PVP.' 
                                : 'You must log in to manage your PVP teams.'}
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Cargar lista de equipos guardados
        const teamsResult = await window.authManager.getAllPVPTeams();
        const hasSavedTeams = teamsResult.success && teamsResult.list.length > 0;

        pvpTab.innerHTML = `
            <div class="pvp-teams-container">
                <div class="pvp-teams-header">
                    <h2 class="d-flex align-items-center justify-content-center gap-3 mb-3" id="pvpTeamsTitle">
                        ⚔️ ${lm.getCurrentLanguage() === 'es' ? 'Equipos PVP' : 'PVP Teams'}
                    </h2>
                    <p class="lead mb-4 text-center" id="pvpTeamsSubtitle">
                        ${lm.getCurrentLanguage() === 'es' 
                            ? 'Sistema de gestión de equipos competitivos' 
                            : 'Competitive team management system'}
                    </p>
                </div>

                <!-- Load/New Controls -->
                <div class="pvp-teams-load-new-controls mb-5">
                    <div class="row align-items-center">
                        <div class="col-auto">
                            <button class="btn btn-danger" id="deleteTeamBtn" disabled title="${lm.getCurrentLanguage() === 'es' ? 'Eliminar equipo' : 'Delete team'}">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="col">
                            <label class="form-label text-white mb-2" id="labelLoadTeam">
                                ⚔️ ${lm.getCurrentLanguage() === 'es' ? 'Cargar Equipo Guardado' : 'Load Saved Team'}
                            </label>
                            <select class="form-control" id="loadTeamSelect" ${!hasSavedTeams ? 'disabled' : ''}>
                                <option value="" id="loadTeamPlaceholder">
                                    ${hasSavedTeams 
                                        ? (lm.getCurrentLanguage() === 'es' ? 'Selecciona un equipo...' : 'Select a team...') 
                                        : (lm.getCurrentLanguage() === 'es' ? 'No hay equipos guardados' : 'No saved teams')}
                                </option>
                                ${hasSavedTeams ? teamsResult.list.map(name => `
                                    <option value="${name}">${name}</option>
                                `).join('') : ''}
                            </select>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-primary" id="newTeamBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                <span id="newTeamBtnText">${lm.getCurrentLanguage() === 'es' ? 'Nuevo Equipo' : 'New Team'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Team Container (hidden initially) -->
                <div id="teamMainContent" style="display: none;">
                    <!-- Se llenará dinámicamente -->
                </div>
            </div>
        `;

        this.setupLoadNewControls();
    }

    /**
     * Configurar controles de Load/New
     */
    setupLoadNewControls() {
        const loadSelect = document.getElementById('loadTeamSelect');
        const newBtn = document.getElementById('newTeamBtn');
        const deleteBtn = document.getElementById('deleteTeamBtn');

        if (loadSelect) {
            loadSelect.addEventListener('change', async (e) => {
                const teamName = e.target.value;
                if (teamName) {
                    await window.pvpTeams.loadTeam(teamName);
                }
                
                // Habilitar/deshabilitar botón de eliminar según selección
                if (deleteBtn) {
                    deleteBtn.disabled = !teamName;
                }
            });
        }

        if (newBtn) {
            newBtn.addEventListener('click', async () => {
                await window.pvpTeams.createNewTeam();
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                const selectedTeam = loadSelect?.value;
                if (!selectedTeam) return;
                
                await this.deleteSelectedTeam(selectedTeam);
            });
        }
    }

    /**
     * Asegurar que siempre hay 6 slots de Pokémon
     */
    ensureSixSlots(pokemons) {
        const sixSlots = Array(6).fill(null);
        
        // Copiar Pokémon existentes a sus posiciones
        pokemons.forEach((pokemon, index) => {
            if (index < 6 && pokemon && pokemon.id) {
                sixSlots[index] = pokemon;
            }
        });
        
        // Rellenar slots vacíos con Pokémon vacío
        return sixSlots.map(pokemon => 
            pokemon || window.pvpTeamData.createEmptyPokemon()
        );
    }

    /**
     * Renderizar editor de equipo completo
     */
    async renderTeamEditor(data = null) {
        const teamContent = document.getElementById('teamMainContent');
        if (!teamContent) return;

        const lm = window.languageManager;

        // Inicializar equipo actual - SIEMPRE asegurar 6 slots
        if (data) {
            this.currentTeam = {
                teamName: data.teamName || '',
                pokemons: this.ensureSixSlots(data.pokemons || [])
            };
        } else {
            this.currentTeam = {
                teamName: '',
                pokemons: Array(6).fill(null).map(() => window.pvpTeamData.createEmptyPokemon())
            };
        }

        teamContent.innerHTML = `
            <!-- Save Indicator -->
            <div class="save-indicator" id="pvpSaveIndicator" style="display: none;">
                <span id="pvpSaveIndicatorText"></span>
            </div>

            <!-- Team Name Input -->
            <div class="row mb-4">
                <div class="col-md-12">
                    <label class="form-label text-white mb-2" id="labelTeamName">
                        📝 ${lm.getCurrentLanguage() === 'es' ? 'Nombre del Equipo' : 'Team Name'}
                        <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" id="teamNameInput" 
                           placeholder="${lm.getCurrentLanguage() === 'es' ? 'Ej: OU Main Team' : 'E.g: OU Main Team'}"
                           value="${data?.teamName || ''}" required>
                    <small class="form-text text-muted" id="teamNameHelp">
                        ${lm.getCurrentLanguage() === 'es' ? 'Este nombre identifica tu equipo' : 'This name identifies your team'}
                    </small>
                    <div class="invalid-feedback" id="teamNameError" style="display: none;">
                        ${lm.t('pvpTeams.nameRequired')}
                    </div>
                </div>
            </div>

            <!-- Main Team Content (hidden until name is provided) -->
            <div id="pvpTeamMainContent" style="display: none;">
            <!-- Pokémon Grid (2x3) -->
            <div class="pokemon-team-grid">
                ${this.currentTeam.pokemons.map((pokemon, index) => 
                    pokemon && pokemon.id 
                        ? window.pokemonBuilder.renderPokemonCard(pokemon, index)
                        : window.pokemonBuilder.renderEmptyCard(index)
                ).join('')}
            </div>
            </div> <!-- End of pvpTeamMainContent -->
        `;

        teamContent.style.display = 'block';

        // Setup event listeners
        this.setupTeamNameListener();
        this.setupPokemonEventListeners();
        
        // Sincronizar radio buttons de nivel al cargar
        this.syncAllLevelRadioButtons(window.pvpTeamData.getSelectedLevel());
        
        // Si hay datos, poblar dropdowns
        if (data && data.pokemons) {
            await this.populateDropdowns(data.pokemons);
        }
        
        // Actualizar totales de EVs para todos los Pokémon
        this.currentTeam.pokemons.forEach((pokemon, index) => {
            if (pokemon && pokemon.id) {
                this.updateEVTotal(index);
            }
        });
    }

    /**
     * Configurar listener para nombre del equipo
     */
    setupTeamNameListener() {
        const nameInput = document.getElementById('teamNameInput');
        const mainContent = document.getElementById('pvpTeamMainContent');
        const errorDiv = document.getElementById('teamNameError');
        
        if (!nameInput || !mainContent) return;

        // Función para validar y mostrar/ocultar contenido
        const validateAndToggleContent = (value) => {
            const trimmedValue = value.trim();
            const isValid = trimmedValue.length > 0;
            
            if (isValid) {
                // Mostrar contenido principal
                mainContent.style.display = 'block';
                nameInput.classList.remove('is-invalid');
                if (errorDiv) errorDiv.style.display = 'none';
                
                // Actualizar nombre en el controlador
                this.currentTeam.teamName = trimmedValue;
                window.pvpTeams.setTeamName(trimmedValue);
                window.pvpTeams.scheduleAutoSave();
            } else {
                // Ocultar contenido principal
                mainContent.style.display = 'none';
                nameInput.classList.add('is-invalid');
                if (errorDiv) errorDiv.style.display = 'block';
                
                // CRÍTICO: Cancelar auto-guardado si se borra el nombre
                window.pvpTeams.cancelAutoSave();
                window.pvpTeams.setTeamName('');
            }
        };

        // Event listener para cambios en tiempo real
        nameInput.addEventListener('input', (e) => {
            validateAndToggleContent(e.target.value);
        });

        // Validación inicial si ya hay un valor
        if (nameInput.value.trim()) {
            validateAndToggleContent(nameInput.value);
        }
    }

    /**
     * Configurar event listeners de Pokémon
     */
    setupPokemonEventListeners() {
        // Level radio buttons
        document.querySelectorAll('input[name^="level-"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleLevelChange(e.target);
            });
        });

        // EVs inputs
        document.querySelectorAll('.ev-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleEVChange(e.target);
            });
        });

        // IVs inputs
        document.querySelectorAll('.iv-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleIVChange(e.target);
            });
        });

        // Nature selects
        document.querySelectorAll('.nature-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleNatureChange(e.target);
            });
        });

        // Ability selects
        document.querySelectorAll('.ability-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleAbilityChange(e.target);
            });
        });

        // Inicializar dropdowns personalizados de items
        document.querySelectorAll('.custom-item-select-wrapper').forEach(wrapper => {
            const slotIndex = parseInt(wrapper.dataset.slot);
            const selectedItem = this.currentTeam.pokemons[slotIndex]?.item || '';
            window.customDropdowns.initItemSelect(slotIndex, selectedItem);
        });

        // Inicializar dropdowns personalizados de movimientos
        document.querySelectorAll('.custom-move-select-wrapper').forEach(wrapper => {
            const slotIndex = parseInt(wrapper.dataset.slot);
            const moveIndex = parseInt(wrapper.dataset.moveIndex);
            const selectedMove = this.currentTeam.pokemons[slotIndex]?.moves[moveIndex] || '';
            window.customDropdowns.initMoveSelect(slotIndex, moveIndex, selectedMove);
        });
    }

    /**
     * Manejar cambio de nivel
     */
    handleLevelChange(radioButton) {
        const slotIndex = parseInt(radioButton.name.split('-')[1]);
        const newLevel = parseInt(radioButton.value);
        
        console.log(`🎮 Cambiando nivel a ${newLevel} desde el slot ${slotIndex}`);
        
        // Actualizar nivel en el sistema de datos (GLOBAL)
        window.pvpTeamData.setSelectedLevel(newLevel);
        console.log(`✅ Nivel global actualizado a: ${window.pvpTeamData.getSelectedLevel()}`);
        
        // Sincronizar todos los radio buttons del equipo
        this.syncAllLevelRadioButtons(newLevel);
        console.log(`✅ Radio buttons sincronizados a nivel ${newLevel}`);
        
        // Recalcular stats para TODOS los Pokémon del equipo
        this.recalculateAllPokemonStats();
        console.log(`✅ Stats de todos los Pokémon recalculados`);
        
        // Programar auto-save
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Sincronizar todos los radio buttons de nivel
     */
    syncAllLevelRadioButtons(level) {
        document.querySelectorAll(`input[name^="level-"][value="${level}"]`).forEach(radio => {
            radio.checked = true;
        });
        
        document.querySelectorAll(`input[name^="level-"][value="${level === 50 ? 100 : 50}"]`).forEach(radio => {
            radio.checked = false;
        });
    }

    /**
     * Recalcular stats de TODOS los Pokémon del equipo
     */
    recalculateAllPokemonStats() {
        this.currentTeam.pokemons.forEach((pokemon, slotIndex) => {
            if (pokemon && pokemon.id) {
                this.recalculatePokemonStats(slotIndex);
            }
        });
    }

    /**
     * Recalcular stats de un Pokémon específico
     */
    recalculatePokemonStats(slotIndex) {
        const pokemon = this.currentTeam.pokemons[slotIndex];
        if (!pokemon || !pokemon.id) {
            console.log(`⚠️ Slot ${slotIndex}: Pokémon vacío, omitiendo recálculo`);
            return;
        }
        
        console.log(`🔄 Recalculando stats del slot ${slotIndex} (${pokemon.name})`);
        
        // Recalcular stats con el nuevo nivel
        const newStats = window.pvpTeamData.calculateAllStats(
            pokemon.baseStats,
            pokemon.evs,
            pokemon.ivs,
            pokemon.nature
        );
        
        console.log(`📊 Nuevos stats calculados para ${pokemon.name}:`, newStats);
        
        // Actualizar stats en el Pokémon
        pokemon.finalStats = newStats;
        
        // Actualizar UI
        this.updatePokemonStatsDisplay(slotIndex, newStats);
        console.log(`✅ UI actualizada para slot ${slotIndex}`);
    }

    /**
     * Actualizar display de stats en la UI
     */
    updatePokemonStatsDisplay(slotIndex, stats) {
        console.log(`🎨 Actualizando display de stats para slot ${slotIndex}:`, stats);
        
        // Actualizar valores de stats finales usando el ID específico
        Object.keys(stats).forEach(statName => {
            const elementId = `finalStat_${slotIndex}_${statName}`;
            const finalStatElement = document.getElementById(elementId);
            
            if (finalStatElement) {
                const oldValue = finalStatElement.textContent;
                const newValue = stats[statName];
                finalStatElement.textContent = newValue;
                console.log(`  ✅ ${statName}: ${oldValue} → ${newValue}`);
            } else {
                console.warn(`  ⚠️ No se encontró el elemento: ${elementId}`);
            }
        });
    }

    /**
     * Manejar cambio de EV
     */
    handleEVChange(input) {
        const slotIndex = parseInt(input.dataset.slot);
        const statName = input.dataset.stat;
        let value = parseInt(input.value) || 0;

        // Validar límite individual
        if (value > window.pvpTeamData.MAX_EV_INDIVIDUAL) {
            value = window.pvpTeamData.MAX_EV_INDIVIDUAL;
            input.value = value;
        }

        // Actualizar en currentTeam
        this.currentTeam.pokemons[slotIndex].evs[statName] = value;

        // Validar total
        const totalEVs = window.pvpTeamData.getTotalEVs(this.currentTeam.pokemons[slotIndex].evs);
        
        if (totalEVs > window.pvpTeamData.MAX_EV_TOTAL) {
            // Revertir cambio
            this.currentTeam.pokemons[slotIndex].evs[statName] -= (totalEVs - window.pvpTeamData.MAX_EV_TOTAL);
            input.value = this.currentTeam.pokemons[slotIndex].evs[statName];
        }

        // Actualizar display de total
        this.updateEVTotal(slotIndex);

        // Recalcular stats
        this.recalculateStats(slotIndex);

        // Auto-save
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Manejar cambio de IV
     */
    handleIVChange(input) {
        const slotIndex = parseInt(input.dataset.slot);
        const statName = input.dataset.stat;
        let value = parseInt(input.value) || 0;

        // Validar límite
        if (value > window.pvpTeamData.MAX_IV) {
            value = window.pvpTeamData.MAX_IV;
            input.value = value;
        }

        // Actualizar en currentTeam
        this.currentTeam.pokemons[slotIndex].ivs[statName] = value;

        // Recalcular stats
        this.recalculateStats(slotIndex);

        // Auto-save
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Manejar cambio de naturaleza
     */
    async handleNatureChange(select) {
        const slotIndex = parseInt(select.dataset.slot);
        const natureName = select.value;

        // Buscar datos de la naturaleza
        const natures = await window.pvpTeamData.loadNatures();
        const nature = natures.find(n => n.name === natureName);

        // Actualizar en currentTeam
        this.currentTeam.pokemons[slotIndex].nature = nature;

        // Recalcular stats
        this.recalculateStats(slotIndex);

        // Auto-save
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Manejar cambio de habilidad
     */
    handleAbilityChange(select) {
        const slotIndex = parseInt(select.dataset.slot);
        this.currentTeam.pokemons[slotIndex].ability = select.value;
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Manejar cambio de objeto
     */
    handleItemChange(select) {
        const slotIndex = parseInt(select.dataset.slot);
        this.currentTeam.pokemons[slotIndex].item = select.value;
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Manejar cambio de movimiento
     */
    handleMoveChange(select) {
        const slotIndex = parseInt(select.dataset.slot);
        const moveIndex = parseInt(select.dataset.moveIndex);
        this.currentTeam.pokemons[slotIndex].moves[moveIndex] = select.value;
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Actualizar total de EVs
     */
    updateEVTotal(slotIndex) {
        const totalEVs = window.pvpTeamData.getTotalEVs(this.currentTeam.pokemons[slotIndex].evs);
        const totalElement = document.getElementById(`evTotal_${slotIndex}`);
        
        if (totalElement) {
            totalElement.textContent = totalEVs;
            
            // Colorear si excede
            if (totalEVs > window.pvpTeamData.MAX_EV_TOTAL) {
                totalElement.style.color = '#ef4444';
                totalElement.style.fontWeight = 'bold';
            } else {
                totalElement.style.color = '#22c55e';
                totalElement.style.fontWeight = 'normal';
            }
        }
    }

    /**
     * Recalcular stats finales
     */
    recalculateStats(slotIndex) {
        const pokemon = this.currentTeam.pokemons[slotIndex];
        
        // Calcular stats
        const finalStats = window.pvpTeamData.calculateAllStats(
            pokemon.baseStats,
            pokemon.evs,
            pokemon.ivs,
            pokemon.nature
        );

        // Actualizar en currentTeam
        pokemon.finalStats = finalStats;

        // Actualizar UI
        window.pvpTeamData.statsOrder.forEach(statName => {
            const statElement = document.getElementById(`finalStat_${slotIndex}_${statName}`);
            if (statElement) {
                statElement.textContent = finalStats[statName];
            }
        });
    }

    /**
     * Actualizar slot de Pokémon
     */
    async updatePokemonSlot(slotIndex, pokemon) {
        this.currentTeam.pokemons[slotIndex] = pokemon;

        // Re-renderizar grid
        const grid = document.querySelector('.pokemon-team-grid');
        if (grid) {
            const slots = grid.children;
            if (slots[slotIndex]) {
                slots[slotIndex].outerHTML = window.pokemonBuilder.renderPokemonCard(pokemon, slotIndex);
            }
        }

        // Re-setup event listeners
        this.setupPokemonEventListeners();
        
        // Sincronizar radio buttons de nivel
        this.syncAllLevelRadioButtons(window.pvpTeamData.getSelectedLevel());

        // Poblar dropdowns para este Pokémon
        await this.populateDropdownsForSlot(slotIndex, pokemon);

        // Auto-save
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Poblar dropdowns de un slot específico
     */
    async populateDropdownsForSlot(slotIndex, pokemon) {
        // Poblar naturalezas
        const natureSelect = document.getElementById(`nature_${slotIndex}`);
        if (natureSelect) {
            const natures = await window.pvpTeamData.loadNatures();
            natures.forEach(nature => {
                const option = document.createElement('option');
                option.value = nature.name;
                option.textContent = this.formatNatureName(nature);
                if (pokemon.nature && pokemon.nature.name === nature.name) {
                    option.selected = true;
                }
                natureSelect.appendChild(option);
            });
        }

        // Poblar habilidades
        const abilitySelect = document.getElementById(`ability_${slotIndex}`);
        if (abilitySelect && pokemon.availableAbilities) {
            // Cargar traducciones de las habilidades
            const abilities = await window.pokemonDataLoader.loadAbilities(pokemon.availableAbilities);
            
            abilities.forEach(ability => {
                const option = document.createElement('option');
                option.value = ability.name;
                option.textContent = ability.displayName;
                if (pokemon.ability === ability.name) {
                    option.selected = true;
                }
                abilitySelect.appendChild(option);
            });
        }

        // Poblar movimientos
        if (pokemon.availableMoves) {
            [0, 1, 2, 3].forEach(moveIndex => {
                const moveSelect = document.getElementById(`move_${slotIndex}_${moveIndex}`);
                if (moveSelect) {
                    pokemon.availableMoves.forEach(move => {
                        const option = document.createElement('option');
                        option.value = move;
                        option.textContent = this.capitalizeText(move);
                        if (pokemon.moves[moveIndex] === move) {
                            option.selected = true;
                        }
                        moveSelect.appendChild(option);
                    });
                }
            });
        }
    }

    /**
     * Poblar todos los dropdowns
     */
    async populateDropdowns(pokemons) {
        for (let i = 0; i < pokemons.length; i++) {
            if (pokemons[i] && pokemons[i].id) {
                await this.populateDropdownsForSlot(i, pokemons[i]);
            }
        }
    }

    /**
     * Remover Pokémon de un slot
     */
    removePokemon(slotIndex) {
        this.currentTeam.pokemons[slotIndex] = window.pvpTeamData.createEmptyPokemon();

        // Re-renderizar grid
        const grid = document.querySelector('.pokemon-team-grid');
        if (grid) {
            const slots = grid.children;
            if (slots[slotIndex]) {
                slots[slotIndex].outerHTML = window.pokemonBuilder.renderEmptyCard(slotIndex);
            }
        }

        // Auto-save
        window.pvpTeams.scheduleAutoSave();
    }

    /**
     * Recopilar datos del equipo actual
     */
    collectTeamData() {
        return {
            teamName: this.currentTeam.teamName,
            pokemons: this.currentTeam.pokemons.filter(p => p && p.id)  // Solo Pokémon válidos
        };
    }

    /**
     * Eliminar equipo seleccionado
     */
    async deleteSelectedTeam(teamName) {
        const lm = window.languageManager;
        const confirmMessage = lm.getCurrentLanguage() === 'es' 
            ? `¿Estás seguro de que deseas eliminar el equipo "${teamName}"?\n\nEsta acción no se puede deshacer.`
            : `Are you sure you want to delete the team "${teamName}"?\n\nThis action cannot be undone.`;
        
        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            // Eliminar de la base de datos
            const result = await window.authManager.deletePVPTeam(teamName);
            
            if (result.success) {
                console.log('✅ Team deleted:', teamName);
                
                // Mostrar mensaje de éxito
                alert(lm.getCurrentLanguage() === 'es' 
                    ? '✅ Equipo eliminado correctamente'
                    : '✅ Team deleted successfully');
                
                // Re-renderizar la UI inicial para actualizar la lista
                await this.renderInitialUI();
            } else {
                console.error('❌ Delete error:', result.message);
                alert(lm.getCurrentLanguage() === 'es' 
                    ? '❌ Error al eliminar el equipo'
                    : '❌ Error deleting team');
            }
        } catch (error) {
            console.error('❌ Delete error:', error);
            alert(lm.getCurrentLanguage() === 'es' 
                ? '❌ Error al eliminar el equipo'
                : '❌ Error deleting team');
        }
    }

    /**
     * Mostrar indicador de guardado
     */
    showSaveIndicator(status) {
        const indicator = document.getElementById('pvpSaveIndicator');
        const text = document.getElementById('pvpSaveIndicatorText');
        
        if (!indicator || !text) return;

        const lm = window.languageManager;

        if (status === 'success') {
            indicator.className = 'save-indicator success';
            text.textContent = lm.getCurrentLanguage() === 'es' 
                ? '✅ Guardado automáticamente' 
                : '✅ Auto-saved';
        } else if (status === 'error') {
            indicator.className = 'save-indicator error';
            text.textContent = lm.getCurrentLanguage() === 'es' 
                ? '❌ Error al guardar' 
                : '❌ Error saving';
        }

        indicator.style.display = 'block';

        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }

    /**
     * Formatear nombre de naturaleza
     */
    formatNatureName(nature) {
        // Usar displayName traducido en lugar de capitalizar manualmente
        const name = nature.displayName || this.capitalizeText(nature.name);
        
        if (!nature.increased_stat) return name;
        
        const increased = window.pvpTeamData.getStatDisplayName(nature.increased_stat);
        const decreased = window.pvpTeamData.getStatDisplayName(nature.decreased_stat);
        
        return `${name} (+${increased} -${decreased})`;
    }

    /**
     * Capitalizar texto
     */
    capitalizeText(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, ' ');
    }

    /**
     * Actualizar traducciones dinámicas
     */
    updateTranslations() {
        const lm = window.languageManager;
        
        // Verificar si la UI está renderizada
        if (!document.getElementById('pvpTeamsTitle')) return;

        // Actualizar mensaje de validación de nombre (si existe)
        const teamNameError = document.getElementById('teamNameError');
        if (teamNameError) {
            teamNameError.textContent = lm.t('pvpTeams.nameRequired');
        }

        // Títulos principales
        const title = document.getElementById('pvpTeamsTitle');
        const subtitle = document.getElementById('pvpTeamsSubtitle');
        
        if (title) {
            title.innerHTML = `⚔️ ${lm.getCurrentLanguage() === 'es' ? 'Equipos PVP' : 'PVP Teams'}`;
        }
        
        if (subtitle) {
            subtitle.textContent = lm.getCurrentLanguage() === 'es' 
                ? 'Sistema de gestión de equipos competitivos' 
                : 'Competitive team management system';
        }

        // Load/New Controls
        const labelLoadTeam = document.getElementById('labelLoadTeam');
        if (labelLoadTeam) {
            labelLoadTeam.innerHTML = `⚔️ ${lm.getCurrentLanguage() === 'es' ? 'Cargar Equipo Guardado' : 'Load Saved Team'}`;
        }

        const newTeamBtnText = document.getElementById('newTeamBtnText');
        if (newTeamBtnText) {
            newTeamBtnText.textContent = lm.getCurrentLanguage() === 'es' ? 'Nuevo Equipo' : 'New Team';
        }

        const loadTeamPlaceholder = document.getElementById('loadTeamPlaceholder');
        if (loadTeamPlaceholder) {
            const loadSelect = document.getElementById('loadTeamSelect');
            const hasOptions = loadSelect && loadSelect.options.length > 1;
            loadTeamPlaceholder.textContent = hasOptions 
                ? (lm.getCurrentLanguage() === 'es' ? 'Selecciona un equipo...' : 'Select a team...')
                : (lm.getCurrentLanguage() === 'es' ? 'No hay equipos guardados' : 'No saved teams');
        }

        // Team Name
        const labelTeamName = document.getElementById('labelTeamName');
        if (labelTeamName) {
            labelTeamName.innerHTML = `📝 ${lm.getCurrentLanguage() === 'es' ? 'Nombre del Equipo' : 'Team Name'} <span class="text-danger">*</span>`;
        }

        const teamNameHelp = document.getElementById('teamNameHelp');
        if (teamNameHelp) {
            teamNameHelp.textContent = lm.getCurrentLanguage() === 'es' 
                ? 'Este nombre identifica tu equipo' 
                : 'This name identifies your team';
        }

        const teamNameInput = document.getElementById('teamNameInput');
        if (teamNameInput) {
            teamNameInput.placeholder = lm.getCurrentLanguage() === 'es' 
                ? 'Ej: OU Main Team' 
                : 'E.g: OU Main Team';
        }

        // Actualizar labels de stats en todas las tablas
        document.querySelectorAll('.pokemon-stats-table').forEach(table => {
            const headers = table.querySelectorAll('th');
            if (headers.length >= 5) {
                headers[0].textContent = lm.getCurrentLanguage() === 'es' ? 'Stat' : 'Stat';
                headers[1].textContent = lm.getCurrentLanguage() === 'es' ? 'Base' : 'Base';
                headers[4].textContent = lm.getCurrentLanguage() === 'es' ? 'Final' : 'Final';
            }
        });

        // Actualizar nombres de stats
        document.querySelectorAll('.stat-name').forEach((el, index) => {
            const statName = window.pvpTeamData.statsOrder[index % 6];
            if (statName) {
                el.textContent = window.pvpTeamData.getStatDisplayName(statName);
            }
        });

        // Actualizar "Total EVs"
        document.querySelectorAll('.ev-total-display').forEach(display => {
            const text = display.childNodes[0];
            if (text && text.nodeType === Node.TEXT_NODE) {
                text.textContent = lm.getCurrentLanguage() === 'es' ? 'Total EVs: ' : 'Total EVs: ';
            }
        });

        // Actualizar labels de atributos
        document.querySelectorAll('.form-label-sm').forEach((label, index) => {
            const labelIndex = index % 4;
            const labels = [
                lm.getCurrentLanguage() === 'es' ? 'Naturaleza' : 'Nature',
                lm.getCurrentLanguage() === 'es' ? 'Habilidad' : 'Ability',
                lm.getCurrentLanguage() === 'es' ? 'Objeto' : 'Item',
                lm.getCurrentLanguage() === 'es' ? 'Movimientos' : 'Moves'
            ];
            label.textContent = labels[labelIndex];
        });
        
        // Actualizar label de nivel
        document.querySelectorAll('.level-label').forEach(label => {
            label.textContent = lm.getCurrentLanguage() === 'es' ? 'Nivel:' : 'Level:';
        });
        
        // RE-POBLAR DROPDOWNS CON TRADUCCIONES ACTUALIZADAS
        this.repopulateAllDropdowns();
        
        // RE-RENDERIZAR DROPDOWNS PERSONALIZADOS (ITEMS Y MOVIMIENTOS)
        if (window.customDropdowns) {
            window.customDropdowns.updateAllDropdownTranslations();
        }
    }

    /**
     * Re-poblar todos los dropdowns con traducciones actualizadas
     */
    async repopulateAllDropdowns() {
        if (!this.currentTeam || !this.currentTeam.pokemons) return;
        
        console.log('🔄 Re-poblando dropdowns con nuevas traducciones...');
        
        // Re-poblar naturalezas y habilidades para cada Pokémon
        for (let slotIndex = 0; slotIndex < this.currentTeam.pokemons.length; slotIndex++) {
            const pokemon = this.currentTeam.pokemons[slotIndex];
            if (pokemon && pokemon.id) {
                await this.repopulateNatureDropdown(slotIndex, pokemon);
                await this.repopulateAbilityDropdown(slotIndex, pokemon);
            }
        }
        
        console.log('✅ Dropdowns actualizados con nuevas traducciones');
    }

    /**
     * Re-poblar dropdown de naturalezas
     */
    async repopulateNatureDropdown(slotIndex, pokemon) {
        const natureSelect = document.getElementById(`nature_${slotIndex}`);
        if (!natureSelect) return;
        
        const currentValue = natureSelect.value;
        
        // Limpiar opciones actuales
        natureSelect.innerHTML = '<option value="">--</option>';
        
        // Re-poblar con traducciones actualizadas
        const natures = await window.pvpTeamData.loadNatures();
        natures.forEach(nature => {
            const option = document.createElement('option');
            option.value = nature.name;
            option.textContent = this.formatNatureName(nature);
            if (nature.name === currentValue) {
                option.selected = true;
            }
            natureSelect.appendChild(option);
        });
    }

    /**
     * Re-poblar dropdown de habilidades
     */
    async repopulateAbilityDropdown(slotIndex, pokemon) {
        const abilitySelect = document.getElementById(`ability_${slotIndex}`);
        if (!abilitySelect || !pokemon.availableAbilities) return;
        
        const currentValue = abilitySelect.value;
        
        // Limpiar opciones actuales
        abilitySelect.innerHTML = '<option value="">--</option>';
        
        // Re-cargar con traducciones actualizadas
        const abilities = await window.pokemonDataLoader.loadAbilities(pokemon.availableAbilities);
        
        abilities.forEach(ability => {
            const option = document.createElement('option');
            option.value = ability.name;
            option.textContent = ability.displayName;
            if (ability.name === currentValue) {
                option.selected = true;
            }
            abilitySelect.appendChild(option);
        });
    }
}

// Exportar instancia global
window.pvpTeamsUI = new PVPTeamUI();

