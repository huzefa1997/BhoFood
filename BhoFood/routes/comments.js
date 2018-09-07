var express = require("express");
var router = express.Router({mergeParams: true});
var Dish = require("../models/menu");
var Comment = require("../models/comment");
var helper = require("../helperFunctions");

//Comments new
router.get("/new", helper.isLoggedIn, function(req, res) {
    Dish.findById(req.params.id, function(err, dish){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {menu: dish});
        }
    })
});

//Comments create
router.post("/", helper.isLoggedIn, function(req, res){
    Dish.findById(req.params.id, function(err, dish){
        if (err){
            console.log(err);
            res.redirect("/menu");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    dish.comments.push(comment);
                    dish.save();
                    req.flash("success", "Sucessfully added comment");
                    res.redirect("/menu/" + dish._id);
                }
            });
        }
    });
});

//EDIT Comments route
router.get("/:comment_id/edit", helper.checkCommentOwnership, function(req,res){
    Dish.findById(req.params.id, function(err, foundDish){
        if(err || !foundDish){
            req.flash("err", "No dish found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {menu_id: req.params.id, comment: foundComment});
            }
        });
    });
});


//UPDATE Comments route
router.put("/:comment_id", helper.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/menu/" + req.params.id);
        }
    });
});

//DELETE Comments route
router.delete("/:comment_id", helper.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("sucess", "Comment deleted");
            res.redirect("/menu/" + req.params.id);
        }
    });
});





module.exports = router;