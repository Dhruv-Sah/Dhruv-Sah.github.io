var middlewareObj = {};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.checkCampgroundOwnership =function(req,res,next){
        if(req.isAuthenticated())
        {
            Campground.findById(req.params.id,function(err,foundCampground){
                if(foundCampground.author.id.equals(req.user._id))
                {
                    if(err){
                    res.redirect("/campgrounds")
                    }
                    else{
                        next();
                        }
                }else{
                    req.flash("error","You did not create this campground!");
                    res.redirect("/campgrounds");
                     };
            });     
        }
        else{
            req.flash("error","You need to logged in to do that");
            res.redirect("/login");
            };
    };

 
middlewareObj.isLoggedin = function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","You need to logged in to do that");
        res.redirect("/login");
    };  


module.exports = middlewareObj;