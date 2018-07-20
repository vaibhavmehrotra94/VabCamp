"use strict";
var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

// Index Route
// -----------
router.get("/",function(req, res) {
    res.render('landing');
});


// =====================
// AUTHENTICATION ROUTES
// =====================

// Show Registration Form
// ----------------------
router.get("/register", function(req, res){
    res.render("auth/register", {page: "register"});
});

// Save Registration Form details
// ------------------------------
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Yahoo! Welcome to our family. ");
            res.redirect("/campgrounds");
        });
    });
});


// Show Login Form
// ---------------
router.get("/login", function(req, res){
    res.render("auth/login", {page: "login"});
});

// handling login
// --------------
router.post("/login", passport.authenticate("local", {
    successRedirect: "/login/success",
    failureRedirect: "/login/fail"
}),function(req, res){
});

// for Displaying Login Success
// ----------------------------
router.get("/login/success", function(req,res){
    req.flash("success", "Welcome! It's good to see you again.");
    res.redirect("/campgrounds");
});
// for Displaying Login Failed
// ----------------------------
router.get("/login/fail", function(req,res){
    req.flash("error", "Oops! Username/Password Invalid.");
    res.redirect("/login");
});


// Handling LogOut
// ---------------
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "See you soon!");
    res.redirect("/campgrounds");
});


module.exports = router;