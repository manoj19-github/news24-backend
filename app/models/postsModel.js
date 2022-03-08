const  mongoose=require("mongoose")
const postsSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true,
    trim:true
  },
  desc:{
    type:String,
    required:true
  },
  image:{
    type:String
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true

  }
},{timestamps:true})

module.exports=mongoose.model('Post', postsSchema);
