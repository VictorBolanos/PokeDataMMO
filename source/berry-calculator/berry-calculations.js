// Berry Calculator - Mathematical Logic
class BerryCalculations {
    constructor() {
        this.extractorCost = 350;
        this.gtlCommission = 0.05;
    }

    // Calcular cosecha total de semillas por tipo
    calculateSeedHarvest(berryType, plantCount, characterCount) {
        const config = window.berryData.getBerryConfig(berryType);
        const totalPlants = plantCount * characterCount;
        const harvest = {};

        // Simulación de cosecha con extractores
        // Cada baya cosechada usa 1 extractor y produce semillas aleatorias
        config.phases.forEach(phase => {
            const berryHarvest = this.simulateBerryHarvest(phase.apiName, totalPlants);
            
            // Distribuir semillas según probabilidades del juego
            phase.seeds.forEach(seedReq => {
                const seedType = seedReq.type;
                if (!harvest[seedType]) harvest[seedType] = 0;
                
                // Simular cosecha de semillas (promedio basado en probabilidades del juego)
                harvest[seedType] += Math.floor(berryHarvest * this.getSeedDropRate(seedType));
            });
        });

        return harvest;
    }

    // Simular cosecha de bayas (usando datos de la imagen como referencia)
    simulateBerryHarvest(berryApiName, plantCount) {
        // Datos de referencia de la imagen
        const harvestRates = {
            'pecha-berry': 696, // Meloc
            'rawst-berry': 692, // Safre  
            'cheri-berry': 725, // Zreza
            'leppa-berry': 939  // Zanamas
        };

        // Calcular tasa de cosecha por planta
        const baseHarvest = harvestRates[berryApiName] || 700;
        const harvestPerPlant = baseHarvest / 100; // Asumiendo 100 plantas base
        
        return Math.floor(plantCount * harvestPerPlant);
    }

    // Obtener tasa de caída de semillas por tipo
    getSeedDropRate(seedType) {
        const dropRates = {
            'dulce': 0.25,
            'muy-dulce': 0.15,
            'amarga': 0.25,
            'muy-amarga': 0.15,
            'picante': 0.30,
            'muy-picante': 0.15,
            'seca': 0.20,
            'muy-seca': 0.10,
            'acida': 0.20,
            'muy-acida': 0.10
        };
        
        return dropRates[seedType] || 0.20;
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
            const profit = sellable * price;
            
            profits[seedType] = profit;
            totalProfits += profit;
        });

        return { profits, totalProfits };
    }

    // Calcular gastos de extracción
    calculateExtractionCosts(berryHarvests) {
        const costs = {};
        let totalCost = 0;

        Object.keys(berryHarvests).forEach(berryType => {
            const harvest = berryHarvests[berryType] || 0;
            const cost = harvest * this.extractorCost;
            
            costs[berryType] = cost;
            totalCost += cost;
        });

        return { costs, totalCost };
    }

    // Calcular gastos de gestión (comisiones GTL)
    calculateManagementCosts(totalSales) {
        return totalSales * this.gtlCommission;
    }

    // Calcular ganancias finales de zanamas
    calculateZanamasProfits(zanamasHarvest, zanamasPrice) {
        return zanamasHarvest * zanamasPrice;
    }

    // Calcular total final
    calculateFinalTotal(totalSales, extractionCosts, purchaseCosts, managementCosts) {
        return totalSales - extractionCosts - purchaseCosts - managementCosts;
    }

    // Calcular horarios de riego
    calculateIrrigationSchedule(plantTime, phases) {
        const schedule = [];
        let currentTime = new Date(plantTime);

        phases.forEach((phase, index) => {
            const phaseSchedule = {
                berry: phase.name,
                plantTime: new Date(currentTime),
                firstIrrigation: new Date(currentTime),
                secondIrrigation: null,
                harvestTime: null,
                harvestUnits: 0
            };

            // Configurar segundo riego
            if (phase.irrigation.second) {
                phaseSchedule.secondIrrigation = new Date(
                    currentTime.getTime() + (phase.irrigation.second * 60 * 60 * 1000)
                );
            }

            // Configurar tiempo de cosecha
            phaseSchedule.harvestTime = new Date(
                currentTime.getTime() + (phase.cycle * 60 * 60 * 1000)
            );

            schedule.push(phaseSchedule);

            // Actualizar tiempo para la siguiente fase
            currentTime = new Date(phaseSchedule.harvestTime);
        });

        return schedule;
    }

    // Formatear tiempo para mostrar
    formatTime(date) {
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    }

    // Calcular tiempo de pérdida de cosecha
    calculateLossTime(harvestTime) {
        const lossTime = new Date(harvestTime.getTime() + (60 * 60 * 1000)); // +1 hora
        return lossTime;
    }
}

// Exportar instancia global
window.berryCalculations = new BerryCalculations();

