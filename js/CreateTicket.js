console.log("jeg er i createTicket!!");

async function createTicket(seatId, phoneNumber){
    const URLCreateTicket = "http://localhost:8080/ticket/createTicket";
    const ticketData = {
        seatId: seatId,
        phoneNumber: phoneNumber,
        price: 100 // Tilføj en fast pris eller hent den dynamisk
    };

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
            displayTicketDetails(ticket)
        } else {
            console.error("Failed to fetch ticket details: " + response.statusText)
        }
    } catch (error) {
        console.error("Error fetching ticket details:", error)
    }
}

function displayTicketDetails(ticket) {
    const ticketDetailsContainer = document.getElementById("ticketDetails");

    // Clear container
    ticketDetailsContainer.innerHTML = '';

    // Movie title
    const ticketId = document.createElement('h2');
    ticketId.textContent = ticket.ticketID;
    ticketDetailsContainer.appendChild(ticketId);

    // ticket phonenumber
    const ticketPhonenumber = document.createElement('p');
    ticketPhonenumber.textContent = ticket.phoneNumber;
    ticketDetailsContainer.appendChild(ticketPhonenumber);

    // ticket price
    const ticketPrice = document.createElement('p');
    ticketPrice.textContent = ticket.ticket_price;
    ticketDetailsContainer.appendChild(ticketPrice);

}

