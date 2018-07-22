"use strict";
var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user"),
    async       = require("async"),
    nodemailer  = require("nodemailer"),
    crypto      = require("crypto");

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
    var newUser = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email   : req.body.email                    
    });
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


// Forgot password Page
// --------------------
router.get('/forgot', function(req, res) {
  res.render('auth/forgot');
});

// Handling Forgot Password
// ------------------------
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'vabcampteam@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'VabCamp <vabcampteam@gmail.com>',
        subject: 'VabCamp Account Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});


// Reset Password Page
// -------------------
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('auth/reset', {token: req.params.token});
  });
});


// Handling Reset Password
// -----------------------
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'vabcampteam@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'VabCamp <vabcampteam@gmail.com>',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});




module.exports = router;