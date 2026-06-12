// Train Database variable
const initialTrains = [
    {
        id: "1015",
        name: "Udarata Menike",
        departureTime: "05:55 AM",
        arrivalTime: "03:15 PM",
        from: "Colombo Fort",
        to: "Ella",
        duration: "9h 20m",
        price: 3000,
        type: "intercity",
        timeCategory: "morning",
        classes: ["first", "second"],
        amenities: [
            '<span><i class="fa-solid fa-snowflake"></i> A/C Available</span>',
            '<span><i class="fa-solid fa-utensils"></i> Buffet Car</span>'
        ]
    },
    {
        id: "1005",
        name: "Podi Menike",
        departureTime: "08:30 AM",
        arrivalTime: "05:40 PM",
        from: "Colombo Fort",
        to: "Ella",
        duration: "9h 10m",
        price: 2500,
        type: "intercity",
        timeCategory: "morning",
        classes: ["second", "third"],
        amenities: [
            '<span><i class="fa-solid fa-eye"></i> Observation Saloon</span>'
        ]
    },
    {
        id: "1045",
        name: "Night Mail",
        departureTime: "08:00 PM",
        arrivalTime: "06:30 AM",
        from: "Colombo Fort",
        to: "Ella",
        duration: "10h 30m",
        price: 4000,
        type: "nightmail",
        timeCategory: "night",
        classes: ["first", "second", "third"],
        amenities: [
            '<span><i class="fa-solid fa-bed"></i> Sleeping Berths</span>'
        ]
    },
    {
        id: "1007",
        name: "Senkadagala Menike",
        departureTime: "07:00 AM",
        arrivalTime: "09:38 AM",
        from: "Colombo Fort",
        to: "Kandy",
        duration: "2h 38m",
        price: 1500,
        type: "intercity",
        timeCategory: "morning",
        classes: ["first", "second"],
        amenities: [
            '<span><i class="fa-solid fa-snowflake"></i> A/C Available</span>',
            '<span><i class="fa-solid fa-eye"></i> Observation Saloon</span>'
        ]
    }
];

// Creating Local Storage Database
function initializeDatabase() {
    if (!localStorage.getItem('trainDatabase')) {
        localStorage.setItem('trainDatabase', JSON.stringify(initialTrains));
        console.log("Train data initialized in local storage.");
    }
}

// Get Data from Local Storage
function getTrainsFromStorage() {
    const trainsJSON = localStorage.getItem('trainDatabase');
    return JSON.parse(trainsJSON) || [];
}

// Render the Train Cards]
function renderTrainList(trainsToRender) {
    const container = document.querySelector('.results-list'); 
    container.innerHTML = ''; 

    if (trainsToRender.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No trains match your selected filters.</p>';
        return null;
    }

    trainsToRender.forEach((train) => {
        const amenitiesHTML = train.amenities.join('');

        const cardHTML = `
            <div class="train-card" 
                 data-type="${train.type}" 
                 data-time="${train.timeCategory}"
                 data-id="${train.id}">
                
                <div class="train-info">
                    <h3>${train.name} (${train.id})</h3>
                    <div class="train-route">
                        <div>
                            <span class="time">${train.departureTime}</span><br>
                            <small>${train.from}</small>
                        </div>
                        <div style="flex-grow: 1; text-align: center;">
                            <i class="fa-solid fa-arrow-right-long"></i><br>
                            <small>${train.duration}</small>
                        </div>
                        <div>
                            <span class="time">${train.arrivalTime}</span><br>
                            <small>${train.to}</small>
                        </div>
                    </div>
                    <div class="train-features">
                        ${amenitiesHTML}
                    </div>
                </div>
                <div class="train-action">
                    <span class="price">LKR ${train.price.toLocaleString()}</span>
                    <button class="btn btn-secondary" onclick="goToSeatSelection('${train.id}')">Select Seats</button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Navigation function
function goToSeatSelection(trainId) {
    localStorage.setItem('selectedTrain', trainId);
    // Navigates to your seat reservation page
    window.location.href = 'seat-reservation.html'; 
}

// Filter 
function applyFilters() {
    const allTrains = getTrainsFromStorage();

    // Getting selected train types, classes and times
    // Get selected Train Types
    let allTypeBoxes = document.getElementsByClassName('filter-type');
    let selectedTypes = []; 
    for (let t = 0; t < allTypeBoxes.length; t++) {
        if (allTypeBoxes[t].checked == true) {
            let boxValue = allTypeBoxes[t].value;
            selectedTypes.push(boxValue); 
    }

    // Get selected Classes
    let allClassBoxes = document.getElementsByClassName('filter-class');
    let selectedClasses = []; 

    for (let c = 0; c < allClassBoxes.length; c++) {
        if (allClassBoxes[c].checked == true) {
            let classValue = allClassBoxes[c].value;
            selectedClasses.push(classValue); 
        }
    }

    // Get selected Time
    var timeDropdown = document.getElementById('filter-time');
    var selectedTime = timeDropdown.value;


    // Filter the array
    const filteredTrains = allTrains.filter(train => {
        // Check Type
        const matchesType = selectedTypes.includes(train.type);
        
        // Check Class
        const matchesClass = train.classes.some(c => selectedClasses.includes(c));
        
        // Check Time
        let matchesTime = false;
        if (selectedTime == 'any') {
            matchesTime = true;
        } else if (train.timeCategory == selectedTime) {
            matchesTime = true;
        } else {
            matchesTime = false;
        }

        return matchesType && matchesClass && matchesTime;
    });

    renderTrainList(filteredTrains);
}};

document.addEventListener('DOMContentLoaded', () => {
    initializeDatabase();
    
    //  render all trains at srtr
    renderTrainList(getTrainsFromStorage());

    const filterBtn = document.getElementById('applyFiltersBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', applyFilters);
    }

});