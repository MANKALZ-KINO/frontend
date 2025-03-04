const urlMovies = "http://localhost:8080/movies";
console.log("Jeg er i ddChooseMovie");

const ddMovies = document.getElementById("ddMovies");

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
        } else {
            // Hvis responsen ikke er OK, log fejl
            console.error("Failed to fetch movies: " + response.statusText);
        }
    } catch (error) {
        // Log fejl ved fetch
        console.error("Error fetching movies:", error);
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

// Kald fetchMovies når DOM er klar
document.addEventListener("DOMContentLoaded", fetchMovies);

// Event listener for ændringer i dropdown
ddMovies.addEventListener('change', selectMovie);


