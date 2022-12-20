const express = require('express')
const Account = require('../models/Account')
const User = require('../models/User')
const router = express.Router()

const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

require('dotenv').config()

router.get('/', (req, res) => {
    res.send('USER ROUTER')
})

// @route POST api/auth/register
// @desc Register user
// @access Public

router.post('/register', async(req, res) => {
    const {username, password} = req.body

    // Simple validation
    if(!username || !password)
        return res.status(400).json({success:false, message: 'Missing username and/or password'})
    try{
        // Check for existing user
        const user = await Account.findOne({username})
        if(user)
        return res
            .status(400).json({success: false, message: 'Username already taken'})
        //All good
        const hashedPassword = await argon2.hash(password)
        const newAccount = new Account({username, password: hashedPassword})
        await newAccount.save()

        // Return token
        const accessToken = jwt.sign({userId: newAccount._id}, process.env.ACCESS_TOKEN_SECRET)
        res.json({success: true, message: "user created sucessfully", accessToken})
    }catch(err){
        console.log(err)
        res.status(500).json({success: false, message: "Internal server error"})
    }
})

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', async(req,res)=>{
    const {username, password} = req.body

    //simple validations
    if(!username|| !password)
    return res  
            .status(400)
            .json({success: false, message: "Mising username and/or password"})
    try {
        const account = await Account.findOne({username})
        if(!account)
        return res.status(400).json({success: false, message: 'Incorrect username or password'})

        //Username found
        const passwordValid = await argon2.verify(account.password, password)
        if(!passwordValid)
        return res.status(400).json({success: false, message: 'Incorrect username or password'})
        // Return token
        const accessToken = jwt.sign({userId: account._id}, process.env.ACCESS_TOKEN_SECRET)
        res.json({success: true, message: "Loged in successfully", account, accessToken})
    }catch(err){
        console.log(err)
        res.status(500).json({success: false, message: "Internal server error"})
    }
})
module.exports = router