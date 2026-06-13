// train data intial
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
        classes: ["first-class", "second-class"],
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
        classes: ["second-class", "third-class"],
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
        classes: ["first-class", "second-class", "third-class"],
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
        classes: ["first-class", "second-class"],
        amenities: [
            '<span><i class="fa-solid fa-snowflake"></i> A/C Available</span>',
            '<span><i class="fa-solid fa-eye"></i> Observation Saloon</span>'
        ]
    }
];

//create a localstorage
function initializeDatabase() {
    let data = localStorage.getItem('trainDatabase');
    if (data == null) {
        let trainString = JSON.stringify(initialTrains);
        localStorage.setItem('trainDatabase', trainString);
        console.log("sucess in putting train data");
        
    }
}

//get from localstorage
function getTrainsFromStorage() {
    let trainsJSON = localStorage.getItem('trainDatabase');
    if (trainsJSON != null) {
        let trainArray = JSON.parse(trainsJSON);
        return trainArray;
    } else {
        let empty = [];
        return empty;
    }
}

// Traiin card displayinhg
function renderTrainList(trainsrederinglist) {
    const container = document.getElementById('train-result-display'); 
    container.innerHTML = ''; 

    if (trainsrederinglist.length == 0) {
        container.innerHTML = "<p>No trains match your selected filters.</p>";
        return; 
    }

    trainsrederinglist.forEach((train) => {
        let amenitiesHTML = "";
        for (let i = 0; i < train.amenities.length; i++) {
            amenitiesHTML = amenitiesHTML + train.amenities[i];
        };

        let cardHTML = `
            <div class="train-card">
                <div class="train-info">
                    <h3>${train.name} (${train.id})</h3>
                    <div class="train-route">
                        <div>
                            <span class="time">${train.departureTime}</span><br>
                            <small>${train.from}</small>
                        </div>
                        <div style="text-align: center;">
                            <i class="fa-solid fa-arrow-right-long">&rarr;</i><br>
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
                    <span class="price">LKR ${train.price}</span>
                    <button class="btn-secondary" onclick="goToSeatSelection('${train.id}')">Select Seats</button>
                </div>
            </div>
        `;

        container.innerHTML = container.innerHTML + cardHTML;
    });
}
function goToSeatSelection(trainId) {
    localStorage.setItem('selectedTrain', trainId);
    window.location.href = 'seat-reservation.html'; 
}
function applyFilters() {
    const allTrains = getTrainsFromStorage();

    let intercityCheckbox = document.getElementById("intercity");
    let nightmailCheckbox = document.getElementById("nightmail");

    let selectedTypes = [];

    if (intercityCheckbox.checked == true) {
        selectedTypes.push(intercityCheckbox.value);
    }

    if (nightmailCheckbox.checked == true) {
        selectedTypes.push(nightmailCheckbox.value);
    }

    // Get selected Class
    let firstClassCheckbox = document.getElementById("First-class");
    let secondClassCheckbox = document.getElementById("second-class");
    let thirdClassCheckbox = document.getElementById("third-class");

    let selectedClasses = [];

    if (firstClassCheckbox.checked == true) {
        selectedClasses.push(firstClassCheckbox.value);
    }

    if (secondClassCheckbox.checked == true) {
        selectedClasses.push(secondClassCheckbox.value);
    }

    if (thirdClassCheckbox.checked == true) {
        selectedClasses.push(thirdClassCheckbox.value);
    }

    // Get time
    let timeDropdownElem = document.getElementById("filter-time");

    let selectedTime = timeDropdownElem.value;

    // Filtera rray
    const filteredTrains = allTrains.filter(train => {
        let matchesType = false;
        if (selectedTypes.length == 0) {
            matchesType = true;
        }else if (selectedTypes.includes(train.type)) {
            matchesType = true;
        }
        
        let matchesClass = false;
        if (selectedClasses.length == 0) {
            matchesClass = true;
        } 
        else {
            for (let c = 0; c < train.classes.length; c++) {
                let singleClass = train.classes[c];
                
                if (selectedClasses.includes(singleClass)) {
                    matchesClass = true;
                }
            }
        }
        
        // time
        let matchesTime = false;
        if (selectedTime == "any") {
            matchesTime = true;
        } else if (train.timeCategory == selectedTime) {
            matchesTime = true;
        } else {
            matchesTime = false;
        }

        return matchesType && matchesClass && matchesTime;
    });

    renderTrainList(filteredTrains);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDatabase();
    
    // Render
    renderTrainList(getTrainsFromStorage());
    const filterBtn = document.querySelector('.filter-sidebar .btn-primary');
    if (filterBtn) {
        filterBtn.addEventListener('click', applyFilters);
    }
});