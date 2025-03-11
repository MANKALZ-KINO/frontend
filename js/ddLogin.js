const logout = () => {
    localStorage.removeItem('auth');
    determineLogin();
}

const determineLogin = () => {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const authToken = localStorage.getItem('auth');

    if (authToken) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    determineLogin();

    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const loginForm = document.getElementById('loginForm');
    const loginErrorBanner = document.getElementById('loginErrorBanner');

    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
    })

    closeModalButton.addEventListener('click', () => {
        loginModal.style.display = 'none';
    })

    loginForm.addEventListener('submit', async () => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const result = await fetch("http://localhost:8080/login", {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })

        if (result.status === 200) {
            localStorage.setItem('auth', username);
            determineLogin()
        } else {
            showErrorBanner()
        }

        loginModal.style.display = 'none';

        console.log(result)
    })

    const showErrorBanner = () => {
        loginErrorBanner.style.display = 'block';
        setTimeout(function() {
            loginErrorBanner.style.display = 'none';
        }, 3000); // Hide the banner after 3 seconds
    }
});
