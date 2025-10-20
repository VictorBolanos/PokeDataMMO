// PokeDataMMO - Ultra Optimized JavaScript

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    if (!window.authManager) {
        return;
    }
    
    await window.authManager.init();
    checkAuthenticationAndRender();
    
    // Precargar datos de movimientos y objetos de PokeAPI
    if (window.pokemonDataLoader) {
        window.pokemonDataLoader.preloadData().catch(err => {});
    }
    
    initializeTabs();
    initializeWallpaper();
    initializeTheme();
    initializeLanguage();
    initializeFont();
    initializeColor();
    initializeAuth();
    loadSavedWallpaper();
    loadSavedTheme();
    translateUI(); // Initial translation
    initializeBerryCalculator();
    initializePVPTeams();
    initializeHomePage();
    initializeHamburgerMenu();
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
        closeDropdown('fontDropdown');
        closeDropdown('colorDropdown');
        
        const isShowing = wallpaperDropdown.classList.contains('show');
        if (isShowing) {
            wallpaperDropdown.classList.remove('show');
            hideMobileOverlay();
        } else {
            wallpaperDropdown.classList.add('show');
            showMobileOverlay();
        }
    });
    
    // Close dropdown
    closeBtn.addEventListener('click', () => {
        wallpaperDropdown.classList.remove('show');
        hideMobileOverlay();
    });
    
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
    hideMobileOverlay();
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
    languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDropdown('musicDropdown');
        closeDropdown('wallpaperDropdown');
        closeDropdown('fontDropdown');
        closeDropdown('colorDropdown');
        toggleLanguage();
    });
    updateLanguageIcon();
}

async function toggleLanguage() {
    window.languageManager.toggleLanguage();
    updateLanguageIcon();
    
    // Actualizar traducciones de movimientos e items
    if (window.pokemonDataLoader) {
        window.pokemonDataLoader.updateAllTranslations();
    }
    
    await translateUI();
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

async function translateUI() {
    const lm = window.languageManager;
    
    // Update page title
    document.title = lm.t('title');
    
    // Update tab names
    document.querySelector('[data-tab="leagues"] .tab-text').textContent = lm.t('tabs.leagues');
    document.querySelector('[data-tab="farming"] .tab-text').textContent = lm.t('tabs.farming');
    document.querySelector('[data-tab="breeding"] .tab-text').textContent = lm.t('tabs.breeding');
    document.querySelector('[data-tab="pokecalc"] .tab-text').textContent = lm.t('tabs.pokecalc');
    document.querySelector('[data-tab="pvp"] .tab-text').textContent = lm.t('tabs.pvp');
    document.querySelector('[data-tab="pokedex"] .tab-text').textContent = lm.t('tabs.pokedex');
    document.querySelector('[data-tab="typechart"] .tab-text').textContent = lm.t('tabs.typechart');
    
    // Update footer
    document.querySelector('.footer-text').textContent = lm.t('footer');
    
    // Translate home page
    translateHomePage();
    
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
    translatePokeCalcTab();
    translatePVPTab();
    await translatePokedexTab();
    translateTypeChartTab();
    translateAuthUI();
}

function translateLeaguesTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('leagues');
    if (!tab) return;
    
    const h2 = tab.querySelector('h2');
    const lead = tab.querySelector('.lead');
    const h4 = tab.querySelector('h4');
    const p = tab.querySelectorAll('p')[0];
    
    if (h2) h2.innerHTML = lm.t('leagues.title');
    if (lead) lead.textContent = lm.t('leagues.subtitle');
    if (h4) h4.textContent = lm.t('leagues.whatsComingTitle');
    if (p) p.textContent = lm.t('leagues.description');
    
    const featureItems = tab.querySelectorAll('.feature-list li');
    if (featureItems[0]) featureItems[0].innerHTML = `<strong>${lm.t('leagues.features.strategies').split(' ')[0]}</strong> ${lm.t('leagues.features.strategies').split(' ').slice(1).join(' ')}`;
    if (featureItems[1]) featureItems[1].innerHTML = `<strong>${lm.t('leagues.features.teams').split(' ')[0]}</strong> ${lm.t('leagues.features.teams').split(' ').slice(1).join(' ')}`;
    if (featureItems[2]) featureItems[2].innerHTML = `<strong>${lm.t('leagues.features.levels').split(' ')[0]}</strong> ${lm.t('leagues.features.levels').split(' ').slice(1).join(' ')}`;
    if (featureItems[3]) featureItems[3].innerHTML = `<strong>${lm.t('leagues.features.items').split(' ')[0]}</strong> ${lm.t('leagues.features.items').split(' ').slice(1).join(' ')}`;
    
    const alertStrong = tab.querySelector('.alert strong');
    const alert = tab.querySelector('.alert');
    if (alertStrong) alertStrong.textContent = lm.t('leagues.ambitiousProject');
    if (alert) alert.innerHTML = `<strong>${lm.t('leagues.ambitiousProject')}</strong> ${lm.t('leagues.ambitiousDescription')}`;
    
    const statusH5 = tab.querySelector('.status-card h5');
    const statusBadge = tab.querySelector('.status-card .badge');
    const statusP = tab.querySelector('.status-card p');
    if (statusH5) statusH5.textContent = lm.t('leagues.developmentStatus');
    if (statusBadge) statusBadge.textContent = lm.t('leagues.statusPlanning');
    if (statusP) statusP.textContent = lm.t('leagues.researchPhase');
}

