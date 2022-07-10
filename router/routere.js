const router = require('express').Router()
const { PrismaClient } = require('@prisma/client')
const cloudinary = require('../modules/cloudaniry')
const prisma = new PrismaClient()
const { createToken, virifyToken } = require("../modules/jsontoken")
const uplode = require('../modules/multar')




router.get('/', (req, res) => {
    res.redirect("/Showall")
})

// register
router.get("/register",(req,res)=>{
    res.render("register")
})


router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body
    const user = await prisma.customers.findUnique({
        where: { email }
    })
    if (user == null) {
        const sent = await prisma.customers.create({
            data: { name, email, password, role }
        })
        return res.redirect("./Showall")
    }
    res.send('User already exists')
})

// login
router.get("/login",(req,res)=>{
    res.render("login")
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.customers.findMany({
        where: { email, password }
    })
    if (user.length == 1) {
        let token = createToken(user[0])
        res.cookie("Cookie", token)
        return res.redirect("/shipment")
    }
    res.render("register")

})

// Extradetails
router.get("/shipment",(req,res)=>{
  if(req.header.cookie){
    res.render("Extradetails")
    return
  }
  res.render("login")
})

router.post('/shipment', virifyToken, async (req, res) => {
    const { address, country, state, city, pincode } = req.body
    const { id, email } = req.userData
    try {
        const details = await prisma.customers.findMany({ where: { email }, include: { Extradetails: true } })
        if (details[0].Extradetails.length == 0) {
            const fill = await prisma.extradetails.create({
                data: { customerId: id, address, country, state, city, pincode }
            })
            res.render("peyment")
            return
        }
        res.render("peyment")
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// shw all product
router.get('/Showall', async (req, res) => {
    let data = await prisma.products.findMany()
    // res.send(data)
    let count = 0
    let arrey = []
    let arr1 = []
    data.forEach((arr) => {
        arrey.push(arr)
        count++
        if (count == 4) {
            arr1.push(arrey)
            count = 0
            arrey = []
        }
    })
    res.render("index", { articles: arr1 })
})

// add product
router.get('/warehouse', (req, res) => {
    res.render("warehouse")
})
router.post('/warehouse', virifyToken, uplode.single("image"), async (req, res) => {
    const { id, role } = req.userData
    const { name, title, discription, Quntity, price } = req.body
    if (role == 'ADMIN') {
        let img = await cloudinary.uploader.upload(req.file.path)
        let image = img.secure_url
        const data = await prisma.products.createMany({
            data: { customersId: id, name, title, discription, Quntity, price, image }
        })
        return res.render("alart")
    }
    res.render("warehouse")
})

// peyment Info
router.post("/peyment",virifyToken, async (req, res) => {
    const { method, detail, name } = req.body
    const { id } = req.userData
    const data = await prisma.peyment.createMany({
        data: { userId: id, method, detail, name }
    })
    res.redirect("/Showall")
})

router.get("*",(req,res)=>{
  res.redirect("/Showall")
})

module.exports = router
