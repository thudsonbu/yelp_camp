var express       = require("express");
var passport      = require("passport");
var router 	      = express.Router();
var Campground    = require("../models/campground"),
    Comment       = require("../models/comment"),
	User          = require("../models/user");


//                                INDEX ROUTES

// route for root directory
router.get("/", function(req, res){
	res.render("landing");
});

//                                AUTHORIZATION ROUTES

// SHOW - register
router.get("/register", function(req, res){
	res.render("register");
});

// POST - register
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res, function(){
			res.redirect("/campgrounds");
		});
	});
});

// SHOW - login
router.get("/login", function(req, res){
	res.render("login");
});

// POST - login
router.post("/login", 
	passport.authenticate("local", {
		successRedirect: "/campgrounds", 
		failureRedirect: "/login"
	}),	 
	function(req, res){
		console.log("potato");
});

// GET - logout
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

// MIDDLEWARE CHECK LOGIN
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;