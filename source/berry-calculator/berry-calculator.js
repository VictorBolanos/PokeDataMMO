// Berry Calculator - Main Controller
class BerryCalculator {
    constructor() {
        this.isInitialized = false;
        this.currentCalculation = null;  // Nombre del cálculo actual
        this.isNewCalculation = false;   // Si es un cálculo nuevo
        this.autoSaveTimeout = null;     // Timer para auto-save
        this.AUTO_SAVE_DELAY = 10000;    // 10 segundos de delay
        this.isSaving = false;           // Flag para evitar guardados simultáneos
    }

    // Inicializar calculadora
    async init() {
        if (this.isInitialized) return;

        try {
            await window.berryUI.renderInitialUI();
            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Berry Calculator init error:', error);
        }
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
            console.error('❌ Load error:', result.message);
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
        
        if (!this.currentCalculation) {
            return;
        }
        
        this.autoSaveTimeout = setTimeout(() => {
            this.performAutoSave();
        }, this.AUTO_SAVE_DELAY);
    }

    // Ejecutar auto-guardado
    async performAutoSave() {
        if (this.isSaving || !this.currentCalculation) {
            return;
        }
        
        this.isSaving = true;
        
        try {
            const calculationData = window.berryUI.collectCalculationData();
            const result = await window.authManager.saveBerryCalculation(
                this.currentCalculation, 
                calculationData
            );
            
            if (result.success) {
                window.berryUI.showSaveIndicator('success');
            } else {
                console.error('❌ Auto-save error:', result.message);
                window.berryUI.showSaveIndicator('error');
            }
            
        } catch (error) {
            console.error('❌ Auto-save error:', error);
            window.berryUI.showSaveIndicator('error');
        } finally {
            this.isSaving = false;
        }
    }

    // Forzar guardado inmediato
    async forceSave() {
        // Cancelar auto-save programado
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = null;
        }
        
        // Guardar inmediatamente
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
        if (!this.currentCalculation) {
            return false;
        }
        
        const result = await window.authManager.deleteBerryCalculation(this.currentCalculation);
        
        if (result.success) {
            this.currentCalculation = null;
            this.isNewCalculation = false;
            await window.berryUI.renderInitialUI();
            return true;
        }
        
        return false;
    }
}

// Exportar instancia global
window.berryCalculator = new BerryCalculator();

