const express=require("express")
const { adminOnly } = require("../middleware/authMiddleware")

const { addCategory, getAllCategories, updateCategory, deleteCategory } = require("../controller/categoryController")
const upload = require("../middleware/multer")

const router=express.Router()

router.post("/add",adminOnly,upload.single("image"),addCategory)

router.put("/update/:id",adminOnly,upload.single("image"),updateCategory)

router.delete("/delete/:id",adminOnly,deleteCategory)

router.get("/all",getAllCategories)




module.exports=router