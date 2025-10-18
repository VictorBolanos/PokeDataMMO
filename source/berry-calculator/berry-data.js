// Berry Calculator - Data Configuration
class BerryData {
    constructor() {
        this.berries = {
            'zanamas': {
                name: 'Zanamas',
                apiName: 'leppa-berry',
                cycle: 20, // horas
                phases: [
                    {
                        name: 'Meloc',
                        apiName: 'pecha-berry',
                        cycle: 16,
                        seeds: [
                            { type: 'dulce', amount: 1 },
                            { type: 'muy-dulce', amount: 1 }
                        ],
                        irrigation: {
                            first: 6, // horas después del plantado
                            second: null // editable pero no calculado automáticamente
                        }
                    },
                    {
                        name: 'Safre',
                        apiName: 'rawst-berry',
                        cycle: 16,
                        seeds: [
                            { type: 'amarga', amount: 1 },
                            { type: 'muy-amarga', amount: 1 }
                        ],
                        irrigation: {
                            first: 6, // horas después del plantado
                            second: null // editable pero no calculado automáticamente
                        }
                    },
                    {
                        name: 'Zreza',
                        apiName: 'cheri-berry',
                        cycle: 16,
                        seeds: [
                            { type: 'picante', amount: 3 }
                        ],
                        irrigation: {
                            first: 6, // horas después del plantado
                            second: null // editable pero no calculado automáticamente
                        }
                    },
                    {
                        name: 'Zanamas',
                        apiName: 'leppa-berry',
                        cycle: 20,
                        seeds: [
                            { type: 'dulce', amount: 1 },
                            { type: 'amarga', amount: 1 },
                            { type: 'muy-picante', amount: 1 }
                        ],
                        irrigation: {
                            first: 6, // horas después del plantado
                            second: 10 // horas después del primer riego
                        }
                    }
                ]
            }
        };

        this.seedTypes = {
            'dulce': {
                name: 'Dulce',
                image: 'sweet.png',
                color: '#ff69b4'
            },
            'muy-dulce': {
                name: 'Muy Dulce',
                image: 'very-sweet.png',
                color: '#ffb6c1'
            },
            'amarga': {
                name: 'Amarga',
                image: 'bitter.png',
                color: '#90ee90'
            },
            'muy-amarga': {
                name: 'Muy Amarga',
                image: 'very-bitter.png',
                color: '#32cd32'
            },
            'picante': {
                name: 'Picante',
                image: 'spicy.png',
                color: '#ffa500'
            },
            'muy-picante': {
                name: 'Muy Picante',
                image: 'very-spicy.png',
                color: '#ff4500'
            },
            'seca': {
                name: 'Seca',
                image: 'dry.png',
                color: '#daa520'
            },
            'muy-seca': {
                name: 'Muy Seca',
                image: 'very-dry.png',
                color: '#b8860b'
            },
            'acida': {
                name: 'Ácida',
                image: 'sour.png',
                color: '#9370db'
            },
            'muy-acida': {
                name: 'Muy Ácida',
                image: 'very-sour.png',
                color: '#8b2be2'
            }
        };

        this.extractorCost = 350;
        this.gtlCommission = 0.05; // 5% comisión GTL
    }

    getBerryConfig(berryType) {
        return this.berries[berryType];
    }

    getSeedConfig(seedType) {
        return this.seedTypes[seedType];
    }

    // Obtener nombre traducido de semilla
    getTranslatedSeedName(seedType) {
        const lm = window.languageManager;
        return lm.t(`farming.calculator.seeds.${seedType}`);
    }

    getAllBerries() {
        return Object.keys(this.berries).map(key => ({
            id: key,
            name: this.berries[key].name
        }));
    }

    getAllSeedTypes() {
        return Object.keys(this.seedTypes).map(key => ({
            id: key,
            name: this.seedTypes[key].name,
            image: this.seedTypes[key].image,
            color: this.seedTypes[key].color
        }));
    }

    // Calcular semillas necesarias para conservar
    calculateConservationSeeds(berryType, plantCount) {
        const config = this.getBerryConfig(berryType);
        const conservation = {};

        if (berryType === 'zanamas') {
            // Para el ciclo completo de zanamas
            conservation['dulce'] = plantCount * 1; // 1 para meloc + 1 para zanamas
            conservation['muy-dulce'] = plantCount * 1; // 1 para meloc
            conservation['amarga'] = plantCount * 1; // 1 para safre + 1 para zanamas
            conservation['muy-amarga'] = plantCount * 1; // 1 para safre
            conservation['picante'] = plantCount * 3; // 3 para zreza
            conservation['muy-picante'] = 0; // NO se conservan, solo se usan para zanamas
        }

        return conservation;
    }

    // Calcular semillas para zanamas específicamente
    calculateZanamasSeeds(plantCount) {
        return {
            'dulce': plantCount * 1,
            'amarga': plantCount * 1,
            'muy-picante': plantCount * 1
        };
    }

    // Obtener semillas necesarias para un cultivo específico
    getRequiredSeedsForCultivation(berryType) {
        const config = this.getBerryConfig(berryType);
        const requiredSeeds = new Set();

        if (berryType === 'zanamas') {
            // Recopilar todas las semillas necesarias para el ciclo completo
            config.phases.forEach(phase => {
                phase.seeds.forEach(seedReq => {
                    requiredSeeds.add(seedReq.type);
                });
            });
        }

        return Array.from(requiredSeeds);
    }
}

// Exportar instancia global
window.berryData = new BerryData();