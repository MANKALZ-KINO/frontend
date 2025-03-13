// ticketManagement.js - Handles the ticket management functionality

// Global variable to store the current customer's tickets
let currentCustomerTickets = [];
const API_BASE_URL = 'http://localhost:8080'; // Adjust this to your actual backend URL

document.addEventListener('DOMContentLoaded', function() {
    // Add ticket management button to navbar
    const header = document.getElementById('ddHeader');
    if (header) {
        const manageTicketsBtn = document.createElement('button');
        manageTicketsBtn.id = 'manageTicketsBtn';
        manageTicketsBtn.textContent = 'Manage Tickets';
        manageTicketsBtn.style.position = 'absolute';
        manageTicketsBtn.style.right = '100px';
        manageTicketsBtn.className = 'btn btn-primary';
        manageTicketsBtn.addEventListener('click', showTicketManagementSection);
        header.appendChild(manageTicketsBtn);
    }

    const logo = document.getElementById('homeLogo');
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.reload();
        });
    }

    // Set up event listeners for the ticket lookup form if it exists
    setupTicketLookupForm();

    // Set up close button for the change ticket modal if it exists
    const closeChangeTicketBtn = document.getElementById('closeChangeTicketBtn');
    if (closeChangeTicketBtn) {
        closeChangeTicketBtn.addEventListener('click', closeChangeTicketModal);
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('changeTicketModal');
        if (event && modal && event.target === modal) {
            closeChangeTicketModal();
        }
    });
});

// Function to set up ticket lookup form event listeners
function setupTicketLookupForm() {
    const lookupForm = document.getElementById('ticketLookupForm');
    if (lookupForm) {
        lookupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleTicketLookup(event);
        });
        console.log('Ticket lookup form event listener set up successfully');
    } else {
        console.log('Ticket lookup form not found in DOM');
    }
}

// Function to show the ticket management section
function showTicketManagementSection() {
    console.log("Manage Tickets button clicked");

    // Hide common content areas
    const elementsToHide = [
        document.getElementById('movieDetails'),
        document.getElementById('ticketDetails'),
        document.getElementById('moviePlan'),
        document.getElementById('frontPage'),
        document.getElementById('bookingPage'),
        document.querySelector('.seats-container'),
        document.querySelector('.dropdown-container')
    ];

    elementsToHide.forEach(element => {
        if (element) element.style.display = 'none';
    });

    // Show the ticket management section
    const ticketManagementSection = document.getElementById('ticketManagementSection');
    if (ticketManagementSection) {
        ticketManagementSection.style.display = 'block';
        ticketManagementSection.classList.remove('hidden');

        // Make sure the form has event listeners
        setupTicketLookupForm();
    } else {
        // Create the section if it doesn't exist
        createTicketManagementSection();
    }
}

// Function to create the ticket management section
function createTicketManagementSection() {
    console.log('Creating ticket management section');
    const main = document.querySelector('main');
    if (!main) {
        console.error('Main element not found');
        return;
    }

    const section = document.createElement('section');
    section.id = 'ticketManagementSection';
    section.className = 'container mt-4';

    section.innerHTML = `
        <h2>Ticket Management</h2>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Look Up Tickets</h5>
                <form id="ticketLookupForm" class="mb-4">
                    <div class="form-group">
                        <label for="phoneNumber">Phone Number</label>
                        <input type="number" class="form-control" id="phoneNumber" required>
                    </div>
                    <button type="submit" class="btn btn-primary mt-2">Look Up</button>
                </form>
            </div>
        </div>
        
        <div id="customerTicketsContainer" class="mt-4" style="display: none;">
            <h3>Your Tickets</h3>
            <div id="customerTicketsList" class="row"></div>
        </div>
        
        <!-- Change Ticket Modal -->
        <div id="changeTicketModal" class="modal">
            <div class="modal-content">
                <span class="close" id="closeChangeTicketBtn">&times;</span>
                <h2>Change Ticket</h2>
                <form id="changeTicketForm">
                    <input type="hidden" id="ticketIdForChange">
                    <div class="form-group">
                        <label for="newMoviePlanSelect">Select New Movie/Time:</label>
                        <select class="form-control" id="newMoviePlanSelect"></select>
                    </div>
                    <div class="form-group">
                        <label for="newSeatSelect">Select New Seat:</label>
                        <select class="form-control" id="newSeatSelect"></select>
                    </div>
                    <button type="submit" class="btn btn-primary mt-3">Change Ticket</button>
                </form>
            </div>
        </div>
    `;

    main.appendChild(section);

    // Set up the ticket lookup form event listeners
    setupTicketLookupForm();

    // Set up the change ticket form event listeners
    const changeTicketForm = document.getElementById('changeTicketForm');
    if (changeTicketForm) {
        changeTicketForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleChangeTicketSubmit();
        });
    }

    // Set up the close button for the change ticket modal
    const closeChangeTicketBtn = document.getElementById('closeChangeTicketBtn');
    if (closeChangeTicketBtn) {
        closeChangeTicketBtn.addEventListener('click', closeChangeTicketModal);
    }
}

