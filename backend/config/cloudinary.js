const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  
  } catch (error) {
    console.error("Cloudinary configuration error:", error);
  }
};

module.exports =  connectCloudinary 
