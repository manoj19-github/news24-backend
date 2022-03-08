const User=require("../../models/usersModel")
const Posts=require("../../models/postsModel")
const uploadCloudinary=require("../../utils/uploadCloudinary")
const myPostsController=()=>{
  return{
    async getMyPosts(req,res){
      try{
        var myposts=await Posts.find({user:req.user._id})
        const myDetails=await User.findById(req.user._id)
        myposts=await User.populate(myposts,{
          path:"user",
          select:"name _id email"
        })
        return res.status(201).json({
          status:true,
          isMyPosts:true,
          myposts,
          myDetails
        })
      }catch(err){
        console.log(err)
        return res.status(501).json({
          status:false,
          message:"something went wrong"
        })

      }
    },
    async getSinglyPost(req,res){
      try{
        const {postId}=req.params
        var mypost=await Posts.findOne({
          $and:[{user:req.user._id},{_id:postId}]
        })
        mypost=await User.populate(mypost,{
          path:"user",
          select:"name _id email"
        })
        return res.status(201).json({
          status:true,
          isMyPosts:true,
          mypost
        })
      }catch(err){
        console.log(`err`,err)
        return res.status(501).json({
          status:false,
          message:"something went wrong"

        })
      }
    },
    async updatePost(req,res){
      try{
        const {title,desc,category,postId,isImageChange}=req.body
        var uImageUrl=""
        if(parseInt(isImageChange)){
          uImageUrl=await uploadCloudinary(req.file.path)
        }
        var updatedPost
        if(uImageUrl!=""){
          updatedPost=await Posts.findOneAndUpdate(
            {$and:[{_id:postId},{user:req.user._id}]},
            {$set:{title,desc,category,image:uImageUrl}},
            {new:true}
          )
          updatedPost=await User.populate(updatedPost,{
            path:"user",
            select:"name _id email"
          })
          return res.status(201).json({
            status:true,
            posts:updatedPost
          })
        }else{
          updatedPost=await Posts.findOneAndUpdate(
            {$and:[{_id:postId},{user:req.user._id}]},
            {$set:{title,desc,category}},
            {new:true}
          )
          updatedPost=await User.populate(updatedPost,{
            path:"user",
            select:"name _id email"
          })
          return res.status(201).json({
            status:true,
            posts:updatedPost
          })

        }

      }catch(err){
        console.log(`err`,err)
        return res.status(501).json({
          status:false,
          message:"something went wrong"

        })

      }
    },
    async deletePost(req,res){
      try{
        const {postId}=req.body
        var myposts=await Posts.deleteOne({$and:[{user:req.user._id},{_id:postId}]})

        return res.status(201).json({
          status:true,
          isMyPosts:true,
          posts:myposts,
          message:"Posts Deleted"

        })

      }catch(err){
        console.log(`err`,err)
        return res.status(501).json({
          status:false,
          message:"something went wrong"

        })

      }

    }
  }
}
module.exports=myPostsController
