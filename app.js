// =============================== APP CONFIG =================================

// Necessary app dependencies
var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
	User          = require("./models/user"),
    seedDB        = require("./seeds");



// Create a connection for mongoose
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

// Memorize this line
app.use(bodyParser.urlencoded({extended: true}));

// Set the default page type to ejs
app.set("view engine", "ejs");

// Stylesheet link
app.use(express.static(__dirname + "/public"));

//seedDB();

// ============================= PASSPORT SETUP ================================

app.use(require("express-session")({
	secret: "The subaru WRX is one of the best cars ever made.",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// THIS MIDDLEWARE PASSES THE CURRENT USER VARIABLE TO EVERY REQ
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// ============================= ROUTES =========================================

// route for root directory
app.get("/", function(req, res){
	res.render("landing");
});

//                                CAMPGROUND ROUTES

// INDEX for campgrounds
app.get("/campgrounds", function(req, res) {
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


//                                COMMENT ROUTES

// NEW - comments
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE - comments
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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


//                                AUTHORIZATION ROUTES

// SHOW - register
app.get("/register", function(req, res){
	res.render("register");
});

// POST - register
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
	res.render("login");
});

// POST - login
app.post("/login", 
	passport.authenticate("local", {
		successRedirect: "/campgrounds", 
		failureRedirect: "/login"
	}),	 
	function(req, res){
		console.log("potato");
});

// GET - logout
app.get("/logout", function(req, res){
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

// LISTEN - tell the server to listen on port 3000
app.listen(3000, function() { 
  console.log('Yelpcamp server listening on port 3000.'); 
});