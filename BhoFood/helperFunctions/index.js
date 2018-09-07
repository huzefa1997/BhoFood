//All helper functions go here
var Dish = require("../models/menu");
var Comment = require("../models/comment");

var helperObj = {
    checkDishOwnership: function(req,res,next){
        
        if(req.isAuthenticated()){
            Dish.findById(req.params.id, function(err, foundDish) {
                if(err || !foundDish){
                    req.flash("error", "Dish not found");
                    res.redirect("back");
                } else {
                    //does user own the dish?
                    if(foundDish.author.id.equals(req.user._id) || req.user.isAdmin) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
        }
    },
    
    checkCommentOwnership: function(req,res,next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err || !foundComment){
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                 } else {
                    //does user own the dish?
                    if(foundComment.author.id.equals || req.user.isAdmin) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
                });
        } else {
        res.redirect("back");
         }
    },
    
    isLoggedIn : function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};

module.exports = helperObj;