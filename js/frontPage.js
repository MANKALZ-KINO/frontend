export const moviesUrl = "http://localhost:8080/movies";
import { fetchMovieDetails } from './ddChooseMovie.js';


async function fetchMovies() {
    try {
        const response = await fetch(moviesUrl);

        if (response.ok) {
            const movies = await response.json();
            displayMovies(movies)
            if (movies.length === 0) {
                console.log("Ingen film fundet.");
            }
        } else {
            console.error("Failed to fetch movies: " + response.statusText);
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const homeLogo = document.getElementById("homeLogo");
    if (homeLogo) {
        homeLogo.addEventListener("click", function () {
            // Only reset if movie details are currently shown
            const movieDetailsContainer = document.getElementById("movieDetails");
            if (movieDetailsContainer.innerHTML.trim() !== '') {
                movieDetailsContainer.innerHTML = ''; // Clear movie details
            }

            // Only reset movie plans if they are shown
            const moviePlanContainer = document.getElementById("moviePlan");
            if (moviePlanContainer.innerHTML.trim() !== '') {
                moviePlanContainer.innerHTML = ''; // Clear movie plan
            }

            // Re-fetch and display all movies
            fetchMovies();
        });
    }
});


async function displayMovies(movies) {
    const frontPageContainer = document.getElementById("frontPage");

    // Clear the front page container before adding new movies
    frontPageContainer.innerHTML = '';

    // If there are no movies, show a message
    if (movies.length === 0) {
        const noMoviesMessage = document.createElement('p');
        noMoviesMessage.textContent = "Ingen film fundet for denne genre.";
        frontPageContainer.appendChild(noMoviesMessage);
        return;
    }

    // Loop through the movies and create elements
    movies.forEach(movie => {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("image-container");

        const movieImage = document.createElement("img");
        movieImage.src = movie.imageUrl;
        movieContainer.appendChild(movieImage);

        movieImage.addEventListener("click", () => {
            frontPageContainer.innerHTML = '';
            fetchMovieDetails(movie.movieId);
        });

        const movieName = document.createElement("h3");
        movieName.textContent = movie.movieName;
        movieContainer.appendChild(movieName);

        frontPageContainer.appendChild(movieContainer);
    });
}

document.addEventListener("DOMContentLoaded", fetchMovies);




