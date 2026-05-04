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

const cartRoutes=require("./routes/cartRoutes");


const orderRoutes=require("./routes/orderRoutes");

const bookingRoutes=require("./routes/bookingRoutes");
const path = require('path');




const app=express()
dotenv.config()
connectDB()

connectCloudinary()





app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials:true,
}))



app.use('/api/auth',authRouter)

app.use('/api/category',categoryRoutes)

app.use('/api/menu',menuRoutes)

app.use('/api/cart',cartRoutes)

app.use('/api/order',orderRoutes)

app.use('/api/booking',bookingRoutes)



const port = process.env.PORT || process.env.port || 8000

app.listen(port,()=>{
    console.log(`server is running on ${port}`.bgGreen)
})