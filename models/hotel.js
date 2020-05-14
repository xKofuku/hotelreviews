var mongoose = require("mongoose");

//Schema Setup
var hotelSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		username: String,
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});
//Model Setup
var Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
