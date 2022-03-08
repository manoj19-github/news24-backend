const User=require("../../models/usersModel")
const jwt=require("jsonwebtoken")
const requireSignIn=async(req,res,next)=>{
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try{
      const userToken=req.headers.authorization.split(" ")[1]
      if(userToken){
        const decoded=jwt.verify(userToken,process.env.JWT_SECRET)
        req.user=await User.findById(decoded.id).select("-password")
        next()

      }else{
        return res.status(403).json({
            status:false,
            message:`please login first then try`
        })

      }
    }catch(err){
      console.log(`signin jsonwebtoken error :${err}`.red.bold)
      return res.status(403).json({
          status:false,
          message:`verification error ${err}`
      })
    }
  }else{
    return res.status(403).json({
        status:false,
        message:`authorization required`
    })
  }
}

module.exports=requireSignIn
