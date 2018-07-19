"use strict";
var express     = require("express"),
    router      = express.Router({mergeParams: true} ),
    CampGround  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleWare  = require("../middleware");

// New Comment Form
// ----------------
router.get("/new", middleWare.isLoggedIn, function(req, res){
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
router.post("/", middleWare.isLoggedIn, function(req,res){
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
        req.flash("success", "Yeah! Comment Added.")
        res.redirect("/campgrounds/"+ req.params.id);
    });
});

// Editing the comment
// -------------------
router.get("/:c_id/edit", middleWare.checkCommentOwnership, function(req, res){
    CampGround.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        } else{
            Comment.findById(req.params.c_id, function(err, comment){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else{
                    res.render("comment/edit", {camp: camp, comment: comment});
                }
            });            
        }
    });
});

// Handling the edited comment
// ---------------------------
router.put("/:c_id", middleWare.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.c_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
        }
        req.flash("success", "Yeah! Comment Successfully Edited .")
        res.redirect("/campgrounds/"+ req.params.id);
    });
});

// Deleting Comment
// ----------------
router.delete("/:c_id", middleWare.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.c_id, function(err){
        if(err){
            console.log(err);
        }
        req.flash("success", "Comment Deleted Successfully.")
        res.redirect("/campgrounds/" + req.params.id);
    });
});


module.exports = router;