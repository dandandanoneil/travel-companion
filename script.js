// Get place from localStorage - if nothing's there, use Philadelphia
let place = localStorage.getItem('place');
if (!place) { place = "Philadelphia"; }

let booksArray = getBooks(place);
let moviesArray = getMovies(place);
let newsArray = getNews(place);

// Function that accesses the GoodReads API given a string representing their place search, and returns an array of book objects with only the key values we care about
function getBooks(place) {
    let queryURL = "https://cors-anywhere.herokuapp.com/" + "https://www.goodreads.com/search.xml?key=Ftrxz5uVKXShxfHT69uvg&q=travel%20" + place;

    $.ajax({
		url: queryURL,
		dataType: "text",
        method: "GET"
    }).then(function(xml) {
		const XmlNode = new DOMParser().parseFromString(xml, 'text/xml');
		const results = xmlToJson(XmlNode).GoodreadsResponse.search.results.work;
		let books = [];
		// Iterate through the messy array and build a cleaner array of objects representing each book on the list
		for (let i = 0; i < results.length; i++) {
			let newBook = {
				title: results[i].best_book.title["#text"],  
				by: results[i].best_book.author.name["#text"], 
				image: results[i].best_book.image_url["#text"], 
				year: results[i].original_publication_year["#text"]};
			if (!newBook.year) { newBook.year = "unknown"; }
			books.push(newBook);
		}
		console.log(books);

		// Add a few reccomendations from books to the books card content
		for (let i = 0; i < 5; i++) {
			let newDiv = $("<div>- " + books[i].title + "</div>");
			$("#book-preview").append(newDiv);
		}
		// Unhide the "show results" link
		$("#book-action").removeClass("hide");
		return books;
	});
}

// Function that accesses the Open Movie Database API given a string representing their place search, and returns an array of movie objects with only the key values we care about
function getMovies(place) {
	var queryURL = "https://www.omdbapi.com/?s=" + place + "&apikey=10b7e919";

    $.ajax({
		url: queryURL,
		method: "GET"
  }).then(function(response) {
		let results = response.Search;
		let movies = [];
		// Iterate through the result and build a cleaner array of objects representing each book on the list
		for (let i = 0; i < results.length; i++) {
			let newMovie = {
				title: results[i].Title,  
				image: results[i].Poster, 
				year: results[i].Year
			};
			movies.push(newMovie);
		}
		console.log(movies);
	
		// Add a few reccomendations from movies to the movies card content
		for (let i = 0; i < 5; i++) {
			let newDiv = $("<div>- " + movies[i].title + "</div>");
			$("#movie-preview").append(newDiv);
		}		
		// Unhide the "show results" link
		$("#movie-action").removeClass("hide");
		return movies;
    });
}

// Function that accesses the NYTimes API given a string representing their place search, and returns an array of article objects with only the key values we care about
function getNews(place) {
	var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=articles&fq=glocations:" + place + "&api-key=g3KFAz8SGDwQs4rxRmIrPbDPuhJbsmtG";

	 $.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(response) {
		let results = response.response.docs;
		let articles = [];

		// Iterate through the results array of objects representing news articles
		for (let i = 0; i < results.length; i++) {
			let newArticles = {
				title: results[i].headline.main,
				url: results[i].web_url,
				byline: results[i].byline.original,
				year: results[i].pub_date
			};
			articles.push(newArticles);
		}
		console.log(articles);

		// Add a few reccomendations from articles to the news card content
		for (let i = 0; i < 5; i++) {
			let newDiv = $("<div>- " + articles[i].title + "</div>");
			$("#news-preview").append(newDiv);
		}
		// Unhide the "show results" link
		$("#news-action").removeClass("hide");
		return articles;		
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
