document.addEventListener("DOMContentLoaded", function () {


    function createAddMovieForm() {

        const authToken = localStorage.getItem('auth');
        if (!authToken) {
            return;
        }

        const formContainer = document.createElement("div");
        formContainer.id = "addMovieFormContainer";

        const formTitle = document.createElement("h3");
        formTitle.textContent = "Add a New Movie";
        formContainer.appendChild(formTitle);

        const form = document.createElement("form");
        form.id = "addMovieForm";

        const movieNameLabel = document.createElement("label");
        movieNameLabel.setAttribute("for", "movieName");
        movieNameLabel.textContent = "Movie Name:";
        form.appendChild(movieNameLabel);
        const movieNameInput = document.createElement("input");
        movieNameInput.type = "text";
        movieNameInput.id = "movieName";
        movieNameInput.name = "movieName";
        movieNameInput.required = true;
        form.appendChild(movieNameInput);
        form.appendChild(document.createElement("br"));

        const genreLabel = document.createElement("label");
        genreLabel.setAttribute("for", "movieGenre");
        genreLabel.textContent = "Genre:";
        form.appendChild(genreLabel);
        const genreInput = document.createElement("input");
        genreInput.type = "text";
        genreInput.id = "movieGenre";
        genreInput.name = "movieGenre";
        genreInput.required = true;
        form.appendChild(genreInput);
        form.appendChild(document.createElement("br"));

        const ageLimitLabel = document.createElement("label");
        ageLimitLabel.setAttribute("for", "movieAgeLimit");
        ageLimitLabel.textContent = "Age Limit:";
        form.appendChild(ageLimitLabel);
        const ageLimitInput = document.createElement("input");
        ageLimitInput.type = "number";
        ageLimitInput.id = "movieAgeLimit";
        ageLimitInput.name = "movieAgeLimit";
        ageLimitInput.required = true;
        form.appendChild(ageLimitInput);
        form.appendChild(document.createElement("br"));

        const durationLabel = document.createElement("label");
        durationLabel.setAttribute("for", "movieDuration");
        durationLabel.textContent = "Duration (minutes):";
        form.appendChild(durationLabel);
        const durationInput = document.createElement("input");
        durationInput.type = "number";
        durationInput.id = "movieDuration";
        durationInput.name = "movieDuration";
        durationInput.required = true;
        form.appendChild(durationInput);
        form.appendChild(document.createElement("br"));

        const imageUrlLabel = document.createElement("label");
        imageUrlLabel.setAttribute("for", "movieImageUrl");
        imageUrlLabel.textContent = "Image URL:";
        form.appendChild(imageUrlLabel);
        const imageUrlInput = document.createElement("input");
        imageUrlInput.type = "url";
        imageUrlInput.id = "movieImageUrl";
        imageUrlInput.name = "movieImageUrl";
        imageUrlInput.required = true;
        form.appendChild(imageUrlInput);
        form.appendChild(document.createElement("br"));

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Add Movie";
        form.appendChild(submitButton);
        formContainer.appendChild(form);
        document.body.appendChild(formContainer);

        form.addEventListener("submit", addMovie);
    }


    async function addMovie(event) {
        event.preventDefault();

        const movieName = document.getElementById("movieName").value;
        const genre = document.getElementById("movieGenre").value;
        const ageLimit = document.getElementById("movieAgeLimit").value;
        const duration = document.getElementById("movieDuration").value;
        const imageUrl = document.getElementById("movieImageUrl").value;

        if (!movieName || !genre || !ageLimit || !duration || !imageUrl) {
            alert("Please fill in all fields");
            return;
        }
        const newMovie = {
            movieName,
            genre,
            ageLimit: parseInt(ageLimit),
            duration: parseInt(duration),
            imageUrl
        };
        try {
            const response = await fetch('http://localhost:8080/createmovie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMovie),
            });
            if (response.ok) {
                alert("Movie added successfully!");
            } else {
                alert("Failed to add movie. Please try again.");
            }
        } catch (error) {
            console.error("Error adding movie:", error);
            alert("An error occurred. Please try again.");
        }
    }
    createAddMovieForm();
});
