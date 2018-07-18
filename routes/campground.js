"use strict";
var express     = require("express"),
    router      = express.Router(),
    CampGround  = require("../models/campground");

// View all Campgrounds
// --------------------
router.get("/",function(req, res) {
    CampGround.find({}, function(err, camp){
        if(err){
            console.log(err);
        }else{
            res.render('campground/index',{location: camp});
        }
    });
});


// Add Campround Form Page
// -----------------------
router.get("/new", isLoggedIn, function(req,res){
    res.render("campground/new");
});


// Post Campground
// ---------------
router.post("/", isLoggedIn, function(req,res){
    var name    = req.body.name,
        image   = req.body.image,
        content = req.body.content,
        author  = {
            id      : req.user._id,
            username: req.user.username
        };
    var newCampLocation = {name: name, image: image, content: content, author: author };
    
    CampGround.create(newCampLocation, function(err, campgrounds){
        if(err){
            console.log(err);
        }else{
            // console.log(campgrounds);
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
       } else{
        //   console.log(camp);
           res.render("campground/show", {camp: camp});
       }
   }); 
});

// Edit Campground Page
// --------------------
router.get("/:id/edit", function(req, res){
    CampGround.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
            res.redirect("/"+camp._id);
        } else{
            res.render("campground/edit", {camp: camp});
        }
    });
});

// Save edited details to campground
// ---------------------------------
router.put("/:id", function(req, res){
    // sanitizing JavaScript from content
    // req.body.camp.content = req.sanitize(req.body.camp.content);
    CampGround.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp){
        if(err){
            console.log(err);
        }
        res.redirect("/campgrounds/"+ camp._id);
    });
});

// Deleting camp
// -------------
router.delete("/:id", function(req,res){
    CampGround.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        res.redirect("/campgrounds");
    });
});


// =========
// FUNCTIONS
// =========

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        // For not allowing cache(for previous page)
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        return next();
    }
    res.redirect("/login");
}



module.exports = router;