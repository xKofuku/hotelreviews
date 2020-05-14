//Setting up import libraries
var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash")

//Models
var Hotel = require("./models/hotel");
var Comment = require("./models/comments");
var User = require("./models/user");
var seedDB = require("./seeds");

//running seed for the DB
//seedDB();

//Routes Config and Dependencies
var commentRoutes = require("./routes/comments"),
	hotelRoutes = require("./routes/hotels"),
	authRoutes = require("./routes/index");



//PassportJS Configuration
app.use(
	require("express-session")({
		secret: "I love you A",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//App Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//App Usage for Login
//Global usage for all routes, getting the ID
app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error"); //global use for flash
	res.locals.success = req.flash("success"); //global use for flash
	next();
});


//MongoDB Full Driver
const MongoClient = require("mongodb").MongoClient;
const uri =
	"mongodb+srv://admin:admin@cluster0-yjr7t.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
	const collection = client.db("test").collection("devices");
	// perform actions on the collection object
	client.close();
});

//Connecting to the MongoDB
mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

//Tester if connected
// mongoose.connection.on("connected", () => {
// 	console.log("Mongoose is connected!");
// });

//ROUTES
app.use(commentRoutes);
app.use(hotelRoutes);
app.use(authRoutes);

//Starting up the server
app.listen(process.env.PORT, () => {
	console.log(`Server started on port`);
});
