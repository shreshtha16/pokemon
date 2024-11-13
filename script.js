document.addEventListener("DOMContentLoaded", () => {
    const pokemonContainer = document.getElementById("pokemon-container");
    const typeSelect = document.getElementById("type-select");
    const filterBtn = document.getElementById("filter-btn");
    const resetBtn = document.getElementById("reset-btn");
    const searchBar = document.getElementById("search-bar");
    let allPokemon = [];

    // Fetch all Pokémon
    async function fetchPokemon() {
        try {
            for (let i = 1; i <= 50; i++) { // Adjust range as needed
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
                const data = await res.json();
                allPokemon.push(data);
                displayPokemon(allPokemon);
            }
        } catch (error) {
            console.error("Error fetching Pokémon:", error);
        }
    }

    // Display Pokémon cards
    function displayPokemon(pokemonList) {
        pokemonContainer.innerHTML = "";
        pokemonList.forEach(pokemon => {
            const card = document.createElement("div");
            card.classList.add("pokemon-card");

            const img = document.createElement("img");
            img.src = pokemon.sprites.front_default;

            const name = document.createElement("p");
            name.classList.add("name");
            name.textContent = pokemon.name;

            const type = document.createElement("p");
            type.classList.add("type");
            type.textContent = pokemon.types.map(t => t.type.name).join(", ");

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(type);
            pokemonContainer.appendChild(card);

            card.addEventListener("click", () => {
                card.classList.toggle("flip");
            });
        });
    }

    // Filter Pokémon by type
    filterBtn.addEventListener("click", async () => {
        const selectedType = typeSelect.value;
        if (selectedType) {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
                const data = await res.json();
                const filteredPokemon = allPokemon.filter(pokemon =>
                    data.pokemon.some(p => p.pokemon.name === pokemon.name)
                );
                displayPokemon(filteredPokemon);
            } catch (error) {
                console.error("Error filtering Pokémon by type:", error);
            }
        }
    });

    // Reset filter
    resetBtn.addEventListener("click", () => {
        displayPokemon(allPokemon);
        searchBar.value = "";
        typeSelect.value = "";
    });

    // Search Pokémon by name
    searchBar.addEventListener("input", () => {
        const searchText = searchBar.value.toLowerCase();
        const filteredPokemon = allPokemon.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchText)
        );
        displayPokemon(filteredPokemon);
    });

    fetchPokemon();
});
