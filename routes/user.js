const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const User = require('../models/User')

// @route GET api/user
// @desc Get all user
// @access Private
router.get('/', verifyToken, async (req, res) => {
	try {
		const users = await User.find()
		res.json({ success: true, users })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/posts
// @desc Create post
// @access Private
// router.post('/', verifyToken, async (req, res) => {
// 	const { name, major, studentNumber, school, gmail, phoneNumber, account } = req.body

// 	// Simple validation
// 	if ( !name || !gmail || !phoneNumber)
// 		return res
// 			.status(400)
// 			.json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' })
// 	try {
// 		const newUser = new User({
// 			name, major, studentNumber, school, gmail, phoneNumber, account
// 		})
// 		console.log(newUser)
// 		await newUser.save()

// 		res.json({ success: true, message: 'Happy learning!',newUser })
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ success: false, message: 'Internal server error' })
// 	}
// })

// @route PUT api/posts
// @desc Update post
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
	const { name, major, school, gmail, phoneNumber, account } = req.body

	// Simple validation
	if ( !name || !gmail || !phoneNumber)
		return res
			.status(400)
			.json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' })

	try {
		let updatedUser = {
			name, major, school, gmail, phoneNumber, account
		}
		console.log(updatedUser)
		const postUpdateCondition = { _id: req.params.id, user: req.userId }

		updatedUser =updatedUser.findOneAndUpdate(
			postUpdateCondition,
			updatedUser,
			{ new: true }
		)

		// User not authorised to update post or post not found
		if (!updatedUser)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({
			success: true,
			message: 'Update successful!',
			post: updatedUser
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route GET api/user
// @desc Get user
// @access Private
router.get('/:id', verifyToken, async (req, res) => {
	try {
		const users = await User.findOne({account: req.params.id})
		res.json({ success: true, users })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router