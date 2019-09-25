var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require('express-handlebars');

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var app = express();

var PORT = process.env.PORT || 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.get("/", (req, res) => {
    res.render("index");
  });
app.get("/saved", (req, res) => {
	res.render("saved");
});
app.get("/scrape", function(req, res) {
    axios.get("https://www.reuters.com//").then(function(response) {
      var $ = cheerio.load(response.data);
  
      var result = {};
      $("div.story-content").each(function(i, element) {
  
        result.title = $(this)
          .children("a")
          .text();
        result.link = "https://www.reuters.com" + $(this).children("a").attr("href");
        result.summary = $(this)
            .children("p")
            .text();
  
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
  
      res.render("index");
    });
});
app.get("/articles", function(req, res) {
    db.Article.find({}).limit(6)
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});