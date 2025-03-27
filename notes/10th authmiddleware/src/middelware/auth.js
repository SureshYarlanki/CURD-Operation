const jwt=require("jsonwebtoken")
const User=require("../modules/user")


const userAuth=async(req, res, next) => {
    try {
        //read the token from the req cookies
    const {token}=req.cookies;
    if(!token){
        throw new Error("Token not valid!!!")
    }
    //validate the token
    const decodedObj=await jwt.verify(token, "Suresh@123")
    const {_id}=decodedObj;
    const user=await User.findOne({_id: _id})
    if(!user){
throw new Error("User not found")
    }
    next()
    //find the user
    }catch (error) {
        console.error("Profile Fetch Error:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
      }
}
module.exports = {userAuth}