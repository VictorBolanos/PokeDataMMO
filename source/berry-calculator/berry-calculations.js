// Berry Calculator - Mathematical Logic
class BerryCalculations {
    constructor() {
        this.extractorCost = 350;
    }


    // Calcular semillas vendibles
    calculateSellableSeeds(harvest, conservation, zanamasSeeds) {
        const sellable = {};
        
        Object.keys(harvest).forEach(seedType => {
            const totalHarvest = harvest[seedType] || 0;
            const totalConservation = (conservation[seedType] || 0) + (zanamasSeeds[seedType] || 0);
            
            sellable[seedType] = Math.max(0, totalHarvest - totalConservation);
        });

        return sellable;
    }

    // Calcular ganancias por semilla
    calculateSeedProfits(sellableSeeds, seedPrices) {
        const profits = {};
        let totalProfits = 0;

        Object.keys(sellableSeeds).forEach(seedType => {
            const sellable = sellableSeeds[seedType] || 0;
            const price = seedPrices[seedType] || 0;
            const profit = Math.round(sellable * price);
            
            profits[seedType] = profit;
            totalProfits += profit;
        });

        return { profits, totalProfits: Math.round(totalProfits) };
    }

    // Calcular gastos de extracción
    calculateExtractionCosts(berryHarvests) {
        const costs = {};
        let totalCost = 0;

        Object.keys(berryHarvests).forEach(berryType => {
            if (berryType !== 'leppa-berry') { // Excluir Zanamas
                const harvest = berryHarvests[berryType] || 0;
                const cost = Math.round(harvest * this.extractorCost);
                
                costs[berryType] = cost;
                totalCost += cost;
            }
        });

        return { costs, totalCost: Math.round(totalCost) };
    }

}

// Exportar instancia global
window.berryCalculations = new BerryCalculations();

