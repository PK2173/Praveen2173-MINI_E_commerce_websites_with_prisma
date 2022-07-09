const jwt = require("jsonwebtoken")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createToken = ({ id }) => {
    return jwt.sign(id, "kjhgfdsfyuilkjhgfuiusuysryyfds")
}

const virifyToken = async (req, res, next) => {
    if (req.headers.cookie) {
        let token = req.headers.cookie.split("=")[1]
        let id1 = jwt.verify(token, "kjhgfdsfyuilkjhgfuiusuysryyfds")
        let id = Number(id1)
        let data = await prisma.customers.findMany({ where:{id}})
        req.userData = data[0]
        return next()
    }
    res.redirect("/login")
}

module.exports = { createToken, virifyToken }