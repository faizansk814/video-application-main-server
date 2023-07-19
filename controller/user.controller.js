const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const UserModel = require("../models/user.model")

async function Register(req,res)  {
    const { name, email, password } = req.body

    try {
        isUserPresent = await UserModel.findOne({ email })
        if (isUserPresent) {
            return res.send({ "msg": "Login Directly" })
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new UserModel({ name, email, password: hash })
            await user.save()
            res.status(201).send({ "msg": "Registration Succesfull" })
        });
    } catch (error) {
        res.status(401).send({ "msg": "Some error occourd while  Registration" })

    }

}

async function Login(req,res)  {
    const { email, password } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let accesstoken = jwt.sign({ "userID": user._id }, 'accesstoken', { expiresIn: "7d" });


                    res.status(201).send({ "msg": "login success", "token": accesstoken, "user":user })

                } else {
                    res.status(401).send({ "msg": "wrong input,login failed ,User already exist, please login" })
                }
            });
        } else {
            res.status(401).send({ "msg": "login failed,user is not present" })

        }
    } catch (error) {
        res.status(401).send({ "msg": "error occourd while login " })

    }
}

async function Logout(req,res)  {
    try {
        const foundToken = req.headers?.authorization
        const newBlackList = new BlackModel({ token: foundToken })
        await newBlackList.save()
        res.status(201).send({ "msg": "Logout SuccesFully" })
    } catch (error) {
        res.status(401).send({ "msg": error.message })
    }
}

module.exports={Register,Login,Logout}