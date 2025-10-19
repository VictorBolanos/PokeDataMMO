// PokeDataMMO - Language Manager
// Professional internationalization system for English and Spanish

class LanguageManager {
    constructor() {
        this.currentLanguage = this.loadLanguage();
        this.translations = {
            en: {
                // ===== HEADER & NAVIGATION =====
                title: 'PokeDataMMO - Personal Wiki and Utilities for PokeMMO',
                
                // ===== TAB NAMES =====
                tabs: {
                    leagues: 'Leagues',
                    farming: 'Berry Farming',
                    breeding: 'Breeding Calculator',
                    pokecalc: 'Pokémon Calculator',
                    pvp: 'PVP Teams',
                    pokedex: 'Pokédex',
                    typechart: 'Types Table'
                },
                
                // ===== LEAGUES TAB =====
                leagues: {
                    title: '🏆 Leagues',
                    subtitle: "Complete guides for conquering the game's leagues",
                    whatsComingTitle: "What's Coming",
                    description: 'This section will contain comprehensive guides for all the leagues in PokeMMO, including:',
                    features: {
                        strategies: 'Strategy guides for each gym leader and Elite Four member',
                        teams: 'Recommended team compositions for different regions',
                        levels: 'Level recommendations and training tips',
                        items: 'Item usage strategies for optimal performance'
                    },
                    ambitiousProject: 'Ambitious Project:',
                    ambitiousDescription: "We're considering translating and adapting the comprehensive Chinese league strategy guides into properly written English guides.",
                    developmentStatus: 'Development Status',
                    statusPlanning: 'In Planning',
                    researchPhase: 'Research phase ongoing'
                },
                
                // ===== BERRY FARMING TAB =====
                farming: {
                    title: '🌱 Berry Farming',
                    subtitle: 'Management and optimization system for berry cultivation',
                    whatsComingTitle: "What's Coming",
                    description: 'This section will provide comprehensive berry farming management tools:',
                    features: {
                        tracking: 'Berry growth tracking with timers and notifications',
                        schedules: 'Optimal planting schedules for maximum yield',
                        soil: 'Soil condition monitoring and fertilizer recommendations',
                        profit: 'Profit calculators for different berry types',
                        harvest: 'Harvest optimization strategies'
                    },
                    developmentStatus: 'Development Status',
                    statusDevelopment: 'In Development',
                    coreFeatures: 'Core functionality being built',
                    
                    // ===== BERRY CALCULATOR =====
                    calculator: {
                        title: '🌱 Berry Farming Calculator',
                        subtitle: 'Advanced calculation system to optimize berry cultivation in PokeMMO',
                        cultivationType: 'Cultivation Type',
                        selectCultivation: 'Select a cultivation type',
                        plantsPerCharacter: 'Plants per Character',
                        numberOfCharacters: 'Number of Characters',
                        irrigationSchedule: '⏰ Irrigation Schedule',
                        seedsAnalysis: '💰 Seeds and Profits Analysis',
                        expensesSummary: '📊 Expenses and Profits Summary',
                        berry: 'Berry',
                        plantingTime: 'Planting Time',
                        firstIrrigation: 'First Irrigation',
                        secondIrrigation: 'Second Irrigation',
                        harvestTime: 'Harvest Time',
                        harvestLossTime: 'Harvest Loss Time',
                        harvestUnits: 'Harvest Units',
                        seed: 'Seed',
                        harvest: 'Harvest',
                        toConserve: 'To Conserve',
                        forZanamas: 'For Zanamas',
                        sellable: 'Sellable',
                        sellingPrice: 'Selling Price',
                        profits: 'Profits',
                        totalSales: 'Total Sales',
                        extractionCosts: 'Extraction Costs',
                        totalExtraction: 'Total Extraction',
                        purchaseCosts: 'Purchase Costs',
                        totalPurchases: 'Total Purchases',
                        managementCosts: 'Management Costs',
                        totalManagement: 'Total Management',
                        finalTotal: 'Final Total',
                        netProfit: 'Net Profit',
                        addExpense: 'Add Expense',
                        removeExpense: 'Remove Expense',
                        meloc: 'Pecha',
                        safre: 'Rawst',
                        zreza: 'Cheri',
                        leppa: 'Leppa',
                        // Nombres de semillas
                        seeds: {
                            dulce: 'Sweet',
                            'muy-dulce': 'Very Sweet',
                            amarga: 'Bitter',
                            'muy-amarga': 'Very Bitter',
                            picante: 'Spicy',
                            'muy-picante': 'Very Spicy',
                            seca: 'Dry',
                            'muy-seca': 'Very Dry',
                            acida: 'Sour',
                            'muy-acida': 'Very Sour'
                        },
                        // Load/New System
                        loadSavedCalculation: 'Load Saved Calculation',
                        newCalculation: 'New Calculation',
                        calculationName: 'Calculation Name',
                        calculationNameHelp: 'This name identifies your calculation',
                        selectCalculationPlaceholder: 'Select a calculation...',
                        noSavedCalculations: 'No saved calculations'
                    }
                },
                
                // ===== BREEDING TAB =====
                breeding: {
                    title: '🧬 Extreme Breeding Calculator',
                    subtitle: 'Advanced calculator to optimize the Pokémon breeding process',
                    whatsComingTitle: "What's Coming",
                    description: 'This advanced calculator will help you create the perfect Pokémon through optimized breeding:',
                    features: {
                        target: 'Target Pokémon Selection - Choose your desired Pokémon',
                        path: 'Optimal Breeding Path - Get step-by-step breeding instructions',
                        dualMode: 'Dual Mode System:',
                        withNatu: 'Mode with Natu (Synchronize ability enabled)',
                        withoutNatu: 'Mode without Natu (no Synchronize)',
                        ivNature: 'IV and Nature optimization recommendations',
                        eggMoves: 'Egg move planning and compatibility checks'
                    },
                    developmentStatus: 'Development Status',
                    statusPriority: 'High Priority',
                    algorithmProgress: 'Algorithm design in progress'
                },
                
                // ===== PVP TAB =====
                pvp: {
                    title: '⚔️ PVP Teams',
                    subtitle: 'Competitive team management and analysis',
                    whatsComingTitle: "What's Coming",
                    description: 'This section will provide comprehensive PVP team building and analysis tools:',
                    features: {
                        builder: 'Team Builder with drag-and-drop interface',
                        coverage: 'Type Coverage Analysis to identify weaknesses',
                        moveset: 'Move Set Optimization recommendations',
                        meta: 'Meta Analysis for current competitive scene',
                        simulation: 'Battle Simulation and matchup calculations'
                    },
                    ambitiousProject: 'Ambitious Project:',
                    ambitiousDescription: "We're exploring how to create a comprehensive Pokémon calculator that can analyze stats, matchups, and battle outcomes.",
                    developmentStatus: 'Development Status',
                    statusPlanning: 'In Planning',
                    researchPhase: 'Research phase ongoing'
                },
                
                // ===== POKÉDEX TAB =====
                pokedex: {
                    title: '📱 Pokédex',
                    subtitle: 'Complete Pokémon database for PokeMMO (Generations I-V)',
                    searchPlaceholder: "Search Pokémon by name or ID (e.g., 'pikachu' or '25')",
                    emptyStateTitle: 'Search for a Pokémon to see its details',
                    emptyStateSubtitle: 'Try searching for "pikachu", "charizard", or "25"',
                    errorLoading: 'Error loading Pokémon',
                    errorRendering: 'Error rendering Pokémon card',
                    
                    // Pokemon Card Labels
                    basicInfo: '📋 Basic Information',
                    types: 'Types',
                    generation: 'Generation',
                    height: 'Height',
                    weight: 'Weight',
                    abilities: 'Abilities',
                    hiddenAbility: 'Hidden Ability',
                    eggGroups: 'Egg Groups',
                    description: '📖 Description',
                    baseStats: '📊 Base Stats',
                    totalBaseStats: 'Total Base Stats',
                    hp: 'HP',
                    attack: 'Attack',
                    defense: 'Defense',
                    spAttack: 'Sp. Atk',
                    spDefense: 'Sp. Def',
                    speed: 'Speed',
                    moves: '⚔️ Moves (Generation V)',
                    movesLevelUp: 'Level-Up',
                    movesMachine: 'TM/HM',
                    movesEgg: 'Egg Moves',
                    movesTutor: 'Tutor',
                    noMoves: 'No moves available',
                    power: 'Power',
                    accuracy: 'Accuracy',
                    pp: 'PP',
                    level: 'Level',
                    evolution: '🔄 Evolution Chain',
                    evolvesTo: 'Evolves to',
                    noEvolutions: 'No evolutions',
                    effectiveness: '⚡ Type Effectiveness',
                    effectivenessAgainst: 'Against this Pokémon',
                    weak4x: 'Weak plus (4x)',
                    weak2x: 'Weak (2x)',
                    resistant05x: 'Resist (0.5x)',
                    resistant025x: 'Resist plus (0.25x)',
                    immune: 'Immune (0x)'
                },
                
                // ===== TYPE CHART TAB =====
                typeChart: {
                    title: '⚡ Type Table',
                    subtitle: 'Interactive Pokémon type effectiveness system',
                    selectTypes: 'Select Types (Primary + Optional Secondary)',
                    ultraEffective: 'Ultra Effective (4x)',
                    superEffective: 'Super Effective (2x)',
                    resistant: 'Resistant (0.5x)',
                    superResistant: 'Super Resist (0.25x)',
                    noEffect: 'No Effect (0x)'
                },
                
                // ===== MUSIC PLAYER =====
                musicPlayer: {
                    title: 'Music Player',
                    selectSong: 'Select a song',
                    error: 'Error'
                },
                
                // ===== WALLPAPER =====
                wallpaper: {
                    title: 'Select Background'
                },
                
                // ===== FOOTER =====
                footer: '2025 PokeDataMMO - Created by Victor Bolaños for managing strategies, farming and data for PokeMMO game',
                
                // ===== POKEMON TYPES =====
                types: {
                    normal: 'Normal',
                    fire: 'Fire',
                    water: 'Water',
                    electric: 'Electric',
                    grass: 'Grass',
                    ice: 'Ice',
                    fighting: 'Fighting',
                    poison: 'Poison',
                    ground: 'Ground',
                    flying: 'Flying',
                    psychic: 'Psychic',
                    bug: 'Bug',
                    rock: 'Rock',
                    ghost: 'Ghost',
                    dragon: 'Dragon',
                    dark: 'Dark',
                    steel: 'Steel'
                },
                
                // ===== AUTHENTICATION =====
                auth: {
                    title: '🔐 PokeDataMMO',
                    subtitle: 'Log in or register to continue',
                    loginTab: 'Login',
                    registerTab: 'Register',
                    username: 'Username',
                    password: 'Password',
                    email: 'Email',
                    optional: '(optional)',
                    loginButton: 'Login',
                    registerButton: 'Register',
                    logout: 'Logout',
                    usernameHelp: '3-20 characters, only letters, numbers, _ and -',
                    passwordHelp: 'Minimum 4 characters',
                    noEmail: 'No email',
                    validationErrors: {
                        usernameRequired: 'Username is required',
                        passwordRequired: 'Password is required',
                        usernameInvalid: 'Username must be 3-20 characters, only letters, numbers, _ and -',
                        passwordTooShort: 'Password must be at least 4 characters',
                        emailInvalid: 'Please enter a valid email address'
                    }
                }
            },
            es: {
                // ===== ENCABEZADO Y NAVEGACIÓN =====
                title: 'PokeDataMMO - Wiki Personal y Utilidades para PokeMMO',
                
                // ===== NOMBRES DE PESTAÑAS =====
                tabs: {
                    leagues: 'Ligas',
                    farming: 'Cultivo de Bayas',
                    breeding: 'Calculadora de Cría',
                    pokecalc: 'Calculadora Pokémon',
                    pvp: 'Equipos PVP',
                    pokedex: 'Pokédex',
                    typechart: 'Tabla de Tipos'
                },
                
                // ===== PESTAÑA LIGAS =====
                leagues: {
                    title: '🏆 Ligas',
                    subtitle: 'Guías completas para conquistar las ligas del juego',
                    whatsComingTitle: 'Próximamente',
                    description: 'Esta sección contendrá guías completas para todas las ligas en PokeMMO, incluyendo:',
                    features: {
                        strategies: 'Guías de estrategia para cada líder de gimnasio y miembro del Alto Mando',
                        teams: 'Composiciones de equipo recomendadas para diferentes regiones',
                        levels: 'Recomendaciones de nivel y consejos de entrenamiento',
                        items: 'Estrategias de uso de objetos para un rendimiento óptimo'
                    },
                    ambitiousProject: 'Proyecto Ambicioso:',
                    ambitiousDescription: 'Estamos considerando traducir y adaptar las guías de estrategia de ligas chinas completas a guías en inglés correctamente escritas.',
                    developmentStatus: 'Estado de Desarrollo',
                    statusPlanning: 'En Planificación',
                    researchPhase: 'Fase de investigación en curso'
                },
                
                // ===== PESTAÑA CULTIVO DE BAYAS =====
                farming: {
                    title: '🌱 Cultivo de Bayas',
                    subtitle: 'Sistema de gestión y optimización para el cultivo de bayas',
                    whatsComingTitle: 'Próximamente',
                    description: 'Esta sección proporcionará herramientas completas de gestión de cultivo de bayas:',
                    features: {
                        tracking: 'Seguimiento del crecimiento de bayas con temporizadores y notificaciones',
                        schedules: 'Horarios de plantación óptimos para máximo rendimiento',
                        soil: 'Monitoreo de condición del suelo y recomendaciones de fertilizantes',
                        profit: 'Calculadoras de beneficio para diferentes tipos de bayas',
                        harvest: 'Estrategias de optimización de cosecha'
                    },
                    developmentStatus: 'Estado de Desarrollo',
                    statusDevelopment: 'En Desarrollo',
                    coreFeatures: 'Funcionalidad principal en construcción',
                    
                    // ===== CALCULADORA DE BAYAS =====
                    calculator: {
                        title: '🌱 Calculadora de Cultivo de Bayas',
                        subtitle: 'Sistema avanzado de cálculo para optimizar el cultivo de bayas en PokeMMO',
                        cultivationType: 'Tipo de Cultivo',
                        selectCultivation: 'Selecciona un tipo de cultivo',
                        plantsPerCharacter: 'Plantas por Personaje',
                        numberOfCharacters: 'Número de Personajes',
                        irrigationSchedule: '⏰ Horarios de Riego',
                        seedsAnalysis: '💰 Análisis de Semillas y Ganancias',
                        expensesSummary: '📊 Resumen de Gastos y Ganancias',
                        berry: 'Baya',
                        plantingTime: 'Hora Plantado',
                        firstIrrigation: 'Primer Riego',
                        secondIrrigation: 'Segundo Riego',
                        harvestTime: 'Cosechado',
                        harvestLossTime: 'Hora Pérdida Cosecha',
                        harvestUnits: 'Unidades Cosecha',
                        seed: 'Semilla',
                        harvest: 'Cosecha',
                        toConserve: 'A Conservar',
                        forZanamas: 'Para Zanamas',
                        sellable: 'Vendibles',
                        sellingPrice: 'Precio al Vender',
                        profits: 'Ganancias',
                        totalSales: 'Total Ventas',
                        extractionCosts: 'Gastos de Extracción',
                        totalExtraction: 'Total Extracción',
                        purchaseCosts: 'Gastos de Compra',
                        totalPurchases: 'Total Compras',
                        managementCosts: 'Gastos de Gestión',
                        totalManagement: 'Total Gestión',
                        finalTotal: 'Total Final',
                        netProfit: 'Ganancia Neta',
                        addExpense: 'Agregar Gasto',
                        removeExpense: 'Quitar Gasto',
                        meloc: 'Meloc',
                        safre: 'Safre',
                        zreza: 'Zreza',
                        leppa: 'Zanamas',
                        // Nombres de semillas
                        seeds: {
                            dulce: 'Dulce',
                            'muy-dulce': 'Muy Dulce',
                            amarga: 'Amarga',
                            'muy-amarga': 'Muy Amarga',
                            picante: 'Picante',
                            'muy-picante': 'Muy Picante',
                            seca: 'Seca',
                            'muy-seca': 'Muy Seca',
                            acida: 'Ácida',
                            'muy-acida': 'Muy Ácida'
                        },
                        // Sistema Load/New
                        loadSavedCalculation: 'Cargar Cálculo Guardado',
                        newCalculation: 'Nuevo Cálculo',
                        calculationName: 'Nombre del Cálculo',
                        calculationNameHelp: 'Este nombre identifica tu cálculo',
                        selectCalculationPlaceholder: 'Selecciona un cálculo...',
                        noSavedCalculations: 'No hay cálculos guardados'
                    }
                },
                
                // ===== PESTAÑA CRÍA =====
                breeding: {
                    title: '🧬 Calculadora Extrema de Cría',
                    subtitle: 'Calculadora avanzada para optimizar el proceso de cría de Pokémon',
                    whatsComingTitle: 'Próximamente',
                    description: 'Esta calculadora avanzada te ayudará a crear el Pokémon perfecto a través de cría optimizada:',
                    features: {
                        target: 'Selección de Pokémon Objetivo - Elige tu Pokémon deseado',
                        path: 'Ruta de Cría Óptima - Obtén instrucciones de cría paso a paso',
                        dualMode: 'Sistema de Modo Dual:',
                        withNatu: 'Modo con Natu (habilidad Sincronía habilitada)',
                        withoutNatu: 'Modo sin Natu (sin Sincronía)',
                        ivNature: 'Recomendaciones de optimización de IVs y Naturaleza',
                        eggMoves: 'Planificación de movimientos huevo y comprobaciones de compatibilidad'
                    },
                    developmentStatus: 'Estado de Desarrollo',
                    statusPriority: 'Alta Prioridad',
                    algorithmProgress: 'Diseño de algoritmo en progreso'
                },
                
                // ===== PESTAÑA PVP =====
                pvp: {
                    title: '⚔️ Equipos PVP',
                    subtitle: 'Gestión y análisis de equipos competitivos',
                    whatsComingTitle: 'Próximamente',
                    description: 'Esta sección proporcionará herramientas completas de construcción y análisis de equipos PVP:',
                    features: {
                        builder: 'Constructor de Equipos con interfaz de arrastrar y soltar',
                        coverage: 'Análisis de Cobertura de Tipos para identificar debilidades',
                        moveset: 'Recomendaciones de Optimización de Conjuntos de Movimientos',
                        meta: 'Análisis del Meta para la escena competitiva actual',
                        simulation: 'Simulación de Batallas y cálculos de enfrentamientos'
                    },
                    ambitiousProject: 'Proyecto Ambicioso:',
                    ambitiousDescription: 'Estamos explorando cómo crear una calculadora completa de Pokémon que pueda analizar estadísticas, enfrentamientos y resultados de batallas.',
                    developmentStatus: 'Estado de Desarrollo',
                    statusPlanning: 'En Planificación',
                    researchPhase: 'Fase de investigación en curso'
                },
                
                // ===== PESTAÑA POKÉDEX =====
                pokedex: {
                    title: '📱 Pokédex',
                    subtitle: 'Base de datos completa de Pokémon para PokeMMO (Generaciones I-V)',
                    searchPlaceholder: "Buscar Pokémon por nombre o ID (ej: 'pikachu' o '25')",
                    emptyStateTitle: 'Busca un Pokémon para ver sus detalles',
                    emptyStateSubtitle: 'Prueba buscando "pikachu", "charizard" o "25"',
                    errorLoading: 'Error al cargar Pokémon',
                    errorRendering: 'Error al renderizar ficha de Pokémon',
                    
                    // Etiquetas de Tarjeta de Pokemon
                    basicInfo: '📋 Información Básica',
                    types: 'Tipos',
                    generation: 'Generación',
                    height: 'Altura',
                    weight: 'Peso',
                    abilities: 'Habilidades',
                    hiddenAbility: 'Habilidad Oculta',
                    eggGroups: 'Grupos Huevo',
                    description: '📖 Descripción',
                    baseStats: '📊 Estadísticas Base',
                    totalBaseStats: 'Estadísticas Base Totales',
                    hp: 'PS',
                    attack: 'Ataque',
                    defense: 'Defensa',
                    spAttack: 'At. Esp',
                    spDefense: 'Def. Esp',
                    speed: 'Velocidad',
                    moves: '⚔️ Movimientos (Generación V)',
                    movesLevelUp: 'Al Subir Nivel',
                    movesMachine: 'MT/MO',
                    movesEgg: 'Mov. Huevo',
                    movesTutor: 'Tutor',
                    noMoves: 'No hay movimientos disponibles',
                    power: 'Potencia',
                    accuracy: 'Precisión',
                    pp: 'PP',
                    level: 'Nivel',
                    evolution: '🔄 Cadena Evolutiva',
                    evolvesTo: 'Evoluciona a',
                    noEvolutions: 'Sin evoluciones',
                    effectiveness: '⚡ Efectividad de Tipos',
                    effectivenessAgainst: 'Contra este Pokémon',
                    weak4x: 'Muy Débil (4x)',
                    weak2x: 'Débil (2x)',
                    resistant05x: 'Resist (0.5x)',
                    resistant025x: 'Muy Resist (0.25x)',
                    immune: 'Inmune (0x)'
                },
                
                // ===== PESTAÑA TABLA DE TIPOS =====
                typeChart: {
                    title: '⚡ Tabla de Tipos',
                    subtitle: 'Sistema interactivo de efectividad de tipos Pokémon',
                    selectTypes: 'Seleccionar Tipos (Primario + Secundario Opcional)',
                    ultraEffective: 'Ultra Efectivo (4x)',
                    superEffective: 'Súper Efectivo (2x)',
                    resistant: 'Resistente (0.5x)',
                    superResistant: 'Súper Resist (0.25x)',
                    noEffect: 'Sin Efecto (0x)'
                },
                
                // ===== REPRODUCTOR DE MÚSICA =====
                musicPlayer: {
                    title: 'Reproductor de Música',
                    selectSong: 'Selecciona una canción',
                    error: 'Error'
                },
                
                // ===== FONDO DE PANTALLA =====
                wallpaper: {
                    title: 'Seleccionar Fondo'
                },
                
                // ===== PIE DE PÁGINA =====
                footer: '2025 PokeDataMMO - Creado por Victor Bolaños para gestionar estrategias, cultivo y datos para el juego PokeMMO',
                
                // ===== TIPOS POKÉMON =====
                types: {
                    normal: 'Normal',
                    fire: 'Fuego',
                    water: 'Agua',
                    electric: 'Eléctrico',
                    grass: 'Planta',
                    ice: 'Hielo',
                    fighting: 'Lucha',
                    poison: 'Veneno',
                    ground: 'Tierra',
                    flying: 'Volador',
                    psychic: 'Psíquico',
                    bug: 'Bicho',
                    rock: 'Roca',
                    ghost: 'Fantasma',
                    dragon: 'Dragón',
                    dark: 'Siniestro',
                    steel: 'Acero'
                },
                
                // ===== AUTENTICACIÓN =====
                auth: {
                    title: '🔐 PokeDataMMO',
                    subtitle: 'Inicia sesión o regístrate para continuar',
                    loginTab: 'Iniciar Sesión',
                    registerTab: 'Registrarse',
                    username: 'Usuario',
                    password: 'Contraseña',
                    email: 'Email',
                    optional: '(opcional)',
                    loginButton: 'Iniciar Sesión',
                    registerButton: 'Registrarse',
                    logout: 'Cerrar Sesión',
                    usernameHelp: '3-20 caracteres, solo letras, números, _ y -',
                    passwordHelp: 'Mínimo 4 caracteres',
                    noEmail: 'Sin email',
                    validationErrors: {
                        usernameRequired: 'El nombre de usuario es obligatorio',
                        passwordRequired: 'La contraseña es obligatoria',
                        usernameInvalid: 'El nombre de usuario debe tener 3-20 caracteres, solo letras, números, _ y -',
                        passwordTooShort: 'La contraseña debe tener al menos 4 caracteres',
                        emailInvalid: 'Por favor ingresa un email válido'
                    }
                }
            }
        };
    }
    
    // Load saved language from localStorage
    loadLanguage() {
        const saved = localStorage.getItem('pokedatammo_language');
        return saved || 'es'; // Default to Spanish
    }
    
    // Save language to localStorage
    saveLanguage(lang) {
        localStorage.setItem('pokedatammo_language', lang);
    }
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Get API language code for PokeAPI
    getApiLanguage() {
        return this.currentLanguage === 'es' ? 'es' : 'en';
    }
    
    // Toggle between languages
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
        this.saveLanguage(this.currentLanguage);
        return this.currentLanguage;
    }
    
    // Set specific language
    setLanguage(lang) {
        if (lang === 'en' || lang === 'es') {
            this.currentLanguage = lang;
            this.saveLanguage(lang);
            return true;
        }
        return false;
    }
    
    // Get translation by key path (e.g., 'pokedex.title')
    t(keyPath) {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Translation key not found: ${keyPath}`);
                return keyPath; // Return key path if translation not found
            }
        }
        
        return value;
    }
    
    // Get all translations for current language
    getAll() {
        return this.translations[this.currentLanguage];
    }
}

// Create global instance
window.languageManager = new LanguageManager();

