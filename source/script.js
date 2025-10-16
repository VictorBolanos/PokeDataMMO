// PokeDataMMO - Ultra Optimized JavaScript

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    initializeTabs();
    initializeFeatures();
    initializeWallpaper();
    initializeTheme();
    loadSavedWallpaper();
    loadSavedTheme();
}

// ===== TAB SYSTEM =====
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    
    // Add click event listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });
    
    // Keyboard navigation (Ctrl + Arrow keys)
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    
    // Check for initial hash on page load
    window.addEventListener('load', handleInitialHash);
}

function switchTab(targetTabId) {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Remove active class from all tabs and panes
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Add active class to target tab and pane
    const targetTab = document.querySelector(`[data-tab="${targetTabId}"]`);
    const targetPane = document.getElementById(targetTabId);
    
    if (targetTab && targetPane) {
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
        targetPane.classList.add('active');
        
        // Smooth transition effect
        targetPane.style.opacity = '0';
        setTimeout(() => {
            targetPane.style.opacity = '1';
        }, 50);
        
        // Update URL hash for bookmarking
        window.history.pushState(null, null, `#${targetTabId}`);
    }
}

function handleKeyboardNavigation(e) {
    if (!e.ctrlKey) return;
    
    const tabs = document.querySelectorAll('.nav-tab');
    const currentTab = document.querySelector('.nav-tab.active');
    const currentIndex = Array.from(tabs).indexOf(currentTab);
    
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        tabs[prevIndex].click();
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        tabs[nextIndex].click();
    }
}

function handlePopState() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchTab(hash);
    }
}

function handleInitialHash() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchTab(hash);
    }
}

// ===== FEATURES =====
function initializeFeatures() {
    addStatusCardHoverEffects();
    addFeatureListClickEffects();
}

function addStatusCardHoverEffects() {
    const statusCards = document.querySelectorAll('.status-card');
    statusCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}
    
function addFeatureListClickEffects() {
    const featureItems = document.querySelectorAll('.feature-list li');
    featureItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// ===== WALLPAPER SYSTEM =====
function initializeWallpaper() {
    const wallpaperBtn = document.getElementById('wallpaperBtn');
    const wallpaperDropdown = document.getElementById('wallpaperDropdown');
    const closeBtn = document.getElementById('closeWallpaper');
    const wallpaperGrid = document.getElementById('wallpaperGrid');
    
    // Load wallpapers
    loadWallpapers();
    
    // Toggle dropdown
    wallpaperBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Close music player if open
        const musicDropdown = document.getElementById('musicDropdown');
        if (musicDropdown) {
            musicDropdown.classList.remove('show');
        }
        wallpaperDropdown.classList.toggle('show');
    });
    
    // Close dropdown
    closeBtn.addEventListener('click', function() {
        wallpaperDropdown.classList.remove('show');
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!wallpaperDropdown.contains(e.target) && !wallpaperBtn.contains(e.target)) {
            wallpaperDropdown.classList.remove('show');
        }
    });
}

