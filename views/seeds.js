var mongoose = require("mongoose");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var ToAdd=require("../models/Essential");

var data = [
    {
    name: "Piece of Peace",
    image:"https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    description: "Peace and chill"
    },
    {
    name: "Heaven's Door",
    image:"https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
    description: "Either you stay up and live the heavenly view or you fall down and literally get to see heaven(hopefully :P)"
    },
    {
        name: "Piece of Peace",
        image:"https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "Peace and Chill!"
        }
];

var essential=[
    {
        item:"Shoes"
    }
];

 function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
        }else{
            console.log("removed campgrounds!");
        }
     });

    data.forEach(function(seed){
        Campground.create(seed, function(err,campground){
            if(err){
                console.log(err);
            }else{
                console.log("Added");
                Comment.create(
                    {
                        text: "This place is great!",
                        author: "Homer"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a new comment!")
                        }
                        
                    });
            }
        })
    });
   };

 function ToAddSeed(){
     ToAdd.create(essential,function(err,essential){
         if(err){
            console.log(err);
         }else{
            
         };
     });
 };  

module.exports = seedDB;

