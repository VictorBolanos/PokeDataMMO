// PokeDataMMO - Music Player System

// ===== MUSIC PLAYER CLASS =====
class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.volume = 0.5;
        this.previousVolume = 0.5;
        this.isInitialized = false;
        
        // DOM Elements
        this.elements = {
            musicBtn: document.getElementById('musicBtn'),
            musicDropdown: document.getElementById('musicDropdown'),
            closeBtn: document.getElementById('closeMusic'),
            songTitle: document.getElementById('songTitle'),
            songInfo: document.getElementById('songInfo'),
            progressContainer: document.getElementById('progressContainer'),
            progressBar: document.getElementById('progressBar'),
            progressThumb: document.getElementById('progressThumb'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            playIcon: document.getElementById('playIcon'),
            pauseIcon: document.getElementById('pauseIcon'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            stopBtn: document.getElementById('stopBtn'),
            muteBtn: document.getElementById('muteBtn'),
            volumeDownBtn: document.getElementById('volumeDownBtn'),
            volumeUpBtn: document.getElementById('volumeUpBtn'),
            volumeDisplay: document.getElementById('volumeDisplay'),
            playlist: document.getElementById('playlist')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadPlaylist();
        this.loadSettings();
        this.updateUI();
        this.isInitialized = true;
    }
    
    setupEventListeners() {
        // Toggle dropdown
        this.elements.musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        // Close dropdown
        this.elements.closeBtn.addEventListener('click', () => this.hideDropdown());
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.elements.musicDropdown.contains(e.target) && 
                !this.elements.musicBtn.contains(e.target)) {
                this.hideDropdown();
            }
        });
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateSongInfo());
        this.audio.addEventListener('timeupdate', () => this.updateSongInfo());
        this.audio.addEventListener('ended', () => this.nextSong());
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showError('Error loading audio file');
        });
        
        // Control buttons
        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.elements.prevBtn.addEventListener('click', () => this.previousSong());
        this.elements.nextBtn.addEventListener('click', () => this.nextSong());
        this.elements.stopBtn.addEventListener('click', () => this.stop());
        this.elements.muteBtn.addEventListener('click', () => this.toggleMute());
        this.elements.volumeDownBtn.addEventListener('click', () => this.changeVolume(-0.1));
        this.elements.volumeUpBtn.addEventListener('click', () => this.changeVolume(0.1));
        
        // Progress bar interaction
        this.setupProgressBarDragging();
    }
    
    setupProgressBarDragging() {
        let isDragging = false;
        
        this.elements.progressContainer.addEventListener('click', (e) => this.seekToPosition(e));
        
        this.elements.progressContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            this.seekToPosition(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) this.seekToPosition(e);
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    loadPlaylist() {
        this.playlist = [
            // Pokémon Crystal
            { title: 'Title Theme (Crystal)', file: 'crystal02. Title Screen (Crystal).mp3' },
            { title: 'New Bark Town', file: 'crystal03. New Bark Town.mp3' },
            { title: 'Pokémon League', file: 'crystal04. Pokémon League.mp3' },
            { title: 'Battle! (Champion)', file: 'crystal05. Battle! (Champion).mp3' },
            { title: 'Vermillion City', file: 'crystal06. Vermillion City.mp3' },
            { title: 'Saffron City', file: 'crystal07. Saffron City.mp3' },
            { title: 'Lavender Town', file: 'crystal08. Lavendar Town.mp3' },
            { title: 'Celadon City', file: 'crystal09. Celadon City.mp3' },
            { title: 'Pallet Town', file: 'crystal10. Pallet Town.mp3' },
            { title: 'Cherrygrove City', file: 'crystal11. Cherrygrove City.mp3' },
            { title: 'Battle! (Rival)', file: 'crystal12. Battle! (Rival).mp3' },
            { title: 'Victory! (Trainer Battle)', file: 'crystal13. Victory! (Trainer Battle).mp3' },
            { title: 'Violet City', file: 'crystal14. Violet City.mp3' },
            { title: 'Sprout Tower', file: 'crystal15. Sprout Tower.mp3' },
            { title: 'Battle! (Gym Leader - Johto)', file: 'crystal16. Battle! (Gym Leader - Johto).mp3' },
            { title: 'Ruins of Alph (Grounds)', file: 'crystal17. Ruins of Alph (Grounds).mp3' },
            { title: 'Azalea Town', file: 'crystal18. Azalea Town.mp3' },
            { title: 'Goldenrod City', file: 'crystal19. Goldenrod City.mp3' },
            { title: 'Ecruteak City', file: 'crystal20. Ecruteak City.mp3' },
            { title: 'Burned Tower', file: 'crystal21. Burned Tower.mp3' },
            { title: 'Surf', file: 'crystal22. Surf.mp3' },
            
            // Pokémon Emerald
            { title: 'Title Theme (Emerald)', file: 'emerald03. Title Theme.mp3' },
            { title: 'Littleroot Town', file: 'emerald05. Littleroot Town.mp3' },
            { title: 'Oldale Town ~ Lavaridge Town', file: 'emerald12. Oldale Town ~ Lavaridge Town.mp3' },
            { title: 'Petalburg City', file: 'emerald19. Petalburg City.mp3' },
            { title: 'Poké Mart', file: 'emerald21. Poké Mart.mp3' },
            { title: 'Petalburg Woods', file: 'emerald25. Petalburg Woods.mp3' },
            { title: 'Team Aqua Appears!', file: 'emerald26. Team Aqua Appears!.mp3' },
            { title: 'Pokémon Gym', file: 'emerald32. Pokémon Gym.mp3' },
            { title: 'Crossing the Sea', file: 'emerald36. Crossing the Sea.mp3' },
            { title: 'Dewford Town', file: 'emerald37. Dewford Town.mp3' },
            { title: 'Slateport City', file: 'emerald40. Slateport City.mp3' },
            { title: 'Cycling', file: 'emerald50. Cycling.mp3' },
            { title: 'Verdanturf Town', file: 'emerald51. Verdanturf Town.mp3' },
            { title: 'Fallarbor Town', file: 'emerald58. Fallarbor Town.mp3' },
            { title: 'Mt. Chimney', file: 'emerald60. Mt. Chimney.mp3' },
            { title: 'Fortree City', file: 'emerald69. Fortree City.mp3' },
            { title: 'Lilycove City', file: 'emerald73. Lilycove City.mp3' },
            { title: 'Team Magma Appears!', file: 'emerald82. Team Magma Appears!.mp3' },
            { title: 'Diving', file: 'emerald87. Diving.mp3' },
            { title: 'Sootopolis City', file: 'emerald88. Sootopolis City.mp3' },
            { title: 'Legendary Pokémon Battle!', file: 'emerald90. Legendary Pokémon Battle!.mp3' },
            { title: 'Ever Grande City', file: 'emerald97. Ever Grande City.mp3' }
        ];
        
        this.renderPlaylist();
    }
    
    renderPlaylist() {
        this.elements.playlist.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.textContent = song.title;
            item.addEventListener('click', () => {
                this.playSong(index);
            });
            this.elements.playlist.appendChild(item);
        });
    }
    
    toggleDropdown() {
        // Close other dropdowns if open
        const wallpaperDropdown = document.getElementById('wallpaperDropdown');
        const fontDropdown = document.getElementById('fontDropdown');
        const colorDropdown = document.getElementById('colorDropdown');
        
        if (wallpaperDropdown) wallpaperDropdown.classList.remove('show');
        if (fontDropdown) fontDropdown.classList.remove('show');
        if (colorDropdown) colorDropdown.classList.remove('show');
        
        this.elements.musicDropdown.classList.toggle('show');
    }
    
    hideDropdown() {
        this.elements.musicDropdown.classList.remove('show');
    }
    
    playSong(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentIndex = index;
        const song = this.playlist[index];
        
        this.audio.src = `audio/music/${song.file}`;
        this.audio.load();
        
        this.updateUI();
        this.updatePlaylistSelection();
        
        // Auto play if was playing
        if (this.isPlaying) {
            this.audio.play().catch(e => {
                console.error('Play failed:', e);
                this.showError('Could not play audio');
            });
        }
    }
    
    togglePlayPause() {
        if (!this.audio.src) {
            this.playSong(0);
            // Auto play after loading
            this.audio.addEventListener('loadeddata', () => {
                this.play();
            }, { once: true });
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
        }).catch(e => {
            console.error('Play failed:', e);
            this.showError('Could not play audio');
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
    }
    
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.currentIndex = 0;
        
        // Load first song without playing
        if (this.playlist.length > 0) {
            this.audio.src = `audio/music/${this.playlist[0].file}`;
            this.audio.load();
        }
        
        this.updateUI();
        this.updatePlaylistSelection();
        this.updateProgressBar(0);
        this.updateSongInfo();
    }
    
    previousSong() {
        const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
        this.playSong(newIndex);
    }
    
    nextSong() {
        const newIndex = this.currentIndex < this.playlist.length - 1 ? this.currentIndex + 1 : 0;
        this.playSong(newIndex);
    }
    
    changeVolume(delta) {
        this.volume = Math.max(0, Math.min(1, this.volume + delta));
        
        // Auto-mute if below 10%
        if (this.volume < 0.1 && this.volume > 0) {
            this.volume = 0;
        }
        
        this.audio.volume = this.volume;
        this.updateVolumeDisplay();
        this.saveSettings();
    }
    
    toggleMute() {
        if (this.volume === 0) {
            // If muted (volume is 0), restore previous volume
            this.volume = this.previousVolume > 0 ? this.previousVolume : 0.5;
            this.audio.volume = this.volume;
        } else {
            // If not muted, save current volume and mute
            this.previousVolume = this.volume;
            this.volume = 0;
            this.audio.volume = 0;
        }
        
        this.updateVolumeDisplay();
        this.saveSettings();
    }
    
    updateUI() {
        // Update play/pause button
        if (this.isPlaying) {
            this.elements.playIcon.style.display = 'none';
            this.elements.pauseIcon.style.display = 'block';
        } else {
            this.elements.playIcon.style.display = 'block';
            this.elements.pauseIcon.style.display = 'none';
        }
        
        // Update song title
        if (this.playlist[this.currentIndex]) {
            this.elements.songTitle.textContent = this.playlist[this.currentIndex].title;
        } else {
            this.elements.songTitle.textContent = 'Select a song';
        }
    }
    
    updateSongInfo() {
        if (this.audio.duration && !isNaN(this.audio.duration)) {
            const current = this.formatTime(this.audio.currentTime);
            const total = this.formatTime(this.audio.duration);
            this.elements.songInfo.textContent = `${current} / ${total}`;
            
            // Update progress bar
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.updateProgressBar(progress);
        } else {
            this.elements.songInfo.textContent = '--:-- / --:--';
            this.updateProgressBar(0);
        }
    }
    
    updatePlaylistSelection() {
        const items = this.elements.playlist.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateVolumeDisplay() {
        if (this.volume === 0) {
            this.elements.volumeDisplay.textContent = 'Mute';
        } else {
            this.elements.volumeDisplay.textContent = `${Math.round(this.volume * 100)}%`;
        }
    }
    
    updateProgressBar(progress) {
        const clampedProgress = Math.max(0, Math.min(100, progress));
        this.elements.progressBar.style.setProperty('--progress', `${clampedProgress}%`);
        this.elements.progressThumb.style.setProperty('--progress', `${clampedProgress}%`);
    }
    
    seekToPosition(e) {
        if (!this.audio.duration || isNaN(this.audio.duration)) return;
        
        const rect = this.elements.progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, offsetX / width));
        
        this.audio.currentTime = percentage * this.audio.duration;
        this.updateProgressBar(percentage * 100);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    showError(message) {
        this.elements.songTitle.textContent = message;
        this.elements.songInfo.textContent = 'Error';
    }
    
    loadSettings() {
        const settings = {
            volume: localStorage.getItem('musicPlayerVolume'),
            previousVolume: localStorage.getItem('musicPlayerPreviousVolume'),
            index: localStorage.getItem('musicPlayerIndex')
        };
        
        if (settings.volume !== null) {
            this.volume = parseFloat(settings.volume);
            this.audio.volume = this.volume;
        }
        
        if (settings.previousVolume !== null) {
            this.previousVolume = parseFloat(settings.previousVolume);
        }
        
        if (settings.index !== null) {
            this.currentIndex = parseInt(settings.index);
        }
        
        this.updateVolumeDisplay();
    }
    
    saveSettings() {
        localStorage.setItem('musicPlayerVolume', this.volume.toString());
        localStorage.setItem('musicPlayerPreviousVolume', this.previousVolume.toString());
        localStorage.setItem('musicPlayerIndex', this.currentIndex.toString());
    }
}

// ===== INITIALIZATION =====
let musicPlayer;

document.addEventListener('DOMContentLoaded', () => {
    musicPlayer = new MusicPlayer();
});

// Export for global access
window.MusicPlayer = MusicPlayer;
