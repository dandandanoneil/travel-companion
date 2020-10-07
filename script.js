// Get place from localStorage - if nothing's there, use Philadelphia
let place = localStorage.getItem('place');
if (!place) { place = "Philadelphia"; }

// Run getBooks() to test it
getBooks(place);

// Function that accesses the GoodReads API given a string representing their place search
function getBooks(place) {
    let queryURL = "https://cors-anywhere.herokuapp.com/" + "https://www.goodreads.com/search.xml?key=Ftrxz5uVKXShxfHT69uvg&q=travel%20" + place;

    $.ajax({
		url: queryURL,
		dataType: "text",
        method: "GET"
    }).then(function(xml) {
        // Code here
		// console.log(xml);
		// console.log(typeof xml);
		// console.log(JSON.stringify(xml));
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
