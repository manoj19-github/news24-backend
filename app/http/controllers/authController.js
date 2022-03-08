const User=require("../../models/usersModel")
const jwt=require("jsonwebtoken")
const authController=()=>{
  return{
    async signup(req,res){
      try{
        const {name,email,password}=req.body
        if(!name || !email,!password){
          return res.status(501).json({
            status:false,
            message:"something went wrong"
          })
        }
        const newUser=new User({
          name,
          email,
          password
        })
        const saveUser=await newUser.save()
        if(saveUser){
          return res.status(201).json({
            status:true,
            message:"new User created successfully"
          })
        }
        return res.status(501).json({
          status:false,
          message:"something went wrong"
        })
      }catch(err){
        console.log(err)
        return res.status(501).json({
          status:false,
          message:"something went wrong"
        })

      }
    },
    async login(req,res){
      try{
        const {email,password}=req.body
        if(!email || !password){
          return res.status(501).json({
            status:false,
            message:"please fill all the fields"
          })
        }
        const userExists=await User.findOne({email})
        if(userExists && await userExists.authenticate(password)){
          const userToken=jwt.sign({id:userExists._id},process.env.JWT_SECRET)
          return res.status(201).json({
            status:true,
            userToken,
            userData:{
              email:userExists.email,
              name:userExists.name,
              userId:userExists._id
            }
          })
        }else{
          return res.status(501).json({
            status:false,
            message:"password or email not valid"
          })
        }
      }catch(err){
        console.log(err)
        return res.status(501).json({
          status:false,
          message:"password or email not valid"
        })
      }
    }
  }
}
module.exports=authController
