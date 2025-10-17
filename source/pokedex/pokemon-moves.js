// Pokédex - Moves Component
class PokemonMoves {
    constructor(pokemonData) {
        this.pokemon = pokemonData;
        this.movesCache = new Map();
    }
    
    async getMovesByType(type) {
        const cacheKey = `${this.pokemon.id}-${type}`;
        
        if (this.movesCache.has(cacheKey)) {
            return this.movesCache.get(cacheKey);
        }
        
        try {
            const moves = await this.fetchMovesByType(type);
            this.movesCache.set(cacheKey, moves);
            return moves;
        } catch (error) {
            console.error(`Error loading ${type} moves:`, error);
            return [];
        }
    }
    
    async fetchMovesByType(type) {
        // Filter moves based on type
        const filteredMoves = this.pokemon.moves.filter(move => {
            const versionDetails = move.version_group_details;
            return versionDetails.some(detail => {
                switch (type) {
                    case 'level-up':
                        return detail.move_learn_method.name === 'level-up';
                    case 'tm-hm':
                        return detail.move_learn_method.name === 'machine';
                    case 'tutor':
                        return detail.move_learn_method.name === 'tutor';
                    case 'egg':
                        return detail.move_learn_method.name === 'egg';
                    default:
                        return false;
                }
            });
        });
        
        // Get move details for Generation V (black-white)
        const movePromises = filteredMoves.slice(0, 100).map(async moveData => {
            try {
                const move = await PokemonAPI.getMove(moveData.move.name);
                const learnDetails = moveData.version_group_details.filter(
                    detail => detail.version_group.name === 'black-white'
                );
                
                return {
                    ...move,
                    learnDetails: learnDetails,
                    moveData: moveData
                };
            } catch (error) {
                return null;
            }
        });
        
        const moves = await Promise.all(movePromises);
        return moves.filter(move => move !== null);
    }
    
    renderMovesList(moves, type) {
        if (moves.length === 0) {
            return `
                <div class="text-center text-muted">
                    No ${type} moves found for this Pokémon.
                </div>
            `;
        }
        
        // Sort moves appropriately
        moves = this.sortMoves(moves, type);
        
        const movesHTML = moves.map(move => `
            <div class="move-item">
                <div class="move-header">
                    <div class="move-name">${this.capitalizeFirst(move.name.replace('-', ' '))}</div>
                    <div class="move-details">
                        <div class="move-type">
                            <img src="img/res/poke-types/box/type-${move.type.name}-box-icon.png" alt="${move.type.name}">
                            <span>${move.type.name}</span>
                        </div>
                        <img src="img/res/atack-class-icons/${move.damage_class.name}-class-mini.png" 
                             alt="${move.damage_class.name}" 
                             class="move-class">
                        <span class="move-power">${move.power || '-'}</span>
                        <span class="move-pp">${move.pp} PP</span>
                    </div>
                </div>
                <div class="move-description">${this.getMoveDescription(move)}</div>
                <div class="move-learn-method">${this.getLearnMethod(move, type)}</div>
            </div>
        `).join('');
        
        return `
            <div class="moves-list">${movesHTML}</div>
        `;
    }
    
    sortMoves(moves, type) {
        switch (type) {
            case 'level-up':
                // Sort by level learned
                return moves.sort((a, b) => {
                    const aLevel = a.learnDetails[0]?.level_learned_at || 999;
                    const bLevel = b.learnDetails[0]?.level_learned_at || 999;
                    return aLevel - bLevel;
                });
            case 'tm-hm':
                // Sort by TM/HM number
                return moves.sort((a, b) => {
                    const aTm = this.extractTmNumber(a.learnDetails[0]?.move_learn_method?.name || '');
                    const bTm = this.extractTmNumber(b.learnDetails[0]?.move_learn_method?.name || '');
                    return aTm - bTm;
                });
            default:
                // Sort alphabetically
                return moves.sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    
    getLearnMethod(move, type) {
        const learnDetails = move.learnDetails[0];
        if (!learnDetails) return '';
        
        switch (type) {
            case 'level-up':
                return `Level ${learnDetails.level_learned_at}`;
            case 'tm-hm':
                return `TM${this.extractTmNumber(learnDetails.move_learn_method.name)}`;
            case 'tutor':
                return 'Move Tutor';
            case 'egg':
                return 'Egg Move';
            default:
                return learnDetails.move_learn_method.name;
        }
    }
    
    extractTmNumber(methodName) {
        const match = methodName.match(/tm(\d+)/i);
        return match ? parseInt(match[1]) : 999;
    }
    
    getMoveDescription(move) {
        const englishEffect = move.effect_entries.find(entry => entry.language.name === 'en');
        return englishEffect ? englishEffect.short_effect : 'No description available';
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