function translateFarmingTab() {
    // Actualizar calculadora de bayas si está activa
    if (window.berryUI && window.berryUI.updateTranslations) {
        window.berryUI.updateTranslations();
    }
}

function translateBreedingTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('breeding');
    if (!tab) return;
    
    const h2 = tab.querySelector('h2');
    const lead = tab.querySelector('.lead');
    const h4 = tab.querySelector('h4');
    const p = tab.querySelectorAll('p')[0];
    
    if (h2) h2.innerHTML = lm.t('breeding.title');
    if (lead) lead.textContent = lm.t('breeding.subtitle');
    if (h4) h4.textContent = lm.t('breeding.whatsComingTitle');
    if (p) p.textContent = lm.t('breeding.description');
    
    const featureItems = tab.querySelectorAll('.feature-list li');
    if (featureItems[0]) featureItems[0].innerHTML = `<strong>${lm.t('breeding.features.target').split(' - ')[0]}</strong> - ${lm.t('breeding.features.target').split(' - ')[1]}`;
    if (featureItems[1]) featureItems[1].innerHTML = `<strong>${lm.t('breeding.features.path').split(' - ')[0]}</strong> - ${lm.t('breeding.features.path').split(' - ')[1]}`;
    if (featureItems[2]) featureItems[2].innerHTML = `<strong>${lm.t('breeding.features.dualMode')}</strong>`;
    if (featureItems[3]) featureItems[3].textContent = lm.t('breeding.features.withNatu');
    if (featureItems[4]) featureItems[4].textContent = lm.t('breeding.features.withoutNatu');
    if (featureItems[5]) featureItems[5].innerHTML = `<strong>${lm.t('breeding.features.ivNature').split(' ')[0]}</strong> ${lm.t('breeding.features.ivNature').split(' ').slice(1).join(' ')}`;
    if (featureItems[6]) featureItems[6].innerHTML = `<strong>${lm.t('breeding.features.eggMoves').split(' ').slice(0, 3).join(' ')}</strong> ${lm.t('breeding.features.eggMoves').split(' ').slice(3).join(' ')}`;
    
    const statusH5 = tab.querySelector('.status-card h5');
    const statusBadge = tab.querySelector('.status-card .badge');
    const statusP = tab.querySelector('.status-card p');
    if (statusH5) statusH5.textContent = lm.t('breeding.developmentStatus');
    if (statusBadge) statusBadge.textContent = lm.t('breeding.statusPriority');
    if (statusP) statusP.textContent = lm.t('breeding.algorithmProgress');
}

function translatePokeCalcTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('pokecalc');
    if (!tab) return;
    
    // Stats Calculator
    const statsTitle = document.getElementById('statsCalcTitle');
    const statsSubtitle = document.getElementById('statsCalcSubtitle');
    
    if (statsTitle) {
        statsTitle.innerHTML = lm.getCurrentLanguage() === 'es' 
            ? '🔢 Calculadora de Stats de Pokémon' 
            : '🔢 Pokémon Stats Calculator';
    }
    
    if (statsSubtitle) {
        statsSubtitle.textContent = lm.getCurrentLanguage() === 'es' 
            ? 'Calcula stats finales basados en Stats Base, EVs, IVs y Naturaleza' 
            : 'Calculate final stats based on Base Stats, EVs, IVs, and Nature';
    }
    
    // Damage Calculator
    const damageTitle = document.getElementById('damageCalcTitle');
    const damageSubtitle = document.getElementById('damageCalcSubtitle');
    
    if (damageTitle) {
        damageTitle.innerHTML = lm.getCurrentLanguage() === 'es' 
            ? '⚔️ Calculadora de Daño' 
            : '⚔️ Damage Calculator';
    }
    
    if (damageSubtitle) {
        damageSubtitle.textContent = lm.getCurrentLanguage() === 'es' 
            ? 'Calcula el daño entre Pokémon en batalla' 
            : 'Calculate damage between Pokémon in battle';
    }
}

function translatePVPTab() {
    // Actualizar PVP Teams UI si está activa
    if (window.pvpTeamsUI && window.pvpTeamsUI.updateTranslations) {
        window.pvpTeamsUI.updateTranslations();
    }
}

async function translatePokedexTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('pokedex');
    
    // Actualizar título y subtítulo usando los nuevos IDs
    const title = document.getElementById('pokedexTitle');
    const subtitle = document.getElementById('pokedexSubtitle');
    
    if (title) title.innerHTML = lm.t('pokedex.title');
    if (subtitle) subtitle.textContent = lm.t('pokedex.subtitle');
    
    // Actualizar placeholder de búsqueda
    const searchInput = document.getElementById('pokemonSearch');
    if (searchInput) {
        searchInput.placeholder = lm.t('pokedex.searchPlaceholder');
    }
    
    // Actualizar estado vacío si está presente
    const emptyState = tab.querySelector('.text-center.text-muted');
    if (emptyState && !window.pokedex?.currentPokemon) {
        const h4 = emptyState.querySelector('h4');
        const p = emptyState.querySelector('p');
        if (h4) h4.textContent = lm.t('pokedex.emptyStateTitle');
        if (p) p.textContent = lm.t('pokedex.emptyStateSubtitle');
    }
    
    // Si hay un Pokémon actualmente mostrado, re-renderizarlo con el nuevo idioma
    if (window.pokedex && window.pokedex.currentPokemon) {
        await window.pokedex.renderPokemonCard();
    }
}

