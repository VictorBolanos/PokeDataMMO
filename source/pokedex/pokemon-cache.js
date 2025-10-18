// Pokédex - Cache System for Pokemon Data
class PokemonCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 50; // Maximum Pokemon in memory
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    }
    
    // Get Pokemon from cache
    get(idOrName) {
        const key = this.normalizeKey(idOrName);
        const cached = this.cache.get(key);
        
        if (!cached) return null;
        
        // Check if expired
        if (Date.now() - cached.timestamp > this.cacheExpiry) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }
    
    // Set Pokemon in cache
    set(idOrName, data) {
        const key = this.normalizeKey(idOrName);
        
        // If cache is full, remove oldest entry
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }
    
    // Clear cache
    clear() {
        this.cache.clear();
    }
    
    // Normalize key for consistent caching
    normalizeKey(idOrName) {
        return String(idOrName).toLowerCase();
    }
}

// Global cache instance
window.pokemonCache = new PokemonCache();
