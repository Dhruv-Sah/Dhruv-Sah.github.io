var mongoose=require("mongoose");

var bucketSchema = new mongoose.Schema({
	name: String,
	image: String,
	cost:Number,
	original:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Campground"
		}
	},
	user:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String,
	}
});


module.exports = mongoose.model("Bucket", bucketSchema);