// Function to handle ticket lookup form submission
function handleTicketLookup(event) {
    event.preventDefault();
    const phoneInput = document.getElementById('customerPhoneInput').value;
    console.log('Phone number entered:', phoneInput);

    // Try parsing it to an integer
    const phoneNumber = parseInt(phoneInput);
    console.log('Parsed phone number:', phoneNumber);

    // Check if it's a valid number
    if (isNaN(phoneNumber)) {
        console.error('Invalid phone number');
        return;
    }


    fetchCustomerTickets(phoneNumber);
}

// Function to fetch customer tickets from the backend
function fetchCustomerTickets(phoneNumber) {
    const url = `${API_BASE_URL}/ticket/customer-tickets?phoneNumber=${phoneNumber}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('No tickets found for this phone number');
                }
                throw new Error('The ticket has been cancelled :)');
            }
            return response.json();
        })
        .then(tickets => {
            console.log('Fetched tickets:', tickets);
            currentCustomerTickets = tickets;
            displayCustomerTickets(tickets);
        })
        .catch(error => {
            console.error('Error fetching customer tickets:', error);
            showTicketLookupError(error.message);
        });
}

// Function to display customer tickets
function displayCustomerTickets(tickets) {
    const container = document.getElementById('customerTicketsContainer');
    const ticketsList = document.getElementById('customerTicketsList');

    if (!container || !ticketsList) {
        console.error('Ticket container elements not found');
        return;
    }

    container.style.display = 'block';
    ticketsList.innerHTML = '';

    if (tickets.length === 0) {
        ticketsList.innerHTML = '<div class="col-12"><p>No tickets found.</p></div>';
        return;
    }

    tickets.forEach(ticket => {
        const ticketCard = document.createElement('div');
        ticketCard.className = 'col-md-6 col-lg-4 mb-3';

        // Format the date for display
        const orderDate = ticket.order_date ? new Date(ticket.order_date).toLocaleDateString() : 'N/A';

        // Extract movie title from moviePlan
        const movieTitle = ticket.moviePlan && ticket.moviePlan.movie ?
            ticket.moviePlan.movie.title : 'N/A';

        // Extract showtime info
        const showDate = ticket.moviePlan && ticket.moviePlan.moviePlanDate ?
            new Date(ticket.moviePlan.moviePlanDate).toLocaleDateString() : 'N/A';

        const showNumber = ticket.moviePlan && ticket.moviePlan.showNumber ?
            ticket.moviePlan.showNumber : 'N/A';

        // Extract theater info
        const theaterName = ticket.moviePlan && ticket.moviePlan.theater ?
            ticket.moviePlan.theater.theaterName : 'N/A';

        // Extract seat info
        const seatNumber = ticket.seat ? ticket.seat.seatNumber : 'N/A';

        ticketCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${movieTitle}</h5>
                    <p class="card-text">
                        <strong>Ticket ID:</strong> ${ticket.ticketID}<br>
                        <strong>Order Date:</strong> ${orderDate}<br>
                        <strong>Show Date:</strong> ${showDate}<br>
                        <strong>Show Time:</strong> ${showNumber}<br>
                        <strong>Theater:</strong> ${theaterName}<br>
                        <strong>Seat:</strong> ${seatNumber}<br>
                       <!-- <strong>Price:</strong> $${ticket}--!>
                    </p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-warning btn-sm change-ticket-btn" data-ticket-id="${ticket.ticketID}">
                        Change
                    </button>
                    <button class="btn btn-danger btn-sm cancel-ticket-btn" data-ticket-id="${ticket.ticketID}">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        ticketsList.appendChild(ticketCard);
    });

    // Add event listeners to the change and cancel buttons
    addTicketButtonEventListeners();
}

// Function to add event listeners to ticket buttons
function addTicketButtonEventListeners() {
    // Add event listeners for change buttons
    const changeButtons = document.querySelectorAll('.change-ticket-btn');
    changeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-ticket-id');
            openChangeTicketModal(ticketId);
        });
    });

    // Add event listeners for cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-ticket-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-ticket-id');
            confirmCancelTicket(ticketId);
        });
    });
}

// Function to show ticket lookup error
function showTicketLookupError(errorMessage) {
    const container = document.getElementById('customerTicketsContainer');
    const ticketsList = document.getElementById('customerTicketsList');

    if (!container || !ticketsList) {
        console.error('Ticket container elements not found');
        return;
    }

    container.style.display = 'block';
    ticketsList.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger" role="alert">
                ${errorMessage}
            </div>
        </div>
    `;
}

// Function to confirm ticket cancellation
function confirmCancelTicket(ticketId) {
    if (confirm('Are you sure you want to cancel this ticket? This action cannot be undone.')) {
        cancelTicket(ticketId);
    }
}

