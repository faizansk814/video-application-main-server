const express = require('express');
const { Register, Login, Logout } = require("../controller/user.controller")

const userRouter = express.Router()

userRouter.post("/register", Register)


userRouter.post("/login", Login)

userRouter.post("/logout", Logout)


module.exports = userRouter