const cloudinary = require("cloudinary").v2;

const cloud = cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "freelince",
    api_key: process.env.CLOUDINERY_API_KEY || 887248159336691,
    api_secret: process.env.CLOUDINERY_SECREAT_KEY || "heDLkbT4G5BJtqhQD2OzomvEJRQ",
    secure: true
})


module.exports = cloudinary;