// Berry Calculator - User Interface
class BerryUI {
    constructor() {
        this.container = null;
        this.currentBerry = null;
    }

    // ========================================
    // RENDERIZADO INICIAL
    // ========================================

    /**
     * Renderizar UI inicial con botones Load/New
     */
    async renderInitialUI() {
        const farmingTab = document.getElementById('farming');
        if (!farmingTab) return;

        const lm = window.languageManager;

        // Verificar si hay sesión activa
        const isAuthenticated = window.authManager && window.authManager.isAuthenticated();

        if (!isAuthenticated) {
            farmingTab.innerHTML = `
                <div class="berry-calculator-container">
                    <div class="berry-calculator-header text-center">
                        <h2 class="mb-3" id="calculatorTitle">
                            ${lm.t('farming.calculator.title')}
                        </h2>
                        <p class="lead mb-4" id="calculatorSubtitle">${lm.t('farming.calculator.subtitle')}</p>
                        <div class="alert alert-warning">
                            <strong>${lm.getCurrentLanguage() === 'es' ? '⚠️ Inicio de sesión requerido' : '⚠️ Login Required'}</strong><br>
                            ${lm.getCurrentLanguage() === 'es' 
                                ? 'Debes iniciar sesión para usar la calculadora de bayas y guardar tus cálculos.' 
                                : 'You must log in to use the berry calculator and save your calculations.'}
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        // Cargar lista de cálculos guardados
        const calculationsResult = await window.authManager.getAllBerryCalculations();
        const hasSavedCalculations = calculationsResult.success && calculationsResult.list.length > 0;

        farmingTab.innerHTML = `
            <div class="berry-calculator-container">
                <div class="berry-calculator-header">
                    <h2 class="d-flex align-items-center justify-content-center gap-3 mb-3" id="calculatorTitle">
                        ${lm.t('farming.calculator.title')}
                    </h2>
                    <p class="lead mb-4 text-center" id="calculatorSubtitle">${lm.t('farming.calculator.subtitle')}</p>
                </div>

                <!-- Load/New Controls -->
                <div class="berry-calculator-load-new-controls mb-5">
                    <div class="row align-items-end">
                        <div class="col-md-8">
                            <label class="form-label text-white mb-2" id="labelLoadCalculation">
                                📂 ${lm.t('farming.calculator.loadSavedCalculation')}
                            </label>
                            <select class="form-control" id="loadCalculationSelect" ${!hasSavedCalculations ? 'disabled' : ''}>
                                <option value="" id="loadCalculationPlaceholder">
                                    ${hasSavedCalculations 
                                        ? lm.t('farming.calculator.selectCalculationPlaceholder')
                                        : lm.t('farming.calculator.noSavedCalculations')}
                                </option>
                                ${hasSavedCalculations ? calculationsResult.list.map(name => `
                                    <option value="${name}">${name}</option>
                                `).join('') : ''}
                            </select>
                        </div>
                        <div class="col-md-4">
                            <button class="btn btn-primary w-100" id="newCalculationBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                                <span id="newCalculationBtnText">${lm.t('farming.calculator.newCalculation')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Calculation Container (hidden initially) -->
                <div id="calculatorMainContent" style="display: none;">
                    <!-- Se llenará dinámicamente -->
                </div>
            </div>
        `;

        // Setup event listeners
        this.setupLoadNewControls();
    }

    /**
     * Configurar controles de Load/New
     */
    setupLoadNewControls() {
        const loadSelect = document.getElementById('loadCalculationSelect');
        const newBtn = document.getElementById('newCalculationBtn');

        if (loadSelect) {
            loadSelect.addEventListener('change', async (e) => {
                const calculationName = e.target.value;
                if (calculationName) {
                    await window.berryCalculator.loadCalculation(calculationName);
                }
            });
        }

        if (newBtn) {
            newBtn.addEventListener('click', async () => {
                await window.berryCalculator.createNewCalculation();
            });
        }
    }

    // ========================================
    // RENDERIZADO DE CALCULADORA
    // ========================================

    /**
     * Renderizar calculadora completa (con o sin datos)
     */
    async renderCalculatorUI(data = null) {
        const calculatorContent = document.getElementById('calculatorMainContent');
        if (!calculatorContent) return;

        const lm = window.languageManager;

        calculatorContent.innerHTML = `
            <!-- Save Indicator -->
            <div class="save-indicator" id="saveIndicator" style="display: none;">
                <span id="saveIndicatorText"></span>
            </div>

            <!-- Calculation Name Input -->
            <div class="row mb-4">
                <div class="col-md-12">
                    <label class="form-label text-white mb-2" id="labelCalculationName">
                        📝 ${lm.t('farming.calculator.calculationName')}
                        <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" id="calculationNameInput" 
                           placeholder="${lm.getCurrentLanguage() === 'es' ? 'Ej: Zanamas Farm Principal' : 'E.g: Zanamas Main Farm'}"
                           value="${data?.calculationName || ''}" required>
                    <small class="form-text text-muted" id="calculationNameHelp">
                        ${lm.t('farming.calculator.calculationNameHelp')}
                    </small>
                </div>
            </div>

            <div class="berry-calculator-controls">
                <div class="row mb-4">
                    <div class="col-md-4">
                        <label class="form-label text-white mb-2" id="labelCultivationType">${lm.t('farming.calculator.cultivationType')}</label>
                        <div class="custom-dropdown" id="berryTypeDropdown">
                            <div class="custom-dropdown-selected" id="berryTypeSelected">
                                <span class="dropdown-text" id="dropdownText">${lm.t('farming.calculator.selectCultivation')}</span>
                                <span class="dropdown-arrow">▼</span>
                            </div>
                            <div class="custom-dropdown-options" id="berryTypeOptions">
                                <div class="custom-dropdown-option" data-value="zanamas" data-icon="leppa-berry">
                                    <img src="" alt="" class="dropdown-sprite" style="display: none;">
                                    <span class="dropdown-option-text">${lm.t('farming.calculator.leppa')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-white mb-2" id="labelPlantsPerCharacter">${lm.t('farming.calculator.plantsPerCharacter')}</label>
                        <input type="number" class="form-control" id="plantCountInput" 
                               placeholder="${lm.getCurrentLanguage() === 'es' ? 'Ej: 100' : 'E.g: 100'}" 
                               min="1" max="1000" value="${data?.plantsPerCharacter || ''}" 
                               ${data && data.cultivationType ? '' : 'disabled'}>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-white mb-2" id="labelNumberOfCharacters">${lm.t('farming.calculator.numberOfCharacters')}</label>
                        <input type="number" class="form-control" id="characterCountInput" 
                               placeholder="${lm.getCurrentLanguage() === 'es' ? 'Ej: 3' : 'E.g: 3'}" 
                               min="1" max="10" value="${data?.characters || ''}"
                               ${data && data.cultivationType ? '' : 'disabled'}>
                    </div>
                </div>
            </div>

            <div class="berry-calculator-content" id="berryCalculatorContent" style="${data && data.cultivationType ? 'display: block;' : 'display: none;'}">
                <!-- Horarios de Riego -->
                <div class="irrigation-schedule-section mb-5">
                    <h4 class="section-title mb-4" id="titleIrrigationSchedule">${lm.t('farming.calculator.irrigationSchedule')}</h4>
                    <div class="irrigation-schedule-table" id="irrigationScheduleTable">
                        <!-- Se generará dinámicamente -->
                    </div>
                </div>

                <!-- Tabla de Semillas y Ganancias -->
                <div class="seeds-profits-section mb-5">
                    <h4 class="section-title mb-4" id="titleSeedsAnalysis">${lm.t('farming.calculator.seedsAnalysis')}</h4>
                    <div class="seeds-profits-table" id="seedsProfitsTable">
                        <!-- Se generará dinámicamente -->
                    </div>
                </div>

                <!-- Resumen de Gastos -->
                <div class="expenses-summary-section">
                    <h4 class="section-title mb-4" id="titleExpensesSummary">${lm.t('farming.calculator.expensesSummary')}</h4>
                    <div class="expenses-summary" id="expensesSummary">
                        <!-- Se generará dinámicamente -->
                    </div>
                </div>
            </div>
        `;

        // Mostrar contenedor
        calculatorContent.style.display = 'block';

        // Setup components
        this.container = document.getElementById('berryCalculatorContent');
        this.setupCalculationNameListener();
        this.setupEventListeners();
        this.setupCustomDropdown();

        // Si hay datos, poblar la calculadora
        if (data && data.cultivationType) {
            await this.populateCalculatorWithData(data);
        }
    }

    /**
     * Configurar listener para el nombre del cálculo
     */
    setupCalculationNameListener() {
        const nameInput = document.getElementById('calculationNameInput');
        if (!nameInput) return;

        nameInput.addEventListener('input', (e) => {
            const newName = e.target.value.trim();
            if (newName) {
                window.berryCalculator.setCalculationName(newName);
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            }
        });
    }

    /**
     * Poblar calculadora con datos guardados
     */
    async populateCalculatorWithData(data) {

        // Seleccionar tipo de baya
        if (data.cultivationType) {
            this.currentBerry = data.cultivationType;
            await this.handleBerrySelection(data.cultivationType);
        }

        // Poblar plantas y personajes
        if (data.plantsPerCharacter) {
            document.getElementById('plantCountInput').value = data.plantsPerCharacter;
            this.plantCount = data.plantsPerCharacter;
        }

        if (data.characters) {
            document.getElementById('characterCountInput').value = data.characters;
            this.characterCount = data.characters;
        }

        // Esperar un momento a que se renderice
        await new Promise(resolve => setTimeout(resolve, 100));

        // Poblar horarios de riego
        if (data.irrigationTimes && Array.isArray(data.irrigationTimes)) {
            data.irrigationTimes.forEach(schedule => {
                const berryName = schedule.berryName;
                
                if (schedule.plantingTime) {
                    const plantInput = document.getElementById(`plantTime_${berryName}`);
                    if (plantInput) plantInput.value = schedule.plantingTime;
                }
                
                if (schedule.firstIrrigation) {
                    const firstInput = document.getElementById(`firstIrrigation_${berryName}`);
                    if (firstInput) firstInput.value = schedule.firstIrrigation;
                }
                
                if (schedule.secondIrrigation) {
                    const secondInput = document.getElementById(`secondIrrigation_${berryName}`);
                    if (secondInput) secondInput.value = schedule.secondIrrigation;
                }
                
                if (schedule.harvestTime) {
                    const harvestInput = document.getElementById(`harvestTime_${berryName}`);
                    if (harvestInput) harvestInput.value = schedule.harvestTime;
                }
                
                if (schedule.harvestUnits) {
                    const unitsInput = document.getElementById(`harvestUnits_${berryName}`);
                    if (unitsInput) unitsInput.value = schedule.harvestUnits;
                }
            });
        }

        // Poblar semillas y precios
        if (data.seedsProfits && Array.isArray(data.seedsProfits)) {
            data.seedsProfits.forEach(seed => {
                const seedName = seed.seedName;
                
                if (seed.harvest !== undefined) {
                    const harvestInput = document.getElementById(`harvest_${seedName}`);
                    if (harvestInput) harvestInput.value = seed.harvest;
                }
                
                if (seed.sellingPrice !== undefined) {
                    const priceInput = document.getElementById(`price_${seedName}`);
                    if (priceInput) priceInput.value = seed.sellingPrice;
                }
            });
        }

        // Poblar costos de compra
        if (data.purchaseCosts && Array.isArray(data.purchaseCosts)) {
            const container = document.getElementById('purchaseCostsContainer');
            if (container) {
                // Limpiar inputs existentes
                container.innerHTML = '';
                
                // Crear inputs para cada costo
                data.purchaseCosts.forEach((cost, index) => {
                    const inputGroup = document.createElement('div');
                    inputGroup.className = 'cost-input-group';
                    inputGroup.innerHTML = `
                        <div class="currency-input-group">
                            <span class="currency-symbol">₽</span>
                            <input type="number" class="form-control form-control-sm purchase-cost-input currency-input" 
                                   placeholder="0" min="0" step="1" value="${cost}">
                        </div>
                        <button class="btn btn-sm btn-outline-${index === 0 ? 'primary add' : 'danger remove'}-cost-btn">
                            ${index === 0 ? '+' : '-'}
                        </button>
                    `;
                    container.appendChild(inputGroup);
                });
                
                // Re-setup event listeners
                this.setupExpenseInputListeners();
            }
        }

        // Poblar costos de gestión
        if (data.managementCosts && Array.isArray(data.managementCosts)) {
            const container = document.getElementById('managementCostsContainer');
            if (container) {
                // Limpiar inputs existentes
                container.innerHTML = '';
                
                // Crear inputs para cada costo
                data.managementCosts.forEach((cost, index) => {
                    const inputGroup = document.createElement('div');
                    inputGroup.className = 'cost-input-group';
                    inputGroup.innerHTML = `
                        <div class="currency-input-group">
                            <span class="currency-symbol">₽</span>
                            <input type="number" class="form-control form-control-sm management-cost-input currency-input" 
                                   placeholder="0" min="0" step="1" value="${cost}">
                        </div>
                        <button class="btn btn-sm btn-outline-${index === 0 ? 'primary add' : 'danger remove'}-cost-btn">
                            ${index === 0 ? '+' : '-'}
                        </button>
                    `;
                    container.appendChild(inputGroup);
                });
                
                // Re-setup event listeners
                this.setupExpenseInputListeners();
            }
        }

        // Recalcular todo
        this.calculateAndRender();
    }

    /**
     * Recopilar todos los datos del cálculo actual
     */
    collectCalculationData() {
        const data = {};

        // Configuración básica
        data.cultivationType = this.currentBerry;
        data.plantsPerCharacter = parseInt(document.getElementById('plantCountInput')?.value) || 0;
        data.characters = parseInt(document.getElementById('characterCountInput')?.value) || 0;

        // Horarios de riego
        data.irrigationTimes = [];
        const config = window.berryData.getBerryConfig(this.currentBerry);
        if (config && config.phases) {
            config.phases.forEach(phase => {
                const berryName = phase.apiName;
                data.irrigationTimes.push({
                    berryName: berryName,
                    plantingTime: document.getElementById(`plantTime_${berryName}`)?.value || '',
                    firstIrrigation: document.getElementById(`firstIrrigation_${berryName}`)?.value || '',
                    secondIrrigation: document.getElementById(`secondIrrigation_${berryName}`)?.value || null,
                    harvestTime: document.getElementById(`harvestTime_${berryName}`)?.value || '',
                    harvestUnits: parseInt(document.getElementById(`harvestUnits_${berryName}`)?.value) || 0
                });
            });
        }

        // Semillas y ganancias
        data.seedsProfits = [];
        const requiredSeeds = window.berryData.getRequiredSeedsForCultivation(this.currentBerry);
        requiredSeeds.forEach(seedType => {
            data.seedsProfits.push({
                seedName: seedType,
                harvest: parseInt(document.getElementById(`harvest_${seedType}`)?.value) || 0,
                sellingPrice: parseInt(document.getElementById(`price_${seedType}`)?.value) || 0
            });
        });

        // Agregar Zanamas berry
        data.seedsProfits.push({
            seedName: 'zanamas',
            harvest: parseInt(document.getElementById('harvest_zanamas')?.value) || 0,
            sellingPrice: parseInt(document.getElementById('price_zanamas')?.value) || 0
        });

        // Costos de compra
        data.purchaseCosts = [];
        document.querySelectorAll('.purchase-cost-input').forEach(input => {
            const value = parseInt(input.value) || 0;
            if (value > 0) data.purchaseCosts.push(value);
        });

        // Costos de gestión
        data.managementCosts = [];
        document.querySelectorAll('.management-cost-input').forEach(input => {
            const value = parseInt(input.value) || 0;
            if (value > 0) data.managementCosts.push(value);
        });

        return data;
    }

    /**
     * Mostrar indicador de guardado
     */
    showSaveIndicator(status) {
        const indicator = document.getElementById('saveIndicator');
        const text = document.getElementById('saveIndicatorText');
        
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
        } else if (status === 'saving') {
            indicator.className = 'save-indicator saving';
            text.textContent = lm.getCurrentLanguage() === 'es' 
                ? '💾 Guardando...' 
                : '💾 Saving...';
        }

        // Mostrar
        indicator.style.display = 'block';

        // Ocultar después de 3 segundos
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }

    // Configurar event listeners
    setupEventListeners() {
        const plantCountInput = document.getElementById('plantCountInput');
        const characterCountInput = document.getElementById('characterCountInput');

        if (plantCountInput) {
            plantCountInput.addEventListener('input', () => {
                this.handleInputChange();
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        }

        if (characterCountInput) {
            characterCountInput.addEventListener('input', () => {
                this.handleInputChange();
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        }
    }

    // Manejar selección de baya
    async handleBerrySelection(berryType) {
        if (!berryType) {
            this.hideContent();
            return;
        }

        this.currentBerry = berryType;
        this.enableInputs();
        await this.renderBerryContent();
        this.showContent();
    }

    // Habilitar inputs
    enableInputs() {
        document.getElementById('plantCountInput').disabled = false;
        document.getElementById('characterCountInput').disabled = false;
    }

    // Manejar cambios en inputs
    handleInputChange() {
        const plantCount = parseInt(document.getElementById('plantCountInput').value) || 0;
        const characterCount = parseInt(document.getElementById('characterCountInput').value) || 0;

        if (plantCount > 0 && characterCount > 0) {
            this.plantCount = plantCount;
            this.characterCount = characterCount;
            this.calculateAndRender();
        }
    }

    // Mostrar contenido
    showContent() {
        this.container.style.display = 'block';
    }

    // Ocultar contenido
    hideContent() {
        this.container.style.display = 'none';
    }

    // Renderizar contenido específico de la baya
    async renderBerryContent() {
        if (this.currentBerry === 'zanamas') {
            await this.renderZanamasContent();
        }
    }

    // Renderizar contenido de Zanamas
    async renderZanamasContent() {
        const config = window.berryData.getBerryConfig('zanamas');
        
        // Renderizar horarios de riego
        this.renderIrrigationSchedule(config.phases);
        
        // Renderizar tabla de semillas
        this.renderSeedsTable();
        
        // Renderizar resumen de gastos
        this.renderExpensesSummary();
    }

    // Renderizar horarios de riego
    renderIrrigationSchedule(phases) {
        const lm = window.languageManager;
        const table = document.getElementById('irrigationScheduleTable');
        const isLightTheme = document.body.classList.contains('light-theme');
        const tableClass = isLightTheme ? 'table table-light table-striped' : 'table table-dark table-striped';
        
        table.innerHTML = `
            <div class="table-responsive">
                <table class="${tableClass}">
                    <thead>
                        <tr>
                            <th id="thBerry">${lm.t('farming.calculator.berry')}</th>
                            <th id="thPlantingTime">${lm.t('farming.calculator.plantingTime')}</th>
                            <th id="thFirstIrrigation">${lm.t('farming.calculator.firstIrrigation')}</th>
                            <th id="thSecondIrrigation">${lm.t('farming.calculator.secondIrrigation')}</th>
                            <th id="thHarvestTime">${lm.t('farming.calculator.harvestTime')}</th>
                            <th id="thHarvestLossTime">${lm.t('farming.calculator.harvestLossTime')}</th>
                            <th id="thHarvestUnits">${lm.t('farming.calculator.harvestUnits')}</th>
                        </tr>
                    </thead>
                    <tbody id="irrigationScheduleBody">
                        ${phases.map(phase => `
                            <tr data-phase="${phase.apiName}">
                                <td>
                                    <div class="berry-info">
                                        <img src="" alt="${this.getBerryDisplayName(phase.apiName)}" class="berry-sprite" data-berry="${phase.apiName}">
                                        <span>${this.getBerryDisplayName(phase.apiName)}</span>
                                    </div>
                                </td>
                                <td>
                                    <input type="time" class="form-control form-control-sm plant-time-input" 
                                           id="plantTime_${phase.apiName}" placeholder="--:--">
                                </td>
                                <td>
                                    <input type="time" class="form-control form-control-sm irrigation-input" 
                                           id="firstIrrigation_${phase.apiName}" placeholder="--:--">
                                </td>
                                <td>
                                    <input type="time" class="form-control form-control-sm irrigation-input" 
                                           id="secondIrrigation_${phase.apiName}" placeholder="--:--">
                                </td>
                                <td>
                                    <input type="time" class="form-control form-control-sm harvest-input" 
                                           id="harvestTime_${phase.apiName}" placeholder="--:--">
                                </td>
                                <td>
                                    <span class="loss-time-display" id="lossTime_${phase.apiName}">--:--</span>
                                </td>
                                <td>
                                    <input type="number" class="form-control form-control-sm harvest-units" 
                                           id="harvestUnits_${phase.apiName}" 
                                           placeholder="0" min="0">
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Cargar sprites de bayas
        this.loadBerrySprites();
        
        // Configurar event listeners para horarios
        this.setupScheduleEventListeners();
    }

    // Configurar dropdown custom
    setupCustomDropdown() {
        const dropdown = document.getElementById('berryTypeDropdown');
        const selected = document.getElementById('berryTypeSelected');
        const options = document.getElementById('berryTypeOptions');
        const optionsList = options.querySelectorAll('.custom-dropdown-option');

        // Cargar sprites para las opciones
        this.loadDropdownSprites();

        // Toggle dropdown
        selected.addEventListener('click', () => {
            dropdown.classList.toggle('open');
        });

        // Seleccionar opción
        optionsList.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                const text = option.querySelector('.dropdown-option-text').textContent;
                const sprite = option.querySelector('.dropdown-sprite');
                
                // Actualizar texto seleccionado
                const dropdownText = document.getElementById('dropdownText');
                dropdownText.innerHTML = '';
                
                if (sprite.src) {
                    const newSprite = sprite.cloneNode(true);
                    newSprite.style.display = 'block';
                    dropdownText.appendChild(newSprite);
                }
                
                dropdownText.appendChild(document.createTextNode(text));
                
                // Cerrar dropdown
                dropdown.classList.remove('open');
                
                // Manejar selección
                this.handleBerrySelection(value);
            });
        });

        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });
    }

    // Cargar sprites para el dropdown
    async loadDropdownSprites() {
        const options = document.querySelectorAll('.custom-dropdown-option');
        
        for (const option of options) {
            const icon = option.dataset.icon;
            const sprite = option.querySelector('.dropdown-sprite');
            
            if (icon && sprite) {
                try {
                    const response = await fetch(`https://pokeapi.co/api/v2/item/${icon}/`);
                    const data = await response.json();
                    sprite.src = data.sprites.default;
                    sprite.alt = data.name;
                    sprite.style.display = 'block';
                } catch (error) {
                    console.error('Error loading berry sprite:', error);
                }
            }
        }
    }

    // Renderizar tabla de semillas
    renderSeedsTable() {
        const lm = window.languageManager;
        const table = document.getElementById('seedsProfitsTable');
        const isLightTheme = document.body.classList.contains('light-theme');
        const tableClass = isLightTheme ? 'table table-light table-striped' : 'table table-dark table-striped';
        
        table.innerHTML = `
            <div class="table-responsive">
                <table class="${tableClass}">
                    <thead>
                        <tr>
                            <th id="thSeed">${lm.t('farming.calculator.seed')}</th>
                            <th id="thHarvest">${lm.t('farming.calculator.harvest')}</th>
                            <th id="thToConserve">${lm.t('farming.calculator.toConserve')}</th>
                            <th id="thForZanamas">${lm.t('farming.calculator.forZanamas')}</th>
                            <th id="thSellable">${lm.t('farming.calculator.sellable')}</th>
                            <th id="thSellingPrice">${lm.t('farming.calculator.sellingPrice')}</th>
                            <th id="thProfits">${lm.t('farming.calculator.profits')}</th>
                        </tr>
                    </thead>
                    <tbody id="seedsProfitsBody">
                        <!-- Se generará dinámicamente -->
                    </tbody>
                </table>
            </div>
        `;

        this.renderSeedsRows();
    }

    // Renderizar filas de semillas
    renderSeedsRows() {
        const tbody = document.getElementById('seedsProfitsBody');
        
        // Obtener solo las semillas necesarias para este cultivo
        const requiredSeeds = window.berryData.getRequiredSeedsForCultivation(this.currentBerry);
        const allSeedTypes = window.berryData.getAllSeedTypes();
        
        // Filtrar solo las semillas necesarias
        const relevantSeeds = allSeedTypes.filter(seedType => 
            requiredSeeds.includes(seedType.id)
        );
        
        tbody.innerHTML = relevantSeeds.map(seedType => `
            <tr data-seed="${seedType.id}">
                <td>
                    <div class="seed-info">
                        <img src="img/res/farm-icons/seeds/${seedType.image}" 
                             alt="${seedType.name}" class="seed-sprite">
                        <span class="seed-name" data-seed-id="${seedType.id}">${window.berryData.getTranslatedSeedName(seedType.id)}</span>
                    </div>
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm harvest-input" 
                           id="harvest_${seedType.id}" placeholder="0" min="0">
                </td>
                <td>
                    <span class="conservation-amount" id="conservation_${seedType.id}">0</span>
                </td>
                <td>
                    <span class="zanamas-amount" id="zanamas_${seedType.id}">0</span>
                </td>
                <td>
                    <span class="sellable-amount" id="sellable_${seedType.id}">0</span>
                </td>
                <td>
                    <div class="currency-input-group">
                        <span class="currency-symbol">₽</span>
                        <input type="number" class="form-control form-control-sm price-input currency-input" 
                               id="price_${seedType.id}" placeholder="0" min="0" step="1">
                    </div>
                </td>
                <td>
                    <span class="profit-amount" id="profit_${seedType.id}">₽0</span>
                </td>
            </tr>
        `).join('');

        // Fila de Zanamas
        const lm = window.languageManager;
        const zanamasName = lm.getCurrentLanguage() === 'es' ? 'Baya Zanamas' : 'Leppa Berry';
        tbody.innerHTML += `
            <tr class="zanamas-row">
                <td>
                    <div class="berry-info">
                        <img src="" alt="${zanamasName}" class="berry-sprite" data-berry="leppa-berry" id="zanamasBerrySprite">
                        <span>${zanamasName}</span>
                    </div>
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm harvest-input" 
                           id="harvest_zanamas" placeholder="0" min="0">
                </td>
                <td>
                    <span class="conservation-amount">-</span>
                </td>
                <td>
                    <span class="zanamas-amount">-</span>
                </td>
                <td>
                    <span class="sellable-amount" id="sellable_zanamas">0</span>
                </td>
                <td>
                    <div class="currency-input-group">
                        <span class="currency-symbol">₽</span>
                        <input type="number" class="form-control form-control-sm price-input currency-input" 
                               id="price_zanamas" placeholder="0" min="0" step="1">
                    </div>
                </td>
                <td>
                    <span class="profit-amount" id="profit_zanamas">₽0</span>
                </td>
            </tr>
        `;

        // Configurar event listeners para precios
        this.setupPriceEventListeners();
        
        // Cargar sprite de Zanamas en tabla de semillas
        this.loadZanamasBerrySprite();
    }

    // Renderizar resumen de gastos
    renderExpensesSummary() {
        const lm = window.languageManager;
        const summary = document.getElementById('expensesSummary');
        
        summary.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="summary-card">
                        <h5 id="hSalesSummary">📈 ${lm.t('farming.calculator.totalSales')}</h5>
                        <div class="summary-item">
                            <span id="labelTotalSales">${lm.t('farming.calculator.totalSales')}:</span>
                            <span class="total-sales" id="totalSales">₽0</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="summary-card">
                        <h5 id="hExtractionCosts">💸 ${lm.t('farming.calculator.extractionCosts')}</h5>
                        <div class="extraction-costs" id="extractionCosts">
                            <!-- Se generará dinámicamente -->
                        </div>
                        <div class="summary-item total">
                            <span id="labelTotalExtraction">${lm.t('farming.calculator.totalExtraction')}:</span>
                            <span class="total-extraction" id="totalExtraction">₽0</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md-4">
                    <div class="summary-card">
                        <h5 id="hPurchaseCosts">🛒 ${lm.t('farming.calculator.purchaseCosts')}</h5>
                        <div class="purchase-costs-container" id="purchaseCostsContainer">
                            <div class="cost-input-group">
                                <div class="currency-input-group">
                                    <span class="currency-symbol">₽</span>
                                    <input type="number" class="form-control form-control-sm purchase-cost-input currency-input" 
                                           placeholder="0" min="0" step="1">
                                </div>
                                <button class="btn btn-sm btn-outline-primary add-cost-btn" 
                                        onclick="window.berryUI.addPurchaseCostInput()">+</button>
                            </div>
                        </div>
                        <div class="summary-item total">
                            <span id="labelTotalPurchases">${lm.t('farming.calculator.totalPurchases')}:</span>
                            <span class="purchase-costs" id="purchaseCosts">₽0</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="summary-card">
                        <h5 id="hManagementCosts">⚙️ ${lm.t('farming.calculator.managementCosts')}</h5>
                        <div class="management-costs-container" id="managementCostsContainer">
                            <div class="cost-input-group">
                                <div class="currency-input-group">
                                    <span class="currency-symbol">₽</span>
                                    <input type="number" class="form-control form-control-sm management-cost-input currency-input" 
                                           placeholder="0" min="0" step="1">
                                </div>
                                <button class="btn btn-sm btn-outline-primary add-cost-btn" 
                                        onclick="window.berryUI.addManagementCostInput()">+</button>
                            </div>
                        </div>
                        <div class="summary-item total">
                            <span id="labelTotalManagement">${lm.t('farming.calculator.totalManagement')}:</span>
                            <span class="management-costs" id="managementCosts">₽0</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="summary-card final-total">
                        <h5 id="hFinalTotal">🎯 ${lm.t('farming.calculator.finalTotal')}</h5>
                        <div class="summary-item">
                            <span id="labelNetProfit">${lm.t('farming.calculator.netProfit')}:</span>
                            <span class="final-total" id="finalTotal">₽0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Configurar event listeners para inputs de gastos
        this.setupExpenseInputListeners();
    }

    // Cargar sprites de bayas desde API
    async loadBerrySprites() {
        const berrySprites = document.querySelectorAll('.berry-sprite[data-berry]');
        
        for (const sprite of berrySprites) {
            const berryName = sprite.dataset.berry;
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/item/${berryName}/`);
                const data = await response.json();
                sprite.src = data.sprites.default;
                sprite.alt = data.name;
            } catch (error) {
                console.error(`Error loading berry sprite for ${berryName}:`, error);
                sprite.src = 'img/res/farm-icons/seeds/sweet.png'; // Fallback
            }
        }
    }

    // Cargar sprite específico de Zanamas para tabla de semillas
    async loadZanamasBerrySprite() {
        const zanamasSprite = document.getElementById('zanamasBerrySprite');
        if (!zanamasSprite) return;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/item/leppa-berry/`);
            const data = await response.json();
            zanamasSprite.src = data.sprites.default;
            zanamasSprite.alt = data.name;
        } catch (error) {
            console.error('Error loading Zanamas berry sprite:', error);
            zanamasSprite.src = 'img/res/farm-icons/seeds/sweet.png'; // Fallback
        }
    }