function loadWallpapers() {
    const wallpaperGrid = document.getElementById('wallpaperGrid');
    
    // Add "Without Background" option first
    const noBackgroundItem = document.createElement('div');
    noBackgroundItem.className = 'wallpaper-item no-background-item';
    noBackgroundItem.dataset.wallpaper = 'none';
    
    noBackgroundItem.innerHTML = `
        <div class="no-background-preview">
            <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="rgba(255,255,255,0.5)" d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v10H7V7zm2 2v6h6V9H9z"/>
            </svg>
            <span>No BG</span>
        </div>
        <div class="pokemon-name">Without Background</div>
    `;
    
    noBackgroundItem.addEventListener('click', function() {
        setWallpaper('none');
        document.querySelectorAll('.wallpaper-item').forEach(item => {
            item.classList.remove('selected');
        });
        this.classList.add('selected');
    });
    
    wallpaperGrid.appendChild(noBackgroundItem);
    
    const wallpapers = [
        '3 venusaur', '6 charizard', '9 blastoise', '17 pidgeotto', '25 pikachu', '39 jigglypuff',
        '50 diglett', '59 arcanine', '65 alakazam', '68 machamp', '76 golem', '78 rapidash', '80 slowbro',
        '81 magnemite', '91 cloyster', '94 gengar', '103 exeggutor', '121 starmie', '123 scyther', '130 gyarados',
        '131 lapras', '132 ditto', '133 eevee', '134 vaporeon', '135 jolteon', '136 flareon',
        '137 porygon', '143 snorlax', '144 articuno', '145 zapdos', '146 moltres', '149 dragonite',
        '150 mewtwo', '151 mew', '154 meganium', '157 typhlosion', '160 feraligatr', '169 crobat',
        '196 espeon', '197 umbreon', '201 unown', '243 raikou', '244 entei', '245 suicune',
        '248 tyranitar', '249 lugia', '250 ho-oh', '254 sceptile', '257 blaziken', '260 swampert',
        '282 gardevoir', '330 flygon', '350 milotic', '373 salamence', '376 metagross', '380 latias',
        '381 latios', '382 kyogre', '383 groudon', '384 rayquaza', '386 deoxys-n', '389 torterra',
        '392 infernape', '395 empoleon', '445 garchomp', '448 lucario', '468 togekiss', '470 leafeon',
        '471 glaceon', '472 gliscor', '483 dialga', '484 palkia', '487 giratina-origin', '491 darkrai', '493 arceus',
        '497 serperior', '500 emboar', '503 samurott', '530 excadrill', '553 krookodile', '571 zoroark',
        '609 chandelure', '612 haxorus', '637 volcarona', '643 reshiram', '644 zekrom', '646 kyurem'
    ];
    
    wallpapers.forEach((wallpaper, index) => {
        const wallpaperItem = document.createElement('div');
        wallpaperItem.className = 'wallpaper-item';
        wallpaperItem.dataset.wallpaper = wallpaper;
        
        wallpaperItem.innerHTML = `
            <img src="img/bg/${wallpaper}.jpg" alt="${wallpaper}" loading="lazy">
            <div class="pokemon-name">${wallpaper}</div>
        `;
        
        wallpaperItem.addEventListener('click', function() {
            setWallpaper(wallpaper);
            // Update selection
            document.querySelectorAll('.wallpaper-item').forEach(item => {
                item.classList.remove('selected');
            });
            this.classList.add('selected');
        });
        
        wallpaperGrid.appendChild(wallpaperItem);
    });
}

function setWallpaper(wallpaperName) {
    if (wallpaperName === 'none') {
        // Remove background
        document.body.style.backgroundImage = 'none';
    } else {
        const wallpaperPath = `img/bg/${wallpaperName}.jpg`;
        document.body.style.backgroundImage = `url('${wallpaperPath}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
    
    // Save to localStorage
    localStorage.setItem('selectedWallpaper', wallpaperName);
    
    // Close dropdown
    document.getElementById('wallpaperDropdown').classList.remove('show');
}

function loadSavedWallpaper() {
    const savedWallpaper = localStorage.getItem('selectedWallpaper');
    if (savedWallpaper) {
        setWallpaper(savedWallpaper);
        // Mark as selected in grid
        setTimeout(() => {
            const selectedItem = document.querySelector(`[data-wallpaper="${savedWallpaper}"]`);
            if (selectedItem) {
                selectedItem.classList.add('selected');
            }
        }, 100);
    } else {
        // Default: no background
        setTimeout(() => {
            const noBackgroundItem = document.querySelector('[data-wallpaper="none"]');
            if (noBackgroundItem) {
                noBackgroundItem.classList.add('selected');
            }
        }, 100);
    }
}

// ===== THEME SYSTEM =====
function initializeTheme() {
    const themeBtn = document.getElementById('themeBtn');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    
    themeBtn.addEventListener('click', function() {
        toggleTheme();
    });
}

function toggleTheme() {
    const body = document.body;
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    
    if (body.classList.contains('light-theme')) {
        // Switch to dark theme
        body.classList.remove('light-theme');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    } else {
        // Switch to light theme
        body.classList.add('light-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        localStorage.setItem('theme', 'light');
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        // Default to dark theme
        body.classList.remove('light-theme');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

// ===== UTILITY FUNCTIONS =====
const PokeDataMMO = {
    // Tab management
    tabs: {
        switchTo: switchTab,
        
        getCurrentTab: function() {
            const activeTab = document.querySelector('.nav-tab.active');
            return activeTab ? activeTab.getAttribute('data-tab') : null;
        },
        
        getAllTabs: function() {
            return Array.from(document.querySelectorAll('.nav-tab')).map(tab => ({
                id: tab.getAttribute('data-tab'),
                text: tab.querySelector('.tab-text')?.textContent || '',
                icon: tab.querySelector('.tab-icon')?.textContent || ''
            }));
        }
    },
    
    // API utility
    fetchPokemonData: async function(pokemonName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            if (!response.ok) {
                throw new Error('Pokémon not found');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            return null;
        }
    }
};

// Export for future modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PokeDataMMO;
}

// Make available globally for debugging
window.PokeDataMMO = PokeDataMMO;