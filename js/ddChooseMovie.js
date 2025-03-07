const urlMovies = "http://localhost:8080/movies";
console.log("Jeg er i ddChooseMovie");

const ddMovies = document.getElementById("ddMovies");
const ddGenre = document.getElementById("ddGenre");
const testBody = document.getElementById("body-container");

// function renderBody() {
//     if (isUserAuthenticated(auth)) {
//         testBody.innerHTML = `
//             <select id="ddTeater">
//                 <option value="">Vælg sal</option>
//             </select>
//
//             <select id="ddDato">
//                 <option value="">Vælg dato</option>
//             </select>
//             <select id="ddMovies">
//                 <option value="">Vælg film</option>
//             </select>
//
//             <select id="ddGenre">
//                 <option value="">Vælg genre</option>
//             </select>
//         `
//         return;
//     }
//
//
//     testBody.innerHTML = `
//         Opdater siden :)
//     `
// }

function isUserAuthenticated() {
    // TODO: REMOVE THIS
    localStorage.setItem("auth", 'bruger')
    const auth = localStorage.getItem("auth");
    return auth === "bruger";
}

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
            await fetchMovieGenre(movies);
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
async function selectMovie(ev) {
    console.log(ev);
    const sel = ddMovies.selectedIndex;
    const selectedOption = ddMovies.options[sel];
    const movieID = selectedOption.value;
    console.log("Valgt film ID: " + movieID);

    if (movieID) {
        await fetchMovieDetails(movieID)
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

function displayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById("movieDetails")

    movieDetailsContainer.innerHTML = ''

    const movieTitle = document.createElement('h2')
    movieTitle.textContent = movie.movieName
    movieDetailsContainer.appendChild(movieTitle)

    const movieGenre = document.createElement('p')
    movieGenre.textContent = movie.genre
    movieDetailsContainer.appendChild(movieGenre)

    const movieAgeLimit = document.createElement('p')
    movieAgeLimit.textContent = movie.ageLimit
    movieDetailsContainer.appendChild(movieAgeLimit)

    const movieDuration = document.createElement('p')
    movieDuration.textContent = movie.duration + "m"
    movieDetailsContainer.appendChild(movieDuration)

    const moviePlanButton = document.createElement('button');
    moviePlanButton.textContent = 'See Movie Plan';
    movieDetailsContainer.appendChild(moviePlanButton);

    const movieImage = document.createElement("img")
    movieImage.src = movie.imageUrl
    movieDetailsContainer.appendChild(movieImage)

    console.log("Movie ID for fetching plans:", movie.movieId);

    moviePlanButton.addEventListener("click", () => fetchMoviePlan(movie.movieId));
}

async function fetchMoviePlan(movieID) {
    const urlMoviePlan = `http://localhost:8080/movieplans/${movieID}`;
    try {
        const response = await fetch(urlMoviePlan);
        if (response.ok) {
            const moviePlans = await response.json();
            console.log("Movie plans received:", moviePlans);
            displayMoviePlans(moviePlans, movieID); //
        } else {
            console.error("Failed to fetch movie plan: " + response.statusText);
        }
    } catch (error) {
        console.error("Error fetching movie plan:", error);
    }
}


function displayMoviePlans(moviePlans, movieId) {
    const moviePlanContainer = document.getElementById("moviePlan");

    moviePlanContainer.innerHTML = '';

    if (isUserAuthenticated()) {
        const moviePlanCreateButton = document.createElement("button");
        moviePlanCreateButton.textContent = 'Add movie plan';
        document.getElementById('moviePlan').appendChild(moviePlanCreateButton);
        moviePlanCreateButton.addEventListener("click", () => openModal('create-movie-plan-modal'));
    }

    moviePlans.forEach(plan => {
        const moviePlanDate = document.createElement('h3');
        moviePlanDate.textContent = "Show date: " + plan.date
        moviePlanContainer.appendChild(moviePlanDate)

        const showTime = document.createElement('p');
        showTime.textContent = "Show time: " + plan.showNumber
        moviePlanContainer.appendChild(showTime);
    });
}

// open modal by id
function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.classList.add('jw-modal-open');
}

// close currently open modal
function closeModal() {
    document.querySelector('.jw-modal.open').classList.remove('open');
    document.body.classList.remove('jw-modal-open');
}

async function saveMoviePlan() {
    const date = document.getElementById('new-movie-plan-date').value
    const theater = document.getElementById('new-movie-plan-theater').value
    const showtime = document.getElementById('new-movie-plan-showing').value

    const dto = {
        date,
        theater,
        showtime
    }

    const urlMoviePlan = `http://localhost:8080/movieplans`;
    try {
        const response = await fetch(urlMoviePlan, {
            method: 'POST',
            body: JSON.stringify(dto),

        });
    } catch (error) {
        console.error("Error creating movie plan:", error);
    }
}

window.addEventListener('load', function() {
    // close modals on background click
    document.addEventListener('click', event => {
        if (event.target.classList.contains('jw-modal')) {
            closeModal();
        }
    });
});

// Event listener for movie genre selection
function selectGenre(ev) {
    console.log(ev);
    const sel = ddGenre.selectedIndex;
    const selectedOption = ddGenre.options[sel];
    const genre = selectedOption.value;
    console.log("Valgt genre: " + genre);
}

// Kald fetchMovies når DOM er klar
// document.addEventListener("DOMContentLoaded", renderBody);
document.addEventListener("DOMContentLoaded", fetchMovies);
document.addEventListener("DOMContentLoaded", fetchMovieGenre);
// Event listener for ændringer i dropdown
ddMovies.addEventListener('change', selectMovie);
ddGenre.addEventListener('change', selectGenre);


