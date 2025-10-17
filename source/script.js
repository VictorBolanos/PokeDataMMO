// PokeDataMMO - Ultra Optimized JavaScript

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    initializeTabs();
    initializeFeatures();
    initializeWallpaper();
    initializeTheme();
    initializeLanguage();
    loadSavedWallpaper();
    loadSavedTheme();
    translateUI(); // Initial translation
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
    handleHashNavigation();
}

function handleInitialHash() {
    handleHashNavigation();
}

function handleHashNavigation() {
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
    
    // Load wallpapers
    loadWallpapers();
    
    // Toggle dropdown
    wallpaperBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeDropdown('musicDropdown');
        wallpaperDropdown.classList.toggle('show');
    });
    
    // Close dropdown
    closeBtn.addEventListener('click', () => wallpaperDropdown.classList.remove('show'));
    
    // Close on outside click
    setupOutsideClickHandler(wallpaperDropdown, wallpaperBtn);
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
        selectWallpaper('none', this);
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
    
    wallpapers.forEach(wallpaper => {
        const wallpaperItem = document.createElement('div');
        wallpaperItem.className = 'wallpaper-item';
        wallpaperItem.dataset.wallpaper = wallpaper;
        
        wallpaperItem.innerHTML = `
            <img src="img/bg/${wallpaper}.jpg" alt="${wallpaper}" loading="lazy">
            <div class="pokemon-name">${wallpaper}</div>
        `;
        
        wallpaperItem.addEventListener('click', function() {
            selectWallpaper(wallpaper, this);
        });
        
        wallpaperGrid.appendChild(wallpaperItem);
    });
}

function selectWallpaper(wallpaperName, element) {
    setWallpaper(wallpaperName);
    updateSelection('.wallpaper-item', element);
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

// ===== LANGUAGE SYSTEM =====
function initializeLanguage() {
    const languageBtn = document.getElementById('languageBtn');
    languageBtn.addEventListener('click', toggleLanguage);
    updateLanguageIcon();
}

async function toggleLanguage() {
    window.languageManager.toggleLanguage();
    updateLanguageIcon();
    translateUI();
    
    // Refresh current Pokémon if in Pokédex tab
    if (window.pokedex && window.pokedex.currentPokemon) {
        await window.pokedex.renderPokemonCard();
    }
}

function updateLanguageIcon() {
    const languageIcon = document.getElementById('languageIcon');
    const currentLang = window.languageManager.getCurrentLanguage();
    
    if (currentLang === 'es') {
        languageIcon.src = 'img/res/language-icons/spain.png';
        languageIcon.alt = 'Español';
    } else {
        languageIcon.src = 'img/res/language-icons/united-kingdom.png';
        languageIcon.alt = 'English';
    }
}

function translateUI() {
    const lm = window.languageManager;
    
    // Update page title
    document.title = lm.t('title');
    
    // Update tab names
    document.querySelector('[data-tab="leagues"] .tab-text').textContent = lm.t('tabs.leagues');
    document.querySelector('[data-tab="farming"] .tab-text').textContent = lm.t('tabs.farming');
    document.querySelector('[data-tab="breeding"] .tab-text').textContent = lm.t('tabs.breeding');
    document.querySelector('[data-tab="pvp"] .tab-text').textContent = lm.t('tabs.pvp');
    document.querySelector('[data-tab="progression"] .tab-text').textContent = lm.t('tabs.progression');
    document.querySelector('[data-tab="pokedex"] .tab-text').textContent = lm.t('tabs.pokedex');
    document.querySelector('[data-tab="typechart"] .tab-text').textContent = lm.t('tabs.typechart');
    
    // Update footer
    document.querySelector('.footer-text').textContent = lm.t('footer');
    
    // Update Music Player header
    const musicHeaderTitle = document.querySelector('#musicDropdown .music-header h6');
    if (musicHeaderTitle) {
        musicHeaderTitle.textContent = lm.t('musicPlayer.title');
    }
    
    // Update Wallpaper header
    const wallpaperHeaderTitle = document.querySelector('#wallpaperDropdown .wallpaper-header h6');
    if (wallpaperHeaderTitle) {
        wallpaperHeaderTitle.textContent = lm.t('wallpaper.title');
    }
    
    // Translate all tabs content
    translateLeaguesTab();
    translateFarmingTab();
    translateBreedingTab();
    translatePVPTab();
    translateProgressionTab();
    translatePokedexTab();
    translateTypeChartTab();
}

function translateLeaguesTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('leagues');
    
    tab.querySelector('h2').innerHTML = lm.t('leagues.title');
    tab.querySelector('.lead').textContent = lm.t('leagues.subtitle');
    tab.querySelector('h4').textContent = lm.t('leagues.whatsComingTitle');
    tab.querySelectorAll('p')[0].textContent = lm.t('leagues.description');
    
    const featureItems = tab.querySelectorAll('.feature-list li');
    featureItems[0].innerHTML = `<strong>${lm.t('leagues.features.strategies').split(' ')[0]}</strong> ${lm.t('leagues.features.strategies').split(' ').slice(1).join(' ')}`;
    featureItems[1].innerHTML = `<strong>${lm.t('leagues.features.teams').split(' ')[0]}</strong> ${lm.t('leagues.features.teams').split(' ').slice(1).join(' ')}`;
    featureItems[2].innerHTML = `<strong>${lm.t('leagues.features.levels').split(' ')[0]}</strong> ${lm.t('leagues.features.levels').split(' ').slice(1).join(' ')}`;
    featureItems[3].innerHTML = `<strong>${lm.t('leagues.features.items').split(' ')[0]}</strong> ${lm.t('leagues.features.items').split(' ').slice(1).join(' ')}`;
    
    tab.querySelector('.alert strong').textContent = lm.t('leagues.ambitiousProject');
    tab.querySelector('.alert').innerHTML = `<strong>${lm.t('leagues.ambitiousProject')}</strong> ${lm.t('leagues.ambitiousDescription')}`;
    
    tab.querySelector('.status-card h5').textContent = lm.t('leagues.developmentStatus');
    tab.querySelector('.status-card .badge').textContent = lm.t('leagues.statusPlanning');
    tab.querySelector('.status-card p').textContent = lm.t('leagues.researchPhase');
}

function translateFarmingTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('farming');
    
    tab.querySelector('h2').innerHTML = lm.t('farming.title');
    tab.querySelector('.lead').textContent = lm.t('farming.subtitle');
    tab.querySelector('h4').textContent = lm.t('farming.whatsComingTitle');
    tab.querySelectorAll('p')[0].textContent = lm.t('farming.description');
    
    const featureItems = tab.querySelectorAll('.feature-list li');
    featureItems[0].innerHTML = `<strong>${lm.t('farming.features.tracking').split(' ').slice(0, 3).join(' ')}</strong> ${lm.t('farming.features.tracking').split(' ').slice(3).join(' ')}`;
    featureItems[1].innerHTML = `<strong>${lm.t('farming.features.schedules').split(' ').slice(0, 3).join(' ')}</strong> ${lm.t('farming.features.schedules').split(' ').slice(3).join(' ')}`;
    featureItems[2].innerHTML = `<strong>${lm.t('farming.features.soil').split(' ').slice(0, 3).join(' ')}</strong> ${lm.t('farming.features.soil').split(' ').slice(3).join(' ')}`;
    featureItems[3].innerHTML = `<strong>${lm.t('farming.features.profit').split(' ').slice(0, 2).join(' ')}</strong> ${lm.t('farming.features.profit').split(' ').slice(2).join(' ')}`;
    featureItems[4].innerHTML = `<strong>${lm.t('farming.features.harvest').split(' ').slice(0, 2).join(' ')}</strong> ${lm.t('farming.features.harvest').split(' ').slice(2).join(' ')}`;
    
    tab.querySelector('.status-card h5').textContent = lm.t('farming.developmentStatus');
    tab.querySelector('.status-card .badge').textContent = lm.t('farming.statusDevelopment');
    tab.querySelector('.status-card p').textContent = lm.t('farming.coreFeatures');
}

function translateBreedingTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('breeding');
    
    tab.querySelector('h2').innerHTML = lm.t('breeding.title');
    tab.querySelector('.lead').textContent = lm.t('breeding.subtitle');
    tab.querySelector('h4').textContent = lm.t('breeding.whatsComingTitle');
    tab.querySelectorAll('p')[0].textContent = lm.t('breeding.description');
    
    const featureItems = tab.querySelectorAll('.feature-list li');
    featureItems[0].innerHTML = `<strong>${lm.t('breeding.features.target').split(' - ')[0]}</strong> - ${lm.t('breeding.features.target').split(' - ')[1]}`;
    featureItems[1].innerHTML = `<strong>${lm.t('breeding.features.path').split(' - ')[0]}</strong> - ${lm.t('breeding.features.path').split(' - ')[1]}`;
    featureItems[2].innerHTML = `<strong>${lm.t('breeding.features.dualMode')}</strong>`;
    featureItems[3].textContent = lm.t('breeding.features.withNatu');
    featureItems[4].textContent = lm.t('breeding.features.withoutNatu');
    featureItems[5].innerHTML = `<strong>${lm.t('breeding.features.ivNature').split(' ')[0]}</strong> ${lm.t('breeding.features.ivNature').split(' ').slice(1).join(' ')}`;
    featureItems[6].innerHTML = `<strong>${lm.t('breeding.features.eggMoves').split(' ').slice(0, 3).join(' ')}</strong> ${lm.t('breeding.features.eggMoves').split(' ').slice(3).join(' ')}`;
    
    tab.querySelector('.status-card h5').textContent = lm.t('breeding.developmentStatus');
    tab.querySelector('.status-card .badge').textContent = lm.t('breeding.statusPriority');
    tab.querySelector('.status-card p').textContent = lm.t('breeding.algorithmProgress');
}

function translatePVPTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('pvp');
    
    tab.querySelector('h2').innerHTML = lm.t('pvp.title');
    tab.querySelector('.lead').textContent = lm.t('pvp.subtitle');
    tab.querySelector('h4').textContent = lm.t('pvp.whatsComingTitle');
    tab.querySelectorAll('p')[0].textContent = lm.t('pvp.description');
    
    const featureItems = tab.querySelectorAll('.feature-list li');
    featureItems[0].innerHTML = `<strong>${lm.t('pvp.features.builder').split(' ')[0]} ${lm.t('pvp.features.builder').split(' ')[1]}</strong> ${lm.t('pvp.features.builder').split(' ').slice(2).join(' ')}`;
    featureItems[1].innerHTML = `<strong>${lm.t('pvp.features.coverage').split(' ').slice(0, 3).join(' ')}</strong> ${lm.t('pvp.features.coverage').split(' ').slice(3).join(' ')}`;
    featureItems[2].innerHTML = `<strong>${lm.t('pvp.features.moveset').split(' ').slice(0, 3).join(' ')}</strong> ${lm.t('pvp.features.moveset').split(' ').slice(3).join(' ')}`;
    featureItems[3].innerHTML = `<strong>${lm.t('pvp.features.meta').split(' ').slice(0, 2).join(' ')}</strong> ${lm.t('pvp.features.meta').split(' ').slice(2).join(' ')}`;
    featureItems[4].innerHTML = `<strong>${lm.t('pvp.features.simulation').split(' ').slice(0, 2).join(' ')}</strong> ${lm.t('pvp.features.simulation').split(' ').slice(2).join(' ')}`;
    
    tab.querySelector('.alert strong').textContent = lm.t('pvp.ambitiousProject');
    tab.querySelector('.alert').innerHTML = `<strong>${lm.t('pvp.ambitiousProject')}</strong> ${lm.t('pvp.ambitiousDescription')}`;
    
    tab.querySelector('.status-card h5').textContent = lm.t('pvp.developmentStatus');
    tab.querySelector('.status-card .badge').textContent = lm.t('pvp.statusPlanning');
    tab.querySelector('.status-card p').textContent = lm.t('pvp.researchPhase');
}

function translateProgressionTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('progression');
    
    tab.querySelector('h2').innerHTML = lm.t('progression.title');
    tab.querySelector('.lead').textContent = lm.t('progression.subtitle');
    tab.querySelector('h4').textContent = lm.t('progression.whatsComingTitle');
    tab.querySelectorAll('p')[0].textContent = lm.t('progression.description');
    
    const featureItems = tab.querySelectorAll('.feature-list li');
    featureItems[0].innerHTML = `<strong>${lm.t('progression.features.multiChar').split(' - ')[0]}</strong> - ${lm.t('progression.features.multiChar').split(' - ')[1]}`;
    featureItems[1].innerHTML = `<strong>${lm.t('progression.features.regionProg').split(' - ')[0]}</strong> - ${lm.t('progression.features.regionProg').split(' - ')[1]}`;
    featureItems[2].innerHTML = `<strong>${lm.t('progression.features.calculator').split(' - ')[0]}</strong> - ${lm.t('progression.features.calculator').split(' - ')[1]}`;
    featureItems[3].innerHTML = `<strong>${lm.t('progression.features.goals').split(' - ')[0]}</strong> - ${lm.t('progression.features.goals').split(' - ')[1]}`;
    featureItems[4].innerHTML = `<strong>${lm.t('progression.features.time').split(' - ')[0]}</strong> - ${lm.t('progression.features.time').split(' - ')[1]}`;
    featureItems[5].innerHTML = `<strong>${lm.t('progression.features.resources').split(' - ')[0]}</strong> - ${lm.t('progression.features.resources').split(' - ')[1]}`;
    
    tab.querySelector('.status-card h5').textContent = lm.t('progression.developmentStatus');
    tab.querySelector('.status-card .badge').textContent = lm.t('progression.statusDevelopment');
    tab.querySelector('.status-card p').textContent = lm.t('progression.databaseProgress');
}

function translatePokedexTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('pokedex');
    
    tab.querySelector('h2').innerHTML = lm.t('pokedex.title');
    tab.querySelector('.lead').textContent = lm.t('pokedex.subtitle');
    
    // Update search placeholder
    const searchInput = document.getElementById('pokemonSearch');
    if (searchInput) {
        searchInput.placeholder = lm.t('pokedex.searchPlaceholder');
    }
    
    // Update empty state if present
    const emptyState = tab.querySelector('.text-center.text-muted');
    if (emptyState && !window.pokedex?.currentPokemon) {
        emptyState.querySelector('h4').textContent = lm.t('pokedex.emptyStateTitle');
        emptyState.querySelector('p').textContent = lm.t('pokedex.emptyStateSubtitle');
    }
}

function translateTypeChartTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('typechart');
    
    tab.querySelector('h2').innerHTML = lm.t('typeChart.title');
    tab.querySelector('.lead').textContent = lm.t('typeChart.subtitle');
    tab.querySelector('.form-label').textContent = lm.t('typeChart.selectTypes');
    
    // Update effectiveness result headers
    const effectivenessHeaders = tab.querySelectorAll('.effectiveness-card h5');
    if (effectivenessHeaders.length >= 5) {
        effectivenessHeaders[0].textContent = lm.t('typeChart.ultraEffective');
        effectivenessHeaders[1].textContent = lm.t('typeChart.superEffective');
        effectivenessHeaders[2].textContent = lm.t('typeChart.resistant');
        effectivenessHeaders[3].textContent = lm.t('typeChart.superResistant');
        effectivenessHeaders[4].textContent = lm.t('typeChart.noEffect');
    }
}

// ===== THEME SYSTEM =====
function initializeTheme() {
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    updateThemeIcons(isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isLight = savedTheme === 'light';
    
    if (isLight) {
        document.body.classList.add('light-theme');
    }
    updateThemeIcons(isLight);
}

function updateThemeIcons(isLight) {
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    
    sunIcon.style.display = isLight ? 'none' : 'block';
    moonIcon.style.display = isLight ? 'block' : 'none';
}

// ===== HELPER FUNCTIONS =====
function closeDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function setupOutsideClickHandler(dropdown, button) {
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && !button.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

function updateSelection(selector, selectedElement) {
    document.querySelectorAll(selector).forEach(item => {
        item.classList.remove('selected');
    });
    selectedElement.classList.add('selected');
}

// ===== FONT SYSTEM =====
function initializeFont() {
    const fontSelector = document.getElementById('fontSelector');
    if (fontSelector) {
        // Load saved font
        const savedFont = localStorage.getItem('selectedFont');
        if (savedFont) {
            fontSelector.value = savedFont;
            applyFont(savedFont);
        }
        
        // Add event listener
        fontSelector.addEventListener('change', function() {
            const selectedFont = this.value;
            applyFont(selectedFont);
            localStorage.setItem('selectedFont', selectedFont);
        });
    }
}

function applyFont(fontFamily) {
    document.body.style.fontFamily = fontFamily;
}

// ===== COLOR SYSTEM =====
function initializeColor() {
    const colorSelector = document.getElementById('colorSelector');
    if (colorSelector) {
        // Load saved color
        const savedColor = localStorage.getItem('colorTheme') || 'standard';
        colorSelector.value = savedColor;
        applyColorTheme(savedColor);
        
        // Add event listener
        colorSelector.addEventListener('change', function() {
            const selectedColor = this.value;
            applyColorTheme(selectedColor);
            localStorage.setItem('colorTheme', selectedColor);
        });
    }
}

function applyColorTheme(colorTheme) {
    document.body.setAttribute('data-color-theme', colorTheme);
}

// Initialize font and color systems
document.addEventListener('DOMContentLoaded', function() {
    initializeFont();
    initializeColor();
});