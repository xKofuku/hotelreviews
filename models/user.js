var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//Schema Setup
var userSchema = new mongoose.Schema({
	username: String,
	password: String,
});

//Passport local mongoose
userSchema.plugin(passportLocalMongoose);

//Model Setup
var User = mongoose.model("User", userSchema);

module.exports = User;
