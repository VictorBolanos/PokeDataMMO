// PVP Teams - Main Controller
class PVPTeams {
    constructor() {
        this.isInitialized = false;
        this.currentTeam = null;  // Nombre del equipo actual
        this.isNewTeam = false;   // Si es un equipo nuevo
        this.autoSaveTimeout = null;
        this.AUTO_SAVE_DELAY = 7000;   // 7 segundos
        this.isSaving = false;
    }

    /**
     * Inicializar PVP Teams
     */
    async init() {
        if (this.isInitialized) return;

        try {
            await window.pvpTeamsUI.renderInitialUI();
            this.isInitialized = true;
        } catch (error) {
        }
    }

    /**
     * Crear nuevo equipo
     */
    async createNewTeam() {
        this.currentTeam = null;
        this.isNewTeam = true;
        await window.pvpTeamsUI.renderTeamEditor();
    }

    /**
     * Cargar equipo existente
     */
    async loadTeam(teamName) {
        const result = await window.authManager.loadPVPTeam(teamName);
        
        if (!result.success) {
            return false;
        }
        
        this.currentTeam = teamName;
        this.isNewTeam = false;
        await window.pvpTeamsUI.renderTeamEditor(result.data);
        
        return true;
    }

    /**
     * Establecer nombre del equipo
     */
    setTeamName(name) {
        const oldName = this.currentTeam;
        this.currentTeam = name;
        
        if (this.isNewTeam && name) {
            this.isNewTeam = false;
        }
        
        if (oldName && oldName !== name) {
            window.authManager.renamePVPTeam(oldName, name);
        }
    }

    /**
     * Programar auto-guardado
     */
    scheduleAutoSave() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }
        
        // Validar que hay nombre válido antes de programar
        if (!this.currentTeam || !this.currentTeam.trim()) {
            return;
        }
        
        this.autoSaveTimeout = setTimeout(() => {
            this.performAutoSave();
        }, this.AUTO_SAVE_DELAY);
    }

    /**
     * Cancelar auto-guardado programado
     */
    cancelAutoSave() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = null;
        }
    }

    /**
     * Ejecutar auto-guardado
     */
    async performAutoSave() {
        // Validaciones múltiples antes de guardar
        if (this.isSaving) {
            return;
        }
        
        if (!this.currentTeam || !this.currentTeam.trim()) {
            return;
        }
        
        // Verificar que el nombre en el input sigue siendo válido
        const nameInput = document.getElementById('teamNameInput');
        if (nameInput && (!nameInput.value || !nameInput.value.trim())) {
            return;
        }
        
        this.isSaving = true;
        
        try {
            const teamData = window.pvpTeamsUI.collectTeamData();
            
            // Validación final: asegurar que el nombre está en los datos
            if (!teamData.teamName || !teamData.teamName.trim()) {
                return;
            }
            
            const result = await window.authManager.savePVPTeam(
                this.currentTeam, 
                teamData
            );
            
            if (result.success) {
                window.pvpTeamsUI.showSaveIndicator('success');
            } else {
                window.pvpTeamsUI.showSaveIndicator('error');
            }
            
        } catch (error) {
            window.pvpTeamsUI.showSaveIndicator('error');
        } finally {
            this.isSaving = false;
        }
    }

    /**
     * Eliminar equipo actual
     */
    async deleteCurrentTeam() {
        if (!this.currentTeam) {
            return false;
        }
        
        const result = await window.authManager.deletePVPTeam(this.currentTeam);
        
        if (result.success) {
            this.currentTeam = null;
            this.isNewTeam = false;
            await window.pvpTeamsUI.renderInitialUI();
            return true;
        }
        
        return false;
    }
}

// Exportar instancia global
window.pvpTeams = new PVPTeams();

