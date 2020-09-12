var express=require("express");
var router=express.Router({mergeParams:true});
var User=require("../models/user");
var Essential=require("../models/Essential");
var middleware=require("../middleware");
const { Query } = require("mongoose");
var campground = require("../models/campground");
const middlewareObj = require("../middleware");


router.get("/users/:user_id", middlewareObj.isLoggedin,function(req,res){
    User.findById(req.params.user_id, function(err,user1){
        campground.find().where('author.id').equals(user1._id).exec(function(err,campgrounds){
            if(err){
                req.flash("error","Something went wrong")
                res.redirect("/");
            }else{
                res.render("profile/index",{user:user1, campgrounds:campgrounds});
            }
        })
        
    });
});




module.exports=router;