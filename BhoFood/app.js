require('dotenv').config();
var express = require("express");
var app = express();
app.set("view engine", "ejs");
var flash = require("connect-flash");
app.use(flash());
//
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/bho_food", {useNewUrlParser: true});
var Dish = require("./models/menu");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
//seedDB(); 
app.use(express.static(__dirname + "/public"));
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.locals.moment = require("moment");



var commentRoutes = require("./routes/comments");
var menuRoutes = require("./routes/menu");
var authRoutes = require("./routes/index");

// Passport Config
app.use(require("express-session")({
    secret: "Bleh",
    resave: false,
    saveUninitialized: false

}));
    
    
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//requiring routes
app.use(authRoutes);
app.use("/menu", menuRoutes);
app.use("/menu/:id/comments", commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The BhoFood Server Has Started!");
});