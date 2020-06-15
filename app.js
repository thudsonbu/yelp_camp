// Necessary app dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var campgrounds = [
		{name: "Red Rocks", image: "https://pixabay.com/get/57e8d1464d53a514f1dc84609620367d1c3ed9e04e507440772e7add934ac5_340.jpg"},
		{name: "Jackson Valley", image: "https://pixabay.com/get/57e8d1454b56ae14f1dc84609620367d1c3ed9e04e507440772e7add934ac5_340.jpg"},
		{name: "North Eagle", image: "https://pixabay.com/get/52e8d4444255ae14f1dc84609620367d1c3ed9e04e507440772e7add934ac5_340.jpg"},];


// Memorize this line
app.use(bodyParser.urlencoded({extended: true}));

// Set the default page type to ejs
app.set("view engine", "ejs");


// route for root directory
app.get("/", function(req, res){
	res.render("landing");
});

// campgrounds route
app.get("/campgrounds", function(req, res) {
	
	// the first campgrounds is the name we give the variable, the second is the data
	res.render("campgrounds", {campgrounds: campgrounds});
});

// campgrounds post route
app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	// redirect back to campgrounds page
	res.redirect("/campgrounds");
});

// campgrounds form for new campgrounds
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});


// tell the server to listen on port 3000
app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});