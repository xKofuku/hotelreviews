var express = require("express"),
	router = express.Router();

//Models
var Hotel = require("../models/hotel");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//INDEX ROUTE - main page
router.get("/hotels", (req, res) => {
	//Search for the list of hotel in database
	Hotel.find({}, (err, allHotel) => {
		if (err) {
			console.log(err);
		} else {
			res.render("hotels/index", { hotels: allHotel });
		}
	});
});

//CREATE ROUTE - add new hotel
router.post("/hotels", middleware.isLoggedIn, (req, res) => {
	//get Data from form
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username,
	};
	var newHotel = {
		name: name,
		price: price,
		image: image,
		description: desc,
		author: author,
	};
	//Create new hotel and save it into database
	Hotel.create(newHotel, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/hotels");
		}
	});
	//add to hotels array
	//redirect to get foods
});

//NEW ROUTE -show form to new hotel
router.get("/hotels/new", middleware.isLoggedIn, (req, res) => {
	res.render("hotels/new");
});

//SHOW ROUTE - Shows one thing in particular
router.get("/hotels/:id", (req, res) => {
	//Find the campground with provided ID
	Hotel.findById(req.params.id)
		.populate("comments") //Populate means the comments won't only show the ID instead the whole comments
		.exec((err, foundHotel) => {
			if (err) {
				console.log(err);
			} else {
				//Render show template with that hotel
				res.render("hotels/show", { hotel: foundHotel });
			}
		});
});

//EDIT ROUTE - Edit a hotel details and loads the form
router.get("/hotels/:id/edit", middleware.checkHotelOwnership, (req, res) => {
	Hotel.findById(req.params.id, (err, foundHotel) => {
		res.render("hotels/edit", { hotel: foundHotel });
	});
});

//UPDATE ROUTE - updating the data and going to the specific detail
router.put("/hotels/:id", middleware.checkHotelOwnership, (req, res) => {
	Hotel.findByIdAndUpdate(
		req.params.id,
		req.body.hotel,
		(err, updatedHotel) => {
			if (err) {
				res.redirect("/hotels");
			} else {
				res.redirect("/hotels/" + req.params.id);
			}
		}
	);
});

//DESTROY ROUTE - deletes
router.delete("/hotels/:id", middleware.checkHotelOwnership, (req, res) => {
	Hotel.findByIdAndDelete(req.params.id, (err) => {
		if (err) {
			res.redirect("/hotels");
		} else {
			res.redirect("/hotels");
		}
	});
});

module.exports = router;
