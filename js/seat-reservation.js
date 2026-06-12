const trainId = localStorage.getItem('selectedTrain');
const storageKey = `bookedSeats_${trainId}`; // unique save key per train 

const trainTitle = document.getElementById('train-title');
const seatGrid = document.getElementById('seat-grid');
const bookBtn = document.getElementById('book-btn');

const TOTAL_SEATS = 60;

function initPage() {
    // send peopel who are directly coming without vising the booking page
    if (!trainId) {
        window.location.href = 'booking.html';
        return null;
    }

    // title
    trainTitle.innerText = `Booking Seats for Train ${trainId}`;

    // previous booked seat list
    let bookedSeatsData = localStorage.getItem(storageKey);
    let bookedSeats;

    if (bookedSeatsData) {
        bookedSeats = JSON.parse(bookedSeatsData);
    } else {
        bookedSeats = [];
    }

    // Generate the seat grid
    for (let i = 0; i < TOTAL_SEATS; i++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        seat.innerText = i + 1; // Give the seat a number
        seat.dataset.index = i; // Store the index for later

        // If this seat's index is in our local storage array, mark it occupied
        if (bookedSeats.includes(i)) {
            seat.classList.add('occupied');
        }

        // Add click listener for selecting the seat
        seat.addEventListener('click', () => {
            if (!seat.classList.contains('occupied')) {
                seat.classList.toggle('selected');
            }
        });

        seatGrid.appendChild(seat);
    }
}

// 4. Handle the Booking Action
bookBtn.addEventListener('click', () => {
    // Find all seats the user currently clicked (highlighted blue)
    const selectedSeats = document.querySelectorAll('.seat.selected');
    
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat to book.');
        return;
    }

    // Get the existing bookings from storage again
    let bookedSeats = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Loop through the selected UI elements, get their numbers, and add to the array
    selectedSeats.forEach(seat => {
        // Convert the dataset string to an integer and push to array
        const seatIndex = parseInt(seat.dataset.index);
        bookedSeats.push(seatIndex);

        // Update the UI immediately
        seat.classList.remove('selected');
        seat.classList.add('occupied');
    });

    // Save the newly updated array back to local storage
    localStorage.setItem(storageKey, JSON.stringify(bookedSeats));

    alert(`Successfully booked ${selectedSeats.length} seat(s)!`);
});

// Run initialization when the script loads
initPage();