var middleWareObj   = {},
    CampGround      = require("../models/campground"),
    Comment         = require("../models/comment");

// Function to check is any user is looged in
// ------------------------------------------
middleWareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        // For not allowing cache(for previous page)
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        return next();
    }
    req.flash("error", "Please Log In First !");
    res.redirect("/login");
};

// Function for Camp Ownership
// ---------------------------
middleWareObj.checkCampOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        CampGround.findById(req.params.id, function(err, camp){
            if(err || !camp){
                console.log(err);
                return res.redirect("back");
            } else{
                if(camp.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Sorry! You don't have the permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please Log In First !");
        res.redirect("/login");
    }
};

// Function for commentOwnership
// -----------------------------
middleWareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        Comment.findById(req.params.c_id, function(err, comment){
            if(err || !comment){
                console.log(err);
                return res.redirect("back");
            } else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Sorry! You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Please Log In First !");
        res.redirect("/login");
    }
};


// Function for deleting comment
// -----------------------------
middleWareObj.deleteComment = function (req, res, next){
    if(req.isAuthenticated()){
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        CampGround.findById(req.params.id, function(err, camp){
            if(err){
                console.log(err);
            }
            Comment.findById(req.params.c_id, function(err, comment){
                if(err || !comment){
                    console.log(err);
                    return res.redirect("back");
                } else{
                    if(comment.author.id.equals(req.user._id) || camp.author.id.equals(req.user._id)){
                        next();
                    }else{
                        req.flash("error", "Sorry! You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        });

    }else{
        req.flash("error", "Please Log In First !");
        res.redirect("/login");
    }
};


module.exports = middleWareObj;