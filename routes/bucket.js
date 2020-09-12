var express=require("express");
var router=express.Router({mergeParams:true});
var middleware=require("../middleware");
var Campground=require("../models/campground");
var User=require("../models/user");
var Bucket=require("../models/bucket");
const user = require("../models/user");


router.get("/:user_id/bucketlist",middleware.isLoggedin,function(req,res){
    User.findById(req.params.user_id).populate("bucketlist").exec(function(err, user){
        Bucket.find({},function(err,bucket){
            if(err){
                console.log(err);
            }else{
                console.log("Found User")
                res.render("profile/bucket",{user:user,bucket:bucket});
            }
        })	
	}); 
});

router.post("/:user_id/bucketlist/:camp_id",middleware.isLoggedin, function(req,res){
    User.findById(req.params.user_id,function(err,user1){
        if(err){
            console.log(err)
        }else{
            Campground.findById(req.params.camp_id,function(err,campground){
                if(err){
                    req.flash("error","Oops,some error occured!")
                    res.redirect("/campgrounds");
                }else{
                    var bucket={name:campground.name,image:campground.image,cost:campground.cost}
                    Bucket.create(bucket,function(err,bucket){
                        if(err){
                            req.flash("error", "Something went wrong!")
                            console.log(err);
                        }else{
                            bucket.original.id=campground._id;
                            bucket.user.id=user1._id;
                            bucket.save();
                            user1.bucketlist.push(bucket);
                    user1.save();
                    console.log(campground._id);
                    req.flash("Success","Successfully added to your bucket list");
                    res.redirect("/" + req.params.user_id + "/bucketlist");
                        }
                    })
                    // if(user1._id.equals('req.query.bucketlistuser')){
                    
                //    }
                //    else{
                //        res.redirect("/" + campground._id )
                //    }
                    }     
                })
        }
    })
	
    });

router.delete("/:user_id/bucketlist/:bucket_id",function(req,res){
    User.findById(req.params.user_id,function(err,user1){
        Bucket.findByIdAndDelete(req.params.bucket_id).where('user.id').equals(user1._id).exec(function(err){
            if(err){
                res.redirect("/campgrounds");
            }
            else{
                req.flash("success","Campground Deleted from Bucket!");
                res.redirect("/" + req.params.user_id + "/bucketlist");
            };
        })


    })
    
});    

module.exports=router;