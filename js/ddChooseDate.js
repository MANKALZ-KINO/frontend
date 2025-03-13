const urlDates = "http://localhost:8080/dates";
const urlMoviePlans = "http://localhost:8080/movieplans?date="; // API til at hente movieplans baseret på dato

console.log("Jeg er i ddChooseDate");

const ddDate = document.getElementById("ddDato");
const movieContainer = document.getElementById("movieDetails"); // Container til at vise film

// Hent og vis datoer i dropdown
async function fetchDates() {
    try {
        const response = await fetch(urlDates);

        if (!response.ok) {
            throw new Error("Fejl ved hentning af datoer: " + response.statusText);
        }

        const dates = await response.json();
        ddDate.innerHTML = "<option value=''>Choose a Date</option>";

        dates.forEach(date => {
            const option = document.createElement("option");
            option.textContent = date;
            option.value = date;
            ddDate.appendChild(option);
        });

    } catch (error) {
        console.log("Error fetching Dates:", error);
    }
}

// Hent film for den valgte dato og vis dem på siden
async function fetchMoviesByDate(date) {
    try {
        const response = await fetch(urlMoviePlans + date);

        if (!response.ok) {
            throw new Error("Fejl ved hentning af film for dato: " + response.statusText);
        }

        const moviePlans = await response.json();
        movieContainer.innerHTML = ""; // Ryd container før ny visning

        if (moviePlans.length === 0) {
            movieContainer.innerHTML = "<p>Ingen film fundet for denne dato.</p>";
            return;
        }

        moviePlans.forEach(plan => {
            const movieElement = document.createElement("div");
            movieElement.classList.add("movie-card"); // Til styling
            movieElement.innerHTML = `
                <h3>${plan.movie.movieName}</h3>
                <p>Showtime: ${plan.showNumber}</p>
                <p>Pris: 100 DKK</p>
            `;
            movieContainer.appendChild(movieElement);
        });

    } catch (error) {
        console.log("Error fetching Movies by Date:", error);
    }
}

// Event listener: Når en dato vælges, vis film
ddDate.addEventListener("change", (event) => {
    const selectedDate = event.target.value;
    console.log("Valgt dato:", selectedDate);

    if (selectedDate) {
        fetchMoviesByDate(selectedDate);
    } else {
        movieContainer.innerHTML = "<p>Vælg en dato for at se film.</p>";
    }
});

// Når siden loader, hent datoer
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    fetchDates();
});
