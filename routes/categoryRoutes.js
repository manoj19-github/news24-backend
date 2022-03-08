const Router=require("express").Router()
const categoryController=require("../app/http/controllers/categoryController")
// Router.post("/signup",authController().signup)
// Router.post("/login",authController().login)
Router.get("/posts/category/:category/:author?",categoryController().getMyData)

module.exports=Router
