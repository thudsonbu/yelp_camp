var express       = require("express");
var router 	      = express.Router();
var Campground    = require("../models/campground"),
    Comment       = require("../models/comment"),
	User          = require("../models/user");


//                                CAMPGROUND ROUTES

// INDEX for campgrounds
router.get("/", function(req, res) {
	// Get all campgrounds from mongodb
	Campground.find({}, function(err, campgrounds){ // Finds all campgrounds
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{
				campgrounds:campgrounds,
				currentUser: req.user
			});
		}
	});
});

// CREATE make a new campground
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
	res.render("campgrounds/new");
});

// SHOW detailed information about a single campground using campground id
router.get("/:id", function(req, res){
	// find the campground with the id provided
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// MIDDLEWARE CHECK LOGIN
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;