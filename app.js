// Necessary app dependencies
var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");




// Create a connection for mongoose
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

// Schema Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

// Create the model
var Campground = mongoose.model("Campground", campgroundSchema);

// //Create a new campground
// Campground.create({
// 	name: "Red Rocks", 
// 	image: "https://images.pexels.com/photos/803226/pexels-photo-803226.jpeg?auto=compress&cs=tinysrgb&h=350",
// 	description: "This is a big red rock."
// },	function(err, campground){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("Newly Created newCampground");
// 		console.log(campground);
// 	}
// });

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
			res.render("index",{campgrounds:campgrounds});
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
	res.render("new.ejs");
});

// SHOW detailed information about a single campground using campground id
app.get("/campgrounds/:id", function(req, res){
	// find the campground with the provided provided
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("show", {campground: foundCampground});
		}
	});
})


// tell the server to listen on port 3000
app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});