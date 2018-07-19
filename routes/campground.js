"use strict";
var express     = require("express"),
    router      = express.Router(),
    CampGround  = require("../models/campground"),
    middleWare  = require("../middleware");

// View all Campgrounds
// --------------------
router.get("/",function(req, res) {
    CampGround.find({}, function(err, camp){
        if(err){
            console.log(err);
        }else{
            res.render('index',{location: camp});
        }
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
    var newCampLocation = {name: name, image: image, content: content, price: price, author: author };
    
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
    // sanitizing JavaScript from content
    // req.body.camp.content = req.sanitize(req.body.camp.content);
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