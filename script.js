// Function that accesses the GoodReads API given a string representing their place search
getBooks("paris");

function getBooks(place) {
    let queryURL = /*"https://cors-anywhere.herokuapp.com/" + */ "https://www.goodreads.com/search.xml?key=Ftrxz5uVKXShxfHT69uvg&q=travel%20" + place;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(xml) {
        // Code here
        const XmlNode = new DOMParser().parseFromString(xml, 'text/xml');
        const obj = xmlToJson(XmlNode);
        const booksArray = obj.GoodreadsResponse.search.results.work
        console.log(booksArray);
        console.log(booksArray[0].best_book.title);
        console.log(booksArray[0].best_book.author.name);
        console.log(booksArray[0].best_book.image_url);
        console.log(booksArray[0].original_publication_year);
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
