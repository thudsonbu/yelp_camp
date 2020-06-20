var express       = require("express");
var router 	      = express.Router({mergeParams: true}); // MERGE PARAMS GETS ID OF CAMPGROUND
var Campground    = require("../models/campground"),
    Comment       = require("../models/comment"),
	User          = require("../models/user");

//                                COMMENT ROUTES

// NEW - comments
router.get("/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE - comments
router.post("/", isLoggedIn, function(req, res){
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

// MIDDLEWARE CHECK LOGIN
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;