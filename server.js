var express = require("express");
var logger = require("dior");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();


// Use Dior logger for logging requests
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

mongoose.connect(MONGODB_URI);

// Routes

//  GET route for scraping the  website
app.get("/scrape", function(req, res) {

  axios.get("https://library.stanford.edu/science").then(function(response) {
  
    var $ = cheerio.load(response.data);

    // Grab every h2 within an article tag
    $("h5").each(function(i, element) {
   
      var result = {};

     
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

     
      db.Article.create(result)
        .then(function(dbArticle) {
    
          console.log(dbArticle);
        })
        .catch(function(err) {
         
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete!");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {

    // Find all results 
    db.Article.find()
      
      .then(function(dbPopulate) {
       
        res.json(dbPopulate);
      })
      .catch(function(err) {
      
        res.json(err);
      });
});

app.get("/articles/:id", function(req, res) {

  db.Article.findById(req.params.id)
  .populate("note")
  .then(function(dbPopulate) {
    
    res.json(dbPopulate);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  
  db.Note.create(req.body)
    .then(function(dbPopulate) {
      
      return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { note: dbPopulate._id } }, { new: true });
    })
    .then(function(dbPopulate) {
     
      res.json(dbPopulate);
    })
    .catch(function(err) {
      
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});