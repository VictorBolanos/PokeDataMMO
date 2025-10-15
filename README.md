# PokeDataMMO
A personal Wiki and Utilities for Pokemmo gameplay

https://victorbolanos.github.io/PokeDataMMO


PRUEBA HTML:

<!DOCTYPE html>
<html>
<head>
    <title>Calculadora Pokémon</title>
    <style>
        .stat-container { margin: 10px 0; }
        input { width: 60px; margin: 0 5px; }
    </style>
</head>
<body>
    <h1>Calculadora de Stats Pokémon</h1>
    
    <div>
        <label>Pokémon: </label>
        <select id="pokemonSelect">
            <option value="charizard">Charizard</option>
            <option value="pikachu">Pikachu</option>
            <!-- Más opciones -->
        </select>
    </div>

    <div>
        <label>Nivel: </label>
        <input type="number" id="nivel" value="50" min="1" max="100">
    </div>

    <!-- Controles para EVs e IVs -->
    <div class="stat-container">
        <h3>EVs / IVs</h3>
        <div>HP: EV <input type="number" id="ev-hp" value="0"> IV <input type="number" id="iv-hp" value="31"></div>
        <div>Ataque: EV <input type="number" id="ev-ataque" value="0"> IV <input type="number" id="iv-ataque" value="31"></div>
        <!-- ... otros stats -->
    </div>

    <div>
        <label>Naturaleza: </label>
        <select id="naturaleza">
            <option value="neutral">Neutral</option>
            <option value="modesta">Modesta (+AtEsp, -At)</option>
            <!-- Más naturalezas -->
        </select>
    </div>

    <button onclick="calcularStats()">Calcular Stats</button>

    <div id="resultados"></div>

    <script>
        // Tu código JavaScript aquí
        const baseStats = {
            charizard: { hp: 78, ataque: 84, defensa: 78, ataqueEspecial: 109, defensaEspecial: 85, velocidad: 100 },
            pikachu: { hp: 35, ataque: 55, defensa: 40, ataqueEspecial: 50, defensaEspecial: 50, velocidad: 90 }
        };

        const naturalezas = {
            neutral: { ataque: 1.0, defensa: 1.0, ataqueEspecial: 1.0, defensaEspecial: 1.0, velocidad: 1.0 },
            modesta: { ataque: 0.9, defensa: 1.0, ataqueEspecial: 1.1, defensaEspecial: 1.0, velocidad: 1.0 }
        };

        function calcularStats() {
            // Implementar cálculo aquí
        }
    </script>
</body>
</html>
