const Posts=require("../../models/postsModel")
const User=require("../../models/usersModel")
const categoryController=()=>{
  return{
    async getMyData(req,res){
      try{
        const {category,author}=req.params
        let isAuthor,isCategory
        if(author){
          isAuthor=true
          isCategory=false
        }else{
          isAuthor=false
          isCategory=true
        }
        var allPosts,authorData
        const pageToken=+req.headers.nextpagetoken||0
        const nextPageToken=parseInt(pageToken)+10
        if(!author){
          allPosts=await Posts.find({category}).skip(pageToken).limit(10)
        }else{
          allPosts=await Posts.find({user:author}).skip(pageToken).limit(10)
          authorData=await User.findById(author)
        }

        if(!allPosts.length){
          return res.status(201).json({
            status:false,
            message:"its completed",
            completed:true
          })
        }

        allPosts=await User.populate(allPosts,{
          path:"user",
          select:"name _id email"
        })
        return res.status(201).json({
          status:true,
          allPosts,
          authorPosts:isAuthor,
          categoryPosts:isCategory,
          nextPageToken,
          authorName:authorData?.name ?authorData.name :null
        })
      }catch(err){
        console.log(err)
        return res.status(501).json({
          status:false,
          message:"something went wrong"
        })
      }
    }
  }
}
module.exports=categoryController
