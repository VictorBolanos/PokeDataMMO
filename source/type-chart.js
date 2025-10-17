// PokeDataMMO - Type Chart System

// ===== TYPE EFFECTIVENESS DATA =====
const typeEffectiveness = {
    normal: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1,
        ground: 1, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0, dragon: 1, dark: 1, steel: 0.5
    },
    fire: {
        normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2, fighting: 1, poison: 1,
        ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2
    },
    water: {
        normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 1,
        ground: 2, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1
    },
    electric: {
        normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1, fighting: 1, poison: 1,
        ground: 0, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1
    },
    grass: {
        normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 0.5,
        ground: 2, flying: 0.5, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5
    },
    ice: {
        normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5, fighting: 1, poison: 1,
        ground: 2, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5
    },
    fighting: {
        normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 2, fighting: 1, poison: 0.5,
        ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2
    },
    poison: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1, fighting: 1, poison: 0.5,
        ground: 0.5, flying: 1, psychic: 1, bug: 1, rock: 0.5, ghost: 0.5, dragon: 1, dark: 1, steel: 0
    },
    ground: {
        normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1, fighting: 1, poison: 2,
        ground: 1, flying: 0, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2
    },
    flying: {
        normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1, fighting: 2, poison: 1,
        ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5
    },
    psychic: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 2,
        ground: 1, flying: 1, psychic: 0.5, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5
    },
    bug: {
        normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1, fighting: 0.5, poison: 0.5,
        ground: 1, flying: 0.5, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5
    },
    rock: {
        normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2, fighting: 0.5, poison: 1,
        ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5
    },
    ghost: {
        normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1,
        ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1
    },
    dragon: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1,
        ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5
    },
    dark: {
        normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1,
        ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1
    },
    steel: {
        normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2, fighting: 1, poison: 1,
        ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5
    }
};

// ===== TYPE NAMES AND ICONS =====
const typeData = {
    normal: { name: 'Normal', icon: 'type-normal-box-icon.png', longIcon: 'type-normal-long-icon.png' },
    fire: { name: 'Fire', icon: 'type-fire-box-icon.png', longIcon: 'type-fire-long-icon.png' },
    water: { name: 'Water', icon: 'type-water-box-icon.png', longIcon: 'type-water-long-icon.png' },
    electric: { name: 'Electric', icon: 'type-electric-box-icon.png', longIcon: 'type-electric-long-icon.png' },
    grass: { name: 'Grass', icon: 'type-grass-box-icon.png', longIcon: 'type-grass-long-icon.png' },
    ice: { name: 'Ice', icon: 'type-ice-box-icon.png', longIcon: 'type-ice-long-icon.png' },
    fighting: { name: 'Fighting', icon: 'type-fighting-box-icon.png', longIcon: 'type-fighting-long-icon.png' },
    poison: { name: 'Poison', icon: 'type-poison-box-icon.png', longIcon: 'type-poison-long-icon.png' },
    ground: { name: 'Ground', icon: 'type-ground-box-icon.png', longIcon: 'type-ground-long-icon.png' },
    flying: { name: 'Flying', icon: 'type-flying-box-icon.png', longIcon: 'type-flying-long-icon.png' },
    psychic: { name: 'Psychic', icon: 'type-psychic-box-icon.png', longIcon: 'type-psychic-long.icon.png' },
    bug: { name: 'Bug', icon: 'type-bug-box-icon.png', longIcon: 'type-bug-long-icon.png' },
    rock: { name: 'Rock', icon: 'type-rock-box-icon.png', longIcon: 'type-rock-long-icon.png' },
    ghost: { name: 'Ghost', icon: 'type-ghost-box-icon.png', longIcon: 'type-ghost-long-icon.png' },
    dragon: { name: 'Dragon', icon: 'type-dragon-box-icon.png', longIcon: 'type-dragon-long-icon.png' },
    dark: { name: 'Dark', icon: 'type-dark-box-icon.png', longIcon: 'type-dark-long-icon.png' },
    steel: { name: 'Steel', icon: 'type-steel-box-icon.png', longIcon: 'type-steel-long-icon.png' }
};

