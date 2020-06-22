var express       = require("express");
var router 	      = express.Router();
var middleware    = require("../middleware");
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
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
	// Create a new campground and save it to the database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
			console.log("Issue with creating campground");
		} else {
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

// NEW show the form to make a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
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


// EDIT - campgrounds
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	// Find campground
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE - campgrounds
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


// DESTROY - campgrounds
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
});


module.exports = router;