document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Check for elements in view for fade-in animation
        checkFadeElements();
    });

    // Mobile Menu Toggle (Simplified placeholder)
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            alert('Mobile menu toggled! (Implement a slide-in menu here for production)');
        });
    }

    // Scroll Animation Logic
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFadeElements() {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkFadeElements();

    // Filter Logic for Booking Page
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            const selectedTypes = Array.from(document.querySelectorAll('.filter-type:checked')).map(cb => cb.value);
            const selectedClasses = Array.from(document.querySelectorAll('.filter-class:checked')).map(cb => cb.value);
            const selectedTime = document.getElementById('filter-time').value;

            const trainCards = document.querySelectorAll('.train-card');

            trainCards.forEach(card => {
                const trainType = card.getAttribute('data-type');
                const trainClasses = card.getAttribute('data-class').split(' ');
                const trainTime = card.getAttribute('data-time');

                const typeMatch = selectedTypes.length === 0 ? true : selectedTypes.includes(trainType);
                const classMatch = selectedClasses.length === 0 ? true : selectedClasses.some(cls => trainClasses.includes(cls));
                const timeMatch = selectedTime === 'any' || selectedTime === trainTime;

                if (typeMatch && classMatch && timeMatch) {
                    card.style.display = ''; // Revert to CSS default (flex)
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- Authentication & Dynamic Header Logic ---
    
    // Redirect when clicking Login/Register in header
    const loginButtons = document.querySelectorAll('.btn-login');
    const registerButtons = document.querySelectorAll('.btn-register');

    loginButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    });

    registerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    });

    // Check simulated authentication status
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
        try {
            const user = JSON.parse(currentUserJson);
            updateHeaderForUser(user);
        } catch (e) {
            console.error('Error parsing user session:', e);
        }
    }

    function updateHeaderForUser(user) {
        const navButtonsContainer = document.querySelector('.nav-buttons');
        if (!navButtonsContainer) return;

        // Get initials from user fullname
        const nameParts = user.fullname.trim().split(/\s+/);
        const initials = nameParts.map(p => p[0]).slice(0, 2).join('').toUpperCase();

        navButtonsContainer.innerHTML = `
            <div class="profile-nav-item" title="View Profile">
                <div class="avatar">${initials}</div>
                <span class="user-name">${user.fullname}</span>
            </div>
            <button class="btn-logout" id="logoutBtn">Logout</button>
        `;

        // Add logout handler
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                // Reload home/current page
                window.location.href = 'index.html';
            });
        }
    }
});
