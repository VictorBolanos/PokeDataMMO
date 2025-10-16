// PokeDataMMO - Main JavaScript file

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PokeDataMMO loaded successfully!');
    
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Initialize tab system
    initializeTabs();
    
    // Initialize any other features
    initializeFeatures();
}

// Tab System - Salesforce Style
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Add click event listeners to all tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            const currentTab = document.querySelector('.nav-tab.active');
            const currentIndex = Array.from(tabs).indexOf(currentTab);
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                    tabs[prevIndex].click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    const nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                    tabs[nextIndex].click();
                    break;
            }
        }
    });
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
        
        // Add smooth transition effect
        targetPane.style.opacity = '0';
        setTimeout(() => {
            targetPane.style.opacity = '1';
        }, 50);
        
        // Update URL hash for bookmarking
        window.history.pushState(null, null, `#${targetTabId}`);
        
        // Log tab switch for analytics
        console.log(`Switched to ${targetTabId} tab`);
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchTab(hash);
    }
});

// Check for initial hash on page load
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchTab(hash);
    }
});

// Initialize other features
function initializeFeatures() {
    // Add hover effects to status cards
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
    
    // Add click animation to feature list items
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

// Utility functions for future use
const PokeDataMMO = {
    // Tab management
    tabs: {
        switchTo: function(tabId) {
            switchTab(tabId);
        },
        
        getCurrentTab: function() {
            const activeTab = document.querySelector('.nav-tab.active');
            return activeTab ? activeTab.getAttribute('data-tab') : null;
        },
        
        getAllTabs: function() {
            return Array.from(document.querySelectorAll('.nav-tab')).map(tab => ({
                id: tab.getAttribute('data-tab'),
                text: tab.querySelector('.tab-text').textContent,
                icon: tab.querySelector('.tab-icon').textContent
            }));
        }
    },
    
    // Future breeding calculator functions
    breedingCalculator: {
        calculateBreedingPath: function(targetPokemon) {
            console.log('Breeding calculator - Coming soon!');
            return null;
        }
    },
    
    // Future PVP team management
    pvpTeams: {
        analyzeTeam: function(team) {
            console.log('PVP team analyzer - Coming soon!');
            return null;
        }
    },
    
    // Future progression tracker
    progressionTracker: {
        trackProgress: function(character, region) {
            console.log('Progression tracker - Coming soon!');
            return null;
        }
    },
    
    // Utility function to fetch data from PokeAPI
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
    },
    
    // Theme management for future image backgrounds
    theme: {
        currentBackground: 'black',
        
        setBackground: function(backgroundType) {
            this.currentBackground = backgroundType;
            document.body.style.background = this.getBackgroundStyle(backgroundType);
        },
        
        getBackgroundStyle: function(type) {
            const backgrounds = {
                'black': '#000',
                'gradient': 'linear-gradient(135deg, #dc2626 0%, #16a34a 100%)',
                'pokemon': 'url("img/pokemon-bg.jpg") center/cover'
            };
            return backgrounds[type] || backgrounds['black'];
        }
    }
};

// Export for future modules (when we add module system)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PokeDataMMO;
}

// Make PokeDataMMO available globally for debugging
window.PokeDataMMO = PokeDataMMO;
