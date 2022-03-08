const Posts=require("../../models/postsModel")
const User=require("../../models/usersModel")
const uploadCloudinary=require("../../utils/uploadCloudinary")
const postController=()=>{
  return{
    async getAllPost(req,res){
      try{
        const skipData=+req.headers?.nextpagetoken ||0
        const nextPageToken=parseInt(skipData)+10
        const query = {}
        const projection = {}
        const options = { sort: { updatedAt: -1 }, limit: 10, skip: skipData }
        var allPosts=await Posts.find(query,projection,options)
        allPosts=await User.populate(allPosts,{
          path:"user",
          select:"name _id email"
        })
        if(!allPosts.length){
          return res.status(201).json({
            status:true,
            nextPageToken,
            completed:true
          })
        }
        return res.status(201).json({
          status:true,
          allPosts,
          completed:false,
          nextPageToken,
        })
      }catch(err){
        console.log(err)
        return res.status(501).
          json({status:false,
          message:"something went wrong"})
      }

    },
    async getSinglyPost(req,res){
      try{
        const {postId}=req.params
        const relatedPostLimit=req.headers?.relatedPostLimit ||10
        var currPost=await Posts.findById(postId)
        if(!currPost) return res.status(501).json({
          status:false,
          message:"post not found"
        })
        currPost=await User.populate(currPost,{
          path:"user",
          select:"name _id email"
        })
        var relatedCategoryPost=await Posts.find({
          $and:[{_id:{$ne:currPost._id}},{category:currPost.category}]
        }).limit(relatedPostLimit)
        relatedCategoryPost=await User.populate(relatedCategoryPost,{
          path:"user",
          select:"name _id email"
        })
        return res.status(201).json({
          status:true,
          currPost,
          relatedCategoryPost
        })
      }catch(err){
        console.log(err)
        return res.status(501).json({
          status:false,
          message:"something went wrong"
        })
      }

    },
    async createPost(req,res){
      try{
        const {title,desc,category}=req.body
        if(req.file==="undefined" || (!title || !desc|| !category)){
          return res.status(501).json({
            status:false,
            message:"please fill all the field correctly"
          })
        }
        const imageUrl=await uploadCloudinary(req.file.path)
        const newPost=new Posts({
          title,
          desc,
          category,
          image:imageUrl,
          user:req.user._id
        })
        var savedPost=await newPost.save()
        savedPost=await User.populate(savedPost,{
          path:"user",
          select:"_id name email"
        })
        return res.status(201).json({
          status:true,
          posts:savedPost
        })

      }catch(err){
        console.log(err)
        return res.status(501).json({status:false})
      }

    }
  }

}

module.exports=postController
