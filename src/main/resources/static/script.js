// Wait for the entire HTML document to be loaded and parsed before running the script.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GET ELEMENT REFERENCES ---
    // Get all the interactive elements from the HTML page that we need to control.
    const mapContainer = document.getElementById('map');
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeBtn = document.querySelector('.close-btn');

    // Forms and form views
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Links to switch between forms
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    // Area to display messages from the server
    const formMessage = document.getElementById('formMessage');

    // --- 2. MAP INITIALIZATION (NOW WITH A SAFETY CHECK) ---
    // First, check if the map container element actually exists on the page.
    if (mapContainer) {
        // Create an interactive map using the Leaflet.js library.
        const map = L.map(mapContainer).setView([6.9271, 79.8612], 13);

        // Add a tile layer to the map. This is the visual map image.
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        // If the map container is not found, log an error to the console.
        // This prevents the entire script from crashing.
        console.error("Error: Map container element with id 'map' was not found.");
    }


    // --- 3. MODAL AND FORM VIEW LOGIC ---
    // Functions to control the visibility of the modal and the forms inside it.

    const showLoginView = () => {
        loginView.style.display = 'block';
        registerView.style.display = 'none';
    };

    const showRegisterView = () => {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    };

    const openModal = (viewToShow) => {
        formMessage.textContent = ''; // Clear any old messages
        formMessage.className = '';
        if (viewToShow === 'login') {
            showLoginView();
        } else {
            showRegisterView();
        }
        authModal.style.display = 'flex'; // Show the modal
    };

    const closeModal = () => {
        authModal.style.display = 'none'; // Hide the modal
    };

    // Helper function to display messages inside the modal
    const displayMessage = (message, isSuccess) => {
        formMessage.textContent = message;
        formMessage.className = isSuccess ? 'success' : 'error';
    };

    // --- 4. EVENT LISTENERS ---
    // Assign actions to user clicks and form submissions.

    // Navbar buttons - Add checks to make sure the buttons exist before adding listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal('login'));
    }
    if (signupBtn) {
        signupBtn.addEventListener('click', () => openModal('register'));
    }

    // Modal close events
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (authModal) {
        authModal.addEventListener('click', (event) => {
            if (event.target === authModal) {
                closeModal();
            }
        });
    }

    // Form switcher links
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterView();
        });
    }
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginView();
        });
    }

    // --- 5. FORM SUBMISSION LOGIC ---

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    displayMessage(result.message, true);
                    setTimeout(closeModal, 1500);
                } else {
                    displayMessage(result.message, false);
                }
            } catch (error) {
                displayMessage('A network error occurred.', false);
            }
        });
    }

    // Registration Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const resultText = await response.text();
                if (response.ok) {
                    displayMessage(resultText, true);
                    setTimeout(() => {
                        showLoginView();
                        formMessage.textContent = "Registration successful! Please log in.";
                        formMessage.className = 'success';
                    }, 2000);
                } else {
                    displayMessage(resultText, false);
                }
            } catch (error) {
                displayMessage('A network error occurred.', false);
            }
        });
    }
});