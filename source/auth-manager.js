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
                    
                    // Probar conexión con una operación simple
                    this.testFirebaseConnection().then(() => {
                        resolve();
                    }).catch((error) => {
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
            return true;
        } catch (error) {
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