const urlMovies = "http://localhost:8080/movies";
console.log("Jeg er i ddChooseMovie");

const ddMovies = document.getElementById("ddMovies");

const ddGenre = document.getElementById("ddGenre");

async function fetchMovies() {
    try {
        const response = await fetch(urlMovies);

        // Tjek om responsen er OK
        if (response.ok) {
            const movies = await response.json();

            // Hvis listen er tom, log en besked
            if (movies.length === 0) {
                console.log("Ingen film fundet.");
            }

            // Fjern tidligere elementer fra dropdown
            ddMovies.innerHTML = "<option value=''>Vælg en film</option>";

            // Tilføj de nye film til dropdown
            movies.forEach(movie => {
                const option = document.createElement("option");
                option.textContent = movie.movieName;
                option.value = movie.movieId;
                ddMovies.appendChild(option);
            });
            fetchMovieGenre(movies);
        } else {
            // Hvis responsen ikke er OK, log fejl
            console.error("Failed to fetch movies: " + response.statusText);
        }
    } catch (error) {
        // Log fejl ved fetch
        console.error("Error fetching movies:", error);
    }
}
async function fetchMovieGenre(movies) {
    try {
        // Create a Set to ensure unique genres
        const genres = new Set();

        // Extract genres from movies
        movies.forEach(movie => {
            if (movie.genre) {
                genres.add(movie.genre);  // Add unique genres to the set
            }
        });

        // If genres are found, populate the genre dropdown
        if (genres.size > 0) {
            // Fjern tidligere elementer fra dropdown
            ddGenre.innerHTML = "<option value=''>Vælg en genre</option>";

            // Add each genre to the dropdown
            genres.forEach(genre => {
                const option = document.createElement("option");
                option.textContent = genre;
                option.value = genre;  // Set genre as value for selection
                ddGenre.appendChild(option);
            });
        } else {
            console.log("Ingen genre fundet.");
        }
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

// Event listener for movie selection
function selectMovie(ev) {
    console.log(ev);
    const sel = ddMovies.selectedIndex;
    const selectedOption = ddMovies.options[sel];
    const mov = selectedOption.value;
    console.log("Valgt film ID: " + mov);
}

// Event listener for movie genre selection
function selectGenre(ev) {
    console.log(ev);
    const sel = ddGenre.selectedIndex;
    const selectedOption = ddGenre.options[sel];
    const genre = selectedOption.value;
    console.log("Valgt genre: " + genre);
}

// Kald fetchMovies når DOM er klar
document.addEventListener("DOMContentLoaded", fetchMovies);
document.addEventListener("DOMContentLoaded", fetchMovieGenre);
// Event listener for ændringer i dropdown
ddMovies.addEventListener('change', selectMovie);
ddGenre.addEventListener('change', selectGenre);


