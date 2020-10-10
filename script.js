// Establish the random places array in case they click that button
const places = ['Paris', 'New Orleans', 'Cleveland', 'San Francisco', 'London', 'Milan', 'Berlin', 'Mexico City', 'Melbourne']

// Get place from localStorage - if nothing's there, use Philadelphia
let place = localStorage.getItem('place');
if (!place) { place = "Philadelphia"; }

let booksArray = [];
getBooks(place);
let moviesArray = [];
getMovies(place);
let newsArray = [];
getNews(place);
let artArray = [];
getArt(place);

$("#header").text("Welcome to " + place);
console.log(place);

// Search by city button
$('#searchBtn').on('click', function () {
    let newPlace = $('#searchBar').val();
    // Check to make sure their input is valid
    if(checkInput(newPlace)) {
		// Store the new place
		localStorage.setItem('place', newPlace);
		// Reset all the arrays
		booksArray = [];
		moviesArray = [];
		newsArray = [];
		artArray = [];
		// Render the new page
		$("#header").text("Welcome to " + newPlace);
		$("#results-div").addClass("hide");
        getBooks(newPlace);
		getMovies(newPlace);
		getNews(newPlace);
		getArt(newPlace);
    }
});

// Send me somewhere random button
$('#randomBtn').on('click', function () {
    let index = Math.floor(Math.random() * places.length);
    let newPlace = places[index];
	// Store the new place
	localStorage.setItem('place', newPlace);
	// Reset all the arrays
	booksArray = [];
	moviesArray = [];
	newsArray = [];
	artArray = [];
	// Render the new page
	$("#header").text("Welcome to " + newPlace);
	$("#results-div").addClass("hide");
	getBooks(newPlace);
	getMovies(newPlace);
	getNews(newPlace);
	getArt(newPlace);
});

// Use my location button
$('#locationBtn').on('click', function () {
	let newPlace =  getLocation();
	// Store the new place
	localStorage.setItem('place', newPlace);
	// Reset all the arrays
	booksArray = [];
	moviesArray = [];
	newsArray = [];
	artArray = [];
	// Render the new page
	$("#header").text("Welcome to " + newPlace);
	$("#results-div").addClass("hide");
	getBooks(newPlace);
	getMovies(newPlace);
	getNews(newPlace);
	getArt(newPlace);
});

function getLocation() {
    // Re-use Tricia's function/API call that gets the user's location and converts it to a place name/string
    // For now, use Philadelphia as the user's location
    let here = "Philadelphia";
    return here;    
}

function checkInput(userInput) {
    // We're going to accept all user inputs for now until we figure out how to check this
	if (input != "") { 
		return true; 
	} else {
		return false
	}
}

// "Show Books" button listener
$("#show-books").on("click", function () {
	$("#results-header").text("Book Recommendations");
	$("#results-content").empty();
	for(let i = 0; i < booksArray.length; i++) {
		let titleDiv = $("<h6 class='text-bold'>" + booksArray[i].title + "</h6>");
		$("#results-content").append(titleDiv);
		let byDiv = $("<div>by " + booksArray[i].by + "</div>");
		$("#results-content").append(byDiv);
		let yearDiv = $("<div>Published: " + booksArray[i].year + "</div>");
		$("#results-content").append(yearDiv);
		if (booksArray[i].image != "https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png") {
			let bookImage = $("<img src ='" + booksArray[i].image + "' alt='book image'>")
			$("#results-content").append(bookImage);
		}
		$("#results-content").append($("<div class='divider'></div>"));
	}
	$("#results-div").removeClass("hide");
});

// "Show Movies" button listener
$("#show-movies").on("click", function () {
    $("#results-header").text("Movie Recommendations");
    $("#results-content").empty();
    for(let i = 0; i < moviesArray.length; i++) {
        let titleDiv = $("<h6 class='text-bold'>" + moviesArray[i].title + "(" + moviesArray[i].year + ")" + "</h6>");
        $("#results-content").append(titleDiv);
        let posterImage = $("<img src ='" + moviesArray[i].image + "' alt='movie poster'>")
		$("#results-content").append(posterImage);
		$("#results-content").append($("<div class='divider'></div>"));
    }
    $("#results-div").removeClass("hide");
});

// "Show News" button listener
$("#show-news").on("click", function () {
	$("#results-header").text("News Articles");
	$("#results-content").empty();
	for(let i = 0; i < newsArray.length; i++) {
		let titleDiv = $("<h6 class='text-bold'>" + newsArray[i].title + "</h6>");
		$("#results-content").append(titleDiv);
		let byDiv = $("<div>by " + newsArray[i].by + "</div>");
		$("#results-content").append(byDiv);
		let yearDiv = $("<div>Published: " + newsArray[i].year + "</div>");
		$("#results-content").append(yearDiv);
		$("#results-content").append($("<div class='divider'></div>"));
	}
	$("#results-div").removeClass("hide");
});

// "Show Art" button listener
$("#show-art").on("click", function () {
	$("#results-header").text("Art Exhibitions");
	$("#results-content").empty();
	for(let i = 0; i < artArray.length; i++) {
		let titleDiv = $("<a class='text-bold'>" + artArray[i].title + "</a>");
		titleDiv.attr("href", artArray[i].url);
		$("#results-content").append(titleDiv);
		let nameDiv = $("<div>Venue: " + artArray[i].venues + "</div>");
		$("#results-content").append(nameDiv);
		$("#results-content").append($("<div class='divider'></div>"));
	}
	$("#results-div").removeClass("hide");
});

