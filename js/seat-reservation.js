const trainId = localStorage.getItem('selectedTrain');
const storageKey = `bookedSeats_${trainId}`;

const trainTitle = document.getElementById('train-title');
const seatGrid = document.getElementById('seat-grid');
const bookBtn = document.getElementById('book-btn');

const totalSeats = 60;

function loading() {
    // title
    trainTitle.innerText = `Booking Seats for Train ${trainId}`;

    // booked seat list
    let bookedSeatsD = localStorage.getItem(storageKey);
    let bookedSeats;

    if (bookedSeatsD) {
        bookedSeats = JSON.parse(bookedSeatsD);
    } else {
        bookedSeats = [];
    }

    // Generate the seat grid
    for (let i = 0; i < totalSeats; i++) {
        let seatNumber = i + 1;
        let isbooked = bookedSeats.includes(seatNumber);

        if (isbooked == true) {
            seatGrid.innerHTML = seatGrid.innerHTML + `<div class="seat occupied">${seatNumber}</div>`;
        } 
        else {
            seatGrid.innerHTML = seatGrid.innerHTML + `
                <div class="seat" onclick="
                    if (this.className == 'seat') { this.className = 'seat selected'; } 
                    else { this.className = 'seat'; }
                ">${seatNumber}</div>
            `;;
        }
    }
}

// Booking action
bookBtn.addEventListener('click', () => {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    
    if (selectedSeats.length == 0) {
        alert('Please select at least one seat to book.');
        return;
    }

    let bookeddatas = localStorage.getItem(storageKey);
    let bookedSeats = [];

    if (bookeddatas != null) {
        bookedSeats = JSON.parse(bookeddatas);
    } else {
        bookedSeats = [];
    };

    
    let allSelectedSeats = document.querySelectorAll(".seat.selected");
    allSelectedSeats.forEach(function(seat) {
        let seatNumber = parseInt(seat.innerText);
        bookedSeats.push(seatNumber);
        seat.className = "seat occupied";
    });

    let updatedString = JSON.stringify(bookedSeats);
    localStorage.setItem(storageKey, updatedString);

    alert(`Successfully booked ${selectedSeats.length} seats..`);
});

loading();