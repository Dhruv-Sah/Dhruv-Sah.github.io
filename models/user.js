var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var bcrypt = require('bcrypt-nodejs');

var UserSchema=new mongoose.Schema({
    username: {type: String, required:true, unique:true},
    password: String,
    email: {type: String, required:true, unique:true},
    firstName: {type:String, required:true},
    lastName:String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    admin: {type: Boolean, default:false},
    bucketlist:[
        {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Bucket"
             },
        name: String,    
        image: String,
        cost:Number, 
     }],
     essentials:[{
         id:{
             type: mongoose.Schema.Types.ObjectId,
             ref:"Essential"
         },
         item:String,
     }]
});

UserSchema.plugin(passportLocalMongoose);


module.exports= mongoose.model("User",UserSchema);