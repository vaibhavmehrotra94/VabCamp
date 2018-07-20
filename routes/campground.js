"use strict";
var express     = require("express"),
    router      = express.Router(),
    CampGround  = require("../models/campground"),
    middleWare  = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX - show all campgrounds
// ----------------------------
router.get("/", function (req, res) {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    CampGround.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        if(err){
            console.log(err);
        }
        CampGround.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("index", {
                    camp: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
                    page: "campgrounds"
                });
            }
        });
    });
});

// Add Campround Form Page
// -----------------------
router.get("/new", middleWare.isLoggedIn, function(req,res){
    res.render("campground/new");
});


// Post Campground
// ---------------
router.post("/", middleWare.isLoggedIn, function(req,res){
    var name    = req.body.name,
        image   = req.body.image,
        content = req.body.content,
        price   = req.body.price,
        author  = {
            id      : req.user._id,
            username: req.user.username
        };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
            
            
        var newCampLocation = {name: name, image: image, content: content, location: location, lat: lat, lng: lng, price: price, author: author };
        
        CampGround.create(newCampLocation, function(err, campgrounds){
            if(err){
                console.log(err);
                req.flash("error", "Oops! Something went wrong.");
                res.redirect("back");
            }else{
                // console.log(campgrounds);
                req.flash("success", "Yeah! CampGround Successfully Added.");
                res.redirect("/campgrounds");
            }
        });
    });
});

// Show details page
// -----------------
router.get("/:id", function(req, res) {
   CampGround.findById(req.params.id).populate("comments").exec(function(err, camp){
       if(err){
           console.log(err);
           req.flash("error", "Oops! Something went wrong.");
           res.redirect("back");
       } else{
        //   console.log(camp);
           res.render("campground/show", {camp: camp});
       }
   }); 
});

// Edit Campground Page
// --------------------
router.get("/:id/edit", middleWare.checkCampOwnership, function(req, res){
    CampGround.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
            req.flash("error", "Oops! Something went wrong.");
            res.redirect("back");
        } else{
            res.render("campground/edit", {camp: camp});
        }
    });
});

// Save edited details to campground
// ---------------------------------
router.put("/:id", middleWare.checkCampOwnership, function(req, res){
    
    geocoder.geocode(req.body.camp.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.camp.lat = data[0].latitude;
        req.body.camp.lng = data[0].longitude;
        req.body.camp.location = data[0].formattedAddress;
        
        CampGround.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp){
            if(err){
                console.log(err);
                req.flash("error", "Oops! Something went wrong.");
                res.redirect("/campgrounds/"+ camp._id);
            } else{
                req.flash("success", "CampGround successfully updated.");
                res.redirect("/campgrounds/"+ camp._id);
            }
        });
    });
});

// Deleting camp
// -------------
router.delete("/:id", middleWare.checkCampOwnership, function(req,res){
    CampGround.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        req.flash("success", "Yeah! CampGround successfully removed.");
        res.redirect("/campgrounds");
    });
});

module.exports = router;