function translateTypeChartTab() {
    const lm = window.languageManager;
    const tab = document.getElementById('typechart');
    
    // Actualizar título y subtítulo usando los nuevos IDs
    const title = document.getElementById('typeTableTitle');
    const subtitle = document.getElementById('typeTableSubtitle');
    const formLabel = tab.querySelector('.form-label');
    
    if (title) title.innerHTML = lm.t('typeChart.title');
    if (subtitle) subtitle.textContent = lm.t('typeChart.subtitle');
    if (formLabel) formLabel.textContent = lm.t('typeChart.selectTypes');
    
    // Actualizar headers de efectividad si están presentes
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
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDropdown('musicDropdown');
        closeDropdown('wallpaperDropdown');
        closeDropdown('fontDropdown');
        closeDropdown('colorDropdown');
        toggleTheme();
    });
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    updateThemeIcons(isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Actualizar tablas dinámicamente
    updateTablesTheme(isLight);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const isLight = savedTheme === 'light';
    
    if (isLight) {
        document.body.classList.add('light-theme');
    }
    updateThemeIcons(isLight);
    
    // Actualizar tablas si ya existen en el DOM
    updateTablesTheme(isLight);
}

function updateThemeIcons(isLight) {
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    
    sunIcon.style.display = isLight ? 'none' : 'block';
    moonIcon.style.display = isLight ? 'block' : 'none';
}

/**
 * Actualizar clases de tablas dinámicamente cuando cambia el tema
 */
function updateTablesTheme(isLight) {
    // Actualizar TODAS las tablas con clase table-dark o table-light
    document.querySelectorAll('table').forEach(table => {
        if (isLight) {
            // Cambiar a tema claro
            table.classList.remove('table-dark');
            table.classList.add('table-light');
        } else {
            // Cambiar a tema oscuro
            table.classList.remove('table-light');
            table.classList.add('table-dark');
        }
    });
}

// ===== MOBILE OVERLAY SYSTEM =====
function createMobileOverlay() {
    let overlay = document.querySelector('.dropdown-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'dropdown-overlay';
        document.body.appendChild(overlay);
        
        // Cerrar dropdowns al hacer click en overlay
        overlay.addEventListener('click', () => {
            closeAllDropdowns();
        });
    }
    return overlay;
}

function showMobileOverlay() {
    if (window.innerWidth <= 450) {
        const overlay = createMobileOverlay();
        overlay.classList.add('show');
    }
}