// Function that accesses the GoodReads API given a string representing their place search, and builds an array of book objects with only the key values we care about
function getBooks(place) {
    let queryURL = "https://cors-anywhere.herokuapp.com/" + "https://www.goodreads.com/search.xml?key=Ftrxz5uVKXShxfHT69uvg&q=travel%20" + place;

    $.ajax({
		url: queryURL,
		dataType: "text",
        method: "GET"
    }).then(function(xml) {
      
        const XmlNode = new DOMParser().parseFromString(xml, 'text/xml');
        const results = xmlToJson(XmlNode).GoodreadsResponse.search.results.work;
        // Iterate through the messy array and build a cleaner array of objects representing each book on the list
        for (let i = 0; i < results.length; i++) {
            let newBook = {
                title: results[i].best_book.title["#text"],  
                by: results[i].best_book.author.name["#text"], 
                image: results[i].best_book.image_url["#text"], 
                year: results[i].original_publication_year["#text"]};
            if (!newBook.year) { newBook.year = "unknown"; }
            booksArray.push(newBook);
        }
        console.log("Books:", booksArray);

		// Add a few reccomendations from books to the books card content
		let limit = 5;
		if (booksArray.length < 5) { limit = booksArray.length; }
		$("#book-preview").empty();
		for (let i = 0; i < limit; i++) {
            let newDiv = $("<div>- " + booksArray[i].title + "</div>");
            $("#book-preview").append(newDiv);
		}
		// Unhide the "show results" link & show how many results there are
		$("#books-title").text(place + " in Books (" + booksArray.length + ")");
        $("#book-action").removeClass("hide");
    });
}

// Function that accesses the Open Movie Database API given a string representing their place search, and builds an array of movie objects with only the key values we care about
function getMovies(place) {
	var queryURL = "https://www.omdbapi.com/?s=" + place + "&apikey=10b7e919";

    $.ajax({
		url: queryURL,
		method: "GET"
  }).then(function(response) {

        let results = response.Search;
        // Iterate through the result and build a cleaner array of objects representing each book on the list
        for (let i = 0; i < results.length; i++) {
            let newMovie = {
                title: results[i].Title,  
                image: results[i].Poster, 
                year: results[i].Year
            };
            moviesArray.push(newMovie);
        }
        console.log("Movies:", moviesArray);
    
        // Add a few reccomendations from moviesArray to the movies card content
		let limit = 5;
		if (moviesArray.length < 5) { limit = moviesArray.length; }
		$("#movie-preview").empty();
		for (let i = 0; i < limit; i++) {
            let newDiv = $("<div>- " + moviesArray[i].title + "</div>");
            $("#movie-preview").append(newDiv);
        }       
		// Unhide the "show results" link & show how many results there are
		$("#movies-title").text(place + " at the Movies (" + moviesArray.length + ")");
        $("#movie-action").removeClass("hide");
    });
}

// Function that accesses the NYTimes API given a string representing their place search, and builds an array of article objects with only the key values we care about
function getNews(place) {
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=articles&fq=glocations:" + place + "&api-key=g3KFAz8SGDwQs4rxRmIrPbDPuhJbsmtG";

     $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        let results = response.response.docs;

        // Iterate through the results array of objects representing news articles
        for (let i = 0; i < results.length; i++) {
            let newArticles = {
                title: results[i].headline.main,
                url: results[i].web_url,
                byline: results[i].byline.original,
                year: results[i].pub_date
            };
            newsArray.push(newArticles);
        }
        console.log("News:", newsArray);

        // Add a few reccomendations from newsArray to the news card content
		let limit = 5;
		if (newsArray.length < 5) { limit = newsArray.length; }
		$("#news-preview").empty();
		for (let i = 0; i < limit; i++) {
            let newDiv = $("<div>- " + newsArray[i].title + "</div>");
            $("#news-preview").append(newDiv);
        }
		// Unhide the "show results" link & show how many results there are
		$("#news-title").text(place + " in the News (" + newsArray.length + ")");
        $("#news-action").removeClass("hide");
    });
}
// Function that accesses the Harvard Art Museums API given a string representing their place search, and builds an array of artwork objects with only the key values we care about
function getArt(place) {
	var queryURL = "https://api.harvardartmuseums.org/exhibition?q=" + place + "&apikey=ad869fde-b267-4f1d-bf87-6a7b86478a0c";

	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {
		let results = response.records;
		// Iterate through the results array of objects representing art
		for (let i = 0; i < results.length; i++) {
  // First, build a string of the venues in the results[i].venues array (venueList)
  let venueList = results[i].venues[0].name;
  if (results[i].venues.length > 1) {
	  for (let j = 0; j < results[i].venues.length; j++) {
		  venueList += ", " + results[i].venues[j].name;
	  }
  }
         // Then build the newArt object and push to artArray
		 let newArt = {
            title: results[i].title,
            url: results[i].url,
            venues: venueList};
            artArray.push(newArt);
        }
    
        console.log("Art:", artArray);

        // Add a few reccomendations from articles to the news card content
		let limit = 5;
		if (artArray.length < 5) { limit = artArray.length; }
		$("#art-preview").empty();
		for (let i = 0; i < limit; i++) {
            let newDiv = $("<div>- " + artArray[i].title + "</div>");
            $("#art-preview").append(newDiv);
        }
		// Unhide the "show results" link & show how many results there are
		$("#art-title").text(place + " in Art (" + artArray.length + ")");
        $("#art-action").removeClass("hide");
    });
}

// Changes XML to JSON
// Code sourced from https://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};
