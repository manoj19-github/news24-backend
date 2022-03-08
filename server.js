require("dotenv").config()
const express=require("express")
const PORT=process.env.PORT || 4000
const helmet=require("helmet")
const morgan=require("morgan")
const cors=require("cors")
const bodyParser=require("body-parser")
const cloudinaryConfig=require("./app/config/cloudinary-config")
const connDb=require("./app/config/db-connect")
const app=express()

// routers
const authRoutes=require("./routes/authRoutes")
const postsRoutes=require("./routes/postsRoutes")
const categoryRoutes=require("./routes/categoryRoutes")
const mypostsRoutes=require("./routes/mypostsRoutes")
app.use(
  cors({
    origin:process.env.CLIENT_SERVER_URL,
    methods:"GET,POST,PUT,DELETE",
    credentials:true
  }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan("dev"))
app.use(helmet())
app.listen(PORT,async()=>{
  await connDb()
  await cloudinaryConfig()
  console.log(`server is running on ${PORT}`)
})
app.use("/api",authRoutes)
app.use("/api",postsRoutes)
app.use("/api",categoryRoutes)
app.use("/api",mypostsRoutes)
