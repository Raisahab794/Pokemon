const BASE_URL = 'https://pokeapi.co/api/v2';
const pokemonContainer = document.getElementById('pokemon-container');
const errorDisplay = document.getElementById('error');
const loadingDisplay = document.getElementById('loading');

async function loadInitialPokemon() {
    try {
        showLoading();
        const response = await fetch(`${BASE_URL}/pokemon?limit=50`);
        if (!response.ok) throw new Error('Failed to fetch Pokémon');
        
        const data = await response.json();
        await Promise.all(data.results.map(pokemon => fetchPokemonData(pokemon.url)));
        hideLoading();
    } catch (error) {
        showError('Failed to load Pokémon. Please try again later.');
        hideLoading();
    }
}

async function fetchPokemonData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch Pokémon details');
        
        const pokemon = await response.json();
        displayPokemon(pokemon);
    } catch (error) {
        showError('Failed to load Pokémon details');
    }
}

function displayPokemon(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <p>ID: ${pokemon.id}</p>
    `;
    pokemonContainer.appendChild(card);
}

async function searchPokemon() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    if (!searchInput) return;

    try {
        showLoading();
        pokemonContainer.innerHTML = '';
        
        const response = await fetch(`${BASE_URL}/pokemon/${searchInput}`);
        if (!response.ok) throw new Error('Pokémon not found');
        
        const pokemon = await response.json();
        displayPokemon(pokemon);
        hideLoading();
    } catch (error) {
        showError('Pokémon not found');
        hideLoading();
    }
}

function resetToAll() {
    document.getElementById('search').value = '';
    pokemonContainer.innerHTML = '';
    hideError();
    loadInitialPokemon();
}

function showError(message) {
    errorDisplay.style.display = 'block';
    errorDisplay.textContent = message;
}

function hideError() {
    errorDisplay.style.display = 'none';
}

function showLoading() {
    loadingDisplay.style.display = 'block';
    hideError();
}

function hideLoading() {
    loadingDisplay.style.display = 'none';
}

window.onload = loadInitialPokemon;