// PokeDataMMO - Firebase Authentication Manager
// Professional user authentication system with Firebase Firestore

class AuthManager {
    constructor() {
        console.log('🏗️ AuthManager constructor iniciado');
        this.currentUser = null;
        this.sessionKey = 'pokedatammo_session';
        this.db = null; // Se inicializará cuando Firebase esté listo
        console.log('✅ AuthManager constructor completado');
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
            console.log('🧪 Probando conexión con Firebase...');
            
            // Intentar leer una colección (esto debería funcionar incluso si está vacía)
            const testQuery = await this.db.collection('users').limit(1).get();
            console.log('✅ Conexión con Firebase exitosa');
            
            return true;
        } catch (error) {
            console.error('❌ Error en conexión Firebase:', error);
            
            // Verificar si es un error de permisos
            if (error.code === 'permission-denied') {
                console.error('🚫 ERROR: Permisos denegados en Firestore');
                console.error('💡 Solución: Ve a Firebase Console → Firestore → Reglas');
                console.error('💡 Cambia las reglas a: allow read, write: if true;');
            }
            
            throw error;
        }
    }

    // Verificar sesión activa
    checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        
        console.log('🔍 Checking session:', {
            sessionKey: this.sessionKey,
            sessionExists: !!session,
            sessionValue: session
        });
        
        if (session) {
            try {
                this.currentUser = JSON.parse(session);
                console.log('✅ Session restored for user:', this.currentUser.username);
                return true;
            } catch (error) {
                console.error('❌ Error parsing session:', error);
                this.logout();
                return false;
            }
        }
        
        console.log('❌ No active session found');
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
        console.log('🔐 AuthManager.register iniciado:', {
            username: username,
            password: password ? '***' : 'VACÍO',
            email: email,
            db: !!this.db
        });
        
        // Validaciones
        if (!this.validateUsername(username)) {
            console.log('❌ Username inválido');
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'Usuario inválido (3-20 caracteres, solo letras, números, _ y -)' 
                    : 'Invalid username (3-20 chars, only letters, numbers, _ and -)'
            };
        }

        if (!this.validatePassword(password)) {
            console.log('❌ Password inválido');
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'La contraseña debe tener al menos 4 caracteres' 
                    : 'Password must be at least 4 characters'
            };
        }

        if (email && !this.validateEmail(email)) {
            console.log('❌ Email inválido');
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'Email inválido' 
                    : 'Invalid email'
            };
        }

        try {
            console.log('⏳ Verificando si usuario existe...');
            
            // Verificar si el usuario ya existe
            const userRef = this.db.collection('users').doc(username);
            const userDoc = await userRef.get();

            console.log('📋 Usuario existe:', userDoc.exists);

            if (userDoc.exists) {
                console.log('❌ Usuario ya existe');
                return {
                    success: false,
                    message: window.languageManager.getCurrentLanguage() === 'es' 
                        ? 'El nombre de usuario ya está en uso' 
                        : 'Username already taken'
                };
            }

            // Verificar si el email ya existe (si se proporcionó)
            if (email) {
                console.log('⏳ Verificando email...');
                const emailQuery = await this.db.collection('users')
                    .where('email', '==', email)
                    .limit(1)
                    .get();
                
                console.log('📋 Email existe:', !emailQuery.empty);
                
                if (!emailQuery.empty) {
                    console.log('❌ Email ya existe');
                    return {
                        success: false,
                        message: window.languageManager.getCurrentLanguage() === 'es' 
                            ? 'El email ya está registrado' 
                            : 'Email already registered'
                    };
                }
            }

            console.log('⏳ Creando usuario en Firebase...');

            // Crear nuevo usuario en Firebase
            const newUser = {
                username: username,
                password: this.encodePassword(password),
                email: email || '',
                createdAt: new Date().toISOString()
            };

            await userRef.set(newUser);
            console.log('✅ Usuario creado en Firebase');

            // Crear documento de datos personalizados del usuario
            const userDataRef = this.db.collection('user_data').doc(username);
            
            await userDataRef.set({
                owner_user: userRef, // Referencia directa al documento del usuario
                berry_calculations: {},
                pokedex_favorites: [],
                breeding_plans: {},
                lastUpdated: new Date().toISOString()
            });
            console.log('✅ Datos de usuario creados en Firebase');

            // Auto-login después del registro
            this.currentUser = {
                username: newUser.username,
                email: newUser.email
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
            console.log('✅ Auto-login realizado');

            return {
                success: true,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? '¡Cuenta creada exitosamente!' 
                    : 'Account created successfully!',
                user: this.currentUser
            };

        } catch (error) {
            console.error('💥 Error registering user:', error);
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
        console.log('🔐 AuthManager.login iniciado:', {
            username: username,
            password: password ? '***' : 'VACÍO',
            db: !!this.db
        });
        
        // Validaciones básicas
        if (!username || !password) {
            console.log('❌ Campos vacíos');
            return {
                success: false,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? 'Por favor, completa todos los campos' 
                    : 'Please fill in all fields'
            };
        }

        try {
            console.log('⏳ Buscando usuario en Firebase...');
            
            // Buscar usuario en Firebase
            const userRef = this.db.collection('users').doc(username);
            const userDoc = await userRef.get();

            console.log('📋 Usuario encontrado:', userDoc.exists);

            if (!userDoc.exists) {
                console.log('❌ Usuario no encontrado');
                return {
                    success: false,
                    message: window.languageManager.getCurrentLanguage() === 'es' 
                        ? 'Usuario no encontrado' 
                        : 'User not found'
                };
            }

            const userData = userDoc.data();
            console.log('📋 Datos del usuario:', {
                username: userData.username,
                email: userData.email,
                hasPassword: !!userData.password
            });

            // Verificar contraseña
            console.log('⏳ Verificando contraseña...');
            const decodedPassword = this.decodePassword(userData.password);
            
            console.log('📋 Contraseña decodificada:', decodedPassword ? '***' : 'ERROR');
            
            if (decodedPassword !== password) {
                console.log('❌ Contraseña incorrecta');
                return {
                    success: false,
                    message: window.languageManager.getCurrentLanguage() === 'es' 
                        ? 'Contraseña incorrecta' 
                        : 'Incorrect password'
                };
            }

            console.log('✅ Contraseña correcta, iniciando sesión...');

            // Login exitoso
            this.currentUser = {
                username: userData.username,
                email: userData.email
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(this.currentUser));
            console.log('✅ Sesión guardada en localStorage');

            return {
                success: true,
                message: window.languageManager.getCurrentLanguage() === 'es' 
                    ? '¡Bienvenido!' 
                    : 'Welcome!',
                user: this.currentUser
            };

        } catch (error) {
            console.error('💥 Error logging in:', error);
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
}

// Exportar instancia global
console.log('🌍 Creando instancia global de AuthManager...');
window.authManager = new AuthManager();
console.log('✅ AuthManager instancia global creada:', !!window.authManager);