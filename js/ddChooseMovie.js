const urlMovies = "http://localhost:8080/movies";
console.log("Jeg er i ddChooseMovie");

const ddMovies = document.getElementById("ddMovies");
const ddGenre = document.getElementById("ddGenre");

async function fetchMovies() {
    try {
        const response = await fetch(urlMovies);

        if (response.ok) {
            const movies = await response.json();

            if (movies.length === 0) {
                console.log("Ingen film fundet.");
            }

            ddMovies.innerHTML = "<option value=''>Vælg en film</option>";
            movies.forEach(movie => {
                const option = document.createElement("option");
                option.textContent = movie.movieName;
                option.value = movie.movieId;
                ddMovies.appendChild(option);
            });

            // Call fetchMovieGenre with the fetched movies to populate the genre dropdown
            fetchMovieGenre(movies);

            // Display all movies initially
            displayMovies(movies);
        } else {
            console.error("Failed to fetch movies: " + response.statusText);
        }
    } catch (error) {
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

async function fetchMoviePlan(movieID) {
    const urlMoviePlan = `http://localhost:8080/movieplans/${movieID}`;
    try {
        const response = await fetch(urlMoviePlan);
        if (response.ok) {
            const moviePlans = await response.json();
            console.log("Movie plans received:", moviePlans);
            displayMoviePlans(moviePlans); //
        } else {
            console.error("Failed to fetch movie plan: " + response.statusText);
        }
    } catch (error) {
        console.error("Error fetching movie plan:", error);
    }
}

// Event listener for movie selection
async function selectMovie(ev) {
    console.log(ev);
    const sel = ddMovies.selectedIndex;
    const selectedOption = ddMovies.options[sel];
    const movieID = selectedOption.value;
    console.log("Valgt film ID: " + movieID);

    if (movieID) {
        // ✅ Clear the full movie list BEFORE showing the selected movie
        const movieListContainer = document.getElementById("frontPage");
        if (movieListContainer) {
            movieListContainer.innerHTML = "";
        }

        // ✅ Fetch and display only the selected movie
        await fetchMovieDetails(movieID);
    }
}


async function fetchMovieDetails(movieID) {
    const urlMovieDetails = `http://localhost:8080/movies/${movieID}`
    try {
        const response = await fetch(urlMovieDetails)
        if (response.ok) {
            const movie = await response.json()
            displayMovieDetails(movie)
        } else {
            console.error("Failed to fetch movie details: " + response.statusText)
        }
    } catch (error) {
        console.error("Error fetching movie details:", error)
    }
}

//Mangler så at når man clicker på et billede med movie så skal den også opdatere de andre søge kriterier såsom Select movie og genre
function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById("movieDetails");

    // Clear previous content
    movieDetailsContainer.innerHTML = '';

    // Movie title
    const movieTitle = document.createElement('h2');
    movieTitle.textContent = movie.movieName;
    movieDetailsContainer.appendChild(movieTitle);

    // Movie genre
    const movieGenre = document.createElement('p');
    movieGenre.textContent = movie.genre;
    movieDetailsContainer.appendChild(movieGenre);

    // Movie age limit
    const movieAgeLimit = document.createElement('p');
    movieAgeLimit.textContent = "PG " + movie.ageLimit;
    movieDetailsContainer.appendChild(movieAgeLimit);

    // Movie duration
    const movieDuration = document.createElement('p');
    movieDuration.textContent = movie.duration + " minutes";
    movieDetailsContainer.appendChild(movieDuration);

    // Movie image
    const movieImage = document.createElement("img");
    movieImage.src = movie.imageUrl;
    movieDetailsContainer.appendChild(movieImage);

    // Movie Plan Button
    const moviePlanButton = document.createElement("button");
    moviePlanButton.textContent = "See Movie Plan";
    moviePlanButton.id = "moviePlanButton";  // Add an ID
    movieDetailsContainer.appendChild(moviePlanButton);

    // Add event listener for "See Movie Plan" button
    moviePlanButton.addEventListener("click", function () {
        fetchMoviePlan(movie.movieId);
    });

    console.log("Movie ID for fetching plans:", movie.movieId);

// Add click event to return to the homepage
    backLogo.addEventListener("click", () => {
        // Clear the movie details section
        movieDetailsContainer.innerHTML = '';

        // Clear the movie plans container
        const moviePlanContainer = document.getElementById("moviePlan");
        moviePlanContainer.innerHTML = '';

        // Re-fetch and display all movies
        fetchMovies();
    });




    // Add an event listener for the back button
    backButton.addEventListener("click", () => {
        // Clear movie details section
        movieDetailsContainer.innerHTML = '';
        // Clear the movie plans container (if it's displayed)
        const moviePlanContainer = document.getElementById("moviePlan");
        moviePlanContainer.innerHTML = '';


        // Re-fetch and display the movies again (or you can show them directly if you already have them in memory)
        fetchMovies(); // Assuming fetchMovies fetches all movies and displays them on the front page
    });

    // Event listener for the "See Movie Plan" button
    moviePlanButton.addEventListener("click", () => {

        fetchMoviePlan(movie.movieId);
    });


    moviePlanButton.addEventListener("click", () => fetchMoviePlan(movie.movieId));
}



function displayMoviePlans(moviePlans) {
    const moviePlanContainer = document.getElementById("moviePlan");

    moviePlanContainer.innerHTML = '';

    moviePlans.forEach(plan => {
        const moviePlanDate = document.createElement('h3');
        moviePlanDate.textContent = "Show date: " + plan.date
        moviePlanContainer.appendChild(moviePlanDate)

        const showTime = document.createElement('p');
        showTime.textContent = "Show time: " + plan.showNumber
        moviePlanContainer.appendChild(showTime);
    });
}

// Event listener for genre selection
async function selectGenre(ev) {
    console.log(ev);
    const sel = ddGenre.selectedIndex;
    const selectedOption = ddGenre.options[sel];
    const selectedGenre = selectedOption.value;
    console.log("Valgt genre: " + selectedGenre);

    if (selectedGenre) {
        // Fetch movies and filter them by genre
        const response = await fetch(urlMovies);
        if (response.ok) {
            const movies = await response.json();
            const filteredMovies = movies.filter(movie => movie.genre === selectedGenre);
            displayMovies(filteredMovies); // Show filtered movies
        } else {
            console.error("Failed to fetch movies: " + response.statusText);
        }
    } else {
        // If no genre is selected, show all movies
        fetchMovies();
    }
}

// Kald fetchMovies når DOM er klar
document.addEventListener("DOMContentLoaded", fetchMovies);
document.addEventListener("DOMContentLoaded", fetchMovieGenre);
// Event listener for ændringer i dropdown
ddMovies.addEventListener('change', selectMovie);
ddGenre.addEventListener('change', selectGenre);




