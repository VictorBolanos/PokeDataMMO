const itemsData = [
    {
        "id": "000",
        "EnglishName": "Select an Item",
        "SpanishName": "Seleccionar un objeto",
        "description": "No description"
    },
    {
        "id": "001",
        "EnglishName": "Master Ball",
        "SpanishName": "Master Ball",
        "description": "The best Poké Ball with the ultimate\nlevel of performance. With it, you will\ncatch any wild Pokémon without fail."
    },
    {
        "id": "002",
        "EnglishName": "Ultra Ball",
        "SpanishName": "Ultra Ball",
        "description": "An ultra-high-performance Poké Ball\nthat provides a higher success rate for\ncatching Pokémon than a Great Ball."
    },
    {
        "id": "003",
        "EnglishName": "Great Ball",
        "SpanishName": "Super Ball",
        "description": "A good, high-performance Poké Ball\nthat provides a higher Pokémon catch\nrate than a standard Poké Ball can."
    },
    {
        "id": "004",
        "EnglishName": "Poké Ball",
        "SpanishName": "Poké Ball",
        "description": "A device for catching wild Pokémon.\nIt’s thrown like a ball at a Pokémon,\ncomfortably encapsulating its target."
    },
    {
        "id": "005",
        "EnglishName": "Safari Ball",
        "SpanishName": "Safari Ball",
        "description": "A special Poké Ball that is used only in\nthe Great Marsh. It is recognizable by\nthe camouflage pattern decorating it."
    },
    {
        "id": "006",
        "EnglishName": "Net Ball",
        "SpanishName": "Ball Red",
        "description": "A somewhat different Poké Ball that\nis more effective when attempting\nto catch Water- or Bug-type Pokémon."
    },
    {
        "id": "007",
        "EnglishName": "Dive Ball",
        "SpanishName": "Ball Dive",
        "description": "A somewhat different Poké Ball that\nworks especially well when catching\nPokémon that live underwater."
    },
    {
        "id": "008",
        "EnglishName": "Nest Ball",
        "SpanishName": "Ball Nido",
        "description": "A somewhat different Poké Ball that\nbecomes more effective the lower\nthe level of the wild Pokémon."
    },
    {
        "id": "009",
        "EnglishName": "Repeat Ball",
        "SpanishName": "Ball Repetición",
        "description": "A somewhat different Poké Ball that\nworks especially well on a Pokémon\nspecies that has been caught before."
    },
    {
        "id": "010",
        "EnglishName": "Timer Ball",
        "SpanishName": "Ball Timer",
        "description": "A somewhat different Poké Ball that\nbecomes progressively more effective\nthe more turns that are taken in battle."
    },
    {
        "id": "011",
        "EnglishName": "Luxury Ball",
        "SpanishName": "Ball Lujo",
        "description": "A particularly comfortable Poké Ball\nthat makes a wild Pokémon quickly\ngrow friendlier after being caught."
    },
    {
        "id": "012",
        "EnglishName": "Premier Ball",
        "SpanishName": "Ball Premier",
        "description": "A somewhat rare Poké Ball that was\nmade as a commemorative item used\nto celebrate an event of some sort."
    },
    {
        "id": "013",
        "EnglishName": "Dusk Ball",
        "SpanishName": "Ball Sombra",
        "description": "A somewhat different Poké Ball that\nmakes it easier to catch wild Pokémon\nat night or in dark places like caves."
    },
    {
        "id": "014",
        "EnglishName": "Heal Ball",
        "SpanishName": "Ball Curación",
        "description": "A remedial Poké Ball that restores\nthe HP of a Pokémon caught with it\nand eliminates any status conditions."
    },
    {
        "id": "015",
        "EnglishName": "Quick Ball",
        "SpanishName": "Ball Veloz",
        "description": "A somewhat different Poké Ball that\nhas a more successful catch rate if\nused at the start of a wild encounter."
    },
    {
        "id": "016",
        "EnglishName": "Cherish Ball",
        "SpanishName": "Ball Preciosa",
        "description": "A quite rare Poké Ball that has been\ncrafted in order to commemorate\na special occasion of some sort."
    },
    {
        "id": "017",
        "EnglishName": "Potion",
        "SpanishName": "Poción",
        "description": "A spray-type medicine for treating\nwounds. It can be used to restore\n20 HP to an injured Pokémon."
    },
    {
        "id": "018",
        "EnglishName": "Antidote",
        "SpanishName": "Antídoto",
        "description": "A spray-type medicine for poisoning.\nIt can be used once to lift the effects\nof being poisoned from a Pokémon."
    },
    {
        "id": "019",
        "EnglishName": "Burn Heal",
        "SpanishName": "Antiquemar",
        "description": "A spray-type medicine for treating\nburns. It can be used once to heal\na Pokémon suffering from a burn."
    },
    {
        "id": "020",
        "EnglishName": "Ice Heal",
        "SpanishName": "Antihielo",
        "description": "A spray-type medicine for freezing.\nIt can be used once to defrost a\nPokémon that has been frozen solid."
    },
    {
        "id": "021",
        "EnglishName": "Awakening",
        "SpanishName": "Despertar",
        "description": "A spray-type medicine used against\nsleep. It can be used once to rouse a\nPokémon from the clutches of sleep."
    },
    {
        "id": "022",
        "EnglishName": "Paralyze Heal",
        "SpanishName": "Antiparalizador",
        "description": "A spray-type medicine for paralysis.\nIt can be used once to free a\nPokémon that has been paralyzed."
    },
    {
        "id": "023",
        "EnglishName": "Full Restore",
        "SpanishName": "Restaurar Todo",
        "description": "A medicine that can be used to fully\nrestore the HP of a single Pokémon\nand heal any status conditions it has."
    },
    {
        "id": "024",
        "EnglishName": "Max Potion",
        "SpanishName": "Máxima Poción",
        "description": "A spray-type medicine for treating\nwounds. It will completely restore\nthe max HP of a single Pokémon."
    },
    {
        "id": "025",
        "EnglishName": "Hyper Potion",
        "SpanishName": "Hiperpoción",
        "description": "A spray-type medicine for treating\nwounds. It can be used to restore\n200 HP to an injured Pokémon."
    },
    {
        "id": "026",
        "EnglishName": "Super Potion",
        "SpanishName": "Superpoción",
        "description": "A spray-type medicine for treating\nwounds. It can be used to restore\n50 HP to an injured Pokémon."
    },
    {
        "id": "027",
        "EnglishName": "Full Heal",
        "SpanishName": "Curación Total",
        "description": "A spray-type medicine that is broadly\neffective. It can be used once to heal\nall the status conditions of a Pokémon."
    },
    {
        "id": "028",
        "EnglishName": "Revive",
        "SpanishName": "Revivir",
        "description": "A medicine that can revive fainted\nPokémon. It also restores half of\na fainted Pokémon’s maximum HP."
    },
    {
        "id": "029",
        "EnglishName": "Max Revive",
        "SpanishName": "Revivir Máximo",
        "description": "A medicine that can revive fainted\nPokémon. It also fully restores a\nfainted Pokémon’s maximum HP."
    },
    {
        "id": "030",
        "EnglishName": "Fresh Water",
        "SpanishName": "Agua Fresca",
        "description": "Water with a high mineral content.\nWhen consumed, it restores\n50 HP to an injured Pokémon."
    },
    {
        "id": "031",
        "EnglishName": "Soda Pop",
        "SpanishName": "Refresco",
        "description": "A highly carbonated soda drink.\nWhen consumed, it restores\n60 HP to an injured Pokémon."
    },
    {
        "id": "032",
        "EnglishName": "Lemonade",
        "SpanishName": "Limonada",
        "description": "A very sweet and refreshing drink.\nWhen consumed, it restores\n80 HP to an injured Pokémon."
    },
    {
        "id": "033",
        "EnglishName": "Moomoo Milk",
        "SpanishName": "Leche Mu-mu",
        "description": "A bottle of highly nutritious milk.\nWhen consumed, it restores\n100 HP to an injured Pokémon."
    },
    {
        "id": "034",
        "EnglishName": "Energy Powder",
        "SpanishName": "Polvo Energía",
        "description": "A bitter medicine powder.\nWhen consumed, it restores\n50 HP to an injured Pokémon."
    },
    {
        "id": "035",
        "EnglishName": "Energy Root",
        "SpanishName": "Raíz Energía",
        "description": "An extremely bitter medicinal root.\nWhen consumed, it restores\n200 HP to an injured Pokémon."
    },
    {
        "id": "036",
        "EnglishName": "Heal Powder",
        "SpanishName": "Polvo Curación",
        "description": "A very bitter medicine powder.\nWhen consumed, it heals all of\na Pokémon’s status conditions."
    },
    {
        "id": "037",
        "EnglishName": "Revival Herb",
        "SpanishName": "Hierba Revivir",
        "description": "A terribly bitter medicinal herb.\nIt revives a fainted Pokémon and\nfully restores its maximum HP."
    },
    {
        "id": "038",
        "EnglishName": "Ether",
        "SpanishName": "Éter",
        "description": "This medicine can restore 10 PP\nto a single selected move that\nhas been learned by a Pokémon."
    },
    {
        "id": "039",
        "EnglishName": "Max Ether",
        "SpanishName": "Éter Máximo",
        "description": "This medicine can fully restore the\nPP of a single selected move that\nhas been learned by a Pokémon."
    },
    {
        "id": "040",
        "EnglishName": "Elixir",
        "SpanishName": "Elixir",
        "description": "This medicine can restore 10 PP\nto each of the moves that have\nbeen learned by a Pokémon."
    },
    {
        "id": "041",
        "EnglishName": "Max Elixir",
        "SpanishName": "Elixir Máximo",
        "description": "This medicine can fully restore the\nPP of all of the moves that have\nbeen learned by a Pokémon."
    },
    {
        "id": "042",
        "EnglishName": "Lava Cookie",
        "SpanishName": "Galleta Lava",
        "description": "Lavaridge Town’s local specialty.\nIt can be used once to heal all the\nstatus conditions of a Pokémon."
    },
    {
        "id": "043",
        "EnglishName": "Berry Juice",
        "SpanishName": "Zumo Baya",
        "description": "A 100 percent pure juice made of Berries.\nWhen consumed, it restores\n20 HP to an injured Pokémon."
    },
    {
        "id": "044",
        "EnglishName": "Sacred Ash",
        "SpanishName": "Ceniza Sagrada",
        "description": "This rare ash can revive all fainted\nPokémon in a party. In doing so, it\nalso fully restores their maximum HP."
    },
    {
        "id": "045",
        "EnglishName": "HP Up",
        "SpanishName": "Más PS",
        "description": "A nutritious drink for Pokémon.\nWhen consumed, it raises the\nbase HP of a single Pokémon."
    },
    {
        "id": "046",
        "EnglishName": "Protein",
        "SpanishName": "Proteína",
        "description": "A nutritious drink for Pokémon.\nWhen consumed, it raises the base\nAttack stat of a single Pokémon."
    },
    {
        "id": "047",
        "EnglishName": "Iron",
        "SpanishName": "Hierro",
        "description": "A nutritious drink for Pokémon.\nWhen consumed, it raises the base\nDefense stat of a single Pokémon."
    },
    {
        "id": "048",
        "EnglishName": "Carbos",
        "SpanishName": "Carburante",
        "description": "A nutritious drink for Pokémon.\nWhen consumed, it raises the base\nSpeed stat of a single Pokémon."
    },
    {
        "id": "049",
        "EnglishName": "Calcium",
        "SpanishName": "Calcio",
        "description": "A nutritious drink for Pokémon.\nWhen consumed, it raises the base\nSp. Atk stat of a single Pokémon."
    },
    {
        "id": "050",
        "EnglishName": "Rare Candy",
        "SpanishName": "Caramelo Raro",
        "description": "A candy that is packed with energy.\nWhen consumed, it will instantly raise\nthe level of a single Pokémon by one."
    },
    {
        "id": "051",
        "EnglishName": "PP Up",
        "SpanishName": "Más PP",
        "description": "A medicine that can slightly raise the\nmaximum PP of a single move that has\nbeen learned by the target Pokémon."
    },
    {
        "id": "052",
        "EnglishName": "Zinc",
        "SpanishName": "Zinc",
        "description": "A nutritious drink for Pokémon.\nWhen consumed, it raises the base\nSp. Def stat of a single Pokémon."
    },
    {
        "id": "053",
        "EnglishName": "PP Max",
        "SpanishName": "PP Máximos",
        "description": "A medicine that can optimally raise the\nmaximum PP of a single move that has\nbeen learned by the target Pokémon."
    },
    {
        "id": "054",
        "EnglishName": "Old Gateau",
        "SpanishName": "Pastel Viejo",
        "description": "The Old Chateau’s hidden specialty.\nIt can be used once to heal all the\nstatus conditions of a Pokémon."
    },
    {
        "id": "055",
        "EnglishName": "Guard Spec.",
        "SpanishName": "Protección X",
        "description": "An item that prevents stat reduction\namong the Trainer’s party Pokémon\nfor five turns after it is used in battle."
    },
    {
        "id": "056",
        "EnglishName": "Dire Hit",
        "SpanishName": "Crítico X",
        "description": "An item that raises the critical-hit ratio\ngreatly. It can be used only once and\nwears off if the Pokémon is withdrawn."
    },
    {
        "id": "057",
        "EnglishName": "X Attack",
        "SpanishName": "Ataque X",
        "description": "An item that boosts the Attack stat\nof a Pokémon during a battle. It wears\noff once the Pokémon is withdrawn."
    },
    {
        "id": "058",
        "EnglishName": "X Defense",
        "SpanishName": "Defensa X",
        "description": "An item that boosts the Defense stat\nof a Pokémon during a battle. It wears\noff once the Pokémon is withdrawn."
    },
    {
        "id": "059",
        "EnglishName": "X Speed",
        "SpanishName": "Velocidad X",
        "description": "An item that boosts the Speed stat\nof a Pokémon during a battle. It wears\noff once the Pokémon is withdrawn."
    },
    {
        "id": "060",
        "EnglishName": "X Accuracy",
        "SpanishName": "Precisión X",
        "description": "An item that boosts the accuracy of\na Pokémon during a battle. It wears\noff once the Pokémon is withdrawn."
    },
    {
        "id": "061",
        "EnglishName": "X Sp. Atk",
        "SpanishName": "At. Especial X",
        "description": "An item that boosts the Sp. Atk stat\nof a Pokémon during a battle. It wears\noff once the Pokémon is withdrawn."
    },
    {
        "id": "062",
        "EnglishName": "X Sp. Def",
        "SpanishName": "Def. Especial X",
        "description": "An item that boosts the Sp. Def stat\nof a Pokémon during a battle. It wears\noff once the Pokémon is withdrawn."
    },
    {
        "id": "063",
        "EnglishName": "Poké Doll",
        "SpanishName": "Poké Muñeco",
        "description": "A doll that attracts the attention of a\nPokémon. It guarantees escape from\nany battle with wild Pokémon."
    },
    {
        "id": "064",
        "EnglishName": "Fluffy Tail",
        "SpanishName": "Cola Skitty",
        "description": "A toy that attracts the attention of a\nPokémon. It guarantees escape from\nany battle with wild Pokémon."
    },
    {
        "id": "065",
        "EnglishName": "Blue Flute",
        "SpanishName": "Flauta Azul",
        "description": "A lovely toy flute to admire.\nIt’s made from blue glass."
    },
    {
        "id": "066",
        "EnglishName": "Yellow Flute",
        "SpanishName": "Flauta Amarilla",
        "description": "A lovely toy flute to admire.\nIt’s made from yellow glass."
    },
    {
        "id": "067",
        "EnglishName": "Red Flute",
        "SpanishName": "Flauta Roja",
        "description": "A lovely toy flute to admire.\nIt’s made from red glass."
    },
    {
        "id": "068",
        "EnglishName": "Black Flute",
        "SpanishName": "Flauta Negra",
        "description": "A lovely toy flute to admire.\nIt’s made from black glass."
    },
    {
        "id": "069",
        "EnglishName": "White Flute",
        "SpanishName": "Flauta Blanca",
        "description": "A lovely toy flute to admire.\nIt’s made from white glass."
    },
    {
        "id": "070",
        "EnglishName": "Shoal Salt",
        "SpanishName": "Sal Cardumen",
        "description": "Pure salt that can be discovered\nonly deep inside the Shoal Cave."
    },
    {
        "id": "071",
        "EnglishName": "Shoal Shell",
        "SpanishName": "Concha Cardumen",
        "description": "A pretty seashell that can be\nfound deep inside the Shoal Cave."
    },
    {
        "id": "072",
        "EnglishName": "Red Shard",
        "SpanishName": "Parte Roja",
        "description": "A small red shard. It appears\nto be a fragment of some sort\nof implement made long ago."
    },
    {
        "id": "073",
        "EnglishName": "Blue Shard",
        "SpanishName": "Parte Azul",
        "description": "A small blue shard. It appears\nto be a fragment of some sort\nof implement made long ago."
    },
    {
        "id": "074",
        "EnglishName": "Yellow Shard",
        "SpanishName": "Parte Amarilla",
        "description": "A small yellow shard. It appears\nto be a fragment of some sort\nof implement made long ago."
    },
    {
        "id": "075",
        "EnglishName": "Green Shard",
        "SpanishName": "Parte Verde",
        "description": "A small green shard. It appears\nto be a fragment of some sort\nof implement made long ago."
    },
    {
        "id": "076",
        "EnglishName": "Super Repel",
        "SpanishName": "Superrepelente",
        "description": "An item that prevents any low-level\nwild Pokémon from jumping out at\nyou for 200 steps after its use."
    },
    {
        "id": "077",
        "EnglishName": "Max Repel",
        "SpanishName": "Repelente Máximo",
        "description": "An item that prevents any low-level\nwild Pokémon from jumping out at\nyou for 250 steps after its use."
    },
    {
        "id": "078",
        "EnglishName": "Escape Rope",
        "SpanishName": "Cuerda Huida",
        "description": "A long and durable rope.\nUse it to escape instantly\nfrom a cave or a dungeon."
    },
    {
        "id": "079",
        "EnglishName": "Repel",
        "SpanishName": "Repelente",
        "description": "An item that prevents any low-level\nwild Pokémon from jumping out at\nyou for 100 steps after its use."
    },
    {
        "id": "080",
        "EnglishName": "Sun Stone",
        "SpanishName": "Piedra Solar",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt burns as red as the evening sun."
    },
    {
        "id": "081",
        "EnglishName": "Moon Stone",
        "SpanishName": "Piedra Lunar",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt is as black as the night sky."
    },
    {
        "id": "082",
        "EnglishName": "Fire Stone",
        "SpanishName": "Piedra Fuego",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nThe stone has a fiery orange heart."
    },
    {
        "id": "083",
        "EnglishName": "Thunder Stone",
        "SpanishName": "Piedra Trueno",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt has a distinct thunderbolt pattern."
    },
    {
        "id": "084",
        "EnglishName": "Water Stone",
        "SpanishName": "Piedra Agua",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt is the blue of a pool of clear water."
    },
    {
        "id": "085",
        "EnglishName": "Leaf Stone",
        "SpanishName": "Piedra Hoja",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt has an unmistakable leaf pattern."
    },
    {
        "id": "086",
        "EnglishName": "Tiny Mushroom",
        "SpanishName": "Miniseta",
        "description": "A very small and rare mushroom.\nIt’s popular with a certain class of\ncollectors and sought out by them."
    },
    {
        "id": "087",
        "EnglishName": "Big Mushroom",
        "SpanishName": "Seta Grande",
        "description": "A very large and rare mushroom.\nIt’s popular with a certain class of\ncollectors and sought out by them."
    },
    {
        "id": "088",
        "EnglishName": "Pearl",
        "SpanishName": "Perla",
        "description": "A rather small pearl that has a\nvery nice silvery sheen to it.\nIt can be sold cheaply to shops."
    },
    {
        "id": "089",
        "EnglishName": "Big Pearl",
        "SpanishName": "Perla Grande",
        "description": "A rather large pearl that has a very nice silvery\nsheen. It can be sold to shops for a high price."
    },
    {
        "id": "090",
        "EnglishName": "Stardust",
        "SpanishName": "Polvo Estelar",
        "description": "Lovely, red sand that flows between\nthe fingers with a loose, silky feel.\nIt can be sold at a high price to shops."
    },
    {
        "id": "091",
        "EnglishName": "Star Piece",
        "SpanishName": "Trozo Estrella",
        "description": "A small shard of a beautiful gem that\ndemonstrates a distinctly red sparkle.\nIt can be sold at a high price to shops."
    },
    {
        "id": "092",
        "EnglishName": "Nugget",
        "SpanishName": "Pepita",
        "description": "A nugget of the purest gold that gives\noff a lustrous gleam in direct light.\nIt can be sold at a high price to shops."
    },
    {
        "id": "093",
        "EnglishName": "Heart Scale",
        "SpanishName": "Escama Corazón",
        "description": "A pretty, heart-shaped scale that is\nextremely rare. It glows faintly with\nall of the colors of the rainbow."
    },
    {
        "id": "094",
        "EnglishName": "Honey",
        "SpanishName": "Miel",
        "description": "A sweet honey with a lush aroma that\nattracts wild Pokémon when it is used\nin tall grass, in caves, or on special trees."
    },
    {
        "id": "099",
        "EnglishName": "Root Fossil",
        "SpanishName": "Fósil Raíz",
        "description": "A fossil from a prehistoric Pokémon\nthat once lived in the sea. It looks as\nif it could be part of a plant’s root."
    },
    {
        "id": "100",
        "EnglishName": "Claw Fossil",
        "SpanishName": "Fósil Garra",
        "description": "A fossil from a prehistoric Pokémon\nthat once lived in the sea. It appears\nto be a fragment of a claw."
    },
    {
        "id": "101",
        "EnglishName": "Helix Fossil",
        "SpanishName": "Fósil Hélix",
        "description": "A fossil from a prehistoric Pokémon\nthat once lived in the sea. It might be\na piece of a seashell."
    },
    {
        "id": "102",
        "EnglishName": "Dome Fossil",
        "SpanishName": "Fósil Domo",
        "description": "A fossil from a prehistoric Pokémon\nthat once lived in the sea. It could\nbe a shell or carapace."
    },
    {
        "id": "103",
        "EnglishName": "Old Amber",
        "SpanishName": "Ámbar Viejo",
        "description": "A piece of amber that still contains the\ngenetic material of an ancient Pokémon.\nIt’s clear with a tawny, reddish tint."
    },
    {
        "id": "104",
        "EnglishName": "Armor Fossil",
        "SpanishName": "Fósil Coraza",
        "description": "A fossil from a prehistoric Pokémon\nthat once lived on the land. It looks to\nbe from some kind of protective collar."
    },
    {
        "id": "105",
        "EnglishName": "Skull Fossil",
        "SpanishName": "Fósil Cráneo",
        "description": "A fossil from a prehistoric Pokémon\nthat once lived on the land. It appears\nas though it’s part of a head."
    },
    {
        "id": "106",
        "EnglishName": "Rare Bone",
        "SpanishName": "Hueso Raro",
        "description": "A rare bone that is extremely valuable\nfor the study of Pokémon archeology.\nIt can be sold for a high price to shops."
    },
    {
        "id": "107",
        "EnglishName": "Shiny Stone",
        "SpanishName": "Piedra Día",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt shines with a dazzling light."
    },
    {
        "id": "108",
        "EnglishName": "Dusk Stone",
        "SpanishName": "Piedra Noche",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt holds shadows as dark as can be."
    },
    {
        "id": "109",
        "EnglishName": "Dawn Stone",
        "SpanishName": "Piedra Alba",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt sparkles like a glittering eye."
    },
    {
        "id": "110",
        "EnglishName": "Oval Stone",
        "SpanishName": "Piedra Oval",
        "description": "A peculiar stone that can make\ncertain species of Pokémon evolve.\nIt’s as round as a Pokémon Egg."
    },
    {
        "id": "112",
        "EnglishName": "Adamant Orb",
        "SpanishName": "Diamansfera",
        "description": "A brightly gleaming orb to be held by\nDialga. It boosts the power of Dragon-​\nand Steel-type moves when it is held."
    },
    {
        "id": "113",
        "EnglishName": "Lustrous Orb",
        "SpanishName": "Lustresfera",
        "description": "A beautifully glowing orb to be held by\nPalkia. It boosts the power of Dragon-​\nand Water-type moves when it is held."
    },
    {
        "id": "126",
        "EnglishName": "Cheri Berry",
        "SpanishName": "Baya Zreza",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can recover\nfrom paralysis on its own in battle."
    },
    {
        "id": "127",
        "EnglishName": "Chesto Berry",
        "SpanishName": "Baya Atania",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can recover\nfrom sleep on its own in battle."
    },
    {
        "id": "128",
        "EnglishName": "Pecha Berry",
        "SpanishName": "Baya Meloc",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can recover\nfrom poisoning on its own in battle."
    },
    {
        "id": "129",
        "EnglishName": "Rawst Berry",
        "SpanishName": "Baya Safre",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can recover\nfrom a burn on its own in battle."
    },
    {
        "id": "130",
        "EnglishName": "Aspear Berry",
        "SpanishName": "Baya Perasi",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can recover\nfrom being frozen on its own in battle."
    },
    {
        "id": "131",
        "EnglishName": "Leppa Berry",
        "SpanishName": "Baya Zanama",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can restore\n10 PP to a depleted move during battle."
    },
    {
        "id": "132",
        "EnglishName": "Oran Berry",
        "SpanishName": "Baya Aranja",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can restore its\nown HP by 10 points during battle."
    },
    {
        "id": "133",
        "EnglishName": "Persim Berry",
        "SpanishName": "Baya Caquic",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can recover\nfrom confusion on its own in battle."
    },
    {
        "id": "134",
        "EnglishName": "Lum Berry",
        "SpanishName": "Baya Ziuela",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can recover\nfrom any status condition during battle."
    },
    {
        "id": "135",
        "EnglishName": "Sitrus Berry",
        "SpanishName": "Baya Zidra",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it can restore its\nown HP by a small amount during battle."
    },
    {
        "id": "136",
        "EnglishName": "Figy Berry",
        "SpanishName": "Baya Higog",
        "description": "If held by a Pokémon, it restores the\nuser’s HP in a pinch, but it will cause\nconfusion if the user hates the taste."
    },
    {
        "id": "137",
        "EnglishName": "Wiki Berry",
        "SpanishName": "Baya Wiki",
        "description": "If held by a Pokémon, it restores the\nuser’s HP in a pinch, but it will cause\nconfusion if the user hates the taste."
    },
    {
        "id": "138",
        "EnglishName": "Mago Berry",
        "SpanishName": "Baya Ango",
        "description": "If held by a Pokémon, it restores the\nuser’s HP in a pinch, but it will cause\nconfusion if the user hates the taste."
    },
    {
        "id": "139",
        "EnglishName": "Aguav Berry",
        "SpanishName": "Baya Guaya",
        "description": "If held by a Pokémon, it restores the\nuser’s HP in a pinch, but it will cause\nconfusion if the user hates the taste."
    },
    {
        "id": "140",
        "EnglishName": "Iapapa Berry",
        "SpanishName": "Baya Pabaya",
        "description": "If held by a Pokémon, it restores the\nuser’s HP in a pinch, but it will cause\nconfusion if the user hates the taste."
    },
    {
        "id": "141",
        "EnglishName": "Razz Berry",
        "SpanishName": "Baya Frambu",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "142",
        "EnglishName": "Bluk Berry",
        "SpanishName": "Baya Oram",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "143",
        "EnglishName": "Nanab Berry",
        "SpanishName": "Baya Latano",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "144",
        "EnglishName": "Wepear Berry",
        "SpanishName": "Baya Peragu",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "145",
        "EnglishName": "Pinap Berry",
        "SpanishName": "Baya Pinia",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "146",
        "EnglishName": "Pomeg Berry",
        "SpanishName": "Baya Grana",
        "description": "A Berry to be consumed by Pokémon.\nUsing it on a Pokémon makes it more\nfriendly but lowers its base HP."
    },
    {
        "id": "147",
        "EnglishName": "Kelpsy Berry",
        "SpanishName": "Baya Algama",
        "description": "A Berry to be consumed by Pokémon.\nUsing it on a Pokémon makes it more\nfriendly but lowers its base Attack."
    },
    {
        "id": "148",
        "EnglishName": "Qualot Berry",
        "SpanishName": "Baya Ispero",
        "description": "A Berry to be consumed by Pokémon.\nUsing it on a Pokémon makes it more\nfriendly but lowers its base Defense."
    },
    {
        "id": "149",
        "EnglishName": "Hondew Berry",
        "SpanishName": "Baya Meluce",
        "description": "A Berry to be consumed by Pokémon.\nUsing it on a Pokémon makes it more\nfriendly but lowers its base Sp. Atk."
    },
    {
        "id": "150",
        "EnglishName": "Grepa Berry",
        "SpanishName": "Baya Uvav",
        "description": "A Berry to be consumed by Pokémon.\nUsing it on a Pokémon makes it more\nfriendly but lowers its base Sp. Def."
    },
    {
        "id": "151",
        "EnglishName": "Tamato Berry",
        "SpanishName": "Baya Tamate",
        "description": "A Berry to be consumed by Pokémon.\nUsing it on a Pokémon makes it more\nfriendly but lowers its base Speed."
    },
    {
        "id": "152",
        "EnglishName": "Cornn Berry",
        "SpanishName": "Baya Mais",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "153",
        "EnglishName": "Magost Berry",
        "SpanishName": "Baya Aostan",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "154",
        "EnglishName": "Rabuta Berry",
        "SpanishName": "Baya Rautan",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "155",
        "EnglishName": "Nomel Berry",
        "SpanishName": "Baya Monli",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "156",
        "EnglishName": "Spelon Berry",
        "SpanishName": "Baya Wikano",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "157",
        "EnglishName": "Pamtre Berry",
        "SpanishName": "Baya Plama",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "158",
        "EnglishName": "Watmel Berry",
        "SpanishName": "Baya Sambia",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "159",
        "EnglishName": "Durin Berry",
        "SpanishName": "Baya Rudion",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "160",
        "EnglishName": "Belue Berry",
        "SpanishName": "Baya Andano",
        "description": "A Berry to be used in cooking.\nThis Berry is very rare and hard\nto obtain in the Unova region."
    },
    {
        "id": "161",
        "EnglishName": "Occa Berry",
        "SpanishName": "Baya Caoca",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Fire-type attack."
    },
    {
        "id": "162",
        "EnglishName": "Passho Berry",
        "SpanishName": "Baya Pasio",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Water-type attack."
    },
    {
        "id": "163",
        "EnglishName": "Wacan Berry",
        "SpanishName": "Baya Gualot",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Electric-type attack."
    },
    {
        "id": "164",
        "EnglishName": "Rindo Berry",
        "SpanishName": "Baya Tamar",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Grass-type attack."
    },
    {
        "id": "165",
        "EnglishName": "Yache Berry",
        "SpanishName": "Baya Rimoya",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Ice-type attack."
    },
    {
        "id": "166",
        "EnglishName": "Chople Berry",
        "SpanishName": "Baya Pomaro",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Fighting-type attack."
    },
    {
        "id": "167",
        "EnglishName": "Kebia Berry",
        "SpanishName": "Baya Kebia",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Poison-type attack."
    },
    {
        "id": "168",
        "EnglishName": "Shuca Berry",
        "SpanishName": "Baya Acardo",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Ground-type attack."
    },
    {
        "id": "169",
        "EnglishName": "Coba Berry",
        "SpanishName": "Baya Kouba",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Flying-type attack."
    },
    {
        "id": "170",
        "EnglishName": "Payapa Berry",
        "SpanishName": "Baya Payapa",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Psychic-type attack."
    },
    {
        "id": "171",
        "EnglishName": "Tanga Berry",
        "SpanishName": "Baya Yecana",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Bug-type attack."
    },
    {
        "id": "172",
        "EnglishName": "Charti Berry",
        "SpanishName": "Baya Alcho",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Rock-type attack."
    },
    {
        "id": "173",
        "EnglishName": "Kasib Berry",
        "SpanishName": "Baya Drasi",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Ghost-type attack."
    },
    {
        "id": "174",
        "EnglishName": "Haban Berry",
        "SpanishName": "Baya Anjiro",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Dragon-type attack."
    },
    {
        "id": "175",
        "EnglishName": "Colbur Berry",
        "SpanishName": "Baya Dillo",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Dark-type attack."
    },
    {
        "id": "176",
        "EnglishName": "Babiri Berry",
        "SpanishName": "Baya Baribá",
        "description": "If held by a Pokémon, this Berry will\nlessen the damage taken from one\nsupereffective Steel-type attack."
    },
    {
        "id": "177",
        "EnglishName": "Chilan Berry",
        "SpanishName": "Baya Chilan",
        "description": "If held by a Pokémon, this Berry\nwill lessen the damage taken\nfrom one Normal-type attack."
    },
    {
        "id": "178",
        "EnglishName": "Liechi Berry",
        "SpanishName": "Baya Lichi",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, its Attack\nstat will increase when it’s in a pinch."
    },
    {
        "id": "179",
        "EnglishName": "Ganlon Berry",
        "SpanishName": "Baya Gonlan",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, its Defense\nstat will increase when it’s in a pinch."
    },
    {
        "id": "180",
        "EnglishName": "Salac Berry",
        "SpanishName": "Baya Aslac",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, its Speed\nstat will increase when it’s in a pinch."
    },
    {
        "id": "181",
        "EnglishName": "Petaya Berry",
        "SpanishName": "Baya Yapati",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, its Sp. Atk\nstat will increase when it’s in a pinch."
    },
    {
        "id": "182",
        "EnglishName": "Apicot Berry",
        "SpanishName": "Baya Aricoc",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, its Sp. Def\nstat will increase when it’s in a pinch."
    },
    {
        "id": "183",
        "EnglishName": "Lansat Berry",
        "SpanishName": "Baya Zonlan",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, its critical-hit\nratio will increase when it’s in a pinch."
    },
    {
        "id": "184",
        "EnglishName": "Starf Berry",
        "SpanishName": "Baya Arabol",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, one of its stats\nwill sharply increase when it’s in a pinch."
    },
    {
        "id": "185",
        "EnglishName": "Enigma Berry",
        "SpanishName": "Baya Enigma",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, being hit by a\nsupereffective attack will restore its HP."
    },
    {
        "id": "186",
        "EnglishName": "Micle Berry",
        "SpanishName": "Baya Lagro",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, its accuracy will\nincrease just once when it’s in a pinch."
    },
    {
        "id": "187",
        "EnglishName": "Custap Berry",
        "SpanishName": "Baya Chiri",
        "description": "A Berry to be consumed by Pokémon.\nIf a Pokémon holds one, it will be able to\nmove first just once when it’s in a pinch."
    },
    {
        "id": "188",
        "EnglishName": "Jaboca Berry",
        "SpanishName": "Baya Jaboca",
        "description": "A Berry to be consumed by Pokémon.\nIf a physical attack hits the Pokémon\nholding it, the attacker will also be hurt."
    },
    {
        "id": "189",
        "EnglishName": "Rowap Berry",
        "SpanishName": "Baya Magua",
        "description": "A Berry to be consumed by Pokémon.\nIf a special attack hits the Pokémon\nholding it, the attacker will also be hurt."
    },
    {
        "id": "190",
        "EnglishName": "Bright Powder",
        "SpanishName": "Polvo Brillo",
        "description": "An item to be held by a Pokémon.\nIt casts a tricky glare that lowers\nthe opposing Pokémon’s accuracy."
    },
    {
        "id": "191",
        "EnglishName": "White Herb",
        "SpanishName": "Hierba Blanca",
        "description": "An item to be held by a Pokémon.\nIt will restore any lowered stat in\nbattle. It can be used only once."
    },
    {
        "id": "192",
        "EnglishName": "Macho Brace",
        "SpanishName": "Brazal Firme",
        "description": "An item to be held by a Pokémon.\nThis stiff, heavy brace helps Pokémon\ngrow strong but cuts Speed in battle."
    },
    {
        "id": "193",
        "EnglishName": "Exp. Share",
        "SpanishName": "Repartir Exp",
        "description": "Turning on this special device will\nallow all the Pokémon on your team\nto receive Exp. Points from battles."
    },
    {
        "id": "194",
        "EnglishName": "Quick Claw",
        "SpanishName": "Garra Rápida",
        "description": "An item to be held by a Pokémon.\nThis light, sharp claw lets the\nbearer move first occasionally."
    },
    {
        "id": "195",
        "EnglishName": "Soothe Bell",
        "SpanishName": "Cascabel Alivio",
        "description": "An item to be held by a Pokémon.\nThe comforting chime of this bell\ncalms the holder, making it friendly."
    },
    {
        "id": "196",
        "EnglishName": "Mental Herb",
        "SpanishName": "Hierba Mental",
        "description": "An item to be held by a Pokémon.\nIt snaps the holder out of infatuation.\nIt can be used only once."
    },
    {
        "id": "197",
        "EnglishName": "Choice Band",
        "SpanishName": "Banda Elegida",
        "description": "An item to be held by a Pokémon.\nThis curious headband boosts Attack\nbut only allows the use of one move."
    },
    {
        "id": "198",
        "EnglishName": "King’s Rock",
        "SpanishName": "Roca del Rey",
        "description": "An item to be held by a Pokémon.\nWhen the holder successfully inflicts\ndamage, the target may also flinch."
    },
    {
        "id": "199",
        "EnglishName": "Silver Powder",
        "SpanishName": "Polvo Plata",
        "description": "An item to be held by a Pokémon.\nIt is a shiny, silver powder that will\nboost the power of Bug-type moves."
    },
    {
        "id": "201",
        "EnglishName": "Cleanse Tag",
        "SpanishName": "Amuleto",
        "description": "An item to be held by a Pokémon.\nIt helps keep wild Pokémon away if\nthe holder is the head of the party."
    },
    {
        "id": "203",
        "EnglishName": "Deep Sea Tooth",
        "SpanishName": "Diente Marino",
        "description": "An item to be held by Clamperl.\nThis fang gleams a sharp silver and\nraises the holder’s Sp. Atk stat."
    },
    {
        "id": "204",
        "EnglishName": "Deep Sea Scale",
        "SpanishName": "Escama Marina",
        "description": "An item to be held by Clamperl.\nThis scale shines with a faint pink and\nraises the holder’s Sp. Def stat."
    },
    {
        "id": "205",
        "EnglishName": "Smoke Ball",
        "SpanishName": "Bola de Humo",
        "description": "An item to be held by a Pokémon.\nIt enables the holder to flee from any\nwild Pokémon encounter without fail."
    },
    {
        "id": "206",
        "EnglishName": "Everstone",
        "SpanishName": "Piedra Eterna",
        "description": "An item to be held by a Pokémon.\nA Pokémon holding this peculiar\nstone is prevented from evolving."
    },
    {
        "id": "207",
        "EnglishName": "Focus Band",
        "SpanishName": "Banda Concentración",
        "description": "An item to be held by a Pokémon.\nThe holder may endure a potential\nKO attack, leaving it with just 1 HP."
    },
    {
        "id": "209",
        "EnglishName": "Scope Lens",
        "SpanishName": "Lupa Alcance",
        "description": "An item to be held by a Pokémon.\nIt’s a lens for scoping out weak points.\nIt boosts the holder’s critical-hit ratio."
    },
    {
        "id": "210",
        "EnglishName": "Metal Coat",
        "SpanishName": "Revest. Metálico",
        "description": "An item to be held by a Pokémon.\nIt is a special metallic film that can\nboost the power of Steel-type moves."
    },
    {
        "id": "211",
        "EnglishName": "Leftovers",
        "SpanishName": "Restos",
        "description": "An item to be held by a Pokémon.\nThe holder’s HP is slowly but steadily\nrestored throughout every battle."
    },
    {
        "id": "212",
        "EnglishName": "Dragon Scale",
        "SpanishName": "Escama Dragón",
        "description": "A very tough and inflexible scale.\nDragon-type Pokémon may be\nholding this item when caught."
    },
    {
        "id": "213",
        "EnglishName": "Light Ball",
        "SpanishName": "Bola Luminosa",
        "description": "An item to be held by Pikachu.\nIt’s a puzzling orb that boosts\nits Attack and Sp. Atk stats."
    },
    {
        "id": "214",
        "EnglishName": "Soft Sand",
        "SpanishName": "Arena Fina",
        "description": "An item to be held by a Pokémon.\nIt is a loose, silky sand that boosts\nthe power of Ground-type moves."
    },
    {
        "id": "215",
        "EnglishName": "Hard Stone",
        "SpanishName": "Piedra Dura",
        "description": "An item to be held by a Pokémon.\nIt is a durable stone that boosts\nthe power of Rock-type moves."
    },
    {
        "id": "216",
        "EnglishName": "Miracle Seed",
        "SpanishName": "Semilla Milagro",
        "description": "An item to be held by a Pokémon.\nIt is a seed imbued with life force that\nboosts the power of Grass-type moves."
    },
    {
        "id": "217",
        "EnglishName": "Black Glasses",
        "SpanishName": "Gafas de Sol",
        "description": "An item to be held by a Pokémon.\nA pair of shady-looking glasses that\nboost the power of Dark-type moves."
    },
    {
        "id": "218",
        "EnglishName": "Black Belt",
        "SpanishName": "Cinturón Negro",
        "description": "An item to be held by a Pokémon.\nThis belt helps the wearer to focus and\nboosts the power of Fighting-type moves."
    },
    {
        "id": "219",
        "EnglishName": "Magnet",
        "SpanishName": "Imán",
        "description": "An item to be held by a Pokémon.\nIt is a powerful magnet that boosts\nthe power of Electric-type moves."
    },
    {
        "id": "220",
        "EnglishName": "Mystic Water",
        "SpanishName": "Agua Mística",
        "description": "An item to be held by a Pokémon.\nThis teardrop-shaped gem boosts\nthe power of Water-type moves."
    },
    {
        "id": "221",
        "EnglishName": "Sharp Beak",
        "SpanishName": "Pico Afilado",
        "description": "An item to be held by a Pokémon.\nIt’s a long, sharp beak that boosts\nthe power of Flying-type moves."
    },
    {
        "id": "222",
        "EnglishName": "Poison Barb",
        "SpanishName": "Flecha Venenosa",
        "description": "An item to be held by a Pokémon.\nThis small, poisonous barb boosts\nthe power of Poison-type moves."
    },
    {
        "id": "223",
        "EnglishName": "Never-Melt Ice",
        "SpanishName": "Antiderretir",
        "description": "An item to be held by a Pokémon.\nIt’s a piece of ice that repels heat\neffects and boosts Ice-type moves."
    },
    {
        "id": "224",
        "EnglishName": "Spell Tag",
        "SpanishName": "Hechizo",
        "description": "An item to be held by a Pokémon.\nIt’s a sinister, eerie tag that boosts\nthe power of Ghost-type moves."
    },
    {
        "id": "225",
        "EnglishName": "Twisted Spoon",
        "SpanishName": "Cuchara Torcida",
        "description": "An item to be held by a Pokémon.\nThis spoon is imbued with telekinetic\npower and boosts Psychic-type moves."
    },
    {
        "id": "226",
        "EnglishName": "Charcoal",
        "SpanishName": "Carbón",
        "description": "An item to be held by a Pokémon.\nIt is a combustible fuel that boosts\nthe power of Fire-type moves."
    },
    {
        "id": "227",
        "EnglishName": "Dragon Fang",
        "SpanishName": "Colmillo Dragón",
        "description": "An item to be held by a Pokémon.\nThis hard and sharp fang boosts\nthe power of Dragon-type moves."
    },
    {
        "id": "228",
        "EnglishName": "Silk Scarf",
        "SpanishName": "Pañuelo de Seda",
        "description": "An item to be held by a Pokémon.\nIt’s a sumptuous scarf that boosts\nthe power of Normal-type moves."
    },
    {
        "id": "229",
        "EnglishName": "Up-grade",
        "SpanishName": "Mejora",
        "description": "A transparent device somehow\nfilled with all sorts of data.\nIt was produced by Silph Co."
    },
    {
        "id": "230",
        "EnglishName": "Shell Bell",
        "SpanishName": "Cascabel Concha",
        "description": "An item to be held by a Pokémon.\nThe holder regains a little HP every\ntime it inflicts damage on others."
    },
    {
        "id": "231",
        "EnglishName": "Sea Incense",
        "SpanishName": "Incienso Marino",
        "description": "An item to be held by a Pokémon.\nThis incense has a curious aroma that\nboosts the power of Water-type moves."
    },
    {
        "id": "232",
        "EnglishName": "Lax Incense",
        "SpanishName": "Incienso Suave",
        "description": "An item to be held by a Pokémon.\nThe beguiling aroma of this incense\nmay cause attacks to miss its holder."
    },
    {
        "id": "233",
        "EnglishName": "Lucky Punch",
        "SpanishName": "Puño Suerte",
        "description": "An item to be held by Chansey.\nThis pair of lucky boxing gloves will\nboost Chansey’s critical-hit ratio."
    },
    {
        "id": "234",
        "EnglishName": "Metal Powder",
        "SpanishName": "Polvo Metálico",
        "description": "An item to be held by Ditto.\nExtremely fine yet hard, this odd\npowder boosts the Defense stat."
    },
    {
        "id": "235",
        "EnglishName": "Thick Club",
        "SpanishName": "Hueso Grueso",
        "description": "An item to be held by Cubone or\nMarowak. It is a hard bone of some\nsort that boosts the Attack stat."
    },
    {
        "id": "236",
        "EnglishName": "Stick",
        "SpanishName": "Leek",
        "description": "An item to be held by Farfetch’d.\nThis very long and stiff stalk of\nleek boosts its critical-hit ratio."
    },
    {
        "id": "242",
        "EnglishName": "Wide Lens",
        "SpanishName": "Lupa Amplia",
        "description": "An item to be held by a Pokémon.\nIt’s a magnifying lens that slightly\nboosts the accuracy of moves."
    },
    {
        "id": "243",
        "EnglishName": "Muscle Band",
        "SpanishName": "Banda Muscular",
        "description": "An item to be held by a Pokémon.\nThis headband exudes strength, slightly\nboosting the power of physical moves."
    },
    {
        "id": "244",
        "EnglishName": "Wise Glasses",
        "SpanishName": "Gafas Sabiduría",
        "description": "An item to be held by a Pokémon.\nThis thick pair of glasses slightly\nboosts the power of special moves."
    },
    {
        "id": "245",
        "EnglishName": "Expert Belt",
        "SpanishName": "Cinturón Experto",
        "description": "An item to be held by a Pokémon.\nIt’s a well-worn belt that slightly boosts\nthe power of supereffective moves."
    },
    {
        "id": "246",
        "EnglishName": "Light Clay",
        "SpanishName": "Arcilla Ligera",
        "description": "An item to be held by a Pokémon.\nProtective moves like Light Screen\nand Reflect will be effective longer."
    },
    {
        "id": "247",
        "EnglishName": "Life Orb",
        "SpanishName": "Orbe Vida",
        "description": "An item to be held by a Pokémon.\nIt boosts the power of moves, but\nat the cost of some HP on each hit."
    },
    {
        "id": "248",
        "EnglishName": "Power Herb",
        "SpanishName": "Hierba Poder",
        "description": "A single-use item to be held by a Pokémon.\nIt allows the holder to immediately use a\nmove that normally requires a turn to charge."
    },
    {
        "id": "249",
        "EnglishName": "Toxic Orb",
        "SpanishName": "Orbe Tóxico",
        "description": "An item to be held by a Pokémon.\nIt is a bizarre orb that will badly\npoison the holder during battle."
    },
    {
        "id": "250",
        "EnglishName": "Flame Orb",
        "SpanishName": "Orbe Llama",
        "description": "An item to be held by a Pokémon.\nIt is a bizarre orb that will afflict the\nholder with a burn during battle."
    },
    {
        "id": "251",
        "EnglishName": "Quick Powder",
        "SpanishName": "Polvo Veloz",
        "description": "An item to be held by Ditto.\nExtremely fine yet hard, this odd\npowder boosts the Speed stat."
    },
    {
        "id": "252",
        "EnglishName": "Focus Sash",
        "SpanishName": "Banda Concentración",
        "description": "An item to be held by a Pokémon. If the holder\nhas full HP, it will endure a potential KO\nattack with 1 HP. The item then disappears."
    },
    {
        "id": "253",
        "EnglishName": "Zoom Lens",
        "SpanishName": "Lupa Zoom",
        "description": "An item to be held by a Pokémon.\nIf the holder moves after its target\nmoves, its accuracy will be boosted."
    },
    {
        "id": "254",
        "EnglishName": "Metronome",
        "SpanishName": "Metrónomo",
        "description": "An item to be held by a Pokémon.\nIt boosts moves used consecutively,\nbut only until a different move is used."
    },
    {
        "id": "255",
        "EnglishName": "Iron Ball",
        "SpanishName": "Bola Hierro",
        "description": "An item to be held by a Pokémon.\nIt lowers Speed and allows Ground-type\nmoves to hit Flying-type and levitating holders."
    },
    {
        "id": "256",
        "EnglishName": "Lagging Tail",
        "SpanishName": "Cola Plomo",
        "description": "An item to be held by a Pokémon.\nIt is tremendously heavy and makes\nthe holder move slower than usual."
    },
    {
        "id": "257",
        "EnglishName": "Destiny Knot",
        "SpanishName": "Nudo Destino",
        "description": "An item to be held by a Pokémon.\nIf the holder becomes infatuated,\nthe opposing Pokémon will be, too."
    },
    {
        "id": "258",
        "EnglishName": "Black Sludge",
        "SpanishName": "Lodo Negro",
        "description": "An item to be held by a Pokémon.\nIt gradually restores HP to Poison-type\nPokémon. It damages any other type."
    },
    {
        "id": "259",
        "EnglishName": "Icy Rock",
        "SpanishName": "Roca Hielo",
        "description": "An item to be held by a Pokémon.\nIt extends the duration of the move\nHail when it’s used by the holder."
    },
    {
        "id": "260",
        "EnglishName": "Smooth Rock",
        "SpanishName": "Roca Suave",
        "description": "An item to be held by a Pokémon.\nIt extends the duration of the move\nSandstorm when used by the holder."
    },
    {
        "id": "261",
        "EnglishName": "Heat Rock",
        "SpanishName": "Roca Calor",
        "description": "An item to be held by a Pokémon.\nIt extends the duration of the move\nSunny Day when used by the holder."
    },
    {
        "id": "262",
        "EnglishName": "Damp Rock",
        "SpanishName": "Roca Humedad",
        "description": "An item to be held by a Pokémon.\nIt extends the duration of the move\nRain Dance when used by the holder."
    },
    {
        "id": "263",
        "EnglishName": "Grip Claw",
        "SpanishName": "Garra Agarre",
        "description": "An item to be held by a Pokémon.\nIt extends the duration of multi-turn\nattacks like Bind and Wrap."
    },
    {
        "id": "264",
        "EnglishName": "Choice Scarf",
        "SpanishName": "Pañuelo Elección",
        "description": "An item to be held by a Pokémon.\nThis curious scarf boosts Speed\nbut only allows the use of one move."
    },
    {
        "id": "265",
        "EnglishName": "Sticky Barb",
        "SpanishName": "Púas Pegajosas",
        "description": "An item to be held by a Pokémon.\nIt damages the holder every turn and may\nlatch on to Pokémon that touch the holder."
    },
    {
        "id": "266",
        "EnglishName": "Power Bracer",
        "SpanishName": "Brazal Recio",
        "description": "An item to be held by a Pokémon.\nIt reduces Speed but allows the holder’s\nAttack stat to grow more after battling."
    },
    {
        "id": "267",
        "EnglishName": "Power Belt",
        "SpanishName": "Cinto Recio",
        "description": "An item to be held by a Pokémon.\nIt reduces Speed but allows the holder’s\nDefense stat to grow more after battling."
    },
    {
        "id": "268",
        "EnglishName": "Power Lens",
        "SpanishName": "Lente Recia",
        "description": "An item to be held by a Pokémon.\nIt reduces Speed but allows the holder’s\nSp. Atk stat to grow more after battling."
    },
    {
        "id": "269",
        "EnglishName": "Power Band",
        "SpanishName": "Banda Recia",
        "description": "An item to be held by a Pokémon.\nIt reduces Speed but allows the holder’s\nSp. Def stat to grow more after battling."
    },
    {
        "id": "270",
        "EnglishName": "Power Anklet",
        "SpanishName": "Franja Recia",
        "description": "An item to be held by a Pokémon.\nIt reduces Speed but allows the holder’s\nSpeed stat to grow more after battling."
    },
    {
        "id": "271",
        "EnglishName": "Power Weight",
        "SpanishName": "Pesa Recia",
        "description": "An item to be held by a Pokémon.\nIt reduces Speed but allows the holder’s\nmaximum HP to grow more after battling."
    },
    {
        "id": "272",
        "EnglishName": "Shed Shell",
        "SpanishName": "Muda Concha",
        "description": "An item to be held by a Pokémon.\nThis discarded carapace enables the\nholder to switch out of battle without fail."
    },
    {
        "id": "273",
        "EnglishName": "Big Root",
        "SpanishName": "Raíz Grande",
        "description": "An item to be held by a Pokémon.\nIt boosts the power of HP-stealing\nmoves so the holder recovers more HP."
    },
    {
        "id": "274",
        "EnglishName": "Choice Specs",
        "SpanishName": "Gafas Elegidas",
        "description": "An item to be held by a Pokémon.\nThese curious glasses boost Sp. Atk\nbut only allow the use of one move."
    },
    {
        "id": "275",
        "EnglishName": "Flame Plate",
        "SpanishName": "Tabla Llama",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Fire-type moves."
    },
    {
        "id": "276",
        "EnglishName": "Splash Plate",
        "SpanishName": "Tabla Linfa",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Water-type moves."
    },
    {
        "id": "277",
        "EnglishName": "Zap Plate",
        "SpanishName": "Tabla Trueno",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Electric-type moves."
    },
    {
        "id": "278",
        "EnglishName": "Meadow Plate",
        "SpanishName": "Tabla Pradal",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Grass-type moves."
    },
    {
        "id": "279",
        "EnglishName": "Icicle Plate",
        "SpanishName": "Tabla Helada",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Ice-type moves."
    },
    {
        "id": "280",
        "EnglishName": "Fist Plate",
        "SpanishName": "Tabla Fuerte",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Fighting-type moves."
    },
    {
        "id": "281",
        "EnglishName": "Toxic Plate",
        "SpanishName": "Tabla Tóxica",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Poison-type moves."
    },
    {
        "id": "282",
        "EnglishName": "Earth Plate",
        "SpanishName": "Tabla Terrax",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Ground-type moves."
    },
    {
        "id": "283",
        "EnglishName": "Sky Plate",
        "SpanishName": "Tabla Cielo",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Flying-type moves."
    },
    {
        "id": "284",
        "EnglishName": "Mind Plate",
        "SpanishName": "Tabla Mental",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Psychic-type moves."
    },
    {
        "id": "285",
        "EnglishName": "Insect Plate",
        "SpanishName": "Tabla Bicho",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Bug-type moves."
    },
    {
        "id": "286",
        "EnglishName": "Stone Plate",
        "SpanishName": "Tabla Pétrea",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Rock-type moves."
    },
    {
        "id": "287",
        "EnglishName": "Spooky Plate",
        "SpanishName": "Tabla Terror",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Ghost-type moves."
    },
    {
        "id": "288",
        "EnglishName": "Draco Plate",
        "SpanishName": "Tabla Draco",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Dragon-type moves."
    },
    {
        "id": "289",
        "EnglishName": "Dread Plate",
        "SpanishName": "Tabla Oscura",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Dark-type moves."
    },
    {
        "id": "290",
        "EnglishName": "Iron Plate",
        "SpanishName": "Tabla Acero",
        "description": "An item to be held by a Pokémon.\nIt’s a stone tablet that boosts the\npower of Steel-type moves."
    },
    {
        "id": "291",
        "EnglishName": "Odd Incense",
        "SpanishName": "Incienso Raro",
        "description": "An item to be held by a Pokémon.\nThis exotic-smelling incense boosts\nthe power of Psychic-type moves."
    },
    {
        "id": "292",
        "EnglishName": "Rock Incense",
        "SpanishName": "Incienso Roca",
        "description": "An item to be held by a Pokémon.\nThis exotic-smelling incense boosts\nthe power of Rock-type moves."
    },
    {
        "id": "293",
        "EnglishName": "Full Incense",
        "SpanishName": "Incienso Lento",
        "description": "An item to be held by a Pokémon.\nThis exotic-smelling incense makes\nthe holder bloated and slow moving."
    },
    {
        "id": "294",
        "EnglishName": "Wave Incense",
        "SpanishName": "Incienso Acua",
        "description": "An item to be held by a Pokémon.\nThis exotic-smelling incense boosts\nthe power of Water-type moves."
    },
    {
        "id": "295",
        "EnglishName": "Rose Incense",
        "SpanishName": "Incienso Floral",
        "description": "An item to be held by a Pokémon.\nThis exotic-smelling incense boosts\nthe power of Grass-type moves."
    },
    {
        "id": "296",
        "EnglishName": "Luck Incense",
        "SpanishName": "Incienso Duplo",
        "description": "An item to be held by a Pokémon.\nIt doubles any prize money received\nif the holding Pokémon joins a battle."
    },
    {
        "id": "297",
        "EnglishName": "Pure Incense",
        "SpanishName": "Incienso Puro",
        "description": "An item to be held by a Pokémon.\nIt helps keep wild Pokémon away if\nthe holder is the head of the party."
    },
    {
        "id": "298",
        "EnglishName": "Protector",
        "SpanishName": "Protector",
        "description": "A protective item of some sort.\nIt is extremely stiff and heavy.\nIt’s loved by a certain Pokémon."
    },
    {
        "id": "299",
        "EnglishName": "Electirizer",
        "SpanishName": "Electrizador",
        "description": "A box packed with a tremendous\namount of electric energy.\nIt’s loved by a certain Pokémon."
    },
    {
        "id": "300",
        "EnglishName": "Magmarizer",
        "SpanishName": "Magmatizador",
        "description": "A box packed with a tremendous\namount of magma energy.\nIt’s loved by a certain Pokémon."
    },
    {
        "id": "301",
        "EnglishName": "Dubious Disc",
        "SpanishName": "Disco Extraño",
        "description": "A transparent device\noverflowing with dubious data.\nIts producer is unknown."
    },
    {
        "id": "302",
        "EnglishName": "Reaper Cloth",
        "SpanishName": "Tela Terrible",
        "description": "A cloth imbued with horrifyingly\nstrong spiritual energy.\nIt’s loved by a certain Pokémon."
    },
    {
        "id": "303",
        "EnglishName": "Razor Claw",
        "SpanishName": "Garra Afilada",
        "description": "An item to be held by a Pokémon.\nThis sharply hooked claw increases\nthe holder’s critical-hit ratio."
    },
    {
        "id": "304",
        "EnglishName": "Razor Fang",
        "SpanishName": "Colmillo Afilado",
        "description": "An item to be held by a Pokémon.\nWhen the holder successfully inflicts\ndamage, the target may also flinch."
    },
    {
        "id": "449",
        "EnglishName": "Lure Ball",
        "SpanishName": "Ball Cebo",
        "description": "A Poké Ball that is good for catching\nPokémon that you reel in with a Rod\nwhile out fishing."
    },
    {
        "id": "450",
        "EnglishName": "Level Ball",
        "SpanishName": "Ball Nivel",
        "description": "A Poké Ball that makes it easier to\ncatch Pokémon that are at a lower\nlevel than your own Pokémon."
    },
    {
        "id": "451",
        "EnglishName": "Moon Ball",
        "SpanishName": "Ball Luna",
        "description": "A Poké Ball that will make it easier\nto catch Pokémon that can evolve\nusing a Moon Stone."
    },
    {
        "id": "452",
        "EnglishName": "Heavy Ball",
        "SpanishName": "Ball Peso",
        "description": "A Poké Ball that is better than usual\nat catching very heavy Pokémon."
    },
    {
        "id": "453",
        "EnglishName": "Fast Ball",
        "SpanishName": "Ball Veloz",
        "description": "A Poké Ball that makes it easier to\ncatch Pokémon that are usually\nvery quick to run away."
    },
    {
        "id": "454",
        "EnglishName": "Friend Ball",
        "SpanishName": "Ball Amigo",
        "description": "A strange Poké Ball that will make\nthe wild Pokémon caught with it more\nfriendly toward you immediately."
    },
    {
        "id": "455",
        "EnglishName": "Love Ball",
        "SpanishName": "Ball Amor",
        "description": "A Poké Ball that works best when\ncatching a Pokémon that is of the\nopposite gender of your Pokémon."
    },
    {
        "id": "458",
        "EnglishName": "Red Apricorn",
        "SpanishName": "Bonguri Rojo",
        "description": "A red Apricorn.\nIt assails your nostrils."
    },
    {
        "id": "459",
        "EnglishName": "Blue Apricorn",
        "SpanishName": "Bonguri Azul",
        "description": "A blue Apricorn.\nIt smells a bit like grass."
    },
    {
        "id": "460",
        "EnglishName": "Yellow Apricorn",
        "SpanishName": "Bonguri Amarillo",
        "description": "A yellow Apricorn.\nIt has an invigorating scent."
    },
    {
        "id": "461",
        "EnglishName": "Green Apricorn",
        "SpanishName": "Bonguri Verde",
        "description": "A green Apricorn.\nIt has a mysterious, aromatic scent."
    },
    {
        "id": "462",
        "EnglishName": "Pink Apricorn",
        "SpanishName": "Bonguri Rosa",
        "description": "A pink Apricorn.\nIt has a nice, sweet scent."
    },
    {
        "id": "463",
        "EnglishName": "White Apricorn",
        "SpanishName": "Bonguri Blanco",
        "description": "A white Apricorn.\nIt doesn’t smell like anything."
    },
    {
        "id": "464",
        "EnglishName": "Black Apricorn",
        "SpanishName": "Bonguri Negro",
        "description": "A black Apricorn.\nIt has a scent beyond one’s experience."
    },
    {
        "id": "466",
        "EnglishName": "Rage Candy Bar",
        "SpanishName": "Barra Caramelo Ira",
        "description": "Mahogany Town’s famous candy.\nWhen consumed, it restores\n20 HP to an injured Pokémon."
    },
    {
        "id": "567",
        "EnglishName": "Sweet Heart",
        "SpanishName": "Corazón Dulce",
        "description": "A piece of cloyingly sweet chocolate.\nWhen consumed, it restores\n20 HP to an injured Pokémon."
    },
    {
        "id": "581",
        "EnglishName": "Eviolite",
        "SpanishName": "Mineral Evol",
        "description": "A mysterious Evolutionary lump. When\nheld by a Pokémon that can still evolve,\nit raises both Defense and Sp. Def."
    },
    {
        "id": "582",
        "EnglishName": "Float Stone",
        "SpanishName": "Piedra Pómez",
        "description": "An item to be held by a Pokémon.\nThis very light stone reduces the\nweight of a Pokémon when held."
    },
    {
        "id": "583",
        "EnglishName": "Rocky Helmet",
        "SpanishName": "Casco Dentado",
        "description": "An item to be held by a Pokémon.\nIf the holder is hit, the attacker will\nalso be damaged upon contact."
    },
    {
        "id": "584",
        "EnglishName": "Air Balloon",
        "SpanishName": "Globo Helio",
        "description": "An item to be held by a Pokémon.\nThe holder will float in the air until hit.\nOnce hit, this item will burst."
    },
    {
        "id": "585",
        "EnglishName": "Red Card",
        "SpanishName": "Tarjeta Roja",
        "description": "An item to be held by a Pokémon.\nWhen the holder is hit by an attack,\nthe attacker is removed from battle."
    },
    {
        "id": "586",
        "EnglishName": "Ring Target",
        "SpanishName": "Blanco",
        "description": "An item to be held by a Pokémon.\nMoves that normally have no effect\nwill land on a Pokémon holding it."
    },
    {
        "id": "587",
        "EnglishName": "Binding Band",
        "SpanishName": "Banda Atadura",
        "description": "An item to be held by a Pokémon.\nA band that increases the power of\nbinding moves used by the holder."
    },
    {
        "id": "588",
        "EnglishName": "Absorb Bulb",
        "SpanishName": "Tubérculo",
        "description": "An item to be held by a Pokémon.\nIt boosts Sp. Atk if hit with a Water-\ntype attack. It can only be used once."
    },
    {
        "id": "589",
        "EnglishName": "Cell Battery",
        "SpanishName": "Pila",
        "description": "An item to be held by a Pokémon.\nIt boosts Attack if hit with an Electric-\ntype attack. It can only be used once."
    },
    {
        "id": "590",
        "EnglishName": "Eject Button",
        "SpanishName": "Botón Escape",
        "description": "An item to be held by a Pokémon.\nIf the holder is hit by an attack, it\nwill be switched out of battle."
    },
    {
        "id": "591",
        "EnglishName": "Fire Gem",
        "SpanishName": "Gema Fuego",
        "description": "A gem with an essence of fire.\nWhen held, it strengthens the power\nof a Fire-type move one time."
    },
    {
        "id": "592",
        "EnglishName": "Water Gem",
        "SpanishName": "Gema Agua",
        "description": "A gem with an essence of water.\nWhen held, it strengthens the power\nof a Water-type move one time."
    },
    {
        "id": "593",
        "EnglishName": "Electric Gem",
        "SpanishName": "Gema Eléctrica",
        "description": "A gem with an essence of electricity.\nWhen held, it strengthens the power of\nan Electric-type move one time."
    },
    {
        "id": "594",
        "EnglishName": "Grass Gem",
        "SpanishName": "Gema Planta",
        "description": "A gem with an essence of nature.\nWhen held, it strengthens the power\nof a Grass-type move one time."
    },
    {
        "id": "595",
        "EnglishName": "Ice Gem",
        "SpanishName": "Gema Hielo",
        "description": "A gem with an essence of ice.\nWhen held, it strengthens the power\nof an Ice-type move one time."
    },
    {
        "id": "596",
        "EnglishName": "Fighting Gem",
        "SpanishName": "Gema Lucha",
        "description": "A gem with an essence of combat.\nWhen held, it strengthens the power\nof a Fighting-type move one time."
    },
    {
        "id": "597",
        "EnglishName": "Poison Gem",
        "SpanishName": "Gema Veneno",
        "description": "A gem with an essence of poison.\nWhen held, it strengthens the power\nof a Poison-type move one time."
    },
    {
        "id": "598",
        "EnglishName": "Ground Gem",
        "SpanishName": "Gema Tierra",
        "description": "A gem with an essence of land.\nWhen held, it strengthens the power\nof a Ground-type move one time."
    },
    {
        "id": "599",
        "EnglishName": "Flying Gem",
        "SpanishName": "Gema Voladora",
        "description": "A gem with an essence of air.\nWhen held, it strengthens the power\nof a Flying-type move one time."
    },
    {
        "id": "600",
        "EnglishName": "Psychic Gem",
        "SpanishName": "Gema Psíquica",
        "description": "A gem with an essence of the mind.\nWhen held, it strengthens the power\nof a Psychic-type move one time."
    },
    {
        "id": "601",
        "EnglishName": "Bug Gem",
        "SpanishName": "Gema Bicho",
        "description": "A gem with an insect-like essence.\nWhen held, it strengthens the power\nof a Bug-type move one time."
    },
    {
        "id": "602",
        "EnglishName": "Rock Gem",
        "SpanishName": "Gema Roca",
        "description": "A gem with an essence of rock.\nWhen held, it strengthens the power\nof a Rock-type move one time."
    },
    {
        "id": "603",
        "EnglishName": "Ghost Gem",
        "SpanishName": "Gema Fantasma",
        "description": "A gem with a spectral essence.\nWhen held, it strengthens the power\nof a Ghost-type move one time."
    },
    {
        "id": "604",
        "EnglishName": "Dark Gem",
        "SpanishName": "Gema Siniestra",
        "description": "A gem with an essence of darkness.\nWhen held, it strengthens the power\nof a Dark-type move one time."
    },
    {
        "id": "605",
        "EnglishName": "Steel Gem",
        "SpanishName": "Gema Acero",
        "description": "A gem with an essence of steel.\nWhen held, it strengthens the power\nof a Steel-type move one time."
    },
    {
        "id": "613",
        "EnglishName": "Cover Fossil",
        "SpanishName": "Fósil Tapa",
        "description": "A fossil from a prehistoric Pokémon\nthat once lived in the sea. It appears\nas though it could be part of its back."
    },
    {
        "id": "614",
        "EnglishName": "Plume Fossil",
        "SpanishName": "Fósil Pluma",
        "description": "A fossil from a prehistoric Pokémon\nthat once lived in the sky. It looks as\nif it could come from part of its wing."
    },
    {
        "id": "617",
        "EnglishName": "Dream Ball",
        "SpanishName": "Ball Sueño",
        "description": "A special Poké Ball that appears in your\nBag out of nowhere in the Entree Forest.\nIt can catch any Pokémon."
    },
    {
        "id": "621",
        "EnglishName": "Balm Mushroom",
        "SpanishName": "Seta Aroma",
        "description": "A rare mushroom that gives off\na nice fragrance. It can be sold at\na high price to shops."
    },
    {
        "id": "622",
        "EnglishName": "Big Nugget",
        "SpanishName": "Maxipepita",
        "description": "A big nugget of pure gold that gives\noff a lustrous gleam. It can be sold\nat a high price to shops."
    },
    {
        "id": "623",
        "EnglishName": "Pearl String",
        "SpanishName": "Sarta Perlas",
        "description": "Very large pearls that sparkle in\na pretty silver color. They can be\nsold at a high price to shops."
    },
    {
        "id": "624",
        "EnglishName": "Comet Shard",
        "SpanishName": "Fragmento Cometa",
        "description": "A shard that fell to the ground\nwhen a comet approached. It can\nbe sold at a high price to shops."
    },
    {
        "id": "632",
        "EnglishName": "Casteliacone",
        "SpanishName": "Helado Castelia",
        "description": "Castelia City’s specialty, soft-serve\nice cream. It heals all the status\nproblems of a single Pokémon."
    },
    {
        "id": "668",
        "EnglishName": "Dragon Gem",
        "SpanishName": "Gema Dragón",
        "description": "A gem with a draconic essence.\nWhen held, it strengthens the power\nof a Dragon-type move one time."
    },
    {
        "id": "669",
        "EnglishName": "Normal Gem",
        "SpanishName": "Gema Normal",
        "description": "A gem with an ordinary essence.\nWhen held, it strengthens the power\nof a Normal-type move one time."
    },
    {
        "id": "683",
        "EnglishName": "Assault Vest",
        "SpanishName": "Assault Gear",
        "description": "An item to be held by a Pokémon.\nThis offensive vest raises Sp. Def\nbut prevents the use of status moves."
    },
    {
        "id": "1700",
        "EnglishName": "Punching Glove",
        "SpanishName": "Guante Boxeo",
        "description": null
    },
    {
        "id": "1701",
        "EnglishName": "Covert Cloak",
        "SpanishName": "Manto Encubierto",
        "description": null
    },
    {
        "id": "1702",
        "EnglishName": "Loaded Dice",
        "SpanishName": "Dado Trucado",
        "description": null
    }
];