// Function to cancel ticket
function cancelTicket(ticketId) {
    const url = `${API_BASE_URL}/ticket/tickets/${ticketId}`;

    fetch(url, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to cancel ticket');
            }

            // Remove the cancelled ticket from the display
            const phoneNumber = document.getElementById('phoneNumber').value;
            fetchCustomerTickets(phoneNumber);

            alert('Ticket cancelled successfully');
        })
        .catch(error => {
            console.error('Error cancelling ticket:', error);
            alert('Failed to cancel ticket: ' + error.message);
        });
}

// Function to open change ticket modal
function openChangeTicketModal(ticketId) {
    // Find the ticket in the current customer tickets
    const ticketToChange = currentCustomerTickets.find(ticket => ticket.ticketID == ticketId);

    if (!ticketToChange) {
        console.error('Ticket not found');
        return;
    }

    // Set the ticket ID in the hidden input
    const ticketIdInput = document.getElementById('ticketIdForChange');
    if (ticketIdInput) {
        ticketIdInput.value = ticketId;
    }

    // Fetch available movie plans and populate the select
    fetchAvailableMoviePlans().then(() => {
        // Show the modal
        const modal = document.getElementById('changeTicketModal');
        if (modal) {
            modal.style.display = 'block';
        }
    });
}

// Function to close change ticket modal
function closeChangeTicketModal() {
    const modal = document.getElementById('changeTicketModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Function to fetch available movie plans
function fetchAvailableMoviePlans() {
    const url = `${API_BASE_URL}/movieplan/all`;
    const moviePlanSelect = document.getElementById('newMoviePlanSelect');

    if (!moviePlanSelect) {
        return Promise.reject('Movie plan select element not found');
    }

    // Clear existing options
    moviePlanSelect.innerHTML = '';

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch movie plans');
            }
            return response.json();
        })
        .then(moviePlans => {
            moviePlans.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.moviePlanId;

                // Format the date
                const planDate = new Date(plan.moviePlanDate).toLocaleDateString();

                // Get movie title and show number
                const movieTitle = plan.movie ? plan.movie.title : 'Unknown Movie';
                const showNumber = plan.showNumber || 'Unknown Time';
                const theaterName = plan.theater ? plan.theater.theaterName : 'Unknown Theater';

                option.textContent = `${movieTitle} - ${planDate} - ${showNumber} - ${theaterName}`;
                moviePlanSelect.appendChild(option);
            });

            // When a movie plan is selected, load available seats
            moviePlanSelect.addEventListener('change', function() {
                const selectedMoviePlanId = this.value;
                fetchAvailableSeats(selectedMoviePlanId);
            });

            // Trigger change event to load seats for the first movie plan
            if (moviePlans.length > 0) {
                moviePlanSelect.value = moviePlans[0].moviePlanId;
                moviePlanSelect.dispatchEvent(new Event('change'));
            }
        })
        .catch(error => {
            console.error('Error fetching movie plans:', error);
            alert('Failed to load available movie plans: ' + error.message);
            return Promise.reject(error);
        });
}

// Function to fetch available seats for a movie plan
function fetchAvailableSeats(moviePlanId) {
    const url = `${API_BASE_URL}/seat/available?moviePlanId=${moviePlanId}`;
    const seatSelect = document.getElementById('newSeatSelect');

    if (!seatSelect) {
        console.error('Seat select element not found');
        return;
    }

    // Clear existing options
    seatSelect.innerHTML = '';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch available seats');
            }
            return response.json();
        })
        .then(seats => {
            if (seats.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No seats available';
                seatSelect.appendChild(option);
                return;
            }

            seats.forEach(seat => {
                const option = document.createElement('option');
                option.value = seat.seatId;
                option.textContent = `Seat ${seat.seatNumber} - Row ${seat.rowNumber}`;
                seatSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching available seats:', error);
            alert('Failed to load available seats: ' + error.message);
        });
}

// Function to handle change ticket form submission
function handleChangeTicketSubmit() {
    const ticketId = document.getElementById('ticketIdForChange').value;
    const moviePlanId = document.getElementById('newMoviePlanSelect').value;
    const seatId = document.getElementById('newSeatSelect').value;

    if (!ticketId || !moviePlanId || !seatId) {
        alert('Please select a movie and seat');
        return;
    }

    // Send request to change ticket
    const url = `${API_BASE_URL}/ticket/tickets/change?ticketId=${ticketId}&moviePlanId=${moviePlanId}&seatId=${seatId}`;

    fetch(url, {
        method: 'PUT'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to change ticket');
            }
            return response.json();
        })
        .then(updatedTicket => {
            // Close the modal
            closeChangeTicketModal();

            // Refresh the tickets display
            const phoneNumber = document.getElementById('phoneNumber').value;
            fetchCustomerTickets(phoneNumber);

            alert('Ticket changed successfully');
        })
        .catch(error => {
            console.error('Error changing ticket:', error);
            alert('Failed to change ticket: ' + error.message);
        });
}