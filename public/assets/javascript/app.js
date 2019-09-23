// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        var articleURL = "https://www.reuters.com"+ data[i].link;
      // Display the apropos information on the page
      $("#scrape-results").append("<p data-id='" + data[i]._id + "'>" + data[i].title + 
      "<button class='save-article button is-info is-medium' data-id='" + data[i]._id + "'><span class='icon'><i class='fa fa-bookmark'></i></span>Save Article</button>"
      + "<br />" + data[i].summary + "<br />" + articleURL + "</p>" + "<br><br>");
    }
  });