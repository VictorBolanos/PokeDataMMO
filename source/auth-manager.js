// PokeDataMMO - Firebase Authentication Manager
// Professional user authentication system with Firebase Firestore

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'pokedatammo_session';
        this.db = null; // Se inicializará cuando Firebase esté listo
        this.init();
    }

    // Inicializar sistema de autenticación
    async init() {
        // Esperar a que Firebase esté disponible
        await this.waitForFirebase();
        
        // Verificar si hay sesión activa
        this.checkSession();
    }

    // Esperar a que Firebase esté disponible
    async waitForFirebase() {
        return new Promise((resolve) => {
            const checkFirebase = () => {
                if (typeof firebase !== 'undefined' && firebase.firestore) {
                    this.db = firebase.firestore();
                    console.log('✅ Firebase Firestore initialized');
                    
                    // Probar conexión con una operación simple
                    this.testFirebaseConnection().then(() => {
                        resolve();
                    }).catch((error) => {
                        console.error('❌ Error testing Firebase connection:', error);
                        resolve(); // Continuar aunque falle la prueba
                    });
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            checkFirebase();
        });
    }

    // Probar conexión con Firebase
    async testFirebaseConnection() {
        try {
            const testQuery = await this.db.collection('users').limit(1).get();
            console.log('✅ Firebase connected');
            return true;
        } catch (error) {
            console.error('❌ Firebase connection error:', error);
            if (error.code === 'permission-denied') {
                console.error('🚫 Firestore permissions denied - Check Firebase rules');
            }
            throw error;
        }
    }

    // Verificar sesión activa
    checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        
        if (session) {
            try {
                this.currentUser = JSON.parse(session);
                return true;
            } catch (error) {
                console.error('❌ Session parse error:', error);
                this.logout();
                return false;
            }
        }
        
        return false;
    }

    // Validar formato de email (opcional pero si se proporciona debe ser válido)
    validateEmail(email) {
        if (!email || email.trim() === '') return true; // Email es opcional
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Validar username (alfanumérico, 3-20 caracteres)
    validateUsername(username) {
        if (!username || username.length < 3 || username.length > 20) {
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]+$/;
        return regex.test(username);
    }

    // Validar password (mínimo 4 caracteres)
    validatePassword(password) {
        return password && password.length >= 4;
    }

    // Codificar password (base64 básico - en producción usar bcrypt)
    encodePassword(password) {
        return btoa(password);
    }

    // Decodificar password
    decodePassword(encoded) {
        try {
            return atob(encoded);
        } catch (error) {
            return null;
        }
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
            // Verificar si el usuario ya existe
            const userRef = this.db.collection('users').doc(username);
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                return {
                    success: false,
                    message: window.languageManager.getCurrentLanguage() === 'es' 
                        ? 'El nombre de usuario ya está en uso' 
                        : 'Username already taken'
                };
            }

            // Verificar si el email ya existe (si se proporcionó)
            if (email) {
                const emailQuery = await this.db.collection('users')
                    .where('email', '==', email)
                    .limit(1)
                    .get();
                
                if (!emailQuery.empty) {
                    return {
                        success: false,
                        message: window.languageManager.getCurrentLanguage() === 'es' 
                            ? 'El email ya está registrado' 
                            : 'Email already registered'
                    };
                }
            }

            // Crear nuevo usuario en Firebase
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

        } catch (error) {
            console.error('❌ Register error:', error);
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'Error al crear la cuenta. Inténtalo de nuevo.' 
                    : 'Error creating account. Please try again.'
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
            // Buscar usuario en Firebase
            const userRef = this.db.collection('users').doc(username);
            const userDoc = await userRef.get();

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

        } catch (error) {
            console.error('❌ Login error:', error);
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'Error al iniciar sesión. Inténtalo de nuevo.' 
                    : 'Error logging in. Please try again.'
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
            console.error('Error saving user data:', error);
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
            console.error('Error loading user data:', error);
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
            console.error('Error loading user data with owner:', error);
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
            console.error('Error updating user:', error);
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
            
            console.log('💾 Saved:', calculationName);
            return { success: true, message: 'Calculation saved' };
            
        } catch (error) {
            console.error('❌ Save error:', error);
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
            
            console.log('📂 Loaded:', calculationName);
            return { success: true, data: calculation };
            
        } catch (error) {
            console.error('❌ Load error:', error);
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
            console.error('❌ Get calculations error:', error);
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
            
            console.log('🗑️ Deleted:', calculationName);
            return { success: true, message: 'Calculation deleted' };
            
        } catch (error) {
            console.error('❌ Delete error:', error);
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
            console.error('❌ Rename error:', error);
            return { success: false, message: 'Error renaming calculation' };
        }
    }
}

// Exportar instancia global
window.authManager = new AuthManager();