const express=require("express")
const { registerUser, loginUser, logoutUser, adminLogin, getProfile } = require("../controller/userController")
const { protect } = require("../middleware/authMiddleware")

const router=express.Router()


 router.post("/register",registerUser)

 router.post("/login",loginUser)

 router.post("/logout",logoutUser)
 router.post("/admin/login",adminLogin)

 router.get("/profile",protect,getProfile)


module.exports=router