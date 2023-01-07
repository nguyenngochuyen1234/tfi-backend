const express = require('express')
const Account = require('../models/Account')
const router = express.Router()

const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')

require('dotenv').config()


// @route Get api/auth
// @desc Check if user is logged in
// @access Public

router.get('/', verifyToken, async(req, res) => {
    try{
        const user = await Account.findById(req.userId).select('-password')
        if(!user) 
            return res.status(400).json({success: false, message:'Vui lòng nhập tên đăng nhập'})
        res.json({success:true, user})
    }catch(err){
        console.log(err)
        res.status(500).json({success: false, message: "Internal server error"})
    }
})
// @route Get api/auth/all-account
// @desc Check if user is logged in
// @access Public

router.get('/allAccount', verifyToken, async(req, res) => {
    try{
        const allUser = await Account.find()
        res.json({success:true, allUser})
    }catch(err){
        console.log(err)
        res.status(500).json({success: false, message: "Internal server error"})
    }
})

// @route POST api/auth/register
// @desc Register user
// @access Public

router.post('/register', async(req, res) => {
    const {username, password, rePassword} = req.body
    
    // Simple validation
    if(!username || !password){
        console.log({username, password})
        return res.status(400).json({success:false, message: 'Vui lòng nhập tên đăng nhập/mật khẩu'})
    }
    else if(password!==rePassword){
        return res.status(400).json({success:false, message: 'Mật khẩu nhập lại không trùng khớp'})
    }
    try{
        // Check for existing user
        const user = await Account.findOne({username})
        if(user)
        return res
            .status(400).json({success: false, message: 'Tên đăng nhập đã tồn tại'})
        //All good
        res.json({success: true})
        
    }catch(err){
        console.log(err)
        res.status(500).json({success: false, message: "Internal server error"})
    }
})
// @route POST api/auth/register/update
// @desc Register user, add user information
// @access Public
router.post('/register/add', async(req, res) => {
    const {username, password, name, major, studentNumber, school, gmail, phoneNumber} = req.body

    // Simple validation
	if ( !name || !major || !studentNumber || !school || !gmail || !phoneNumber)
		return res
			.status(400)
			.json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' })
	try {
        const hashedPassword = await argon2.hash(password)
        const newAccount = new Account({username, password: hashedPassword, name, major, studentNumber, school, gmail, phoneNumber})
        await newAccount.save()

        // Return token
        const accessToken = jwt.sign({userId: newAccount._id}, process.env.ACCESS_TOKEN_SECRET)
        res.json({success: true, message: "Đăng ký thành công", accessToken})
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
            .json({success: false, message: "Vui lòng nhập tên đăng nhập/mật khẩu"})
    try {
        const account = await Account.findOne({username})
        if(!account)
        return res.status(400).json({success: false, message: 'Tên đăng nhập/Mật khẩu không chính xác'})

        //Username found
        const passwordValid = await argon2.verify(account.password, password)
        if(!passwordValid)
        return res.status(400).json({success: false, message: 'Tên đăng nhập/Mật khẩu không chính xác'})
        // Return token
        const accessToken = jwt.sign({userId: account._id}, process.env.ACCESS_TOKEN_SECRET)
        res.json({success: true, message: "Đăng nhập thành công", account, accessToken})
    }catch(err){
        console.log(err)
        res.status(500).json({success: false, message: "Internal server error"})
    }
})
module.exports = router