let place = localStorage.getItem('place');
if (!place) { place = "Philadelphia"; }

console.log("place");

let APIKey = "g3KFAz8SGDwQs4rxRmIrPbDPuhJbsmtG";

function getNews(place) {

let queryURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=articles&fq=glocations:${place}&api-key=g3KFAz8SGDwQs4rxRmIrPbDPuhJbsmtG`


    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = $("#article-count").val();
  
    // Log the NYTData to console, where it will show up as an object
    console.log(place);
    console.log("------------------------------------");

  for (var i = 0; i < numArticles; i++) {
    // Get specific article info for current index
    var article = place.response.docs[i];

    var articleCount = i + 1;

    // Create the  list group to contain the articles and add the article content for each
    var $articleList = $("<ul>");
    $articleList.addClass("list-group");

    // Add the newly created element to the DOM
    $("#article-section").append($articleList);

    // If the article has a headline, log and append to $articleList
    var headline = article.headline;
    var $articleListItem = $("<li class='list-group-item articleHeadline'>");

    if (headline && headline.main) {
      console.log(headline.main);
      $articleListItem.append(
        "<span class='label label-primary'>" +
          articleCount +
          "</span>" +
          "<strong> " +
          headline.main +
          "</strong>"
      );
    }
  }
  var byline = article.byline;

  if (byline && byline.original) {
    console.log(byline.original);
    $articleListItem.append("<h5>" + byline.original + "</h5>");
  }

  // Log section, and append to document if exists
  var section = article.section_name;
  console.log(article.section_name);
  if (section) {
    $articleListItem.append("<h5>Section: " + section + "</h5>");
  }

  // Log published date, and append to document if exists
  var pubDate = article.pub_date;
  console.log(article.pub_date);
  if (pubDate) {
    $articleListItem.append("<h5>" + article.pub_date + "</h5>");
  }

  // Append and log url
  $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
  console.log(article.web_url);

  // Append the article
  $articleList.append($articleListItem);
}

$('#news-button').on('click', function () {
  console.log('news');
  localStorage.setItem('place', getLocation());
  window.location.href = 'results.html';
});
// CLICK HANDLERS
// ==========================================================

// .on("click") function associated with the Search Button
$("#news-button").on("click", function(event) {
// This line allows us to take advantage of the HTML "submit" property
// This way we can hit enter on the keyboard and it registers the search
// (in addition to clicks). Prevents the page from reloading on form submit.
event.preventDefault();

// Build the query URL for the ajax request to the NYT API
var queryURL = getNews();

// Make the AJAX request to the API - GETs the JSON data at the queryURL.
// The data then gets passed as an argument to the updatePage function
$.ajax({
  url: queryURL,
  method: "GET"
}).then(getNews);
});