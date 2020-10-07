const places = ['Paris', 'New Orleans', 'Cleveland', 'San Francisco', 'London', 'Milan', 'Berlin', 'Mexico City', 'Melbourne']

// Search by city button
$('#searchBtn').on('click', function () {
    console.log('Search');
    let input = $('#searchBar').val();
    // Check to make sure their input is valid
    if(checkInput(input)) {
        localStorage.setItem('place', input);
        window.location.href = 'results.html';
    }
});

// Send me somewhere random button
$('#randomBtn').on('click', function () {
    console.log('Random');
    let index = Math.floor(Math.random() * places.length);
    let place = places[index];
    localStorage.setItem('place', place);
    window.location.href = 'results.html';
});

// Use my location button
$('#locationBtn').on('click', function () {
    console.log('My Location');
    localStorage.setItem('place', getLocation());
    window.location.href = 'results.html';
});

function getLocation() {
    // We need to write a function/API call that gets the user's location and converts it to a place name/string
    // For now, use Philadelphia as the user's location
    let place = "Philadelphia";
    return place;    
}

function checkInput(userInput) {
    // We're going to accept all user inputs for now until we figure out how to check this
    return true;
}