function hideMobileOverlay() {
    const overlay = document.querySelector('.dropdown-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function closeAllDropdowns() {
    const dropdowns = [
        'colorDropdown', 'fontDropdown', 'wallpaperDropdown', 
        'musicDropdown', 'userDropdown', 'hamburgerMenuDropdown'
    ];
    
    dropdowns.forEach(id => {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    });
    
    hideMobileOverlay();
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
            // Remover overlay si existe
            const overlay = document.querySelector('.dropdown-overlay');
            if (overlay) {
                overlay.classList.remove('show');
            }
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
    const fontBtn = document.getElementById('fontSelectorBtn');
    const fontDropdown = document.getElementById('fontDropdown');
    const closeBtn = document.getElementById('closeFontDropdown');
    const fontList = document.getElementById('fontList');
    
    const fonts = [
        { name: 'Segoe UI', value: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
        { name: 'Arial', value: 'Arial, sans-serif' },
        { name: 'Helvetica', value: 'Helvetica, sans-serif' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Times New Roman', value: 'Times New Roman, serif' },
        { name: 'Courier New', value: 'Courier New, monospace' },
        { name: 'Verdana', value: 'Verdana, sans-serif' },
        { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
        { name: 'Impact', value: 'Impact, sans-serif' },
        { name: 'Roboto', value: 'Roboto, sans-serif' },
        { name: 'Open Sans', value: 'Open Sans, sans-serif' },
        { name: 'Lato', value: 'Lato, sans-serif' },
        { name: 'Montserrat', value: 'Montserrat, sans-serif' },
        { name: 'Poppins', value: 'Poppins, sans-serif' },
        { name: 'Inter', value: 'Inter, sans-serif' },
        { name: 'Ubuntu', value: 'Ubuntu, sans-serif' },
        { name: 'Fira Code', value: 'Fira Code, monospace' },
        { name: 'JetBrains Mono', value: 'JetBrains Mono, monospace' },
        { name: 'Consolas', value: 'Consolas, monospace' },
        { name: 'System UI', value: 'system-ui, sans-serif' }
    ];
    
    // Render font list
    fonts.forEach(font => {
        const fontItem = document.createElement('div');
        fontItem.className = 'font-item';
        fontItem.textContent = font.name;
        fontItem.style.fontFamily = font.value;
        fontItem.dataset.font = font.value;
        
        fontItem.addEventListener('click', () => {
            applyFont(font.value);
            updateFontSelection(fontItem);
            fontDropdown.classList.remove('show');
        });
        
        fontList.appendChild(fontItem);
    });
    
    // Toggle dropdown
    fontBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDropdown('colorDropdown');
        closeDropdown('wallpaperDropdown');
        closeDropdown('musicDropdown');
        fontDropdown.classList.toggle('show');
    });
    
    // Close dropdown
    closeBtn.addEventListener('click', () => fontDropdown.classList.remove('show'));
    
    // Close on outside click
    setupOutsideClickHandler(fontDropdown, fontBtn);
    
    // Load saved font
    const savedFont = localStorage.getItem('selectedFont') || 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
    applyFont(savedFont);
    updateFontSelectionByValue(savedFont);
}

function applyFont(fontFamily) {
    document.body.style.fontFamily = fontFamily;
    localStorage.setItem('selectedFont', fontFamily);
}

function updateFontSelection(selectedItem) {
    document.querySelectorAll('.font-item').forEach(item => {
        item.classList.remove('selected');
    });
    selectedItem.classList.add('selected');
}

function updateFontSelectionByValue(fontValue) {
    const fontItem = document.querySelector(`[data-font="${fontValue}"]`);
    if (fontItem) {
        updateFontSelection(fontItem);
    }
}

// ===== COLOR SYSTEM =====
function initializeColor() {
    const colorBtn = document.getElementById('colorSelectorBtn');
    const colorDropdown = document.getElementById('colorDropdown');
    const closeBtn = document.getElementById('closeColorDropdown');
    const colorGrid = document.getElementById('colorGrid');
    const colorPreview = document.getElementById('colorPreview');
    
    // Colors in chromatic order (rainbow spectrum)
    const colors = [
        { name: 'Red', value: 'red', color: '#dc2626' },
        { name: 'Orange', value: 'orange', color: '#ea580c' },
        { name: 'Yellow', value: 'yellow', color: '#eab308' },
        { name: 'Green', value: 'green', color: '#16a34a' },
        { name: 'Aquamarine', value: 'aquamarine', color: '#14b8a6' },
        { name: 'Cyan', value: 'cyan', color: '#06b6d4' },
        { name: 'Blue', value: 'blue', color: '#2563eb' },
        { name: 'Purple', value: 'purple', color: '#9333ea' },
        { name: 'Pink', value: 'pink', color: '#ec4899' }
    ];
    
    // Render color grid
    colors.forEach(color => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.style.background = color.color;
        colorItem.dataset.color = color.value;
        colorItem.dataset.name = color.name;
        
        colorItem.addEventListener('click', () => {
            applyColorTheme(color.value);
            updateColorSelection(colorItem);
            updateColorPreview(color.color);
            colorDropdown.classList.remove('show');
        });
        
        colorGrid.appendChild(colorItem);
    });
    
    // Toggle dropdown
    colorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDropdown('fontDropdown');
        closeDropdown('wallpaperDropdown');
        closeDropdown('musicDropdown');
        colorDropdown.classList.toggle('show');
    });
    
    // Close dropdown
    closeBtn.addEventListener('click', () => colorDropdown.classList.remove('show'));
    
    // Close on outside click
    setupOutsideClickHandler(colorDropdown, colorBtn);
    
    // Load saved color
    const savedColor = localStorage.getItem('colorTheme') || 'red';
    applyColorTheme(savedColor);
    updateColorSelectionByValue(savedColor);
    
    const savedColorData = colors.find(c => c.value === savedColor);
    if (savedColorData) {
        updateColorPreview(savedColorData.color);
    }
}

function applyColorTheme(colorTheme) {
    document.body.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem('colorTheme', colorTheme);
}

function updateColorSelection(selectedItem) {
    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.remove('selected');
    });
    selectedItem.classList.add('selected');
}

function updateColorSelectionByValue(colorValue) {
    const colorItem = document.querySelector(`[data-color="${colorValue}"]`);
    if (colorItem) {
        updateColorSelection(colorItem);
    }
}

function updateColorPreview(color) {
    const colorPreview = document.getElementById('colorPreview');
    if (colorPreview) {
        colorPreview.style.background = color;
    }
}

// Berry Calculator Integration
async function initializeBerryCalculator() {
    try {
        await window.berryCalculator.init();
    } catch (error) {
    }
}

// PVP Teams Integration
async function initializePVPTeams() {
    try {
        await window.pvpTeams.init();
    } catch (error) {
    }
}

// ===== AUTHENTICATION SYSTEM =====
function checkAuthenticationAndRender() {
    const isAuthenticated = window.authManager.isAuthenticated();
    const authCard = document.getElementById('authCard');
    const mainCard = document.getElementById('mainCard');
    const userPillContainer = document.getElementById('userPillContainer');
    
    if (isAuthenticated) {
        authCard.style.display = 'none';
        mainCard.style.display = 'block';
        updateUserPill();
    } else {
        authCard.style.display = 'block';
        mainCard.style.display = 'none';
        updateUserPill();
    }
    
    // Re-renderizar componentes que dependen de autenticación
    reRenderAuthenticationDependentComponents();
}

