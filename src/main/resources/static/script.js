document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GET ELEMENT REFERENCES ---
    const mapContainer = document.getElementById('map');
    const authModal = document.getElementById('authModal');
    // Nav elements
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    // Modal elements
    const closeBtn = document.querySelector('.close-btn');
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const formMessage = document.getElementById('formMessage');

    // --- 2. MAP INITIALIZATION ---
    if (mapContainer) {
        const map = L.map(mapContainer).setView([6.9271, 79.8612], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        console.error("Error: Map container element with id 'map' was not found.");
    }

    // --- 3. UI UPDATE LOGIC ---
    const updateNavForLoggedInUser = () => {
        guestNav.style.display = 'none';
        userNav.style.display = 'block';
    };

    const updateNavForLoggedOutUser = () => {
        guestNav.style.display = 'block';
        userNav.style.display = 'none';
    };

    // --- 4. MODAL AND FORM VIEW LOGIC ---
    const showLoginView = () => {
        loginView.style.display = 'block';
        registerView.style.display = 'none';
        formMessage.textContent = '';
        formMessage.className = '';
    };

    const showRegisterView = () => {
        loginView.style.display = 'none';
        registerView.style.display = 'block';
        formMessage.textContent = '';
        formMessage.className = '';
    };

    const openModal = (viewToShow) => {
        if (viewToShow === 'login') showLoginView();
        else showRegisterView();
        authModal.style.display = 'flex';
    };

    const closeModal = () => {
        authModal.style.display = 'none';
    };

    const displayMessage = (message, isSuccess) => {
        formMessage.textContent = message;
        formMessage.className = isSuccess ? 'success' : 'error';
    };

    // --- 5. EVENT LISTENERS ---
    if (loginBtn) loginBtn.addEventListener('click', () => openModal('login'));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal('register'));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout); // Add logout listener
    if (authModal) authModal.addEventListener('click', (event) => {
        if (event.target === authModal) closeModal();
    });
    if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); showRegisterView(); });
    if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); showLoginView(); });

    // --- 6. API CALLS AND FORM SUBMISSION ---

    // Logout Handler
    async function handleLogout() {
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if(response.ok) {
                updateNavForLoggedOutUser();
            } else {
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            alert('A network error occurred during logout.');
        }
    }

    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            displayMessage('', false);
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
                    setTimeout(() => {
                        closeModal();
                        updateNavForLoggedInUser(); // UPDATE UI
                    }, 1500);
                } else {
                    displayMessage(result.message, false);
                }
            } catch (error) {
                displayMessage('A network error occurred.', false);
            }
        });
    }

    // Registration Form
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            displayMessage('', false);
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());
            if (data.password !== data.confirmPassword) {
                displayMessage('Passwords do not match.', false);
                return;
            }
            try {
                const registrationData = { name: data.name, email: data.email, password: data.password };
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
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