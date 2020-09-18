// =============================== APP CONFIG =================================

// Libraries
var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	flash          = require("connect-flash");
    
// Mongoose Models	
var Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
	User          = require("./models/user"),
    seedDB        = require("./seeds");

// Route Files
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes      = require("./routes/index");


// Create a connection for mongoose
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

// Memorize this line
app.use(bodyParser.urlencoded({extended: true}));

// Set the default page type to ejs
app.set("view engine", "ejs");

// Stylesheet link
app.use(express.static(__dirname + "/public"));

// Method override (to fix the stupidity of forms)
app.use(methodOverride("_method"));

// Flash library used for flash notificaitons
app.use(flash());

// seedDB();

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// LISTEN - tell the server to listen on port 3000
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Yelpcamp server listening on port 3000.'); 
});