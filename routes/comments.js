var express = require("express"),
	router = express.Router();

//Models
var Hotel = require("../models/hotel");
var Comment = require("../models/comments");
var middleware = require("../middleware");

// ======================================
// COMMENT ROUTES
// ======================================

//NEW ROUTE - Renders form
router.get("/hotels/:id/comments/new", middleware.isLoggedIn, (req, res) => {
	Hotel.findById(req.params.id, (err, hotel) => {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", { hotel: hotel });
		}
	});
});

//CREATE ROUTE - adds comment to the database
router.post("/hotels/:id/comments", middleware.isLoggedIn, (req, res) => {
	Hotel.findById(req.params.id, (err, hotel) => {
		if (err) {
			console.log(err);
			redirect("/hotels");
		} else {
			//req.body.comment is new because we used on form is array
			//See the old version CREATE FOOD ROUTE its too long
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					res.flash("error", "Something went wrong");
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					hotel.comments.push(comment);
					hotel.save();
					res.flash("success", "Successfully added comment");
					res.redirect("/hotels/" + hotel._id);
				}
			});
		}
	});
});

//EDIT ROUTE
router.get(
	"/hotels/:id/comments/:comment_id/edit",
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {
					hotel_id: req.params.id,
					comment: foundComment,
				});
			}
		});
	}
);

//UPDATE ROUTE
router.put(
	"/hotels/:id/comments/:comment_id",
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findByIdAndUpdate(
			req.params.comment_id,
			req.body.comment,
			(err, updatedComment) => {
				if (err) {
					res.redirect("back");
				} else {
					res.redirect("/hotels/" + req.params.id);
				}
			}
		);
	}
);

//DELETE ROUTE
router.delete(
	"/hotels/:id/comments/:comment_id",
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findByIdAndDelete(req.params.comment_id, (err) => {
			if (err) {
				res.redirect("back");
			} else {
				req.flash("success", "Comment deleted!");
				res.redirect("/hotels/" + req.params.id);
			}
		});
	}
);

module.exports = router;
