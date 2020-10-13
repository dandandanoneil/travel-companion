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
var mapsAPI = 'AIzaSyDP6Zh-LaIStr2ODLz_C9yj--XdyC4CZ28';
var geolocateURL = 'https://www.googleapis.com/geolocation/v1/geolocate?key=';
var getAddressURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key='
var submitLocation = $("#locationBtn");

submitLocation.on("click", function() {
        console.log('My Location');
        getLocation();
});

function getLocation() {
    //API call to retrieve lattitude & longitude
    $.ajax({
        url: geolocateURL + mapsAPI,
        method: "POST"
      }).then (function(response) {
        console.log(response);
        let lat = JSON.stringify(response.location.lat);
        let lng = JSON.stringify(response.location.lng);
        console.log(lat, lng);
      //API call to use lat & long to retrieve place name
    $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng +'&key=' + mapsAPI,
        method: "POST"
    }).then (function(results) {
        console.log(results);
        let place = JSON.stringify(results.results[5].formatted_address);
        console.log(place);
        localStorage.setItem('place', place);
        window.location.href = 'results.html';
    });
});
    };


function checkInput(userInput) {
    // We're going to accept all user inputs for now until we figure out how to check this
    return true;
}