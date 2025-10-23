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
                image: 'sweet.png'
            },
            'muy-dulce': {
                name: 'Muy Dulce',
                image: 'very-sweet.png'
            },
            'amarga': {
                name: 'Amarga',
                image: 'bitter.png'
            },
            'muy-amarga': {
                name: 'Muy Amarga',
                image: 'very-bitter.png'
            },
            'picante': {
                name: 'Picante',
                image: 'spicy.png'
            },
            'muy-picante': {
                name: 'Muy Picante',
                image: 'very-spicy.png'
            },
            'seca': {
                name: 'Seca',
                image: 'dry.png'
            },
            'muy-seca': {
                name: 'Muy Seca',
                image: 'very-dry.png'
            },
            'acida': {
                name: 'Ácida',
                image: 'sour.png'
            },
            'muy-acida': {
                name: 'Muy Ácida',
                image: 'very-sour.png'
            }
        };
    }

    getBerryConfig(berryType) {
        return this.berries[berryType];
    }

    // Obtener nombre traducido de semilla
    getTranslatedSeedName(seedType) {
        const lm = window.languageManager;
        return lm.t(`farming.calculator.seeds.${seedType}`);
    }

    getAllSeedTypes() {
        return Object.keys(this.seedTypes).map(key => ({
            id: key,
            name: this.seedTypes[key].name,
            image: this.seedTypes[key].image
        }));
    }

    // Calcular semillas necesarias para conservar
    calculateConservationSeeds(berryType, plantCount) {
        if (berryType !== 'zanamas') return {};

        return {
            'dulce': plantCount * 1, // 1 para meloc + 1 para zanamas
            'muy-dulce': plantCount * 1, // 1 para meloc
            'amarga': plantCount * 1, // 1 para safre + 1 para zanamas
            'muy-amarga': plantCount * 1, // 1 para safre
            'picante': plantCount * 3, // 3 para zreza
            'muy-picante': 0 // NO se conservan, solo se usan para zanamas
        };
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
        if (berryType !== 'zanamas') return [];

        const config = this.getBerryConfig(berryType);
        const requiredSeeds = new Set();

        config.phases.forEach(phase => {
            phase.seeds.forEach(seedReq => {
                requiredSeeds.add(seedReq.type);
            });
        });

        return Array.from(requiredSeeds);
    }
}

// Exportar instancia global
window.berryData = new BerryData();