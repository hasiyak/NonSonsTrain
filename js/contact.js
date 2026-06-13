
const contactForm = document.getElementById('contactForm');
const toastBox = document.getElementById('toastBox');
const errorToastBox = document.getElementById('errorToastBox');

contactForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const inputs = contactForm.querySelectorAll('input, textarea');
    let isFormFilled = true; 

    inputs.forEach(function(input) {
        if (input.value.trim() === '') {
            isFormFilled = false;
        }
    });

    if (isFormFilled === false) {
        errorToastBox.classList.add('show');
        
        setTimeout(function() {
            errorToastBox.classList.remove('show');
        }, 3500);

    } else {
        toastBox.classList.add('show');
        contactForm.reset();
        
        setTimeout(function() {
            toastBox.classList.remove('show');
        }, 3500);
    }
});