/**
 * Re-renderizar componentes que dependen del estado de autenticación
 */
async function reRenderAuthenticationDependentComponents() {
    try {
        // Berry Calculator
        if (window.berryUI && window.berryUI.checkAuthenticationAndReRender) {
            await window.berryUI.checkAuthenticationAndReRender();
        }
        
        // PVP Teams
        if (window.pvpTeamsUI && window.pvpTeamsUI.updateTranslations) {
            await window.pvpTeamsUI.updateTranslations();
        }
    } catch (error) {
    }
}

function initializeAuth() {
    // Auth Tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchAuthTab(tab.dataset.authTab);
        });
    });
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        setupRegisterValidation();
        setupLoginValidation();
    } else {
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', handleLogout);
    
    // Dropdown Login Button
    const dropdownLoginBtn = document.getElementById('dropdownLoginBtn');
    if (dropdownLoginBtn) {
        dropdownLoginBtn.addEventListener('click', () => {
            switchAuthTab('login');
            document.getElementById('authCard').style.display = 'block';
            document.getElementById('mainCard').style.display = 'none';
        });
    } else {
    }
    
    // User Pill Dropdown
    const userPillBtn = document.getElementById('userPillBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    userPillBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Solo mostrar dropdown si hay usuario logueado
        if (!window.authManager.isAuthenticated()) {
            return;
        }
        closeDropdown('musicDropdown');
        closeDropdown('wallpaperDropdown');
        closeDropdown('fontDropdown');
        closeDropdown('colorDropdown');
        userDropdown.classList.toggle('show');
    });
    
    // Close user dropdown on outside click
    setupOutsideClickHandler(userDropdown, userPillBtn);
}

// Configurar validación en tiempo real para el formulario de registro
function setupRegisterValidation() {
    const usernameInput = document.getElementById('registerUsername');
    const passwordInput = document.getElementById('registerPassword');
    const submitBtn = document.getElementById('registerSubmitBtn');
    
    function validateForm() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Validar username (3-20 caracteres, alfanumérico)
        const usernameValid = username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(username);
        
        // Validar password (mínimo 4 caracteres)
        const passwordValid = password.length >= 4;
        
        const formValid = usernameValid && passwordValid;
        
        // Limpiar mensajes de error cuando el usuario empiece a escribir
        const messageEl = document.getElementById('registerMessage');
        if (messageEl && (username || password)) {
            messageEl.innerHTML = '';
            messageEl.className = 'auth-message';
        }
        
        // Habilitar/deshabilitar botón
        submitBtn.disabled = !formValid;
        
        // Cambiar estilo del botón
        if (formValid) {
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
        }
    }
    
    // Añadir event listeners
    usernameInput.addEventListener('input', validateForm);
    passwordInput.addEventListener('input', validateForm);
    
    // Validación inicial
    validateForm();
}

function setupLoginValidation() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    
    function clearMessages() {
        const messageEl = document.getElementById('loginMessage');
        if (messageEl) {
            messageEl.innerHTML = '';
            messageEl.className = 'auth-message';
        }
    }
    
    // Añadir event listeners para limpiar mensajes
    usernameInput.addEventListener('input', clearMessages);
    passwordInput.addEventListener('input', clearMessages);
}

function switchAuthTab(tabName) {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authPanes = document.querySelectorAll('.auth-pane');
    
    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.authTab === tabName);
    });
    
    authPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `${tabName}Pane`);
    });
    
    // Limpiar mensajes al cambiar de tab
    document.getElementById('loginMessage').textContent = '';
    document.getElementById('registerMessage').textContent = '';
}

// ===== VALIDACIÓN DE FORMULARIOS =====

function validateLoginForm() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');
    
    // Limpiar mensajes anteriores
    messageEl.innerHTML = '';
    messageEl.className = 'auth-message';
    
    const errors = [];
    
    // Validar username
    if (!username) {
        errors.push(window.languageManager.t('auth.validationErrors.usernameRequired'));
    }
    
    // Validar password
    if (!password) {
        errors.push(window.languageManager.t('auth.validationErrors.passwordRequired'));
    }
    
    // Mostrar errores si los hay
    if (errors.length > 0) {
        messageEl.className = 'auth-message error';
        messageEl.innerHTML = errors.join('<br>');
        return false;
    }
    
    return true;
}

function validateRegisterForm() {
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value.trim();
    const messageEl = document.getElementById('registerMessage');
    
    // Limpiar mensajes anteriores
    messageEl.innerHTML = '';
    messageEl.className = 'auth-message';
    
    const errors = [];
    
    // Validar username
    if (!username) {
        errors.push(window.languageManager.t('auth.validationErrors.usernameRequired'));
    } else if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push(window.languageManager.t('auth.validationErrors.usernameInvalid'));
    }
    
    // Validar password
    if (!password) {
        errors.push(window.languageManager.t('auth.validationErrors.passwordRequired'));
    } else if (password.length < 4) {
        errors.push(window.languageManager.t('auth.validationErrors.passwordTooShort'));
    }
    
    // Validar email (opcional pero si se proporciona debe ser válido)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push(window.languageManager.t('auth.validationErrors.emailInvalid'));
    }
    
    // Mostrar errores si los hay
    if (errors.length > 0) {
        messageEl.className = 'auth-message error';
        messageEl.innerHTML = errors.join('<br>');
        return false;
    }
    
    return true;
}

