"use strict";
var express     = require("express"),
    router      = express.Router({mergeParams: true} ),
    CampGround  = require("../models/campground"),
    Comment     = require("../models/comment");

// New Comment Form
// ----------------
router.get("/new", isLoggedIn, function(req, res){
    CampGround.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        } else{
            res.render("comment/new", {camp: camp});
        }
    });
});

// Handling the New Comment
// ------------------------
router.post("/", isLoggedIn, function(req,res){
    CampGround.findById(req.params.id, function(err, camp) {
        if(err){
            console.log(err);
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                }
            });
        }
        res.redirect("/campgrounds/"+ req.params.id);
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