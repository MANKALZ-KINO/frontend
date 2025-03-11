async function fetchSeatsForMoviePlan(moviePlanID) {
    try {
        // Fetch all seats in the theater
        const seatsResponse = await fetch(`http://localhost:8080/theater/movieplan/${moviePlanID}/seats`);
        const seats = seatsResponse.ok ? await seatsResponse.json() : [];

        // Fetch booked tickets (reserved seats)
        const ticketsResponse = await fetch(`http://localhost:8080/ticket/tickets/${moviePlanID}`);
        const tickets = ticketsResponse.ok ? await ticketsResponse.json() : [];

        const bookedSeatIds = new Set(tickets.map(ticket => ticket.seat.seatId)); // Extract reserved seat IDs

        console.log("All seats:", seats);
        console.log("Booked seats:", bookedSeatIds);

        displaySeats(seats, bookedSeatIds); // Pass both to displaySeats function
    } catch (error) {
        console.error("Error fetching seats:", error);
    }
}

function displaySeats(seats, bookedSeatIds) {
    const seatContainer = document.getElementById("bookingPage");
    seatContainer.innerHTML = '';

    seats.forEach(seat => {
        const seatDiv = document.createElement("div");
        seatDiv.classList.add("seat");
        seatDiv.textContent = `Row ${seat.rowNum} - Seat ${seat.seatNumb}`;
        seatDiv.dataset.seatId = seat.seatId;

        if (bookedSeatIds.has(seat.seatId)) {
            seatDiv.classList.add("reserved"); // Add a reserved class for styling
        } else {
            seatDiv.addEventListener("click", () => selectSeat(seatDiv)); // Select only if not reserved
        }

        seatContainer.appendChild(seatDiv);
    });

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Confirm Selection";
    confirmButton.classList.add("confirm-btn");
    confirmButton.addEventListener("click", confirmSelection);

    seatContainer.appendChild(confirmButton);
}

function selectSeat(seatDiv) {
    if (!seatDiv.classList.contains("reserved")) {
        seatDiv.classList.toggle("selected");
        console.log("Seat selected:", seatDiv.dataset.seatId);
    }
}

function confirmSelection() {
    const selectedSeats = [...document.querySelectorAll(".seat.selected")].map(seat => seat.dataset.seatId);
    console.log("Selected Seats:", selectedSeats);

    if (selectedSeats.length === 0) {
        alert("Please select at least one seat!");
        return;
    }

    // Send selectedSeats to the backend via API
    alert(`Seats confirmed: ${selectedSeats.join(", ")}`);
}