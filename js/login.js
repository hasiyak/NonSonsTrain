// Grab the form and all the elements we need to interact with
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- NEW HELPER FUNCTION FOR TOASTS ---
function showToast(message, type = 'error') {
    const container = document.getElementById('toast-container');
    
    // Create the toast element
    const toast = document.createElement('div');
    toast.classList.add('toast', type); // Adds .toast and .error or .success

    // Determine the icon based on the type
    let iconHtml = type === 'error' 
        ? `<span class="toast-icon error-icon">✖</span>` 
        : `<span class="toast-icon success-icon">✔</span>`;

    // Inject the icon and message
    toast.innerHTML = `${iconHtml} <span>${message}</span>`;
    
    // Add it to the screen
    container.appendChild(toast);

    // Trigger the slide-in animation shortly after adding to DOM
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto-remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show'); // Slide it out
        
        // Wait for the slide-out animation to finish, then delete it from the HTML completely
        setTimeout(() => {
            toast.remove();
        }, 400); 
    }, 3500); 
}
// ---------------------------------------

// 1. Real-time check: Show/hide the small text under the email input
emailInput.addEventListener('input', function() {
    const currentEmail = emailInput.value.trim(); 
    if (currentEmail !== '' && !emailPattern.test(currentEmail)) {
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});

// 2. Form Submit Check
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value.trim();

    // Check 1: Are any fields empty?
    if (emailVal === '' || passVal === '') {
        // REPLACED ALERT WITH TOAST
        showToast("Please fill in all fields.", "error");
        return; 
    }

    // Check 2: Is the email invalid?
    if (!emailPattern.test(emailVal)) {
        // REPLACED ALERT WITH TOAST
        showToast("Please enter a valid email address.", "error");
        emailInput.value = '';
        passwordInput.value = '';
        emailError.style.display = 'none'; 
        return; 
    }

    // Check 3: Success!
    // REPLACED ALERT WITH TOAST
    showToast("Login successful! Welcome back.", "success");
    
    // Clear fields on success
    emailInput.value = '';
    passwordInput.value = '';
    emailError.style.display = 'none'; 
});

// --- BACKGROUND SLIDESHOW LOGIC ---

// 1. Grab the container that holds the background image
const bgContainer = document.querySelector('.screen-container');

// 2. Create an array of your image paths
// MAKE SURE to change the file names to match the actual images in your assets folder!
const bgImages = [
    "url('assets/train-login.jpg')", // Image 1
    "url('assets/train-login1.png')", // Image 2 (Replace with your actual file name)
    "url('assets/train-login2.png')"  // Image 3 (Replace with your actual file name)
];

let currentImageIndex = 0;

// 3. Set up a timer to change the image every 5 seconds (5000 milliseconds)
setInterval(() => {
    // Move to the next image, and loop back to 0 if we reach the end of the list
    currentImageIndex = (currentImageIndex + 1) % bgImages.length;
    
    // Apply the new background image
    bgContainer.style.backgroundImage = bgImages[currentImageIndex];
}, 3000);

// --- PASSWORD SHOW/HIDE TOGGLE LOGIC ---

// 1. Grab the password input and the eye icon elements
const passwordField = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');

// 2. Listen for a click on the eye icon
togglePasswordBtn.addEventListener('click', function() {
    // Check what type the field currently is
    const currentType = passwordField.getAttribute('type');
    
    if (currentType === 'password') {
        // Switch to text mode to show the password
        passwordField.setAttribute('type', 'text');
        togglePasswordBtn.textContent = '⦵'; // Changes the icon to a "hidden" state if you like
    } else {
        // Switch back to password mode to hide it
        passwordField.setAttribute('type', 'password');
        togglePasswordBtn.textContent = '👁'; // Reset back to the open eye
    }
});