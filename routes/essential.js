var express=require("express");
var router=express.Router({mergeParams:true});
var User=require("../models/user");
var Essential=require("../models/Essential");
var middleware=require("../middleware");
const { Query } = require("mongoose");
var campground = require("../models/campground");
const middlewareObj = require("../middleware");
const user = require("../models/user");


router.get("/:user_id/essentials",middlewareObj.isLoggedin,function(req,res){
    User.findById(req.params.user_id).populate("essentials").exec(function(err,user1){
        Essential.find({}).where('user.id').equals(user1._id).exec(function(err,essential){
            if(err){
                res.redirect("/campgrounds");
            }else{         
                res.render("profile/essential",{user:user1,essential:essential});           
            }
        })
        
});
});

router.post("/:user_id/essentials",middlewareObj.isLoggedin,function(req,res){
    User.findById(req.params.user_id,function(err,user1){
        if(err){
            console.log(err);
        }else{
            if(req.user._id.equals(req.params.user_id)){
                var ToAdd=req.body.ToAdd;
                Essential.create({item:ToAdd},function(err,essential){
                    if(err){
                        console.log(err)
                    }else{
                     essential.user.id=user1._id;
                     essential.save();
                     user1.essentials.push(essential);
                     user1.save();
                     res.redirect("/"+ req.params.user_id +"/essentials")  
                    }
                })  
            }else{
                res.send("Dont peek!");
            }  
        }
    })      
});

router.delete("/:user_id/essentials/:essential_id",middlewareObj.isLoggedin,function(req,res){
    User.findById(req.params.user_id,function(err,user1){
        if(err){
            console.log(err);
        }else{
            console.log("1");
            Essential.findByIdAndDelete(req.params.essential_id).exec(function(err){
                console.log("2");
                if(err){
                    res.redirect("/" + req.params.user_id + "/essentials");
                    console.log("Error 1")
                }
                else{
                    req.flash("success","Essential Deleted!");
                    console.log("Error 2")
                    res.redirect("/" + req.params.user_id + "/essentials");
                };
        })   
           
            }
        })
    })


module.exports=router;