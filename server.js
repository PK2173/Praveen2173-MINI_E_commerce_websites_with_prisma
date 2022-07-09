const express =require("express")
const path = require("path")
const ejs = require("ejs")
const app = express()
require("dotenv").config()


app.use(express.json())
const csspath = path.join(__dirname,"./templete/public")
const templetepathh = path.join(__dirname,"./templete/views")
app.use(express.static(csspath))
app.set("view engine", "ejs")
app.set("views",templetepathh)
app.use(express.urlencoded({extended:true}))
app.use("/",require("./router/routere"))

app.listen(5050,()=>{
    console.log("connected server 5050");
})