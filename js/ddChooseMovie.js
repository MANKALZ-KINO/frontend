const urlMovies = "http://localhost:8080/movies";
console.log("Jeg er i ddChooseMovie");

const ddMovies = document.getElementById("ddMovies");
const ddGenre = document.getElementById("ddGenre");
const testBody = document.getElementById("body-container");


function isUserAuthenticated() {
    // TODO: REMOVE THIS
    localStorage.setItem("auth", 'bruger')
    const auth = localStorage.getItem("auth");
    return auth === "bruger";
}

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
            await fetchMovieGenre(movies);

            fetchMovieGenre(movies);

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
        const genres = new Set();
        movies.forEach(movie => {
            if (movie.genre) {
                genres.add(movie.genre);  // Add unique genres to the set
            }
        });

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

async function selectMovie(ev) {
    console.log(ev);
    const sel = ddMovies.selectedIndex;
    const selectedOption = ddMovies.options[sel];
    const movieID = selectedOption.value;
    console.log("Valgt film ID: " + movieID);

    if (movieID) {
        const movieListContainer = document.getElementById("frontPage");
        if (movieListContainer) {
            movieListContainer.innerHTML = "";
        }
        const moviePlanContainer = document.getElementById("moviePlan");
        if (moviePlanContainer) {
            moviePlanContainer.innerHTML = "";
        }

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
    movieDetailsContainer.appendChild(moviePlanButton);

    moviePlanButton.addEventListener("click", () => {
        movieImage.remove()
        fetchMoviePlan(movie.movieId)
    });


    /*
    backLogo.addEventListener("click", () => {
        movieDetailsContainer.innerHTML = '';

        const moviePlanContainer = document.getElementById("moviePlan");
        moviePlanContainer.innerHTML = '';

        fetchMovies();
    });

     */

    // Add an event listener for the back button
    /*
    backButton.addEventListener("click", () => {

        movieDetailsContainer.innerHTML = '';

        const moviePlanContainer = document.getElementById("moviePlan");
        moviePlanContainer.innerHTML = '';

        fetchMovies();
    });
    moviePlanButton.addEventListener("click", () => {

        fetchMoviePlan(movie.movieId);
    });


    moviePlanButton.addEventListener("click", () => fetchMoviePlan(movie.movieId));

     */
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


function displayMoviePlans(moviePlans) {
    const moviePlanContainer = document.getElementById("moviePlan");

    moviePlanContainer.innerHTML = '';

    moviePlans.forEach(plan => {
        const planDiv = document.createElement("div");
        planDiv.classList.add("movie-plan");

        const moviePlanDate = document.createElement('h3');
        moviePlanDate.textContent = "Show date: " + plan.moviePlanDate
        moviePlanContainer.appendChild(moviePlanDate)

        const showTime = document.createElement('p');
        showTime.textContent = "Show time: " + plan.showNumber
        moviePlanContainer.appendChild(showTime);

        const theater = document.createElement('p')
        theater.textContent = "Theater: " + plan.theater.theaterName

        moviePlanContainer.appendChild(theater)

        // Opret book seats knappen

        const bookSeatsButton = document.createElement("button");
        bookSeatsButton.textContent = "Choose seats";
        bookSeatsButton.classList.add("book-seats-btn");

// Brug dataset til at gemme moviePlanId og theaterId
        bookSeatsButton.dataset.planId = plan.moviePlanId;
        bookSeatsButton.dataset.theaterId = plan.theater.theaterId;

// Knyt event listener til knappen
        bookSeatsButton.addEventListener("click", function () {
            const moviePlanId = this.dataset.planId; // Henter moviePlanId fra knappen
            fetchSeats(moviePlanId); // Henter kun sæder til denne MoviePlan
        });

        planDiv.appendChild(bookSeatsButton);


        planDiv.appendChild(bookSeatsButton); // Tilføj knappen til planen
        moviePlanContainer.appendChild(planDiv);

    })
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

window.addEventListener('load', function () {
    // close modals on background click
    document.addEventListener('click', event => {
        if (event.target.classList.contains('jw-modal')) {
            closeModal();
        }
    });
});


async function selectGenre(ev) {
    console.log(ev);
    const sel = ddGenre.selectedIndex;
    const selectedOption = ddGenre.options[sel];
    const selectedGenre = selectedOption.value;
    console.log("Valgt genre: " + selectedGenre);

    const movieDetailsContainer = document.getElementById("movieDetails");
    if (movieDetailsContainer) {
        movieDetailsContainer.innerHTML = "";
    }

    const moviePlanContainer = document.getElementById("moviePlan");
    if (moviePlanContainer) {
        moviePlanContainer.innerHTML = "";
    }

    if (selectedGenre) {
        try {
            const response = await fetch(urlMovies);
            if (response.ok) {
                const movies = await response.json();
                const filteredMovies = movies.filter(movie => movie.genre === selectedGenre);

                displayMovies(filteredMovies);
            } else {
                console.error("Failed to fetch movies: " + response.statusText);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    } else {
        fetchMovies();
    }
}

// Assign event listener properly
ddGenre.addEventListener('change', selectGenre);


// Kald fetchMovies når DOM er klar
document.addEventListener("DOMContentLoaded", fetchMovies);
document.addEventListener("DOMContentLoaded", fetchMovieGenre);
ddMovies.addEventListener('change', selectMovie);
ddGenre.addEventListener('change', selectGenre);


//SEATS
console.log("Jeg er i seeSeatsBtn!");

// Funktion til at hente sæder
async function fetchSeats(moviePlanId) {
    const urlAllSeats = `http://localhost:8080/allFreeSeats/${moviePlanId}`;
    console.log(`Henter sæder for moviePlanId: ${moviePlanId}`);

    try {
        const response = await fetch(urlAllSeats);
        if (!response.ok) {
            throw new Error("Fejl ved hentning af sæder: " + response.statusText);
        }

        let seats = await response.json();
        console.log("Sæder modtaget:", seats);


        createSeats(seats);
    } catch (error) {
        console.error("Fejl ved hentning af sæder:", error);
    }
}


// Funktion til at vise sæder i UI
function createSeats(seats) {
    const seatsContainer = document.getElementById("seatsContainer");
    seatsContainer.innerHTML = ""; // Rens containeren

    let rows = {}; // Opbevar sæder sorteret efter række

    // Opdel sæder efter række
    seats.forEach(seat => {
        if (!rows[seat.rowNum]) {
            rows[seat.rowNum] = [];
        }
        rows[seat.rowNum].push(seat);
    });

    // Opret rækker
    Object.keys(rows).forEach(rowNum => {
        let rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        rows[rowNum].forEach(seat => {
            let seatElement = document.createElement("div");
            seatElement.textContent = `Row ${seat.rowNum}, Seat ${seat.seatNumb}`;
            seatElement.classList.add("seat");

            if (seat.seatTaken) {
                seatElement.classList.add("taken");
            }

            seatElement.addEventListener("click", function () {
                console.log(`Valgt sæde: Række ${seat.rowNum}, Sæde ${seat.seatNumb}`);
                seatElement.classList.toggle("selected");
            });

            rowDiv.appendChild(seatElement);
        });

        seatsContainer.appendChild(rowDiv);
    });
}

// Event listener til "Choose seats" knappen
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded kører!");

    const seatsBtn = document.getElementById("seeSeatsBtn");

    if (seatsBtn) {
        seatsBtn.addEventListener("click", function () {
            const moviePlanId = prompt("Indtast MoviePlan ID:");
            if (moviePlanId) {
                fetchSeats(moviePlanId);
            }
        });
    }
});
//note
//før videre til en create ticket
//indtast tlf nummer og sørg for at sende det rigtige seat med
//sørg før at automatisk udfylde de andre attributter