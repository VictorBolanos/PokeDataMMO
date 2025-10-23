// Berry Calculator - Main Controller
class BerryCalculator {
    constructor() {
        this.isInitialized = false;
        this.currentCalculation = null;  // Nombre del cálculo actual
        this.isNewCalculation = false;   // Si es un cálculo nuevo
        this.autoSaveTimeout = null;     // Timer para auto-save
        this.AUTO_SAVE_DELAY = 7000;     // 7 segundos de delay
        this.isSaving = false;           // Flag para evitar guardados simultáneos
    }

    // Inicializar calculadora
    async init() {
        if (this.isInitialized) return;

        await window.berryUI.renderInitialUI();
        this.isInitialized = true;
    }

    // Crear nuevo cálculo
    async createNewCalculation() {
        this.currentCalculation = null;
        this.isNewCalculation = true;
        await window.berryUI.renderCalculatorUI();
    }

    // Cargar cálculo existente
    async loadCalculation(calculationName) {
        const result = await window.authManager.loadBerryCalculation(calculationName);
        
        if (!result.success) {
            return false;
        }
        
        this.currentCalculation = calculationName;
        this.isNewCalculation = false;
        await window.berryUI.renderCalculatorUI(result.data);
        
        return true;
    }

    // Programar auto-guardado
    scheduleAutoSave() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }
        
        // Validar que hay nombre válido antes de programar
        if (!this.currentCalculation || !this.currentCalculation.trim()) {
            return;
        }
        
        this.autoSaveTimeout = setTimeout(() => {
            this.performAutoSave();
        }, this.AUTO_SAVE_DELAY);
    }

    // Cancelar auto-guardado programado
    cancelAutoSave() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = null;
        }
    }

    // Ejecutar auto-guardado
    async performAutoSave() {
        if (this.isSaving || !this.currentCalculation?.trim()) return;
        
        // Verificar que el nombre en el input sigue siendo válido
        const nameInput = document.getElementById('calculationNameInput');
        if (!nameInput?.value?.trim()) return;
        
        this.isSaving = true;
        
        try {
            const calculationData = window.berryUI.collectCalculationData();
            
            // Validación final: asegurar que el nombre está en los datos
            if (!calculationData.calculationName?.trim()) return;
            
            const result = await window.authManager.saveBerryCalculation(
                this.currentCalculation, 
                calculationData
            );
            
            window.berryUI.showSaveIndicator(result.success ? 'success' : 'error');
            
        } catch (error) {
            window.berryUI.showSaveIndicator('error');
        } finally {
            this.isSaving = false;
        }
    }

    // Forzar guardado inmediato
    async forceSave() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = null;
        }
        
        await this.performAutoSave();
    }

    // Obtener nombre del cálculo actual
    getCurrentCalculationName() {
        return this.currentCalculation;
    }

    // Establecer nombre del cálculo
    setCalculationName(name) {
        const oldName = this.currentCalculation;
        this.currentCalculation = name;
        
        if (this.isNewCalculation && name) {
            this.isNewCalculation = false;
        }
        
        if (oldName && oldName !== name) {
            window.authManager.renameBerryCalculation(oldName, name);
        }
    }

    // Eliminar cálculo actual
    async deleteCurrentCalculation() {
        if (!this.currentCalculation) return false;
        
        const result = await window.authManager.deleteBerryCalculation(this.currentCalculation);
        
        if (result.success) {
            this.currentCalculation = null;
            this.isNewCalculation = false;
            await window.berryUI.renderInitialUI();
        }
        
        return result.success;
    }
}

// Exportar instancia global
window.berryCalculator = new BerryCalculator();

