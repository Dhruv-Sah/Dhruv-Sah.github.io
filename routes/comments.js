var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var middleware=require("../middleware");


router.get("/new", middleware.isLoggedin , function(req,res){
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground})
		}
	})
	
});

router.post("/",middleware.isLoggedin, function(req,res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error", "Something went wrong!")
					console.log(err);
				}else{
                    comment.author.id=req.user._id;
                    comment.author.username= req.user.username;
                    comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("Success","Successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

router.get("/:comment_id/edit",function(req,res){
    Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
        Comment.findById(req.params.comment_id,function(err,comment){
            if(err){
                res.redirect("/campgrounds"+campground._id);
            }else{
                res.render("comments/edit",{comment: comment, campground: campground});
            }
        }); 
    }
});
});

router.put("/:comment_id",function(req,res){
    Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,comment){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds/" + campground._id );
		}
    });
};
});
});


router.delete("/:comment_id",function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("/campgrounds/"+req.params.id);
        }
        else{
			req.flash("success","Comment Deleted!");
            res.redirect("/campgrounds/"+req.params.id);
        };
    })
});



module.exports=router;