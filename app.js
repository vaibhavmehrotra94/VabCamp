"use strict";
// For general environment
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override');

// for user authentication & session
var passport                = require("passport"), //for saving and retrieving auth data using some strategy
    localStrategy           = require("passport-local"), //strategy that uses local data for auth i.e. username & pass.
    passportLocalMongoose   = require("passport-local-mongoose"), //plugging methods in schema to work with passport 
    expressSession          = require("express-session");

// Schemas 
var CampGround  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");

// Routes
var campGroundRoute = require("./routes/campground"),
    commentRoute    = require("./routes/comment"),
    authRoute       = require("./routes/index");
    
// Including Seeds file 
var seedDB = require("./seeds");
    
// Strategy describes the data you will use for auth.(ex. fb, google+, local, twitter) for signUp & logIn. 


mongoose.connect("mongodb://localhost/vab_camp_v8"/*, { useNewUrlParser: true }*/);

// =================================
// Setting up the express Environment
// ==================================
app.set("view engine", "ejs"); //what files to look for html data
app.use(bodyParser.urlencoded({extended:true})); //true(complex Algo) for parsing all data types, false just for string/array
app.use(express.static(__dirname + "/public"));//for describing where the static files are present.
app.use(methodOverride("__method")); //for enabling PUT and DELETE methods.


// ======================
// PASSPORT CONFIGURATION
// ======================
app.use(expressSession({
    secret: "I really want to eat something tasty right now.",
    resave: false,
    saveUninitialized: false
}));

// Intializing Passport
// --------------------
app.use(passport.initialize());
app.use(passport.session());

// Setting up Passport
// -------------------
passport.use(new localStrategy(User.authenticate())); //.authenticate() is provided by pass-loc-mongoose
passport.serializeUser(User.serializeUser()); //.serializeUser() -> pass-loc-mongoose (for decoding)
passport.deserializeUser(User.deserializeUser()); //.deserializeUser() -> pass-loc-mongoose (for encoding)

// Seeding the DataBase
// --------------------
// seedDB();

// MiddleWare for Passing thisUser to all Routes
// ---------------------------------------------

app.use(function(req, res, next){
    res.locals.thisUser = req.user;
    next();
});

// =========================
// Including the Route Files
// =========================

app.use("/",authRoute);
app.use("/campgrounds",campGroundRoute);
app.use("/campgrounds/:id/comments",commentRoute);

// ******************************************
app.listen(process.env.PORT, process.env.IP);