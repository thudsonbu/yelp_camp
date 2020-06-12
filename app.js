// Necessary app dependencies
var express = require("express");
var app = express();


// Set the default page type to ejs
app.set("view engine", "ejs");


// route for root directory
app.get("/", function(req, res){
	res.render("landing");
});

// campgrounds route
app.get("/campgrounds", function(req, res) {
	var campgrounds = [
		{name: "Red Rocks", image: "https://pixabay.com/get/50e9d4474856b10ff3d8992ccf2934771438dbf8525478487d2a79d2964a_340.jpg"},
		{name: "Jackson Valley", image: "https://pixabay.com/get/57e1d14a4e52ae14f1dc84609620367d1c3ed9e04e50744074277ed6914cc2_340.jpg"},
		{name: "North Eagle", image: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e50744074277ed6914cc2_340.jpg"},
	]
	// the first campgrounds is the name we give the variable, the second is the data
	res.render("campgrounds", {campgrounds:campgrounds});
});

// campgrounds post route
app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	// redirect back to campgrounds page
});


// tell the server to listen on port 3000
app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});