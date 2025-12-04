const express=require("express")
const { registerUser, loginUser, logoutUser, adminLogin } = require("../controller/userController")

const router=express.Router()


 router.post("/register",registerUser)

 router.post("/login",loginUser)

 router.post("/logout",logoutUser)
 router.post("/admin/login",adminLogin)


module.exports=router