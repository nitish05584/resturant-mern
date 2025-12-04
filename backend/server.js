const express=require("express");

const colors=require("colors");

const cors=require("cors");

const cookieParser = require('cookie-parser');

const dotenv=require("dotenv");
const connectDB = require("./config/db");
const authRouter=require("./routes/authroutes")

const app=express()
dotenv.config()
connectDB()


app.use(express.json());

app.use(cookieParser())

app.use(cors())



app.use('/api/auth',authRouter)



const port=process.env.port||8000

app.listen(port,()=>{
    console.log(`server is running on ${port}`.bgGreen)
})