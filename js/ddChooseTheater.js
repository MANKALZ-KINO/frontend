const urlTheaters = "http://localhost:8080/theater/all";
console.log("Jeg er i ddChooseTheater");

const ddTheater = document.getElementById("ddTeater");

async function fetchTheaters(){
    try {
        const response = await fetch(urlTheaters)

        if (!response.ok) {
            throw new Error("fejl ved hentning af teatre" + response.statusText)
        }
        const theaters = await response.json();
        ddTheater.innerHTML = "<option value=''>Choose a theater</option>";

        theaters.forEach(theater => {
            const option = document.createElement("option");
            option.textContent = theater.theaterName;
            option.value = theater.theaterId;
            ddTeater.appendChild(option);
        });
        //fetchTheaters(theaters)
    } catch (error){
        console.log("Error fetching Theaters")
    }


    }






document.addEventListener("DOMContentLoaded", fetchTheaters);
