document.addEventListener("DOMContentLoaded", function () {
    let formContainer = null;

    function createAddMoviePlanButton() {
        const authToken = localStorage.getItem('auth');
        if (!authToken) {
            return;
        }

        // Create "Add Movie Plan" button
        const addMoviePlanButton = document.createElement("button");
        addMoviePlanButton.id = "addMoviePlanButton";
        addMoviePlanButton.textContent = "Add Movie Plan";
        document.body.appendChild(addMoviePlanButton);

        const frontPageContainer = document.getElementById("frontPage");
        const movieDetailsContainer = document.getElementById("movieDetails");
        const moviePlanContainer = document.getElementById("moviePlan");

        // Add event listener to show the form when the button is clicked
        addMoviePlanButton.addEventListener("click", function() {
            createAddMoviePlanForm();
            frontPageContainer.innerHTML = '';  // Clear content
            movieDetailsContainer.innerHTML = ''; // Clear content
            moviePlanContainer.innerHTML = ''; // Clear content

            addMoviePlanButton.style.display = 'none'; // Hide the button after clicking
        });
    }

    function createAddMoviePlanForm() {
        // Remove any previous form if exists
        if (formContainer) {
            formContainer.remove();
        }

        formContainer = document.createElement("div");
        formContainer.id = "addMoviePlanFormContainer";

        const formTitle = document.createElement("h3");
        formTitle.textContent = "Add a New Movie Plan";
        formContainer.appendChild(formTitle);

        const form = document.createElement("form");
        form.id = "addMoviePlanForm";

        const movieLabel = document.createElement("label");
        movieLabel.setAttribute("for", "movieId");
        movieLabel.textContent = "Movie:";
        form.appendChild(movieLabel);
        const movieInput = document.createElement("select");
        movieInput.id = "movieId";
        movieInput.name = "movieId";
        movieInput.required = true;
        form.appendChild(movieInput);

        const theaterLabel = document.createElement("label");
        theaterLabel.setAttribute("for", "theaterId");
        theaterLabel.textContent = "Theater:";
        form.appendChild(theaterLabel);
        const theaterInput = document.createElement("select");
        theaterInput.id = "theaterId";
        theaterInput.name = "theaterId";
        theaterInput.required = true;
        form.appendChild(theaterInput);

        const showNumberLabel = document.createElement("label");
        showNumberLabel.setAttribute("for", "showNumber");
        showNumberLabel.textContent = "Show Number:";
        form.appendChild(showNumberLabel);
        const showNumberInput = document.createElement("select");
        showNumberInput.id = "showNumber";
        showNumberInput.name = "showNumber";
        showNumberInput.required = true;
        const showNumberOptions = ['MORNING', 'NOON', 'AFTERNOON']; // Example show numbers
        showNumberOptions.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            showNumberInput.appendChild(opt);
        });
        form.appendChild(showNumberInput);

        const moviePlanDateLabel = document.createElement("label");
        moviePlanDateLabel.setAttribute("for", "moviePlanDate");
        moviePlanDateLabel.textContent = "Movie Plan Date:";
        form.appendChild(moviePlanDateLabel);
        const moviePlanDateInput = document.createElement("input");
        moviePlanDateInput.type = "date";
        moviePlanDateInput.id = "moviePlanDate";
        moviePlanDateInput.name = "moviePlanDate";
        moviePlanDateInput.required = true;
        form.appendChild(moviePlanDateInput);

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Add Movie Plan";
        form.appendChild(submitButton);
        formContainer.appendChild(form);
        document.body.appendChild(formContainer);

        // Add event listener for the form submission
        form.addEventListener("submit", addMoviePlan);

        // Add event listener to close the form when clicking outside
        document.addEventListener("click", function (event) {
            if (!formContainer.contains(event.target) && event.target !== addMoviePlanButton) {
                formContainer.remove();
                addMoviePlanButton.style.display = 'inline-block'; // Show the "Add Movie Plan" button again
            }
        });

        // Populate movie and theater options (you need to fetch these from the backend)
        fetchMovies();
        fetchTheaters();
    }

    async function fetchMovies() {
        try {
            const response = await fetch("http://localhost:8080/movies");
            if (response.ok) {
                const movies = await response.json();
                const movieSelect = document.getElementById("movieId");
                movies.forEach(movie => {
                    const option = document.createElement("option");
                    option.value = movie.movieId;
                    option.textContent = movie.movieName;
                    movieSelect.appendChild(option);
                });
            } else {
                console.error("Failed to fetch movies");
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    }

    async function fetchTheaters() {
        try {
            const response = await fetch("http://localhost:8080/theater/all");
            if (response.ok) {
                const theaters = await response.json();
                const theaterSelect = document.getElementById("theaterId");
                theaters.forEach(theater => {
                    const option = document.createElement("option");
                    option.value = theater.theaterId;
                    option.textContent = theater.theaterName;
                    theaterSelect.appendChild(option);
                });
            } else {
                console.error("Failed to fetch theaters");
            }
        } catch (error) {
            console.error("Error fetching theaters:", error);
        }
    }

    async function addMoviePlan(event) {
        event.preventDefault();

        const movieId = document.getElementById("movieId").value;
        const theaterId = document.getElementById("theaterId").value;
        const showNumber = document.getElementById("showNumber").value;
        const moviePlanDate = document.getElementById("moviePlanDate").value;

        if (!movieId || !theaterId || !showNumber || !moviePlanDate) {
            alert("Please fill in all fields");
            return;
        }

        const newMoviePlan = {
            movie: { movieId },
            theater: { theaterId },
            showNumber,
            moviePlanDate
        };

        try {
            const response = await fetch('http://localhost:8080/createMoviePlan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMoviePlan),
            });

            if (response.ok) {
                alert("Movie plan added successfully!");
            } else {
                alert("Failed to add movie plan. Please try again.");
            }
        } catch (error) {
            console.error("Error adding movie plan:", error);
            alert("An error occurred. Please try again.");
        }
    }

    // Show the "Add Movie Plan" button if authenticated
    createAddMoviePlanButton();
});
