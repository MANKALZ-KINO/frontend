document.addEventListener("DOMContentLoaded", function () {
    console.log("Jeg er i seeSeatsBtn!");

    //hvis seattaken sæt rød farve

    const urlAllSeats = "http://localhost:8080/allFreeSeats"
    const seatsBtn = document.getElementById("seeSeatsBtn");
    const seatsContainer = document.getElementById("seatsContainer");

    seatsBtn.addEventListener('click', fetchSeats);

    async function fetchSeats() {
        console.log("Jeg laver seats fra backend");
        try {
            const response = await fetch(urlAllSeats);
            if (!response.ok) {
                throw new Error("Fejl ved hentning af sæder: ");
            }

            const seats = await response.json();
            console.log("Sæder modtaget:", seats);

            createSeats(seats);

        } catch (error) {
            console.log("feeejl")
        }
    }

    function createSeats(seats) {

        // Gør seatsContainer synlig
        seatsContainer.style.display = "grid";
        seatsContainer.innerHTML = ""; // Rens containeren for at undgå dubletter


        const totalRows = 8;
        const seatsPerRow = 8;

        seats.forEach(seat => {
            let seatElement = document.createElement("div");
            seatElement.textContent = `Row ${seat.rowNum}, Seat ${seat.seatNumb}`;
            seatElement.classList.add("seat");

            //hvis sædet er optaget (seat_taken == true) lav det rødt
            if(seat.seatTaken) {
                seatElement.classList.add("taken")
            }

            seatElement.addEventListener("click", function () {
                console.log(`Valgt sæde: Række ${seat.rowNum}, Sæde ${seat.seatNumb}`);
                seatElement.classList.toggle("selected");
            });

            seatsContainer.appendChild(seatElement);

        });
    }
});