// ===== TYPE CHART CLASS =====
class TypeChart {
    constructor() {
        this.primaryType = null;
        this.secondaryType = null;
        // Orden específico de tipos
        this.types = [
            'normal', 'fire', 'water', 'grass', 'bug', 'flying', 'electric', 'ice', 
            'steel', 'rock', 'ground', 'fighting', 'dark', 'ghost', 'poison', 'psychic', 'dragon'
        ];
        
        this.init();
    }
    
    init() {
        this.populateSelectors();
        this.createTypeChart();
        this.setupEventListeners();
    }
    
    populateSelectors() {
        const typeButtonsGrid = document.getElementById('typeButtonsGrid');
        
        // Create type buttons
        this.types.forEach(type => {
            const button = document.createElement('div');
            button.className = 'type-button';
            button.dataset.type = type;
            button.innerHTML = `
                <img src="img/res/poke-types/long/${typeData[type].longIcon}" alt="${typeData[type].name}">
            `;
            typeButtonsGrid.appendChild(button);
        });
        
        this.setupTypeButtons();
    }
    
    setupTypeButtons() {
        const typeButtons = document.querySelectorAll('.type-button');
        
        typeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const type = button.dataset.type;
                
                if (button.classList.contains('selected')) {
                    this.handleDeselectType(button);
                } else {
                    this.handleSelectType(type, button);
                }
                
                this.updateEffectiveness();
            });
        });
    }
    
    handleDeselectType(button) {
        if (button.classList.contains('secondary')) {
            this.secondaryType = null;
            button.classList.remove('selected', 'secondary');
        } else {
            this.primaryType = null;
            button.classList.remove('selected');
            
            // Also deselect secondary if exists
            if (this.secondaryType) {
                const secondaryButton = document.querySelector(`[data-type="${this.secondaryType}"]`);
                if (secondaryButton) {
                    secondaryButton.classList.remove('selected', 'secondary');
                }
                this.secondaryType = null;
            }
        }
    }
    
    handleSelectType(type, button) {
        if (!this.primaryType) {
            this.primaryType = type;
            button.classList.add('selected');
        } else if (!this.secondaryType && type !== this.primaryType) {
            this.secondaryType = type;
            button.classList.add('selected', 'secondary');
        }
    }
    
    createTypeChart() {
        const table = document.getElementById('typeChartTable');
        table.innerHTML = '';
        
        // Create header row
        table.appendChild(this.createHeaderRow());
        
        // Create data rows
        this.types.forEach(attackingType => {
            table.appendChild(this.createDataRow(attackingType));
        });
        
        this.setupHoverEffects();
    }
    
    createHeaderRow() {
        const headerRow = document.createElement('div');
        headerRow.className = 'type-chart-row';
        
        // Empty corner cell
        const cornerCell = document.createElement('div');
        cornerCell.className = 'type-chart-cell type-chart-header corner-cell';
        headerRow.appendChild(cornerCell);
        
        // Type headers
        this.types.forEach(type => {
            const headerCell = document.createElement('div');
            headerCell.className = 'type-chart-cell type-chart-header';
            headerCell.innerHTML = `<img src="img/res/poke-types/box/${typeData[type].icon}" alt="${typeData[type].name}">`;
            headerRow.appendChild(headerCell);
        });
        
        return headerRow;
    }
    
    createDataRow(attackingType) {
        const row = document.createElement('div');
        row.className = 'type-chart-row';
        
        // Type name cell
        const typeCell = document.createElement('div');
        typeCell.className = 'type-chart-cell type-chart-header';
        typeCell.innerHTML = `<img src="img/res/poke-types/box/${typeData[attackingType].icon}" alt="${typeData[attackingType].name}">`;
        row.appendChild(typeCell);
        
        // Effectiveness cells
        this.types.forEach((defendingType, colIndex) => {
            const cell = this.createEffectivenessCell(attackingType, defendingType, colIndex);
            row.appendChild(cell);
        });
        
        return row;
    }
    
    createEffectivenessCell(attackingType, defendingType, colIndex) {
        const effectiveness = typeEffectiveness[attackingType][defendingType];
        const effectivenessClass = effectiveness === 0 ? '0' : effectiveness === 0.5 ? '05' : effectiveness;
        const displayValue = effectiveness === 0 ? '0' : effectiveness === 0.5 ? '0.5' : effectiveness;
        
        const cell = document.createElement('div');
        cell.className = `type-chart-cell effectiveness-${effectivenessClass}`;
        cell.textContent = displayValue;
        cell.title = `${typeData[attackingType].name} vs ${typeData[defendingType].name}: ${effectiveness}x`;
        cell.dataset.row = this.types.indexOf(attackingType);
        cell.dataset.col = colIndex;
        
        return cell;
    }
    
    setupHoverEffects() {
        const cells = document.querySelectorAll('.type-chart-cell');
        
        cells.forEach(cell => {
            cell.addEventListener('mouseenter', () => this.highlightCells(cell));
            cell.addEventListener('mouseleave', () => this.removeHighlights());
        });
    }
    
    highlightCells(cell) {
        const { row, col } = cell.dataset;
        
        if (row !== undefined) {
            document.querySelectorAll(`[data-row="${row}"]`).forEach(c => {
                c.classList.add('hover-row');
            });
        }
        
        if (col && col !== '0') {
            document.querySelectorAll(`[data-col="${col}"]`).forEach(c => {
                c.classList.add('hover-col');
            });
        }
    }
    
    removeHighlights() {
        document.querySelectorAll('.hover-row, .hover-col').forEach(c => {
            c.classList.remove('hover-row', 'hover-col');
        });
    }
    
    
    updateEffectiveness() {
        const resultsContainer = document.getElementById('effectivenessResults');
        
        if (!this.primaryType) {
            resultsContainer.style.display = 'none';
            return;
        }
        
        const effectiveness = this.calculateEffectiveness();
        this.displayEffectiveness(effectiveness);
        resultsContainer.style.display = 'block';
    }
    
    calculateEffectiveness() {
        const effectiveness = {
            noEffect: [],
            notVeryEffective: [],
            superEffective: [],
            ultraEffective: []
        };
        
        this.types.forEach(type => {
            const multiplier = this.getTypeMultiplier(type);
            this.categorizeEffectiveness(type, multiplier, effectiveness);
        });
        
        return effectiveness;
    }
    
    getTypeMultiplier(attackingType) {
        let multiplier = typeEffectiveness[attackingType][this.primaryType];
        
        if (this.secondaryType && this.secondaryType !== this.primaryType) {
            multiplier *= typeEffectiveness[attackingType][this.secondaryType];
        }
        
        return multiplier;
    }
    
    categorizeEffectiveness(type, multiplier, effectiveness) {
        if (multiplier === 0) {
            effectiveness.noEffect.push(type);
        } else if (multiplier <= 0.5) {
            effectiveness.notVeryEffective.push(type);
        } else if (multiplier === 2) {
            effectiveness.superEffective.push(type);
        } else if (multiplier >= 4) {
            effectiveness.ultraEffective.push(type);
        }
    }
    
    displayEffectiveness(effectiveness) {
        this.displayEffectivenessList('noEffectList', effectiveness.noEffect);
        this.displayEffectivenessList('notVeryEffectiveList', effectiveness.notVeryEffective);
        this.displayEffectivenessList('superEffectiveList', effectiveness.superEffective);
        this.displayEffectivenessList('ultraEffectiveList', effectiveness.ultraEffective);
    }
    
    displayEffectivenessList(listId, types) {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        
        if (types.length === 0) {
            list.innerHTML = '<div class="no-types">None</div>';
            return;
        }
        
        types.forEach(type => {
            const typeElement = document.createElement('div');
            typeElement.className = 'effectiveness-type';
            typeElement.innerHTML = `
                <img src="img/res/poke-types/long/${typeData[type].longIcon}" alt="${typeData[type].name}">
            `;
            list.appendChild(typeElement);
        });
    }
}

// ===== INITIALIZATION =====
let typeChart;

document.addEventListener('DOMContentLoaded', () => {
    typeChart = new TypeChart();
});

// Export for global access
window.TypeChart = TypeChart;
