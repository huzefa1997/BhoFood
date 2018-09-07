var express = require("express");
var router = express.Router();
var Dish = require("../models/menu");
var helper = require("../helperFunctions");

//image upload config code
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'huzefa1997', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//INDEX: Show all dishes
router.get("/", function (req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(searchRegex(req.query.search), 'gi');
        Dish.find({name: regex}, function(err, allDishes){
            if(err){
                console.log(err);
        } else {
            if(allDishes.length < 1){
                 noMatch = "No dishes match that search, please try again";
            }
            res.render("menu/index", {menu: allDishes, page: "menu", noMatch: noMatch});
        }
        });
        
    }else {
        
        Dish.find({}, function(err, allDishes){
            if(err){
                console.log(err);
        } else {
            res.render("menu/index", {menu: allDishes, page: "menu",noMatch: noMatch});
        }
        });
    }
});

//CREATE: add new dish to menu and database
router.post("/", helper.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
    // add cloudinary url for the image to the dish object under image property
    req.body.dish.image = result.secure_url;
    //add images id to dish object
    req.body.dish.imageId = result.public_id;
    // add author to dish
    req.body.dish.author = {
        id: req.user._id,
        username: req.user.username
    }
    Dish.create(req.body.dish, function(err, dish) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    res.redirect('/menu/' + dish.id);
    });
    });
});

//NEW: Displays form to make a new Dish
router.get("/new",helper.isLoggedIn, function(req, res){
    res.render("menu/new");
});

//SHOW: Shows more info about one dish
router.get("/:id", function(req,res){
    Dish.findById(req.params.id).populate("comments").exec(function(err, foundDish){
        if(err || !foundDish){
            req.flash("error", "Dish not found");
            res.redirect("back");
        }else{
            console.log(foundDish);
            res.render("menu/show", {dish: foundDish});
        }
    });
});

// EDIT Dish 
router.get("/:id/edit", helper.checkDishOwnership, function(req, res) {
    Dish.findById(req.params.id, function(err, foundDish){
        res.render("menu/edit", {dish: foundDish});
    });
});

//UPDATE Dish
router.put("/:id",helper.checkDishOwnership, upload.single('image'), function(req, res) {
    Dish.findById(req.params.id, async function(err, dish){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if(req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(dish.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    dish.imageId = result.public_id;
                    dish.image =result.secure_url;
                } catch(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            dish.name = req.body.name;
            dish.price = req.body.price;
            dish.description =req.body.description;
            dish.save();
            req.flash("success", "Sucessfully Updated!");
            res.redirect("/menu/" + req.params.id);
        }
    });
});

//DESTROY DISH ROUTE
router.delete("/:id", helper.checkDishOwnership, function(req,res){
    Dish.findById(req.params.id, async function(err, dish){
        if(err){
            res.flash("error", err.message);
            return res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(dish.imageId);
            dish.remove();
            req.flash("success", "Dish deleted successfully!");
            res.redirect("/menu");
        } catch(err){
            if(err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
        }
    });
});


function searchRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;