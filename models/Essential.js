var mongoose=require("mongoose");

var ToAddSchema= new mongoose.Schema({
    item:String,
    user:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		}
	}   
});

module.exports= mongoose.model("Essential",ToAddSchema);