async function handleLogin(e) {
    e.preventDefault();
    
    if (!validateLoginForm()) {
        return;
    }
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');
    
    messageEl.textContent = '';
    messageEl.className = 'auth-message';
    
    try {
        const result = await window.authManager.login(username, password);
        
        if (result.success) {
            messageEl.className = 'auth-message success';
            messageEl.textContent = result.message;
            
            setTimeout(() => {
                checkAuthenticationAndRender();
                translateAuthUI();
                // Forzar re-renderizado de componentes después del login
                reRenderAuthenticationDependentComponents();
            }, 500);
        } else {
            messageEl.className = 'auth-message error';
            messageEl.textContent = result.message;
        }
    } catch (error) {
        messageEl.className = 'auth-message error';
        messageEl.textContent = 'Error inesperado. Inténtalo de nuevo.';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
        return;
    }
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value.trim();
    const messageEl = document.getElementById('registerMessage');
    
    messageEl.textContent = '';
    messageEl.className = 'auth-message';
    
    try {
        const result = await window.authManager.register(username, password, email);
        
        if (result.success) {
            messageEl.className = 'auth-message success';
            messageEl.textContent = result.message;
            
            setTimeout(() => {
                checkAuthenticationAndRender();
                translateAuthUI();
                // Forzar re-renderizado de componentes después del login
                reRenderAuthenticationDependentComponents();
            }, 500);
        } else {
            messageEl.className = 'auth-message error';
            messageEl.textContent = result.message;
        }
    } catch (error) {
        messageEl.className = 'auth-message error';
        messageEl.textContent = 'Error inesperado. Inténtalo de nuevo.';
    }
}

function handleLogout() {
    const result = window.authManager.logout();
    
    // Cerrar dropdown
    document.getElementById('userDropdown').classList.remove('show');
    
    // Recargar vista
    checkAuthenticationAndRender();
    translateAuthUI(); // Actualizar traducciones
    // Re-renderizar componentes después del logout
    reRenderAuthenticationDependentComponents();
}

function updateUserPill() {
    const userPillContainer = document.getElementById('userPillContainer');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const userDropdownName = document.getElementById('userDropdownName');
    const userDropdownEmail = document.getElementById('userDropdownEmail');
    const dropdownLoginBtn = document.getElementById('dropdownLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const user = window.authManager.getCurrentUser();
    
    if (user) {
        // Usuario logueado - mostrar datos del usuario
        usernameDisplay.textContent = user.username;
        userDropdownName.textContent = user.username;
        userDropdownEmail.textContent = user.email || 
            (window.languageManager.getCurrentLanguage() === 'es' ? 'Sin email' : 'No email');
        
        // Mostrar botón de logout, ocultar botón de login
        dropdownLoginBtn.style.display = 'none';
        logoutBtn.style.display = 'flex';
        
        // Cambiar estilo para usuario logueado
        userPillContainer.classList.remove('user-pill-no-user');
        userPillContainer.classList.add('user-pill-logged-in');
    } else {
        // Sin usuario - mostrar estado "no conectado"
        const noUserText = window.languageManager.getCurrentLanguage() === 'es' 
            ? 'No conectado' 
            : 'Not connected';
        
        usernameDisplay.textContent = noUserText;
        userDropdownName.textContent = noUserText;
        userDropdownEmail.textContent = window.languageManager.getCurrentLanguage() === 'es' 
            ? 'Inicia sesión para ver tu perfil' 
            : 'Login to see your profile';
        
        // Mostrar botón de login, ocultar botón de logout
        dropdownLoginBtn.style.display = 'flex';
        logoutBtn.style.display = 'none';
        
        // Cambiar estilo para usuario no logueado
        userPillContainer.classList.remove('user-pill-logged-in');
        userPillContainer.classList.add('user-pill-no-user');
    }
}

function translateAuthUI() {
    const lm = window.languageManager;
    const lang = lm.getCurrentLanguage();
    
    // Auth card title y subtitle
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    if (authTitle) authTitle.textContent = lm.t('auth.title');
    if (authSubtitle) authSubtitle.textContent = lm.t('auth.subtitle');
    
    // Auth tabs
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    if (loginTab) loginTab.textContent = lm.t('auth.loginTab');
    if (registerTab) registerTab.textContent = lm.t('auth.registerTab');
    
    // Login form labels
    const loginUsernameLabelText = document.getElementById('loginUsernameLabelText');
    const loginPasswordLabelText = document.getElementById('loginPasswordLabelText');
    const loginSubmitBtnText = document.getElementById('loginSubmitBtnText');
    if (loginUsernameLabelText) loginUsernameLabelText.textContent = lm.t('auth.username');
    if (loginPasswordLabelText) loginPasswordLabelText.textContent = lm.t('auth.password');
    if (loginSubmitBtnText) loginSubmitBtnText.textContent = lm.t('auth.loginButton');
    
    // Register form labels
    const registerUsernameLabelText = document.getElementById('registerUsernameLabelText');
    const registerPasswordLabelText = document.getElementById('registerPasswordLabelText');
    const registerEmailLabelText = document.getElementById('registerEmailLabelText');
    const registerEmailOptional = document.getElementById('registerEmailOptional');
    const registerSubmitBtnText = document.getElementById('registerSubmitBtnText');
    if (registerUsernameLabelText) registerUsernameLabelText.textContent = lm.t('auth.username');
    if (registerPasswordLabelText) registerPasswordLabelText.textContent = lm.t('auth.password');
    if (registerEmailLabelText) registerEmailLabelText.textContent = lm.t('auth.email');
    if (registerEmailOptional) registerEmailOptional.textContent = lm.t('auth.optional');
    if (registerSubmitBtnText) registerSubmitBtnText.textContent = lm.t('auth.registerButton');
    
    // Help texts
    const usernameHelp = document.getElementById('usernameHelp');
    const passwordHelp = document.getElementById('passwordHelp');
    if (usernameHelp) usernameHelp.textContent = lm.t('auth.usernameHelp');
    if (passwordHelp) passwordHelp.textContent = lm.t('auth.passwordHelp');
    
    // Logout button
    const logoutBtnText = document.getElementById('logoutBtnText');
    const dropdownLoginBtnText = document.getElementById('dropdownLoginBtnText');
    if (logoutBtnText) logoutBtnText.textContent = lm.t('auth.logout');
    if (dropdownLoginBtnText) dropdownLoginBtnText.textContent = lm.t('auth.loginButton');
    
    // Update user pill if authenticated
    if (window.authManager.isAuthenticated()) {
        updateUserPill();
    }
}

// ===== PÁGINA DE INICIO =====
function initializeHomePage() {
    const titleLogo = document.getElementById('titleLogo');
    if (titleLogo) {
        titleLogo.addEventListener('click', showHomePage);
    }
    
    // La página home ya está como tab-pane activo por defecto
}

// ===== MENÚ HAMBURGUESA =====
function initializeHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerMenuBtn');
    const hamburgerDropdown = document.getElementById('hamburgerMenuDropdown');
    
    if (!hamburgerBtn || !hamburgerDropdown) return;
    
    // Clonar user pill al contenedor móvil
    cloneUserPillToMobile();
    
    // Toggle menú
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerDropdown.classList.toggle('show');
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!hamburgerDropdown.contains(e.target) && e.target !== hamburgerBtn) {
            hamburgerDropdown.classList.remove('show');
        }
    });
    
    // Sincronizar estado inicial
    syncHamburgerMenu();
    
    // Event listeners para los botones del menú hamburguesa
    setupHamburgerMenuListeners();
    
    // Traducir textos del menú
    translateHamburgerMenu();
}

