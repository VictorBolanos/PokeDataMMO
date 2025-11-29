// PokeDataMMO - Firebase Authentication Manager
// Professional user authentication system with Firebase Firestore

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'pokedatammo_session';
        this.db = null; // Se inicializará cuando Firebase esté listo
        this.isOnline = navigator.onLine;
        this.init();
        this.setupOnlineOfflineListeners();
    }
    
    // Configurar listeners para detectar cambios de conexión
    setupOnlineOfflineListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Conexión restaurada');
            // Intentar reconectar con Firebase
            if (this.db) {
                this.testFirebaseConnection().catch(() => {
                    console.warn('Firebase aún no responde');
                });
            }
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.warn('Conexión perdida - Modo offline activado');
        });
    }

    // Inicializar sistema de autenticación
    async init() {
        // Esperar a que Firebase esté disponible
        await this.waitForFirebase();
        
        // Verificar si hay sesión activa
        this.checkSession();
    }

    // Esperar a que Firebase esté disponible y conectado
    // Optimizado para conexiones muy lentas (72 kbps+)
    async waitForFirebase() {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 300; // 60 segundos máximo (300 * 200ms) para conexiones muy lentas
            
            const checkFirebase = async () => {
                attempts++;
                
                // Verificar si Firebase está cargado
                if (typeof firebase === 'undefined' || !firebase.firestore) {
                    if (attempts >= maxAttempts) {
                        reject(new Error('Firebase no se cargó después de varios intentos'));
                        return;
                    }
                    setTimeout(checkFirebase, 200);
                    return;
                }
                
                // Inicializar Firestore
                if (!this.db) {
                    this.db = firebase.firestore();
                }
                
                // Verificar estado de conexión del navegador
                if (!navigator.onLine) {
                    if (attempts >= maxAttempts) {
                        reject(new Error('Sin conexión a internet'));
                        return;
                    }
                    setTimeout(checkFirebase, 500);
                    return;
                }
                
                // Probar conexión real con Firebase
                try {
                    await this.testFirebaseConnection();
                    resolve();
                } catch (error) {
                    // Si es error de offline, reintentar con más paciencia
                    if (error.message && (error.message.includes('offline') || error.message.includes('Timeout'))) {
                        if (attempts >= maxAttempts) {
                            // Aún así resolver para permitir operaciones offline
                            console.warn('Firebase en modo offline o conexión muy lenta, continuando con cache local');
                            resolve();
                            return;
                        }
                        // Delay progresivo: más tiempo entre intentos para conexiones lentas
                        const delay = Math.min(500 + (attempts * 100), 2000); // 500ms a 2s
                        setTimeout(checkFirebase, delay);
                    } else {
                        // Otros errores: continuar después de algunos intentos
                        if (attempts >= 50) {
                            console.warn('Firebase no responde, continuando de todas formas');
                            resolve();
                        } else {
                            setTimeout(checkFirebase, 500);
                        }
                    }
                }
            };
            
            checkFirebase();
        });
    }

    // Probar conexión con Firebase (con timeout extendido para conexiones lentas)
    async testFirebaseConnection() {
        return new Promise((resolve, reject) => {
            // Timeout de 30 segundos para conexiones muy lentas (72 kbps)
            const timeout = setTimeout(() => {
                reject(new Error('Timeout esperando respuesta de Firebase (conexión muy lenta)'));
            }, 30000); // 30 segundos timeout para conexiones muy lentas
            
            try {
                // Usar get() SIN especificar source para que Firebase intente automáticamente
                // Primero servidor, luego cache si está disponible
                // Esto evita el error de "document may exist on server" cuando el cache está vacío
                this.db.collection('users').limit(1).get()
                    .then(() => {
                        clearTimeout(timeout);
                        resolve(true);
                    })
                    .catch((error) => {
                        clearTimeout(timeout);
                        // Si es error de offline, aún así resolver para permitir intentar operaciones
                        // Firebase puede estar en modo offline pero aún funcional
                        if (error.message && (
                            error.message.includes('offline') || 
                            error.message.includes('Timeout') ||
                            error.message.includes('Failed to get document')
                        )) {
                            // Resolver de todas formas - Firebase puede funcionar en modo offline
                            resolve(true);
                        } else {
                            reject(error);
                        }
                    });
            } catch (error) {
                clearTimeout(timeout);
                reject(error);
            }
        });
    }
    
    // Verificar si Firebase está realmente conectado
    async ensureFirebaseConnection() {
        if (!this.db) {
            await this.waitForFirebase();
        }
        
        // Verificar estado online del navegador
        if (!navigator.onLine && !this.isOnline) {
            throw new Error('Sin conexión a internet');
        }
        
        return true;
    }
    
    // Ejecutar operación con reintentos (optimizado para conexiones muy lentas)
    async executeWithRetry(operation, maxRetries = 5, delay = 2000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Asegurar conexión antes de cada intento (solo en primeros intentos)
                if (attempt <= 2) {
                    try {
                        await this.ensureFirebaseConnection();
                    } catch (connError) {
                        // Si no hay conexión pero no es el último intento, continuar
                        if (attempt < maxRetries && connError.message.includes('internet')) {
                            await new Promise(resolve => setTimeout(resolve, delay * attempt));
                            continue;
                        }
                    }
                }
                
                // Intentar operación con timeout extendido
                return await Promise.race([
                    operation(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Operación tardó demasiado')), 45000)
                    )
                ]);
            } catch (error) {
                lastError = error;
                
                // Si es error de offline/timeout y no es el último intento, esperar y reintentar
                const isOfflineError = error.message && (
                    error.message.includes('offline') || 
                    error.message.includes('Timeout') ||
                    error.message.includes('tardó demasiado') ||
                    error.message.includes('network') ||
                    error.message.includes('fetch')
                );
                
                if (isOfflineError && attempt < maxRetries) {
                    // Delay progresivo: 2s, 4s, 6s, 8s, 10s
                    const retryDelay = Math.min(delay * attempt, 10000);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    continue;
                }
                
                // Si no es recuperable o es el último intento, lanzar error
                throw error;
            }
        }
        
        throw lastError;
    }

    // Verificar sesión activa
    checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (session) {
            try {
                this.currentUser = JSON.parse(session);
                return true;
            } catch {
                this.logout();
                return false;
            }
        }
        
        return false;
    }

    // Validar formato de email (opcional pero si se proporciona debe ser válido)
    validateEmail(email) {
        if (!email?.trim()) return true; // Email es opcional
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Validar username (alfanumérico, 3-20 caracteres)
    validateUsername(username) {
        return username?.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(username);
    }

    // Validar password (mínimo 4 caracteres)
    validatePassword(password) {
        return password?.length >= 4;
    }

    // Codificar password (base64 básico - en producción usar bcrypt)
    encodePassword(password) {
        return btoa(password);
    }

    // Decodificar password
    decodePassword(encoded) {
        try {
            return atob(encoded);
        } catch {
            return null;
        }
    }

    // Obtener mensaje de error legible
    getErrorMessage(error) {
        if (!error) {
            return 'Error desconocido';
        }

        // Si el error tiene un mensaje, usarlo
        if (error.message) {
            // Traducir errores comunes de Firebase
            const errorMsg = error.message.toLowerCase();
            
            // Errores de cache vacío (documento no existe en cache pero puede existir en servidor)
            if (errorMsg.includes('failed to get document from cache') || 
                errorMsg.includes('document may exist on the server')) {
                return 'El documento no está en cache. Intentando obtener desde el servidor...';
            }
            
            // Errores de conexión/offline
            if (errorMsg.includes('offline') || errorMsg.includes('client is offline')) {
                return 'Conexión lenta detectada. Firebase está intentando conectarse. Por favor espera...';
            }
            
            // Errores de conexión
            if (errorMsg.includes('network') || errorMsg.includes('failed to fetch')) {
                return 'Problema de conexión. Verifica tu internet. Con conexiones muy lentas (72 kbps), esto puede tardar varios minutos.';
            }
            
            // Errores de timeout
            if (errorMsg.includes('timeout') || errorMsg.includes('deadline') || errorMsg.includes('tardó demasiado')) {
                return 'La conexión es muy lenta. Se están realizando reintentos automáticos. Por favor espera...';
            }
            
            // Error de que se requiere servidor
            if (errorMsg.includes('requiere conexión al servidor')) {
                return 'Se requiere conexión al servidor. Verificando conexión...';
            }
            
            // Errores de permisos
            if (errorMsg.includes('permission') || errorMsg.includes('permission-denied')) {
                return 'Sin permisos para realizar esta acción.';
            }
            
            // Errores de Firebase no disponible
            if (errorMsg.includes('firebase') && errorMsg.includes('not')) {
                return 'Firebase no está disponible.';
            }
            
            // Errores de base de datos
            if (errorMsg.includes('database') || errorMsg.includes('firestore')) {
                return 'Error de base de datos.';
            }
            
            // Si no coincide con ningún patrón conocido, devolver el mensaje original
            return error.message;
        }

        // Si el error es un string, devolverlo directamente
        if (typeof error === 'string') {
            return error;
        }

        // Si el error tiene un código, intentar traducirlo
        if (error.code) {
            const errorCodes = {
                'permission-denied': 'Sin permisos',
                'unavailable': 'Servicio no disponible',
                'unauthenticated': 'No autenticado',
                'not-found': 'No encontrado',
                'already-exists': 'Ya existe',
                'failed-precondition': 'Condición previa fallida',
                'aborted': 'Operación cancelada',
                'out-of-range': 'Fuera de rango',
                'unimplemented': 'No implementado',
                'internal': 'Error interno',
                'deadline-exceeded': 'Tiempo de espera agotado',
                'cancelled': 'Cancelado',
                'data-loss': 'Pérdida de datos',
                'unknown': 'Error desconocido'
            };
            
            return errorCodes[error.code] || error.code;
        }

        // Último recurso: convertir el error a string
        return String(error);
    }

    // Registrar nuevo usuario en Firebase
    async register(username, password, email = '') {
        // Validaciones
        if (!this.validateUsername(username)) {
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'Usuario inválido (3-20 caracteres, solo letras, números, _ y -)' 
                    : 'Invalid username (3-20 chars, only letters, numbers, _ and -)'
            };
        }

        if (!this.validatePassword(password)) {
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'La contraseña debe tener al menos 4 caracteres' 
                    : 'Password must be at least 4 characters'
            };
        }

        if (email && !this.validateEmail(email)) {
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'Email inválido' 
                    : 'Invalid email'
            };
        }

        try {
            // El registro requiere conexión al servidor (no puede usar cache)
            return await this.executeWithRetry(async () => {
                // Verificar si el usuario ya existe (desde servidor)
                const userRef = this.db.collection('users').doc(username);
                let userDoc;
                
                try {
                    userDoc = await userRef.get({ source: 'server' });
                } catch (serverError) {
                    // Si es error de offline, no podemos registrar sin conexión
                    if (serverError.message && serverError.message.includes('offline')) {
                        throw new Error('Se requiere conexión a internet para registrar una cuenta');
                    }
                    throw serverError;
                }

                if (userDoc.exists) {
                    return {
                        success: false,
                        message: window.languageManager.getCurrentLanguage() === 'es' 
                            ? 'El nombre de usuario ya está en uso' 
                            : 'Username already taken'
                    };
                }

                // Verificar si el email ya existe (si se proporcionó) - desde servidor
                if (email) {
                    let emailQuery;
                    try {
                        emailQuery = await this.db.collection('users')
                            .where('email', '==', email)
                            .limit(1)
                            .get({ source: 'server' });
                    } catch (serverError) {
                        if (serverError.message && serverError.message.includes('offline')) {
                            throw new Error('Se requiere conexión a internet para verificar el email');
                        }
                        throw serverError;
                    }
                    
                    if (!emailQuery.empty) {
                        return {
                            success: false,
                            message: window.languageManager.getCurrentLanguage() === 'es' 
                                ? 'El email ya está registrado' 
                                : 'Email already registered'
                        };
                    }
                }

                // Crear nuevo usuario en Firebase (requiere servidor)
                const newUser = {
                    username: username,
                    password: this.encodePassword(password),
                    email: email || '',
                    createdAt: new Date().toISOString()
                };

                await userRef.set(newUser);

                // Crear documento de datos personalizados del usuario
                const userDataRef = this.db.collection('user_data').doc(username);
                
                await userDataRef.set({
                    owner_user: userRef,
                    berry_calculations: {},
                    breeding_plans: {},
                    pvp_teams: {},
                    league_calculations: {},
                    lastUpdated: new Date().toISOString()
                });

                // Auto-login después del registro
                this.currentUser = {
                    username: newUser.username,
                    email: newUser.email
                };
                localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));

                return {
                    success: true,
                    message: window.languageManager.getCurrentLanguage() === 'es' 
                        ? '¡Cuenta creada exitosamente!' 
                        : 'Account created successfully!',
                    user: this.currentUser
                };
            }, 5, 3000); // 5 reintentos con delay de 3s (optimizado para conexiones muy lentas)

        } catch (error) {
            // Obtener mensaje de error legible
            const errorMessage = this.getErrorMessage(error);
            const isSpanish = window.languageManager.getCurrentLanguage() === 'es';
            
            return {
                success: false,
                message: isSpanish 
                    ? `Error al crear la cuenta: ${errorMessage}` 
                    : `Error creating account: ${errorMessage}`
            };
        }
    }

    // Iniciar sesión con Firebase
    async login(username, password) {
        // Validaciones básicas
        if (!username || !password) {
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'Por favor, completa todos los campos' 
                    : 'Please fill in all fields'
            };
        }

        try {
            // Ejecutar login con reintentos
            // IMPORTANTE: Login SIEMPRE requiere servidor (no usar cache) porque las contraseñas pueden cambiar
            return await this.executeWithRetry(async () => {
                // Buscar usuario en Firebase
                // NO especificar source para que Firebase intente automáticamente servidor primero
                // Si está offline, Firebase intentará cache automáticamente, pero login requiere servidor
                const userRef = this.db.collection('users').doc(username);
                let userDoc;
                
                try {
                    // Intentar obtener desde servidor (sin especificar source, Firebase lo maneja)
                    // Si está offline, Firebase lanzará error que manejaremos
                    userDoc = await userRef.get({ source: 'server' });
                } catch (serverError) {
                    // Si es error de offline, NO intentar cache para login
                    // Login requiere datos actuales del servidor (contraseñas pueden haber cambiado)
                    if (serverError.message && (
                        serverError.message.includes('offline') || 
                        serverError.message.includes('Failed to get document')
                    )) {
                        // Lanzar error específico para que se reintente
                        throw new Error('Se requiere conexión al servidor para iniciar sesión. Verificando conexión...');
                    }
                    // Otros errores, lanzar directamente
                    throw serverError;
                }

                if (!userDoc.exists) {
                    return {
                        success: false,
                        message: window.languageManager.getCurrentLanguage() === 'es' 
                            ? 'Usuario no encontrado' 
                            : 'User not found'
                    };
                }

                const userData = userDoc.data();

                // Verificar contraseña
                const decodedPassword = this.decodePassword(userData.password);
                
                if (decodedPassword !== password) {
                    return {
                        success: false,
                        message: window.languageManager.getCurrentLanguage() === 'es' 
                            ? 'Contraseña incorrecta' 
                            : 'Incorrect password'
                    };
                }

                // Login exitoso
                this.currentUser = {
                    username: userData.username,
                    email: userData.email
                };
                
                // Guardar sesión en localStorage (persistente)
                localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));

                return {
                    success: true,
                    message: window.languageManager.getCurrentLanguage() === 'es' 
                        ? '¡Bienvenido!' 
                        : 'Welcome!',
                    user: this.currentUser
                };
            }, 5, 3000); // 5 reintentos con delay de 3s (optimizado para conexiones muy lentas)

        } catch (error) {
            // Obtener mensaje de error legible
            const errorMessage = this.getErrorMessage(error);
            const isSpanish = window.languageManager.getCurrentLanguage() === 'es';
            
            return {
                success: false,
                message: isSpanish 
                    ? `Error al iniciar sesión: ${errorMessage}` 
                    : `Error logging in: ${errorMessage}`
            };
        }
    }

    // Cerrar sesión
    logout() {
        this.currentUser = null;
        localStorage.removeItem(this.sessionKey);
        
        return {
            success: true,
            message: window.languageManager.getCurrentLanguage() === 'es' 
                ? 'Sesión cerrada' 
                : 'Logged out'
        };
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar si hay sesión activa
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Guardar datos del usuario en Firebase
    async saveUserData(dataType, data) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            
            await userDataRef.update({
                [dataType]: data,
                lastUpdated: new Date().toISOString()
            });

            return { success: true };

        } catch (error) {
            return { success: false, message: 'Error saving data' };
        }
    }

    // Cargar datos del usuario desde Firebase
    async loadUserData(dataType = null) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            const userDataDoc = await userDataRef.get();

            if (!userDataDoc.exists) {
                return { success: false, message: 'User data not found' };
            }

            const userData = userDataDoc.data();

            if (dataType) {
                return { 
                    success: true, 
                    data: userData[dataType] || null 
                };
            }

            return { 
                success: true, 
                data: userData 
            };

        } catch (error) {
            return { success: false, message: 'Error loading data' };
        }
    }

    // Obtener datos del usuario con información del propietario
    async loadUserDataWithOwner(dataType = null) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            const userDataDoc = await userDataRef.get();

            if (!userDataDoc.exists) {
                return { success: false, message: 'User data not found' };
            }

            const userData = userDataDoc.data();
            
            // Si hay referencia al usuario, obtener sus datos
            let ownerData = null;
            if (userData.owner_user && userData.owner_user.get) {
                const ownerDoc = await userData.owner_user.get();
                if (ownerDoc.exists) {
                    ownerData = ownerDoc.data();
                }
            }

            if (dataType) {
                return { 
                    success: true, 
                    data: userData[dataType] || null,
                    owner: ownerData
                };
            }

            return { 
                success: true, 
                data: userData,
                owner: ownerData
            };

        } catch (error) {
            return { success: false, message: 'Error loading data' };
        }
    }

    // Actualizar información del usuario
    async updateUser(updates) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userRef = this.db.collection('users').doc(this.currentUser.username);
            
            const updateData = {};
            
            if (updates.email !== undefined) {
                if (updates.email && !this.validateEmail(updates.email)) {
                    return { success: false, message: 'Invalid email' };
                }
                updateData.email = updates.email;
                this.currentUser.email = updates.email;
            }

            if (updates.password !== undefined) {
                if (!this.validatePassword(updates.password)) {
                    return { success: false, message: 'Invalid password' };
                }
                updateData.password = this.encodePassword(updates.password);
            }

            await userRef.update(updateData);
            localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));

            return { success: true, message: 'User updated' };

        } catch (error) {
            return { success: false, message: 'Error updating user' };
        }
    }

    // ========================================
    // BERRY CALCULATIONS METHODS
    // ========================================

    /**
     * Guardar un cálculo de bayas (crear o actualizar)
     * @param {string} calculationName - Nombre del cálculo
     * @param {Object} calculationData - Datos del cálculo
     * @returns {Promise<Object>} Resultado de la operación
     */
    async saveBerryCalculation(calculationName, calculationData) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        // Validación crítica: no permitir guardar sin nombre
        if (!calculationName || !calculationName.trim()) {
            return { success: false, message: 'No calculation name provided' };
        }
        
        if (!calculationData || !calculationData.calculationName || !calculationData.calculationName.trim()) {
            return { success: false, message: 'No calculation name in data' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            
            const dataToSave = {
                ...calculationData,
                calculationName: calculationName,
                lastSaved: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await userDataRef.update({
                [`berry_calculations.${calculationName}`]: dataToSave,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true, message: 'Calculation saved' };
            
        } catch (error) {
            return { success: false, message: 'Error saving calculation' };
        }
    }

    /**
     * Cargar un cálculo específico de bayas
     * @param {string} calculationName - Nombre del cálculo
     * @returns {Promise<Object>} Resultado con los datos del cálculo
     */
    async loadBerryCalculation(calculationName) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            const userDataDoc = await userDataRef.get();
            
            if (!userDataDoc.exists) {
                return { success: false, message: 'User data not found' };
            }
            
            const userData = userDataDoc.data();
            const calculation = userData.berry_calculations?.[calculationName];
            
            if (!calculation) {
                return { success: false, message: 'Calculation not found' };
            }
            
            return { success: true, data: calculation };
            
        } catch (error) {
            return { success: false, message: 'Error loading calculation' };
        }
    }

    /**
     * Obtener lista de todos los cálculos de bayas del usuario
     * @returns {Promise<Object>} Resultado con todos los cálculos
     */
    async getAllBerryCalculations() {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            const userDataDoc = await userDataRef.get();
            
            if (!userDataDoc.exists) {
                await userDataRef.set({
                    owner_user: this.db.collection('users').doc(this.currentUser.username),
                    berry_calculations: {},
                    breeding_plans: {},
                    pvp_teams: {},
                    league_calculations: {},
                    lastUpdated: new Date().toISOString()
                });
                return { success: true, data: {}, list: [] };
            }
            
            const userData = userDataDoc.data();
            const calculations = userData.berry_calculations || {};
            
            return { 
                success: true, 
                data: calculations,
                list: Object.keys(calculations)
            };
            
        } catch (error) {
            return { success: false, message: 'Error loading calculations' };
        }
    }

    /**
     * Eliminar un cálculo de bayas
     * @param {string} calculationName - Nombre del cálculo a eliminar
     * @returns {Promise<Object>} Resultado de la operación
     */
    async deleteBerryCalculation(calculationName) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            
            await userDataRef.update({
                [`berry_calculations.${calculationName}`]: firebase.firestore.FieldValue.delete(),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true, message: 'Calculation deleted' };
            
        } catch (error) {
            return { success: false, message: 'Error deleting calculation' };
        }
    }

    /**
     * Renombrar un cálculo de bayas
     * @param {string} oldName - Nombre actual
     * @param {string} newName - Nuevo nombre
     * @returns {Promise<Object>} Resultado de la operación
     */
    async renameBerryCalculation(oldName, newName) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const loadResult = await this.loadBerryCalculation(oldName);
            if (!loadResult.success) {
                return loadResult;
            }
            
            const calculationData = loadResult.data;
            calculationData.calculationName = newName;
            
            const saveResult = await this.saveBerryCalculation(newName, calculationData);
            if (!saveResult.success) {
                return saveResult;
            }
            
            const deleteResult = await this.deleteBerryCalculation(oldName);
            if (!deleteResult.success) {
                return deleteResult;
            }
            
            return { success: true, message: 'Calculation renamed' };
            
        } catch (error) {
            return { success: false, message: 'Error renaming calculation' };
        }
    }

    // ========================================
    // PVP TEAMS METHODS
    // ========================================

    /**
     * Guardar un equipo PVP (crear o actualizar)
     */
    async savePVPTeam(teamName, teamData) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        // Validación crítica: no permitir guardar sin nombre
        if (!teamName || !teamName.trim()) {
            return { success: false, message: 'No team name provided' };
        }
        
        if (!teamData || !teamData.teamName || !teamData.teamName.trim()) {
            return { success: false, message: 'No team name in data' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            
            const dataToSave = {
                ...teamData,
                teamName: teamName,
                lastSaved: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await userDataRef.update({
                [`pvp_teams.${teamName}`]: dataToSave,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true, message: 'Team saved' };
            
        } catch (error) {
            return { success: false, message: 'Error saving team' };
        }
    }

    /**
     * Cargar un equipo PVP específico
     */
    async loadPVPTeam(teamName) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            const userDataDoc = await userDataRef.get();
            
            if (!userDataDoc.exists) {
                return { success: false, message: 'User data not found' };
            }
            
            const userData = userDataDoc.data();
            const team = userData.pvp_teams?.[teamName];
            
            if (!team) {
                return { success: false, message: 'Team not found' };
            }
            
            return { success: true, data: team };
            
        } catch (error) {
            return { success: false, message: 'Error loading team' };
        }
    }

    /**
     * Obtener lista de todos los equipos PVP
     */
    async getAllPVPTeams() {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            const userDataDoc = await userDataRef.get();
            
            if (!userDataDoc.exists) {
                await userDataRef.set({
                    owner_user: this.db.collection('users').doc(this.currentUser.username),
                    berry_calculations: {},
                    breeding_plans: {},
                    pvp_teams: {},
                    league_calculations: {},
                    lastUpdated: new Date().toISOString()
                });
                return { success: true, data: {}, list: [] };
            }
            
            const userData = userDataDoc.data();
            const teams = userData.pvp_teams || {};
            
            return { 
                success: true, 
                data: teams,
                list: Object.keys(teams)
            };
            
        } catch (error) {
            return { success: false, message: 'Error loading teams' };
        }
    }

    /**
     * Eliminar un equipo PVP
     */
    async deletePVPTeam(teamName) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const userDataRef = this.db.collection('user_data').doc(this.currentUser.username);
            
            await userDataRef.update({
                [`pvp_teams.${teamName}`]: firebase.firestore.FieldValue.delete(),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true, message: 'Team deleted' };
            
        } catch (error) {
            return { success: false, message: 'Error deleting team' };
        }
    }

    /**
     * Renombrar un equipo PVP
     */
    async renamePVPTeam(oldName, newName) {
        if (!this.isAuthenticated()) {
            return { success: false, message: 'No session active' };
        }

        try {
            const loadResult = await this.loadPVPTeam(oldName);
            if (!loadResult.success) {
                return loadResult;
            }
            
            const teamData = loadResult.data;
            teamData.teamName = newName;
            
            const saveResult = await this.savePVPTeam(newName, teamData);
            if (!saveResult.success) {
                return saveResult;
            }
            
            const deleteResult = await this.deletePVPTeam(oldName);
            if (!deleteResult.success) {
                return deleteResult;
            }
            
            return { success: true, message: 'Team renamed' };
            
        } catch (error) {
            return { success: false, message: 'Error renaming team' };
        }
    }
}

// Exportar instancia global
window.authManager = new AuthManager();