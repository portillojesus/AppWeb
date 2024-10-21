const apiKey = ''; // Reemplaza con tu clave API

//const apiUrl = 'https://api.themoviedb.org/3';
const apiUrl = 'https://api.themoviedb.org/3';

const movieList = document.getElementById('movies');

const movieDetails = document.getElementById('movie-details');

const detailsContainer = document.getElementById('details');

const searchButton = document.getElementById('search-button');

const searchInput = document.getElementById('search-input');

const favoritesList = document.getElementById('favorites-list');

const addToFavoritesButton = document.getElementById('add-to-favorites');

let selectedMovieId = null;

let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];



// Fetch and display popular movies

async function fetchPopularMovies() {

    try {

        // tu codigo aqui: realiza una solicitud para obtener las películas populares
        const response = await fetch(`${apiUrl}/movie/popular?api_key=&language=en-US&page=1`);
        if (!response.ok) {
            throw new Error('Error fetching popular movies');
        }
        const data = await response.json();

        displayMovies(data.results); // Llamar a displayMovies con la lista de películas

    } catch (error) {

        console.error('Error fetching popular movies:', error);

    }

}



// Display movies

function displayMovies(movies) {

    movieList.innerHTML = ''; // Limpia la lista de películas

    movies.forEach(movie => {

        const li = document.createElement('li');

        li.innerHTML = `

            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">

            <span>${movie.title}</span>

        `;

        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película

        movieList.appendChild(li);

    });

}



// Show movie details

async function showMovieDetails(movieId) {

    try {

        // tu codigo aqui: realiza una solicitud para obtener los detalles de la película
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=&language=en-US`);
        if (!response.ok) {
            throw new Error('Error fetching movie details');
        }
        const movie = await response.json();
        
        // Actualizar el contenedor de detalles con la información de la película
        detailsContainer.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}</p>
        `;

        // Almacenar el ID de la película seleccionada
        movieDetails.classList.remove('hidden');
        selectedMovieId = movie.id;
        

    } catch (error) {

        console.error('Error fetching movie details:', error);

    }

}



// Search movies

searchButton.addEventListener('click', async () => {

    const query = searchInput.value;

    if (query) {

        try {

            const response = await fetch(`${apiUrl}/search/movie?api_key=&query=${encodeURIComponent(query)}&language=en-US&page=1`);
            if (!response.ok) {
                throw new Error('Error searching movies');
            }
            const data = await response.json();
            if (data.results.length > 0) {
                displayMovies(data.results); // Mostrar los resultados de búsqueda
            } else {
                movieList.innerHTML = '<li>No results found</li>';
            }
            
        } catch (error) {

            console.error('Error searching movies:', error);

        }

    }

});



// Add movie to favorites

addToFavoritesButton.addEventListener('click', () => {

    if (selectedMovieId) {

        const favoriteMovie = {

            id: selectedMovieId,

            title: document.querySelector('#details h3').textContent

        };

        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {

            favoriteMovies.push(favoriteMovie);

            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage

            displayFavorites(); // Muestra la lista actualizada de favoritos

        }

    }

});



// Display favorite movies

function displayFavorites() {

    favoritesList.innerHTML = ''; // Limpia la lista de favoritos

    favoriteMovies.forEach(movie => {

        const li = document.createElement('li');

        li.textContent = movie.title;

        favoritesList.appendChild(li);

    });

}



// Initial fetch of popular movies and display favorites

fetchPopularMovies(); // Obtiene y muestra las películas populares

displayFavorites(); // Muestra las películas favoritas guardadas