// Berry Calculator - Main Controller
class BerryCalculator {
    constructor() {
        this.isInitialized = false;
        this.currentBerry = null;
        this.calculations = null;
    }

    // Inicializar calculadora
    async init() {
        if (this.isInitialized) return;

        console.log('🌱 Initializing Berry Calculator...');
        
        try {
            // Renderizar interfaz
            window.berryUI.render();
            
            // Marcar como inicializado
            this.isInitialized = true;
            
            console.log('✅ Berry Calculator initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Berry Calculator:', error);
        }
    }

    // Obtener configuración actual
    getCurrentConfig() {
        return {
            berry: this.currentBerry,
            plantCount: window.berryUI.plantCount,
            characterCount: window.berryUI.characterCount,
            calculations: this.calculations
        };
    }

    // Exportar datos como JSON
    exportData() {
        const config = this.getCurrentConfig();
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `berry-calculator-${this.currentBerry}-${Date.now()}.json`;
        link.click();
    }

    // Importar datos desde JSON
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.loadConfiguration(data);
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error al importar los datos. Verifica que el archivo sea válido.');
            }
        };
        reader.readAsText(file);
    }

    // Cargar configuración
    loadConfiguration(data) {
        if (data.berry) {
            document.getElementById('berryTypeSelector').value = data.berry;
            window.berryUI.handleBerrySelection(data.berry);
        }
        
        if (data.plantCount) {
            document.getElementById('plantCountInput').value = data.plantCount;
            window.berryUI.plantCount = data.plantCount;
        }
        
        if (data.characterCount) {
            document.getElementById('characterCountInput').value = data.characterCount;
            window.berryUI.characterCount = data.characterCount;
        }
        
        // Recalcular si hay datos suficientes
        if (data.plantCount && data.characterCount) {
            window.berryUI.calculateAndRender();
        }
    }

    // Resetear calculadora
    reset() {
        this.currentBerry = null;
        this.calculations = null;
        
        // Limpiar inputs
        document.getElementById('berryTypeSelector').value = '';
        document.getElementById('plantCountInput').value = '';
        document.getElementById('characterCountInput').value = '';
        
        // Deshabilitar inputs
        document.getElementById('plantCountInput').disabled = true;
        document.getElementById('characterCountInput').disabled = true;
        
        // Ocultar contenido
        window.berryUI.hideContent();
    }

    // Obtener estadísticas de uso
    getUsageStats() {
        return {
            initialized: this.isInitialized,
            currentBerry: this.currentBerry,
            calculationsPerformed: this.calculations ? Object.keys(this.calculations).length : 0,
            lastCalculation: this.calculations ? new Date().toISOString() : null
        };
    }
}

// Exportar instancia global
window.berryCalculator = new BerryCalculator();

