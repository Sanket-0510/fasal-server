const express = require('express');
const { checkUser }= require('../utlis/checkUser');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { credentials } = require('../contoller/type');
const router = express.Router();

// signUp 
router.post('/signUp', async (req, res) => {
    let { success } = credentials.safeParse(req.body); 
    // check for valid body
    if (!success) {
        let response =  {
            details: 'Invalid Email/password, password must be at least 6 characters',
        }
        return res.json(response);
    }

    try {
        let { email, password } = req.body;
        let user = await checkUser(email);
        if (user) {
            return res.json({details: "User Already Exists"});
        }

        let salt = await bcrypt.genSalt(10);
        let hashedPass = await bcrypt.hash(password, salt);

        let createdUser = await User.create({
            email,
            password: hashedPass
        })

        if (createdUser) {
            let userId = createdUser._id.toString();
            let token = jwt.sign({
                userId: userId,
                email: email
            }, process.env.SECRET_KEY);

            res.json({
                message: "success",
                token: token
            });
        } else {
            console.log(createdUser);
            res.json({details:"failed to create user"});
        }
    } catch (err) {
        console.log(err);
        res.json({details: "Api Call Failed"});
    }
})

// signIn
router.post('/signIn', async (req, res) => {
    try {
        let { success } = credentials.safeParse(req.body);
        if (!success) {
            res.json({details: "Invalid Credentials"});
            return;
        }

        let { email, password } = req.body;
        let userExists = await checkUser(email);
        if (!userExists) {
            res.json({details: "User does not exist"});
            return;
        }

        const checkPassword = await bcrypt.compare(req.body.password, userExists.password);
        if (checkPassword) {
            let token = jwt.sign({
                userId: userExists._id,
                email: req.body.email
            }, process.env.SECRET_KEY);
            return res.json({
                message: "success",
                token: token
            })
        } else {
            return res.json({
                details: "Password is incorrect"
            })
        }        

    } catch (err) {
        console.log(err);
        res.json({details: "Api Call Failed"}); 
    }
});

module.exports = router;