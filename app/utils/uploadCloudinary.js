const  cloudinary =require("cloudinary").v2
const uploadCloudinary=async(filePath)=>{
  var uploadedFile
  try{
    uploadedFile=await cloudinary
    .uploader.upload(filePath,{
      folder:"pizzahut2",
      resource_type:"auto"
    })
    const {secure_url}=uploadedFile
    return secure_url

  }catch(err){
    console.log(`cloudinary uploading error in uploadcloudinary`,err)
    return null
  }
}
module.exports=uploadCloudinary
