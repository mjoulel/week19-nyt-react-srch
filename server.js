/* MongoDB nytreact
 * =================== */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");

// Require Article Schema
var Article = require("./models/Article");

var request = require("request");     // Snatches HTML from URLs
var cheerio = require("cheerio");     // Scrapes our HTML

// Initialize Express
var app = express();

// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "nytreact";
var collections = ["articles"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});


// Routes
// 1. At the root path, send a simple hello world message to the browser
app.get("/", function(req, res) {
  res.send("Articles");
});

// 2. At the "/all" path, display every entry in the articles collection
app.get("/all", function(req, res) {
  // Query: In our database, go to the articles collection, then "find" everything
  db.articles.find({}, function(err, found) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// 3. At the "/title" path, display every entry in the articles collection, sorted by title
app.get("/title", function(req, res) {
  // Query: In our database, go to the articles collection, then "find" everything,
  // but this time, sort it by title (1 means ascending order)
  db.articles.find().sort({ title: 1 }, function(err, found) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// 4. At the "/date" path, display every entry in the articles collection, sorted by date
app.get("/date", function(req, res) {
  // Query: In our database, go to the articles collection, then "find" everything,
  // but this time, sort it by date (-1 means descending order)
  db.articles.find().sort({ date: -1 }, function(err, found) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// 5. At the "/url" path, display every entry in the articles collection, sorted by url
app.get("/url", function(req, res) {
  // Query: In our database, go to the articles collection, then "find" everything,
  // but this time, sort it by url (1 means ascending order)
  db.articles.find().sort({ url: 1 }, function(err, found) {
    // Log any errors if the server encounters one
    if (err) {
      console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

// -------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
mongoose.connect("mongodb://admin:codingrocks@ds023664.mlab.com:23664/reactlocate");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// -------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// This is the route we will send GET requests to retrieve our most recent search data.
// We will call this route the moment our page gets rendered
app.get("/api/saved", function(req, res) {

  // We will find all the records, sort it in descending order, then limit the records to 5
  Article.find({}).sort([
    ["date", "descending"]
  ]).limit(5).exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// This is the route we will send POST requests to save each search.
app.post("/api/saved", function(req, res) {
  console.log("TITLE: " + req.body.title);

  // Here we'll save the title based on the JSON input.
  // We'll use Date.now() to always get the current date time
  Article.create({
    title: req.body.title,
    date: Date.now(),
    url: req.body.url
  }, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send("Saved Search");
    }
  });
});

// -------------------------------------------------


// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});