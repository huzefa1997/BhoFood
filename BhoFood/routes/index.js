var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function (req,res){
    res.render("landing");
});



// AUTH ROUTES
// 1. Show Register form
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
})

//Handle Sign Up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === "huzmus"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error":err.message});
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to BhoFood " + user.username);
            return res.redirect("/menu");
        });
    });
});

//SHow login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
})

//handling login 
router.post("/login", passport.authenticate("local", 
    {   successRedirect: "/menu",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome to BhoFood"
    
    }), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/menu");
});


module.exports = router;