    // Configurar event listeners para horarios
    setupScheduleEventListeners() {
        const harvestInputs = document.querySelectorAll('.harvest-units');
        const plantTimeInputs = document.querySelectorAll('.plant-time-input');
        const irrigationInputs = document.querySelectorAll('.irrigation-input');
        const harvestTimeInputs = document.querySelectorAll('.harvest-input');
        
        // Event listeners para unidades cosechadas
        harvestInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateAndRender();
                // Autocompletar cosecha de Zanamas si es la fila correspondiente
                this.autoCompleteZanamasHarvest(input);
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        });

        // Event listeners para todos los campos de tiempo (calculan en cascada)
        plantTimeInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateCascadeTimes(input);
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        });

        irrigationInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateCascadeTimes(input);
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        });

        harvestTimeInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateCascadeTimes(input);
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        });
    }

    // Autocompletar cosecha de Zanamas desde unidades cosechadas
    autoCompleteZanamasHarvest(harvestUnitsInput) {
        const inputId = harvestUnitsInput.id;
        if (inputId === 'harvestUnits_leppa-berry') {
            const units = parseInt(harvestUnitsInput.value) || 0;
            const zanamasHarvestInput = document.getElementById('harvest_zanamas');
            if (zanamasHarvestInput) {
                zanamasHarvestInput.value = units;
                // Recalcular para actualizar vendibles y ganancias
                this.calculateAndRender();
            }
        }
    }

    // Configurar event listeners para precios
    setupPriceEventListeners() {
        const priceInputs = document.querySelectorAll('.price-input');
        const harvestInputs = document.querySelectorAll('.harvest-input');
        
        priceInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateAndRender();
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        });

        harvestInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.calculateAndRender();
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        });
    }

    // Calcular horarios en cascada basado en cualquier campo editado
    calculateCascadeTimes(changedInput) {
        const inputId = changedInput.id;
        const berryType = inputId.replace(/^(plantTime_|firstIrrigation_|secondIrrigation_|harvestTime_)/, '');
        
        const config = window.berryData.getBerryConfig('zanamas');
        const phase = config.phases.find(p => p.apiName === berryType);
        
        if (!phase) return;

        // Obtener tiempo base según el campo editado
        let baseTime = null;
        let baseElement = null;

        if (inputId.startsWith('plantTime_')) {
            baseTime = changedInput.value;
            baseElement = changedInput;
        } else if (inputId.startsWith('firstIrrigation_')) {
            baseTime = changedInput.value;
            baseElement = changedInput;
        } else if (inputId.startsWith('secondIrrigation_')) {
            baseTime = changedInput.value;
            baseElement = changedInput;
        } else if (inputId.startsWith('harvestTime_')) {
            baseTime = changedInput.value;
            baseElement = changedInput;
        }

        if (!baseTime) return;

        const baseDate = new Date(`2000-01-01T${baseTime}:00`);

        // Calcular campos hacia la derecha según el campo editado
        if (inputId.startsWith('plantTime_')) {
            // Desde plantado: calcular primer riego, segundo riego, cosecha, pérdida
            this.calculateFromPlantTime(berryType, baseDate, phase);
        } else if (inputId.startsWith('firstIrrigation_')) {
            // Desde primer riego: calcular segundo riego, cosecha, pérdida
            this.calculateFromFirstIrrigation(berryType, baseDate, phase);
        } else if (inputId.startsWith('secondIrrigation_')) {
            // Desde segundo riego: calcular cosecha, pérdida
            this.calculateFromSecondIrrigation(berryType, baseDate, phase);
        } else if (inputId.startsWith('harvestTime_')) {
            // Desde cosecha: calcular solo pérdida
            this.calculateFromHarvestTime(berryType, baseDate, phase);
        }
    }

    // Calcular desde hora de plantado
    calculateFromPlantTime(berryType, plantDate, phase) {
        // Primer riego (6 horas después del plantado)
        const firstIrrigation = new Date(plantDate.getTime() + (phase.irrigation.first * 60 * 60 * 1000));
        document.getElementById(`firstIrrigation_${berryType}`).value = 
            firstIrrigation.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

        // Segundo riego (solo para Zanamas: 10 horas después del primer riego)
        if (phase.irrigation.second) {
            const secondIrrigation = new Date(firstIrrigation.getTime() + (phase.irrigation.second * 60 * 60 * 1000));
            document.getElementById(`secondIrrigation_${berryType}`).value = 
                secondIrrigation.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
        }

        // Tiempo de cosecha (16h para Meloc/Safre/Zreza, 20h para Zanamas)
        const harvestTime = new Date(plantDate.getTime() + (phase.cycle * 60 * 60 * 1000));
        document.getElementById(`harvestTime_${berryType}`).value = 
            harvestTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

        // Tiempo de pérdida (6 horas después de la cosecha)
        const lossTime = new Date(harvestTime.getTime() + (6 * 60 * 60 * 1000));
        document.getElementById(`lossTime_${berryType}`).textContent = 
            lossTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    // Calcular desde primer riego
    calculateFromFirstIrrigation(berryType, firstIrrigationDate, phase) {
        // Segundo riego (solo para Zanamas: 10 horas después del primer riego)
        if (phase.irrigation.second) {
            const secondIrrigation = new Date(firstIrrigationDate.getTime() + (phase.irrigation.second * 60 * 60 * 1000));
            document.getElementById(`secondIrrigation_${berryType}`).value = 
                secondIrrigation.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
        }

        // La cosecha SIEMPRE se calcula desde la hora de plantado (no desde primer riego)
        const plantTime = document.getElementById(`plantTime_${berryType}`).value;
        if (plantTime) {
            const plantDate = new Date(`2000-01-01T${plantTime}:00`);
            const harvestTime = new Date(plantDate.getTime() + (phase.cycle * 60 * 60 * 1000));
            document.getElementById(`harvestTime_${berryType}`).value = 
                harvestTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

            // Tiempo de pérdida (6 horas después de la cosecha)
            const lossTime = new Date(harvestTime.getTime() + (6 * 60 * 60 * 1000));
            document.getElementById(`lossTime_${berryType}`).textContent = 
                lossTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
    }

    // Calcular desde segundo riego
    calculateFromSecondIrrigation(berryType, secondIrrigationDate, phase) {
        // La cosecha SIEMPRE se calcula desde la hora de plantado (no desde segundo riego)
        const plantTime = document.getElementById(`plantTime_${berryType}`).value;
        if (plantTime) {
            const plantDate = new Date(`2000-01-01T${plantTime}:00`);
            const harvestTime = new Date(plantDate.getTime() + (phase.cycle * 60 * 60 * 1000));
            document.getElementById(`harvestTime_${berryType}`).value = 
                harvestTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

            // Tiempo de pérdida (6 horas después de la cosecha)
            const lossTime = new Date(harvestTime.getTime() + (6 * 60 * 60 * 1000));
            document.getElementById(`lossTime_${berryType}`).textContent = 
                lossTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
    }

    // Calcular desde cosecha
    calculateFromHarvestTime(berryType, harvestDate, phase) {
        // Tiempo de pérdida (6 horas después de la cosecha)
        const lossTime = new Date(harvestDate.getTime() + (6 * 60 * 60 * 1000));
        document.getElementById(`lossTime_${berryType}`).textContent = 
            lossTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    // Calcular y renderizar resultados
    calculateAndRender() {
        if (this.plantCount <= 0 || this.characterCount <= 0) return;

        this.calculateConservation();
        this.calculateSellable();
        this.calculateProfits();
        this.calculateExpenses();
    }


    // Calcular conservación
    calculateConservation() {
        const conservation = window.berryData.calculateConservationSeeds(
            this.currentBerry, 
            this.plantCount * this.characterCount
        );

        Object.keys(conservation).forEach(seedType => {
            const element = document.getElementById(`conservation_${seedType}`);
            if (element) {
                element.textContent = conservation[seedType];
            }
        });

        const zanamasSeeds = window.berryData.calculateZanamasSeeds(
            this.plantCount * this.characterCount
        );

        Object.keys(zanamasSeeds).forEach(seedType => {
            const element = document.getElementById(`zanamas_${seedType}`);
            if (element) {
                element.textContent = zanamasSeeds[seedType];
            }
        });
    }

    // Calcular vendibles
    calculateSellable() {
        const harvest = {};
        const conservation = {};
        const zanamasSeeds = {};

        // Recopilar datos de cosecha desde inputs editables
        document.querySelectorAll('.harvest-input').forEach(input => {
            const seedType = input.id.replace('harvest_', '');
            harvest[seedType] = parseInt(input.value) || 0;
        });

        // Recopilar datos de conservación
        document.querySelectorAll('[id^="conservation_"]').forEach(element => {
            const seedType = element.id.replace('conservation_', '');
            conservation[seedType] = parseInt(element.textContent) || 0;
        });

        // Recopilar datos de zanamas
        document.querySelectorAll('[id^="zanamas_"]').forEach(element => {
            const seedType = element.id.replace('zanamas_', '');
            zanamasSeeds[seedType] = parseInt(element.textContent) || 0;
        });

        const sellable = window.berryCalculations.calculateSellableSeeds(
            harvest, conservation, zanamasSeeds
        );

        Object.keys(sellable).forEach(seedType => {
            const element = document.getElementById(`sellable_${seedType}`);
            if (element) {
                element.textContent = sellable[seedType];
            }
        });
    }

    // Calcular ganancias
    calculateProfits() {
        const sellable = {};
        const prices = {};

        // Recopilar datos vendibles
        document.querySelectorAll('[id^="sellable_"]').forEach(element => {
            const seedType = element.id.replace('sellable_', '');
            sellable[seedType] = parseInt(element.textContent) || 0;
        });

        // Recopilar precios
        document.querySelectorAll('.price-input').forEach(input => {
            const seedType = input.id.replace('price_', '');
            prices[seedType] = parseInt(input.value) || 0;
        });

        const { profits, totalProfits } = window.berryCalculations.calculateSeedProfits(
            sellable, prices
        );

        Object.keys(profits).forEach(seedType => {
            const element = document.getElementById(`profit_${seedType}`);
            if (element) {
                element.textContent = `₽${Math.round(profits[seedType]).toLocaleString('es-ES', {maximumFractionDigits: 0})}`;
            }
        });

        // Actualizar total de ventas
        document.getElementById('totalSales').textContent = `₽${Math.round(totalProfits).toLocaleString('es-ES', {maximumFractionDigits: 0})}`;
    }

    // Calcular gastos
    calculateExpenses() {
        const berryHarvests = {};
        
        // Recopilar cosechas de bayas (excluyendo Zanamas/leppa-berry)
        document.querySelectorAll('.harvest-units').forEach(input => {
            const berryType = input.id.replace('harvestUnits_', '');
            if (berryType !== 'leppa-berry') { // Excluir Zanamas
                berryHarvests[berryType] = parseInt(input.value) || 0;
            }
        });

        const { costs, totalCost } = window.berryCalculations.calculateExtractionCosts(berryHarvests);

        // Actualizar gastos de extracción con sprites y nombres localizados
        const extractionContainer = document.getElementById('extractionCosts');
        extractionContainer.innerHTML = Object.keys(costs).map(berryType => `
            <div class="summary-item extraction-item" data-berry="${berryType}">
                <div class="berry-info-small">
                    <img src="" alt="${berryType}" class="berry-sprite-small" data-berry="${berryType}">
                    <span class="berry-name">${this.getBerryDisplayName(berryType)}</span>
                </div>
                <span>₽${Math.round(costs[berryType]).toLocaleString('es-ES', {maximumFractionDigits: 0})}</span>
            </div>
        `).join('');

        // Cargar sprites de bayas en gastos de extracción
        this.loadExtractionBerrySprites();

        document.getElementById('totalExtraction').textContent = `₽${Math.round(totalCost).toLocaleString('es-ES', {maximumFractionDigits: 0})}`;

        // Calcular totales de gastos manuales
        const purchaseCosts = this.calculateTotalPurchaseCosts();
        const managementCostsTotal = this.calculateTotalManagementCosts();
        
        // Actualizar totales en UI
        document.getElementById('purchaseCosts').textContent = `₽${Math.round(purchaseCosts).toLocaleString('es-ES', {maximumFractionDigits: 0})}`;
        document.getElementById('managementCosts').textContent = `₽${Math.round(managementCostsTotal).toLocaleString('es-ES', {maximumFractionDigits: 0})}`;

        // Calcular total final (Total Ventas - Total Extracción - Total Compras - Total Gestión)
        const totalSales = parseInt(document.getElementById('totalSales').textContent.replace(/[₽,.]/g, '')) || 0;
        const totalExtraction = parseInt(document.getElementById('totalExtraction').textContent.replace(/[₽,.]/g, '')) || 0;
        const finalTotal = totalSales - totalExtraction - purchaseCosts - managementCostsTotal;
        
        document.getElementById('finalTotal').textContent = `₽${Math.round(finalTotal).toLocaleString('es-ES', {maximumFractionDigits: 0})}`;
    }

    // Obtener nombre de baya para mostrar
    getBerryDisplayName(berryType) {
        const berryNames = {
            'pecha-berry': window.languageManager.getCurrentLanguage() === 'es' ? 'Meloc' : 'Pecha',
            'rawst-berry': window.languageManager.getCurrentLanguage() === 'es' ? 'Safre' : 'Rawst',
            'cheri-berry': window.languageManager.getCurrentLanguage() === 'es' ? 'Zreza' : 'Cheri',
            'leppa-berry': window.languageManager.getCurrentLanguage() === 'es' ? 'Zanamas' : 'Leppa'
        };
        return berryNames[berryType] || berryType;
    }

    // Cargar sprites de bayas en gastos de extracción
    async loadExtractionBerrySprites() {
        const berrySprites = document.querySelectorAll('.berry-sprite-small[data-berry]');
        
        for (const sprite of berrySprites) {
            const berryName = sprite.dataset.berry;
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/item/${berryName}/`);
                const data = await response.json();
                sprite.src = data.sprites.default;
                sprite.alt = data.name;
            } catch (error) {
                console.error(`Error loading berry sprite for ${berryName}:`, error);
                sprite.src = 'img/res/farm-icons/seeds/sweet.png'; // Fallback
            }
        }
    }

    // Calcular total de gastos de compra
    calculateTotalPurchaseCosts() {
        const purchaseInputs = document.querySelectorAll('.purchase-cost-input');
        let total = 0;
        purchaseInputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });
        return total;
    }

    // Calcular total de gastos de gestión
    calculateTotalManagementCosts() {
        const managementInputs = document.querySelectorAll('.management-cost-input');
        let total = 0;
        managementInputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });
        return total;
    }

    // Configurar event listeners para inputs de gastos
    setupExpenseInputListeners() {
        // Event listeners para gastos de compra
        document.querySelectorAll('.purchase-cost-input').forEach(input => {
            input.addEventListener('input', () => {
                this.updatePurchaseCostsTotal();
                this.calculateAndRender();
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        });

        // Event listeners para gastos de gestión
        document.querySelectorAll('.management-cost-input').forEach(input => {
            input.addEventListener('input', () => {
                this.updateManagementCostsTotal();
                this.calculateAndRender();
                // Programar auto-save
                window.berryCalculator.scheduleAutoSave();
            });
        });
    }

    // Añadir input de gasto de compra
    addPurchaseCostInput() {
        const container = document.getElementById('purchaseCostsContainer');
        const newInputGroup = document.createElement('div');
        newInputGroup.className = 'cost-input-group';
        newInputGroup.innerHTML = `
            <div class="currency-input-group">
                <span class="currency-symbol">₽</span>
                <input type="number" class="form-control form-control-sm purchase-cost-input currency-input" 
                       placeholder="0" min="0" step="1">
            </div>
            <button class="btn btn-sm btn-outline-danger remove-cost-btn" 
                    onclick="this.parentElement.remove(); window.berryUI.updatePurchaseCostsTotal();">-</button>
        `;
        container.appendChild(newInputGroup);
        
        // Configurar event listener para el nuevo input
        const newInput = newInputGroup.querySelector('.purchase-cost-input');
        newInput.addEventListener('input', () => {
            this.updatePurchaseCostsTotal();
            this.calculateAndRender();
        });
    }

    // Añadir input de gasto de gestión
    addManagementCostInput() {
        const container = document.getElementById('managementCostsContainer');
        const newInputGroup = document.createElement('div');
        newInputGroup.className = 'cost-input-group';
        newInputGroup.innerHTML = `
            <div class="currency-input-group">
                <span class="currency-symbol">₽</span>
                <input type="number" class="form-control form-control-sm management-cost-input currency-input" 
                       placeholder="0" min="0" step="1">
            </div>
            <button class="btn btn-sm btn-outline-danger remove-cost-btn" 
                    onclick="this.parentElement.remove(); window.berryUI.updateManagementCostsTotal();">-</button>
        `;
        container.appendChild(newInputGroup);
        
        // Configurar event listener para el nuevo input
        const newInput = newInputGroup.querySelector('.management-cost-input');
        newInput.addEventListener('input', () => {
            this.updateManagementCostsTotal();
            this.calculateAndRender();
        });
    }

    // Actualizar total de gastos de compra
    updatePurchaseCostsTotal() {
        const total = this.calculateTotalPurchaseCosts();
        document.getElementById('purchaseCosts').textContent = `₽${Math.round(total).toLocaleString('es-ES', {maximumFractionDigits: 0})}`;
    }

    // Actualizar total de gastos de gestión
    updateManagementCostsTotal() {
        const total = this.calculateTotalManagementCosts();
        document.getElementById('managementCosts').textContent = `₽${Math.round(total).toLocaleString('es-ES', {maximumFractionDigits: 0})}`;
    }

    // Actualizar traducciones cuando se cambia el idioma
    updateTranslations() {
        const lm = window.languageManager;
        
        // Si la calculadora NO está renderizada, no hacer nada
        if (!document.getElementById('calculatorTitle')) return;
        
        // 0. Actualizar Load/New Controls (si existen en UI inicial)
        const labelLoadCalculation = document.getElementById('labelLoadCalculation');
        const newCalculationBtnText = document.getElementById('newCalculationBtnText');
        const loadCalculationPlaceholder = document.getElementById('loadCalculationPlaceholder');
        
        if (labelLoadCalculation) {
            labelLoadCalculation.innerHTML = `📂 ${lm.t('farming.calculator.loadSavedCalculation')}`;
        }
        
        if (newCalculationBtnText) {
            newCalculationBtnText.textContent = lm.t('farming.calculator.newCalculation');
        }
        
        if (loadCalculationPlaceholder) {
            const loadSelect = document.getElementById('loadCalculationSelect');
            const hasOptions = loadSelect && loadSelect.options.length > 1;
            loadCalculationPlaceholder.textContent = hasOptions 
                ? lm.t('farming.calculator.selectCalculationPlaceholder')
                : lm.t('farming.calculator.noSavedCalculations');
        }
        
        // 0.5 Actualizar Calculation Name (si existe en calculadora activa)
        const labelCalculationName = document.getElementById('labelCalculationName');
        const calculationNameHelp = document.getElementById('calculationNameHelp');
        const calculationNameInput = document.getElementById('calculationNameInput');
        
        if (labelCalculationName) {
            labelCalculationName.innerHTML = `📝 ${lm.t('farming.calculator.calculationName')} <span class="text-danger">*</span>`;
        }
        
        if (calculationNameHelp) {
            calculationNameHelp.textContent = lm.t('farming.calculator.calculationNameHelp');
        }
        
        if (calculationNameInput) {
            calculationNameInput.placeholder = lm.getCurrentLanguage() === 'es' 
                ? 'Ej: Zanamas Farm Principal' 
                : 'E.g: Zanamas Main Farm';
        }
        
        // 1. Actualizar títulos principales
        const calcTitle = document.getElementById('calculatorTitle');
        const calcSubtitle = document.getElementById('calculatorSubtitle');
        if (calcTitle) calcTitle.innerHTML = lm.t('farming.calculator.title');
        if (calcSubtitle) calcSubtitle.textContent = lm.t('farming.calculator.subtitle');
        
        // 2. Actualizar labels de controles
        const labelCultivationType = document.getElementById('labelCultivationType');
        const labelPlantsPerCharacter = document.getElementById('labelPlantsPerCharacter');
        const labelNumberOfCharacters = document.getElementById('labelNumberOfCharacters');
        if (labelCultivationType) labelCultivationType.textContent = lm.t('farming.calculator.cultivationType');
        if (labelPlantsPerCharacter) labelPlantsPerCharacter.textContent = lm.t('farming.calculator.plantsPerCharacter');
        if (labelNumberOfCharacters) labelNumberOfCharacters.textContent = lm.t('farming.calculator.numberOfCharacters');
        
        // 3. Actualizar dropdown custom y placeholders
        const dropdownText = document.getElementById('dropdownText');
        const optionText = document.querySelector('.dropdown-option-text');
        
        if (dropdownText && !dropdownText.querySelector('img')) {
            dropdownText.textContent = lm.t('farming.calculator.selectCultivation');
        }
        
        if (optionText) {
            const leppaText = lm.t('farming.calculator.leppa');
            optionText.textContent = leppaText;
        }
        
        // Actualizar texto seleccionado si ya hay una selección
        if (dropdownText && dropdownText.querySelector('img')) {
            const leppaText = lm.t('farming.calculator.leppa');
            const sprite = dropdownText.querySelector('img');
            dropdownText.innerHTML = '';
            dropdownText.appendChild(sprite);
            dropdownText.appendChild(document.createTextNode(leppaText));
        }
        
        const plantInput = document.getElementById('plantCountInput');
        const charInput = document.getElementById('characterCountInput');
        if (plantInput) plantInput.placeholder = lm.getCurrentLanguage() === 'es' ? 'Ej: 100' : 'E.g: 100';
        if (charInput) charInput.placeholder = lm.getCurrentLanguage() === 'es' ? 'Ej: 3' : 'E.g: 3';
        
        // 4. Actualizar títulos de secciones
        const titleIrrigationSchedule = document.getElementById('titleIrrigationSchedule');
        const titleSeedsAnalysis = document.getElementById('titleSeedsAnalysis');
        const titleExpensesSummary = document.getElementById('titleExpensesSummary');
        if (titleIrrigationSchedule) titleIrrigationSchedule.innerHTML = lm.t('farming.calculator.irrigationSchedule');
        if (titleSeedsAnalysis) titleSeedsAnalysis.innerHTML = lm.t('farming.calculator.seedsAnalysis');
        if (titleExpensesSummary) titleExpensesSummary.innerHTML = lm.t('farming.calculator.expensesSummary');
        
        // 5. Actualizar headers de tabla de horarios
        const thBerry = document.getElementById('thBerry');
        const thPlantingTime = document.getElementById('thPlantingTime');
        const thFirstIrrigation = document.getElementById('thFirstIrrigation');
        const thSecondIrrigation = document.getElementById('thSecondIrrigation');
        const thHarvestTime = document.getElementById('thHarvestTime');
        const thHarvestLossTime = document.getElementById('thHarvestLossTime');
        const thHarvestUnits = document.getElementById('thHarvestUnits');
        if (thBerry) thBerry.textContent = lm.t('farming.calculator.berry');
        if (thPlantingTime) thPlantingTime.textContent = lm.t('farming.calculator.plantingTime');
        if (thFirstIrrigation) thFirstIrrigation.textContent = lm.t('farming.calculator.firstIrrigation');
        if (thSecondIrrigation) thSecondIrrigation.textContent = lm.t('farming.calculator.secondIrrigation');
        if (thHarvestTime) thHarvestTime.textContent = lm.t('farming.calculator.harvestTime');
        if (thHarvestLossTime) thHarvestLossTime.textContent = lm.t('farming.calculator.harvestLossTime');
        if (thHarvestUnits) thHarvestUnits.textContent = lm.t('farming.calculator.harvestUnits');
        
        // 6. Actualizar nombres de bayas en tabla de horarios
        const berryInfos = document.querySelectorAll('.irrigation-schedule-table .berry-info span');
        const config = window.berryData.getBerryConfig('zanamas');
        if (config && berryInfos.length > 0) {
            config.phases.forEach((phase, index) => {
                if (berryInfos[index]) {
                    berryInfos[index].textContent = this.getBerryDisplayName(phase.apiName);
                }
            });
        }
        
        // 7. Actualizar headers de tabla de semillas
        const thSeed = document.getElementById('thSeed');
        const thHarvest = document.getElementById('thHarvest');
        const thToConserve = document.getElementById('thToConserve');
        const thForZanamas = document.getElementById('thForZanamas');
        const thSellable = document.getElementById('thSellable');
        const thSellingPrice = document.getElementById('thSellingPrice');
        const thProfits = document.getElementById('thProfits');
        if (thSeed) thSeed.textContent = lm.t('farming.calculator.seed');
        if (thHarvest) thHarvest.textContent = lm.t('farming.calculator.harvest');
        if (thToConserve) thToConserve.textContent = lm.t('farming.calculator.toConserve');
        if (thForZanamas) thForZanamas.textContent = lm.t('farming.calculator.forZanamas');
        if (thSellable) thSellable.textContent = lm.t('farming.calculator.sellable');
        if (thSellingPrice) thSellingPrice.textContent = lm.t('farming.calculator.sellingPrice');
        if (thProfits) thProfits.textContent = lm.t('farming.calculator.profits');
        
        // 8. Actualizar nombre de Zanamas en tabla de semillas
        const zanamasLabel = document.querySelector('.zanamas-row .berry-info span');
        if (zanamasLabel) {
            zanamasLabel.textContent = lm.getCurrentLanguage() === 'es' ? 'Baya Zanamas' : 'Leppa Berry';
        }
        
        // 9. Actualizar títulos de resumen de gastos
        const hSalesSummary = document.getElementById('hSalesSummary');
        const hExtractionCosts = document.getElementById('hExtractionCosts');
        const hPurchaseCosts = document.getElementById('hPurchaseCosts');
        const hManagementCosts = document.getElementById('hManagementCosts');
        const hFinalTotal = document.getElementById('hFinalTotal');
        if (hSalesSummary) hSalesSummary.innerHTML = `📈 ${lm.t('farming.calculator.totalSales')}`;
        if (hExtractionCosts) hExtractionCosts.innerHTML = `💸 ${lm.t('farming.calculator.extractionCosts')}`;
        if (hPurchaseCosts) hPurchaseCosts.innerHTML = `🛒 ${lm.t('farming.calculator.purchaseCosts')}`;
        if (hManagementCosts) hManagementCosts.innerHTML = `⚙️ ${lm.t('farming.calculator.managementCosts')}`;
        if (hFinalTotal) hFinalTotal.innerHTML = `🎯 ${lm.t('farming.calculator.finalTotal')}`;
        
        // 10. Actualizar labels de totales
        const labelTotalSales = document.getElementById('labelTotalSales');
        const labelTotalExtraction = document.getElementById('labelTotalExtraction');
        const labelTotalPurchases = document.getElementById('labelTotalPurchases');
        const labelTotalManagement = document.getElementById('labelTotalManagement');
        const labelNetProfit = document.getElementById('labelNetProfit');
        if (labelTotalSales) labelTotalSales.textContent = `${lm.t('farming.calculator.totalSales')}:`;
        if (labelTotalExtraction) labelTotalExtraction.textContent = `${lm.t('farming.calculator.totalExtraction')}:`;
        if (labelTotalPurchases) labelTotalPurchases.textContent = `${lm.t('farming.calculator.totalPurchases')}:`;
        if (labelTotalManagement) labelTotalManagement.textContent = `${lm.t('farming.calculator.totalManagement')}:`;
        if (labelNetProfit) labelNetProfit.textContent = `${lm.t('farming.calculator.netProfit')}:`;
        
        // 11. Actualizar nombres de bayas en gastos de extracción
        document.querySelectorAll('.extraction-item .berry-name').forEach(nameElement => {
            const parent = nameElement.closest('.extraction-item');
            if (parent) {
                const berryType = parent.dataset.berry;
                if (berryType) {
                    nameElement.textContent = this.getBerryDisplayName(berryType);
                }
            }
        });
        
        // 12. Actualizar nombres de semillas
        document.querySelectorAll('.seed-name[data-seed-id]').forEach(nameElement => {
            const seedId = nameElement.dataset.seedId;
            if (seedId) {
                nameElement.textContent = window.berryData.getTranslatedSeedName(seedId);
            }
        });
    }
}

// Exportar instancia global
window.berryUI = new BerryUI();
