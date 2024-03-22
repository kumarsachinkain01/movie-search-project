const searchInput = document.getElementById("search-movies");
const moviesContainer = document.getElementById("movies-container");
const paginationContainer = document.getElementById("pagination-container");

const API_KEY = "c033725e";
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

// Function to debounce API requests
const debounce = (fn, delay) => {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    };
};

// Function to fetch movies
async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}&s=${searchInput.value}`);
        const data = await response.json();
        if (data.Response === "False") {
            responseIsFalse();
        } else {
            displayMoviesContainer(data.Search);
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        responseIsFalse(); // Display error message
    }
}

// Debounce the fetchMovies function
const debouncedFetchMovies = debounce(fetchMovies, 1000);
searchInput.addEventListener("input", debouncedFetchMovies);

// Function to display movie cards
function displayMoviesContainer(movies) {
    moviesContainer.innerHTML = "";
    movies.forEach(movie => {
        const card = createCard(movie);
        moviesContainer.appendChild(card);
    });
}

// Function to create a movie card
function createCard(movie) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <div class="card-body">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
        </div>
    `;
    return card;
}

// Function to handle API response when no movies are found
function responseIsFalse() {
    moviesContainer.innerHTML = `<h3>No movies found for "${searchInput.value}"</h3>`;
}

// Function to display pagination
function displayPagination(totalResults) {
    // Assuming totalResults is passed as a parameter
    const totalPages = Math.ceil(totalResults / 10);
    paginationContainer.innerHTML = `
        <button ${currentPage === 1 ? "disabled" : ""}>Previous</button>
        <span>${currentPage} of ${totalPages} Pages</span>
        <button ${currentPage === totalPages ? "disabled" : ""}>Next</button>
    `;
}
