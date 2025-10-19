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
                    <div class="row align-items-end">
                        <div class="col-md-8">
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
                        <div class="col-md-4">
                            <button class="btn btn-primary w-100" id="newTeamBtn">
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

        if (loadSelect) {
            loadSelect.addEventListener('change', async (e) => {
                const teamName = e.target.value;
                if (teamName) {
                    await window.pvpTeams.loadTeam(teamName);
                }
            });
        }

        if (newBtn) {
            newBtn.addEventListener('click', async () => {
                await window.pvpTeams.createNewTeam();
            });
        }
    }

    /**
     * Renderizar editor de equipo completo
     */
    async renderTeamEditor(data = null) {
        const teamContent = document.getElementById('teamMainContent');
        if (!teamContent) return;

        const lm = window.languageManager;

        // Inicializar equipo actual
        if (data) {
            this.currentTeam = data;
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
                </div>
            </div>

            <!-- Pokémon Grid (2x3) -->
            <div class="pokemon-team-grid">
                ${this.currentTeam.pokemons.map((pokemon, index) => 
                    pokemon && pokemon.id 
                        ? window.pokemonBuilder.renderPokemonCard(pokemon, index)
                        : window.pokemonBuilder.renderEmptyCard(index)
                ).join('')}
            </div>
        `;

        teamContent.style.display = 'block';

        // Setup event listeners
        this.setupTeamNameListener();
        this.setupPokemonEventListeners();
        
        // Si hay datos, poblar dropdowns
        if (data && data.pokemons) {
            await this.populateDropdowns(data.pokemons);
        }
    }

    /**
     * Configurar listener para nombre del equipo
     */
    setupTeamNameListener() {
        const nameInput = document.getElementById('teamNameInput');
        if (!nameInput) return;

        nameInput.addEventListener('input', (e) => {
            const newName = e.target.value.trim();
            if (newName) {
                this.currentTeam.teamName = newName;
                window.pvpTeams.setTeamName(newName);
                window.pvpTeams.scheduleAutoSave();
            }
        });
    }

    /**
     * Configurar event listeners de Pokémon
     */
    setupPokemonEventListeners() {
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

        // Item selects
        document.querySelectorAll('.item-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleItemChange(e.target);
            });
        });

        // Move selects
        document.querySelectorAll('.move-select').forEach(select => {
            select.addEventListener('change', (e) => {
                this.handleMoveChange(e.target);
            });
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
            pokemon.availableAbilities.forEach(ability => {
                const option = document.createElement('option');
                option.value = ability;
                option.textContent = this.capitalizeText(ability);
                if (pokemon.ability === ability) {
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
        const name = this.capitalizeText(nature.name);
        
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
    }
}

// Exportar instancia global
window.pvpTeamsUI = new PVPTeamUI();

