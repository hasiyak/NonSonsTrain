/**
 * LankaTrains Authentication Logic
 * Handles validation, UI interactions, and simulated authentication state.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Password Visibility Toggle Setup
    setupPasswordToggle('password', 'passwordToggle');
    setupPasswordToggle('confirmPassword', 'confirmPasswordToggle');

    // 2. Password Strength Meter Setup
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    if (passwordInput && strengthFill && strengthText) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            const strength = checkPasswordStrength(password);
            
            // Clear current strength classes
            strengthFill.className = 'strength-fill';
            
            if (password) {
                strengthFill.classList.add(strength.className);
                strengthText.textContent = strength.label;
            } else {
                strengthText.textContent = 'Too short';
            }
        });
    }

    // 3. Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const submitBtn = document.getElementById('submitBtn');

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Form validations
            if (!email || !password) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Show simulated loading spinner
            setLoadingState(submitBtn, true, 'Signing in...');

            setTimeout(() => {
                // Check if user is registered in simulated DB (localStorage)
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

                // Add a default user for testing if no DB is initialized
                const isDemoUser = email.toLowerCase() === 'kaveesha@example.com' && password === 'Password123!';

                if (user || isDemoUser) {
                    const activeUser = user || { fullname: 'Kaveesha Senanayake', email: email };
                    
                    // Store current user session in localStorage
                    localStorage.setItem('currentUser', JSON.stringify(activeUser));
                    showToast('Login successful! Welcome back.', 'success');

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1200);
                } else {
                    setLoadingState(submitBtn, false);
                    showToast('Invalid email or password. Try kaveesha@example.com / Password123!', 'error');
                }
            }, 1200);
        });
    }

    // 4. Registration Form Handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullnameInput = document.getElementById('fullname');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const termsCheckbox = document.getElementById('terms');
            const submitBtn = document.getElementById('submitBtn');

            const fullname = fullnameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const termsChecked = termsCheckbox.checked;

            // Step-by-step validation checks
            if (!fullname || !email || !phone || !password || !confirmPassword) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            if (!validatePhone(phone)) {
                showToast('Please enter a valid Sri Lankan phone number (e.g. 0771234567).', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('Password must be at least 6 characters long.', 'error');
                return;
            }

            const strength = checkPasswordStrength(password);
            if (strength.label === 'Weak') {
                showToast('Please create a stronger password.', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Passwords do not match.', 'error');
                return;
            }

            if (!termsChecked) {
                showToast('You must agree to the Terms of Service and Privacy Policy.', 'error');
                return;
            }

            // Show loading spinner
            setLoadingState(submitBtn, true, 'Creating account...');

            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

                if (emailExists) {
                    setLoadingState(submitBtn, false);
                    showToast('Email address already registered.', 'error');
                    return;
                }

                // Register user details
                const newUser = { fullname, email, phone, password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // Auto login user
                localStorage.setItem('currentUser', JSON.stringify({ fullname, email }));
                showToast('Account created successfully! Welcome to LankaTrains.', 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1200);
            }, 1200);
        });
    }
});

/**
 * Toast notification triggers
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    
    // Trigger reflow to start transition
    toast.offsetHeight;
    toast.classList.add('show');

    // Slide-out and remove toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3500);
}

/**
 * Validates email pattern
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validates Sri Lankan mobile phone formats
 */
function validatePhone(phone) {
    const re = /^(?:0|94|\+94)?7\d{8}$/;
    return re.test(phone);
}

/**
 * Configures show/hide functionality for password fields
 */
function setupPasswordToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    
    if (input && toggle) {
        toggle.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = isPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
            }
        });
    }
}

/**
 * Evaluates password strength based on patterns
 */
function checkPasswordStrength(password) {
    if (password.length < 6) {
        return { label: 'Too short', className: 'weak' };
    }

    let score = 0;
    // Length check
    if (password.length >= 8) score++;
    // Contains uppercase letters
    if (/[A-Z]/.test(password)) score++;
    // Contains digits
    if (/[0-9]/.test(password)) score++;
    // Contains symbols
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
        return { label: 'Weak', className: 'weak' };
    } else if (score <= 3) {
        return { label: 'Medium', className: 'medium' };
    } else {
        return { label: 'Strong', className: 'strong' };
    }
}

/**
 * Toggles a button loading spinner
 */
let originalButtonHTML = '';
function setLoadingState(button, isLoading, text = '') {
    if (isLoading) {
        originalButtonHTML = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `
            <div class="spinner"></div>
            <span>${text}</span>
        `;
    } else {
        button.disabled = false;
        button.innerHTML = originalButtonHTML;
    }
}

/**
 * Simulates third-party OAuth logins (Google, Facebook)
 */
window.simulatedSocialLogin = function(provider) {
    showToast(`Connecting to ${provider}...`, 'success');
    
    setTimeout(() => {
        const simulatedUser = {
            fullname: `Demo User (${provider})`,
            email: `${provider.toLowerCase()}.user@lankatrains.lk`
        };
        localStorage.setItem('currentUser', JSON.stringify(simulatedUser));
        showToast(`Signed in successfully via ${provider}!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    }, 1000);
};
