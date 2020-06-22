var express       = require("express");
var Campground    = require("../models/campground"),
    Comment       = require("../models/comment"),
	User          = require("../models/user");


// Middleware

var middlewareObj = {};

// CHECK CAMPGROUND OWNER
middlewareObj.checkCampgroundOwnership =function(req, res, next){
	// Check if user is logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back");
			} else {
				// Does user own campground?
				if(foundCampground.author.id.equals(req.user._id)){ // We must use the equals  method because campground is an object
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		console.log("Need to be logged in to do that.");
		res.redirect("back");
	}
}

// CHECK COMMENT OWNER
middlewareObj.checkCommentOwnership = function(req, res, next){
	// Check if user is logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				// Does user own comment?
				if(foundComment.author.id.equals(req.user._id)){ // We must use the equals  method because campground is an object
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		console.log("Need to be logged in to do that.");
		res.redirect("back");
	}
}

// CHECK USER IS LOGGED IN
middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		// user was found to be logged in => perform next function (handled by express)
		return next();
	}
	// user was not found 
	req.flash("error", "Please Login First!"); // needs to come before redirect
	res.redirect("/login");
};


module.exports = middlewareObj;