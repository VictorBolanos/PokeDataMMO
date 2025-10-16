// PokeDataMMO - Music Player System

// ===== MUSIC PLAYER CLASS =====
class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.volume = 0.5;
        this.isInitialized = false;
        
        // DOM Elements
        this.elements = {
            musicBtn: document.getElementById('musicBtn'),
            musicDropdown: document.getElementById('musicDropdown'),
            closeBtn: document.getElementById('closeMusic'),
            songTitle: document.getElementById('songTitle'),
            songInfo: document.getElementById('songInfo'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            playIcon: document.getElementById('playIcon'),
            pauseIcon: document.getElementById('pauseIcon'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            stopBtn: document.getElementById('stopBtn'),
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
        this.elements.closeBtn.addEventListener('click', () => {
            this.hideDropdown();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.elements.musicDropdown.contains(e.target) && 
                !this.elements.musicBtn.contains(e.target)) {
                this.hideDropdown();
            }
        });
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateSongInfo();
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateSongInfo();
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showError('Error loading audio file');
        });
        
        // Control buttons
        this.elements.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        this.elements.prevBtn.addEventListener('click', () => {
            this.previousSong();
        });
        
        this.elements.nextBtn.addEventListener('click', () => {
            this.nextSong();
        });
        
        this.elements.stopBtn.addEventListener('click', () => {
            this.stop();
        });
        
        this.elements.volumeDownBtn.addEventListener('click', () => {
            this.changeVolume(-0.1);
        });
        
        this.elements.volumeUpBtn.addEventListener('click', () => {
            this.changeVolume(0.1);
        });
    }
    
    loadPlaylist() {
        this.playlist = [
            { title: 'Title Screen (Gold & Silver)', file: '01. Title Screen (Gold & Silver).mp3' },
            { title: 'Title Screen (Crystal)', file: '02. Title Screen (Crystal).mp3' },
            { title: 'New Bark Town', file: '03. New Bark Town.mp3' },
            { title: 'Pokémon League', file: '04. Pokémon League.mp3' },
            { title: 'Battle! (Champion)', file: '05. Battle! (Champion).mp3' },
            { title: 'Vermillion City', file: '06. Vermillion City.mp3' },
            { title: 'Saffron City', file: '07. Saffron City.mp3' },
            { title: 'Lavender Town', file: '08. Lavendar Town.mp3' },
            { title: 'Celadon City', file: '09. Celadon City.mp3' },
            { title: 'Pallet Town', file: '10. Pallet Town.mp3' },
            { title: 'Cherrygrove City', file: '11. Cherrygrove City.mp3' },
            { title: 'Battle! (Rival)', file: '12. Battle! (Rival).mp3' },
            { title: 'Victory! (Trainer Battle)', file: '13. Victory! (Trainer Battle).mp3' },
            { title: 'Violet City', file: '14. Violet City.mp3' },
            { title: 'Sprout Tower', file: '15. Sprout Tower.mp3' },
            { title: 'Battle! (Gym Leader - Johto)', file: '16. Battle! (Gym Leader - Johto).mp3' },
            { title: 'Ruins of Alph (Grounds)', file: '17. Ruins of Alph (Grounds).mp3' },
            { title: 'Azalea Town', file: '18. Azalea Town.mp3' },
            { title: 'Goldenrod City', file: '19. Goldenrod City.mp3' },
            { title: 'Ecruteak City', file: '20. Ecruteak City.mp3' },
            { title: 'Burned Tower', file: '21. Burned Tower.mp3' },
            { title: 'Surf', file: '22. Surf.mp3' }
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
        // Close wallpaper dropdown if open
        const wallpaperDropdown = document.getElementById('wallpaperDropdown');
        if (wallpaperDropdown) {
            wallpaperDropdown.classList.remove('show');
        }
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
        this.updateUI();
        this.updatePlaylistSelection();
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
        this.audio.volume = this.volume;
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
        } else {
            this.elements.songInfo.textContent = '--:-- / --:--';
        }
    }
    
    updatePlaylistSelection() {
        const items = this.elements.playlist.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateVolumeDisplay() {
        this.elements.volumeDisplay.textContent = `${Math.round(this.volume * 100)}%`;
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '--:--';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    showError(message) {
        this.elements.songTitle.textContent = message;
        this.elements.songInfo.textContent = 'Error';
    }
    
    loadSettings() {
        const savedVolume = localStorage.getItem('musicPlayerVolume');
        const savedIndex = localStorage.getItem('musicPlayerIndex');
        
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
            this.audio.volume = this.volume;
        }
        
        if (savedIndex !== null) {
            this.currentIndex = parseInt(savedIndex);
        }
        
        this.updateVolumeDisplay();
    }
    
    saveSettings() {
        localStorage.setItem('musicPlayerVolume', this.volume.toString());
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
