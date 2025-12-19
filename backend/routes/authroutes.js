const express=require("express")
const { registerUser, loginUser, logoutUser, adminLogin, getProfile, isAuth } = require("../controller/userController")
const { protect } = require("../middleware/authMiddleware")

const router=express.Router()


 router.post("/register",registerUser)

 router.post("/login",loginUser)

 router.post("/logout",logoutUser)
 router.post("/admin/login",adminLogin)

 router.get("/profile",protect,getProfile)
 
router.get("/is-auth",protect,isAuth)


module.exports=router