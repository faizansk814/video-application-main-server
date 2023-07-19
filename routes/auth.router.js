const express = require('express');
const passport = require("../connection/google");
const UserModel = require('../models/user.model');
const authrouter = express.Router()
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

authrouter.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

authrouter.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    async function (req, res) {
        // Successful authentication, redirect home.
        console.log(req.user)
        const fetch_user = await UserModel.findOne({ email: req.user.email });
        if (fetch_user) {
            token_Genretor(res, fetch_user.name, fetch_user._id,fetch_user.image);
        } else {
            bcrypt.hash("password", 2, async (err, hash) => {
                const newUser = new UserModel({ name: req.user.displayName, email: req.user._json.email,image:req.user._json.picture, password: hash })
                console.log(req.user.displayName)
                await newUser.save()
                // res.status(200).send({ msg: "Registration successful", newUser })
                token_Genretor(res, req.user.displayName, "login with google",req.user._json.picture);

            });
        }
    })

function token_Genretor(res, name, id,image) {
    let token = jwt.sign(
        { user: name, id: id },
        "marvel",
        { expiresIn: "6s" }
    );
    res.redirect(`http://127.0.0.1:5500/frontend/index.html?token=${token}&image=${image}&name=${name}`);
    // res.status(202).json({ refreshToken });
}


module.exports = authrouter