var express       = require("express");
var router 	      = express.Router({mergeParams: true}); // MERGE PARAMS GETS ID OF CAMPGROUND
var middleware    = require("../middleware");
var Campground    = require("../models/campground"),
    Comment       = require("../models/comment"),
	User          = require("../models/user");

//                                COMMENT ROUTES

// NEW - comments
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Campground not found.");
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE - comments
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			req.flash("error", "Campground not found.");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Comment creation failed.");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save the comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					console.log(comment);
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// EDIT - comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Comment not found.");
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE - comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", "Comment edit failed.");
			res.redirect("back");
		} else {
			req.flash("success", "Comment update successful.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY - comments
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	// findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Comment deletion failed.");
			res.redirect("back");
		} else {
			req.flash("error", "Comment deleted succesfully.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;