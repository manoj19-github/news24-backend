const multer=require("multer")
const storage=multer.diskStorage({})
const uploads=multer({storage})
const Router=require("express").Router()
const myPostsController=require("../app/http/controllers/myPostsController")
const requireSignin=require("../app/http/middleware/requireSignin")
Router.get("/posts/myposts",requireSignin,myPostsController().getMyPosts)
Router.get("/posts/myposts/:postId",requireSignin,myPostsController().getSinglyPost)
Router.post("/posts/myposts/updatePost",requireSignin,uploads.single("image"),myPostsController().updatePost)
Router.post("/posts/myposts/delposts",requireSignin,myPostsController().deletePost)


module.exports=Router