function cloneUserPillToMobile() {
    const userPillContainer = document.getElementById('userPillContainer');
    const userPillContainerMobile = document.getElementById('userPillContainerMobile');
    
    if (userPillContainer && userPillContainerMobile) {
        // Clonar el contenido completo del user pill
        userPillContainerMobile.innerHTML = userPillContainer.innerHTML;
        
        // Re-inicializar los event listeners para el user pill clonado
        const clonedBtn = userPillContainerMobile.querySelector('.user-pill-btn');
        const clonedDropdown = userPillContainerMobile.querySelector('.user-dropdown');
        
        if (clonedBtn && clonedDropdown) {
            clonedBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clonedDropdown.classList.toggle('show');
            });
        }
    }
}

function syncHamburgerMenu() {
    // Sincronizar color preview
    const colorPreview = document.getElementById('colorPreview');
    const hamburgerColorPreview = document.getElementById('hamburgerColorPreview');
    if (colorPreview && hamburgerColorPreview) {
        hamburgerColorPreview.style.backgroundColor = colorPreview.style.backgroundColor;
    }
    
    // Sincronizar icono de idioma
    const languageIcon = document.getElementById('languageIcon');
    const hamburgerLanguageIcon = document.getElementById('hamburgerLanguageIcon');
    if (languageIcon && hamburgerLanguageIcon) {
        hamburgerLanguageIcon.src = languageIcon.src;
    }
    
    // Sincronizar texto de tema
    const hamburgerThemeText = document.getElementById('hamburgerThemeText');
    if (hamburgerThemeText) {
        const isDark = document.body.classList.contains('dark-theme');
        hamburgerThemeText.textContent = 'Cambiar Tema';
    }
}

