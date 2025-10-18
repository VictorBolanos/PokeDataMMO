// Berry Calculator - Main Controller
class BerryCalculator {
    constructor() {
        this.isInitialized = false;
    }

    // Inicializar calculadora
    async init() {
        if (this.isInitialized) return;

        try {
            // Renderizar interfaz
            window.berryUI.render();
            
            // Marcar como inicializado
            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Error initializing Berry Calculator:', error);
        }
    }
}

// Exportar instancia global
window.berryCalculator = new BerryCalculator();

