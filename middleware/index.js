var Hotel = require("../models/hotel");
var Comments = require("../models/comments");

//All middleware goes here
var middlewareObj = {}; 

middlewareObj.checkHotelOwnership = function (res, req, next) {
	if (req.user.isAuthenticated()) {
		Hotel.findById(req.params.id, (err, foundHotel) => {
			if (err) {
				req.flash("error", "Hotel not found");
				res.redirect("back");
			} else {
				if (foundHotel.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};
middlewareObj.checkCommentOwnership = function (res, req, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.id, (err, foundComment) => {
			if (err) {
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};
middlewareObj.isLoggedIn = function (req, res, next) {
	//Next parameter is will just continue the code if authenticated
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;