function setupHamburgerMenuListeners() {
    // Language - SÍ cerrar menú (no abre dropdown)
    const hamburgerLanguageBtn = document.getElementById('hamburgerLanguageBtn');
    if (hamburgerLanguageBtn) {
        hamburgerLanguageBtn.addEventListener('click', () => {
            toggleLanguage();
            syncHamburgerMenu();
            translateHamburgerMenu();
            closeHamburgerMenu();
        });
    }
    
    // Color - NO cerrar menú (abre dropdown)
    const hamburgerColorBtn = document.getElementById('hamburgerColorBtn');
    if (hamburgerColorBtn) {
        hamburgerColorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const colorBtn = document.getElementById('colorSelectorBtn');
            if (colorBtn) colorBtn.click();
            // NO cerrar menú
        });
    }
    
    // Font - NO cerrar menú (abre dropdown)
    const hamburgerFontBtn = document.getElementById('hamburgerFontBtn');
    if (hamburgerFontBtn) {
        hamburgerFontBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const fontBtn = document.getElementById('fontSelectorBtn');
            if (fontBtn) fontBtn.click();
            // NO cerrar menú
        });
    }
    
    // Theme - SÍ cerrar menú (no abre dropdown)
    const hamburgerThemeBtn = document.getElementById('hamburgerThemeBtn');
    if (hamburgerThemeBtn) {
        hamburgerThemeBtn.addEventListener('click', () => {
            toggleTheme();
            syncHamburgerMenu();
            translateHamburgerMenu();
            closeHamburgerMenu();
        });
    }
    
    // Wallpaper - NO cerrar menú (abre dropdown)
    const hamburgerWallpaperBtn = document.getElementById('hamburgerWallpaperBtn');
    if (hamburgerWallpaperBtn) {
        hamburgerWallpaperBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const wallpaperBtn = document.getElementById('wallpaperBtn');
            if (wallpaperBtn) wallpaperBtn.click();
            // NO cerrar menú
        });
    }
    
    // Music - NO cerrar menú (abre dropdown)
    const hamburgerMusicBtn = document.getElementById('hamburgerMusicBtn');
    if (hamburgerMusicBtn) {
        hamburgerMusicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const musicBtn = document.getElementById('musicBtn');
            if (musicBtn) musicBtn.click();
            // NO cerrar menú
        });
    }
}

function translateHamburgerMenu() {
    const lm = window.languageManager;
    if (!lm) return;
    
    // Language button
    const languageBtn = document.querySelector('#hamburgerLanguageBtn span');
    if (languageBtn) {
        languageBtn.textContent = lm.t('menu.changeLanguage');
    }
    
    // Color button
    const colorBtn = document.querySelector('#hamburgerColorBtn span');
    if (colorBtn) {
        colorBtn.textContent = lm.t('menu.changeColor');
    }
    
    // Font button
    const fontBtn = document.querySelector('#hamburgerFontBtn span');
    if (fontBtn) {
        fontBtn.textContent = lm.t('menu.changeFont');
    }
    
    // Theme button
    const themeText = document.getElementById('hamburgerThemeText');
    if (themeText) {
        themeText.textContent = lm.t('menu.changeTheme');
    }
    
    // Wallpaper button
    const wallpaperBtn = document.querySelector('#hamburgerWallpaperBtn span');
    if (wallpaperBtn) {
        wallpaperBtn.textContent = lm.t('menu.changeBackground');
    }
    
    // Music button
    const musicBtn = document.querySelector('#hamburgerMusicBtn span');
    if (musicBtn) {
        musicBtn.textContent = lm.t('menu.musicPlayer');
    }
}

function translateHomePage() {
    const lm = window.languageManager;
    if (!lm) return;
    
    // Header
    const homeSubtitle = document.getElementById('homeSubtitle');
    if (homeSubtitle) homeSubtitle.textContent = lm.t('home.subtitle');
    
    const homeDescription = document.getElementById('homeDescription');
    if (homeDescription) homeDescription.textContent = lm.t('home.description');
    
    // Features (6 features)
    for (let i = 1; i <= 6; i++) {
        const featureTitle = document.getElementById(`homeFeature${i}Title`);
        const featureDesc = document.getElementById(`homeFeature${i}Desc`);
        
        if (featureTitle) featureTitle.textContent = lm.t(`home.feature${i}.title`);
        if (featureDesc) featureDesc.textContent = lm.t(`home.feature${i}.desc`);
        
        // Items (features 1-4 y 6 tienen 4 items, feature 5 tiene 3)
        const itemCount = i === 5 ? 3 : 4;
        for (let j = 1; j <= itemCount; j++) {
            const item = document.getElementById(`homeFeature${i}Item${j}`);
            if (item) item.textContent = lm.t(`home.feature${i}.item${j}`);
        }
    }
    
    // Highlights (3 highlights)
    for (let i = 1; i <= 3; i++) {
        const highlightTitle = document.getElementById(`homeHighlight${i}Title`);
        const highlightDesc = document.getElementById(`homeHighlight${i}Desc`);
        
        if (highlightTitle) highlightTitle.textContent = lm.t(`home.highlight${i}.title`);
        if (highlightDesc) highlightDesc.textContent = lm.t(`home.highlight${i}.desc`);
    }
    
    // Footer
    const footer1 = document.getElementById('homeFooterText1');
    if (footer1) footer1.textContent = lm.t('home.footer1');
    
    const footer2 = document.getElementById('homeFooterText2');
    if (footer2) footer2.textContent = lm.t('home.footer2');
}

function closeHamburgerMenu() {
    const hamburgerDropdown = document.getElementById('hamburgerMenuDropdown');
    if (hamburgerDropdown) {
        hamburgerDropdown.classList.remove('show');
    }
}

function showHomePage() {
    // Ocultar todos los tab-panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Mostrar el tab-pane de home
    const homePane = document.getElementById('home');
    if (homePane) {
        homePane.classList.add('active');
    }
    
    // Remover clase active de todos los tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    // Actualizar URL sin hash
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.pathname);
    }
}