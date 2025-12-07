const express=require("express");

const colors=require("colors");

const cors=require("cors");

const cookieParser = require('cookie-parser');

const dotenv=require("dotenv");
const connectDB = require("./config/db");
const authRouter=require("./routes/authroutes")
const categoryRoutes = require("./routes/categoryRoutes");
const connectCloudinary = require("./config/cloudinary");
const menuRoutes = require("./routes/menuRoutes");




const app=express()
dotenv.config()
connectDB()

connectCloudinary()





app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors())



app.use('/api/auth',authRouter)

app.use('/api/category',categoryRoutes)

app.use('/api/menu',menuRoutes)



const port=process.env.port||8000

app.listen(port,()=>{
    console.log(`server is running on ${port}`.bgGreen)
})