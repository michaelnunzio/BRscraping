var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
const bodyParser = require("body-parser");

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

//******MONGODB******/
var databaseUri= "mongodb://localhost/BRscraper";

if (process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI);
}else{
  mongoose.connect(databaseUri)
}


// Initialize Express
var app = express();

//*****Body Parser***/
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
// Configure middleware
//**body parse end***/

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder *Might have to get rid of this when adding handlebars*
// app.use(express.static("public"));
app.use(express.static(__dirname+"/public"));


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/BRscraper", { useNewUrlParser: true });


// handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// **Routes**
// A GET route for scraping BleacherReport.com

app.get('/', function(req, res){
    
  res.render('index');
  
  // res.send('hit the "/" route');
})

//**start route */
app.get("/scrape", function(req, res) {

    axios.get("https://bleacherreport.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
    
        // Now, we grab every h2 within an article tag, and do the following:
        $("a.articleTitle").each(function(i, element) {
          // Save an empty result object
          var result = {};
    
          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this).children().text();
          console.log(result.title);
          result.link = $(this).attr("href");
          console.log(result.link);
    
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        });
    
        // Send a message to the client
        res.send("Scrape Complete");
      });

});
// first GET complete

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


/********/

app.get('/saved', function(req, res){
    
  db.Article.find({saved: true}).then(function(dbArticle){
      res.json(dbArticle);
  }).catch(function(err){
      res.json(err);
  })
})

app.get('/savedArticles', function(req, res){

  res.render('saved'); 
})


app.get('/savedArticles/:id', function(req, res){
  
  db.Article.update(
      {_id: req.params.id},
      {$set: {saved: true}},
      function(error, edited){
          if (error){
              // console.log(error);
              res.send(error);
          }else{
              res.send(edited);
          }
      })
})

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  