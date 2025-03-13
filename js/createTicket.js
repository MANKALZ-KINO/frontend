console.log("jeg er i createTicket!!");
//fetchmovies
//vis alle movieplans
//display seat number(displayticket)
//bestille flere biletter


export async function createTicket(seatId, phoneNumber, moviePlanId){
    console.log("CREATETICKET BLIVER KALDT")
    console.log("seatId:", seatId);
    console.log("moviePlanId:", moviePlanId);
    console.log("phoneNumber:", phoneNumber);

    // Konverter telefonnummer til integer
    const phoneNumberInt = parseInt(phoneNumber, 10);
    if (isNaN(phoneNumberInt)) {
        console.error("Ugyldigt telefonnummer!");
        alert("Indtast et gyldigt telefonnummer!");
        return;
    }

    const URLCreateTicket = "http://localhost:8080/ticket/createTicket";
    const ticketData = {
        order_date: new Date().toISOString().split("T")[0], // Automatisk dags dato
        phoneNumber: phoneNumberInt,
        ticket_price: 120,
        seat: { seatId: seatId },  // Ændret fra seatId til et seat-objekt
        moviePlan: { moviePlanId: moviePlanId } // Ændret fra moviePlanId til et moviePlan-objekt
    };


    console.log("Sender ticket data:", JSON.stringify(ticketData));

    try {
        const response = await fetch(URLCreateTicket, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticketData)
        });

    if (response.ok) {
            const ticket = await response.json()
        confirm("Order went through, you now have a ticket!");
        console.log("Modtaget ticket JSON fra backend:", ticket);
        displayTicketDetails(ticket)
        } else {
            console.error("Failed to fetch ticket details: " + response.statusText)
        }
    } catch (error) {
        console.error("Error fetching ticket details:", error)
    }
}
function displayTicketDetails(ticket) {
    console.log("🎟️ Modtaget ticket JSON fra backend:", ticket);
    console.log("💺 Seat:", ticket.seat);
    console.log("💺 Seat ID:", ticket.seat?.seatId);
    console.log("💺 Row Number:", ticket.seat?.rowNum);



    let seatInfo = "📍 Seat: Not Available";

    if (ticket.seat) {
        seatInfo = `📍 Seat: Row ${ticket.seat.rowNum}, Seat ${ticket.seat.seatNumb}`;
    }

    confirm(
        `✅ Order Successful!\n\n` +
        `🎟 Ticket ID: ${ticket.ticketID}\n` +
        `📅 Order Date: ${ticket.order_date}\n` +
        `📞 Phone Number: ${ticket.phoneNumber}\n` +
        `💰 Price: ${ticket.ticket_price} DKK\n` +
        `🎬 Movie: ${ticket.moviePlan.movie.movieName}\n` +
        seatInfo + `\n` +
        `🕒 Showtime: ${ticket.moviePlan.showNumber}`
    );

    location.reload();
}


