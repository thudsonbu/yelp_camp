// Necessary app dependencies
var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");
var seedDB      = require("./seeds");

//seedDB();

// Create a connection for mongoose
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

// Memorize this line
app.use(bodyParser.urlencoded({extended: true}));

// Set the default page type to ejs
app.set("view engine", "ejs");


// route for root directory
app.get("/", function(req, res){
	res.render("landing");
});

// INDEX for campgrounds
app.get("/campgrounds", function(req, res) {
	// Get all campgrounds from mongodb
	Campground.find({}, function(err, campgrounds){ // Finds all campgrounds
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds:campgrounds});
		}
	});
});

// CREATE make a new campground
app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	// Create a new campground and save it to the database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
			console.log("Issue with creating campground");
		} else {
			console.log(name);
			res.redirect("/campgrounds");
		}
	});
});

// NEW show the form to make a new campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

// SHOW detailed information about a single campground using campground id
app.get("/campgrounds/:id", function(req, res){
	// find the campground with the provided provided
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});



// ============================================ COMMENTS ============================================
app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});


// tell the server to listen on port 3000
app.listen(3000, function() { 
  console.log('Yelpcamp server listening on port 3000.'); 
});