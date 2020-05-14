var express = require("express"),
	router = express.Router(),
	passport = require("passport");

var User = require("../models/user");

// ======================================
// INDEX ROUTES
// ======================================

//Get Routes - learning RESTFUL ROUTES

router.get("/", (req, res) => {
	res.render("landing");
});

// ======================================
// Auth ROUTES
// ======================================

//Show Register Form
router.get("/register", (req, res) => {
	res.render("register");
});

//Handles Signup Logic
router.post("/register", (req, res) => {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash("error", err.message);
			res.render("register");
		} else {
			passport.authenticate("local")(req, res, () => {
				req.flash("success", "Welcome to Hotel Reviews, " + user.username);
				res.redirect("/hotels");
			});
		}
	});
});

//Show Login Form
router.get("/login", (req, res) => {
	res.render("login");
});

//Handles Login Logic
router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/hotels",
		failureRedirect: "/login",
	}),
	(req, res) => {}
);

//Logout Route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/hotels");
});

module.exports = router;
