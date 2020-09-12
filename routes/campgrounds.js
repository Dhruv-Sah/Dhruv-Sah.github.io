var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var middleware=require("../middleware");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

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
  cloud_name: 'dhruv1507', 
  api_key: '818134866926925', 
  api_secret: 'TmuosDZbdfk_ZExYZAOtplvxSvQ'
});
const fs = require('fs');


router.get("/", function(req,res)
{	
	var perPage=6;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name:regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, campgrounds){
			Campground.count().exec(function (err, count) {
				if(err){
				console.log(err);
			}else{
				var noMatch;
				if(campgrounds.length < 1){
					noMatch = " No campgrounds match the search query"
				}
				res.render("campgrounds/index",{campgrounds:campgrounds, noMatch: noMatch, current:pageNumber, pages :Math.ceil(count/perPage)});
			}
		})
	})
}else{
		Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec( function(err, campgrounds){
			Campground.count().exec(function (err, count) {
				if(err){
				console.log(err);
			}else{
				var noMatch;
				if(campgrounds.length < 1){
					noMatch = " No campgrounds added so far"
				}
				console.log()
				res.render("campgrounds/index",{campgrounds:campgrounds, noMatch: noMatch,current:pageNumber, pages :Math.ceil(count/perPage)});
				}
			})
		})
	}	
});

router.get("/trek", function(req,res)
{	
	var perPage=6;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name:regex, category:'Trek'}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, campgrounds){
			Campground.count().exec(function (err, count) {
				if(err){
				console.log(err);
			}else{
				var noMatch;
				if(campgrounds.length < 1){
					noMatch = " No campgrounds match the search query"
				}
				res.render("campgrounds/trekindex",{campgrounds:campgrounds, noMatch: noMatch, current:pageNumber, pages :Math.ceil(count/perPage)});
			}
		})
	})
}else{
		Campground.find({category:"Trek"}).skip((perPage * pageNumber) - perPage).limit(perPage).exec( function(err, campgrounds){
			Campground.count().exec(function (err, count) {
				if(err){
				console.log(err);
			}else{
				var noMatch;
				if(campgrounds.length < 1){
					noMatch = " No campgrounds in this category"
				}
				res.render("campgrounds/trekindex",{campgrounds:campgrounds, noMatch: noMatch,current:pageNumber, pages :Math.ceil(count/perPage)});
				}
			})
		})
	}	
});

router.get("/nontrek", function(req,res)
{	
	var perPage=6;
	var pageQuery = parseInt(req.query.page);
	var pageNumber = pageQuery ? pageQuery : 1;
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name:regex, category:'Non-Trek'}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, campgrounds){
			Campground.count().exec(function (err, count) {
				if(err){
				console.log(err);
			}else{
				var noMatch;
				if(campgrounds.length < 1){
					noMatch = " No campgrounds match the search query"
				}
				res.render("campgrounds/nontrekindex",{campgrounds:campgrounds, noMatch: noMatch, current:pageNumber, pages :Math.ceil(count/perPage)});
			}
		})
	})
}else{
		Campground.find({category:'Non-Trek'}).skip((perPage * pageNumber) - perPage).limit(perPage).exec( function(err, campgrounds){
			Campground.count().exec(function (err, count) {
				if(err){
				console.log(err);
			}else{
				var noMatch;
				if(campgrounds.length < 1){
					noMatch = " No campgrounds in this category"
				}
				res.render("campgrounds/nontrekindex",{campgrounds:campgrounds, noMatch: noMatch,current:pageNumber, pages :Math.ceil(count/perPage)});
				}
			})
		})
	}	
});


router.get("/new",middleware.isLoggedin,function(req,res){
	res.render("campgrounds/new");
})



router.post("/",middleware.isLoggedin, upload.array('image'),async(req,res)=>{
	const uploader = async (path) => await cloudinary.uploads(path, 'Images');
	const images = []
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path)
      images.push(newPath)
      fs.unlinkSync(path)
    }
	
    var name=req.body.camp.name;
	var cost=req.body.camp.cost;
	var desc=req.sanitize(req.body.camp.description);
	var timecreated = Date.now();
	var category=req.body.camp.category;
    var author={
        id:req.user._id,
        username:req.user.username
    };

    var newCampground={name:name,cost:cost,image:images,description:desc,author:author, timecreated:timecreated, category:category}
	Campground.create(newCampground,function(err, newly) {
		if(err){
			console.log(err);
		}else{
			if(category=='Trek'){
				res.redirect("/campgrounds/trek");
			}	
			if(category=='Non-Trek'){
				res.redirect("/campgrounds/non-trek");
			}
		}
	})
});





router.get("/:id",function(req,res){

	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground)
			res.render("campgrounds/show",{campground: foundCampground, user:req.user});
		}
	}); 
	
});



router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
    res.render("campgrounds/edit",{campground: foundCampground});
});
});



router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.camp, function(err,updatedCamp){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})




router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	})
})



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;

