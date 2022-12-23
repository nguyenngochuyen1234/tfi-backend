const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Group = require('../models/Group')
// const User = require('../models/User')
const Account = require('../models/Account')

// @route GET api/group
// @desc Get group
// @access Private
router.get('/', verifyToken, async (req, res) => {
	try {
		const groups = await Group.find({ user: req.userId }).populate('leader', [
			'username'
		])
		res.json({ success: true, groups })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async (req, res) => {
	const { name, leader, member } = req.body

	

	// Simple validation
	if (!name)
		return res
			.status(400)
			.json({ success: false, message: 'Name is required' })
     // check existing name group
    const group = await Group.findOne({name})
    if(group && group.name === name)
        return res
            .status(400)
            .json({ success: false, message: 'Name already taken' })
	try {
		let accounts = []
		for(let i=0;i<member.length;i++){
			let usernameAccount = member[i]
			console.log(usernameAccount)
			let mem = await Account.findOne({username: usernameAccount})
			accounts.push(mem)
		}
		console.log(accounts)
		const memberId = accounts.map(member=>member._id)
		console.log(memberId)
		const newGroup = new Group({
			name,leader,member:memberId
		})
//------------------------------------
		const savedGroup = await newGroup.save()
		for(let i=0;i<memberId.length;i++){
			let user = await Account.findById(memberId[i])
			await user.updateOne({ $push: { groupJoin: [savedGroup._id] } })
		}
		if (req.body.leader) {
			const Leader = User.find({account: req.body.leader});
			await Leader.updateOne({ $push: { groupMade: [savedGroup._id] } });
		}
		res.json({ success: true, message: 'Happy learning!', group: newGroup})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// // @route PUT api/posts
// // @desc Update post
// // @access Private
router.put('/:id', verifyToken, async (req, res) => {
	const { name } = req.body

	// Simple validation
	if (!name)
		return res
			.status(400)
			.json({ success: false, message: 'Name is required' })
     // check existing name group
     const group = await Group.findOne({name})
     if(group && group.name === name)
         return res
             .status(400)
             .json({ success: false, message: 'Name already taken' })

	try {
		let updatedGroup = {
			name
		}

		const postUpdateCondition = { _id: req.params.id, user: req.userId }

		updatedGroup = await Group.findOneAndUpdate(
			postUpdateCondition,
			updatedGroup,
			{ new: true }
		)

		// User not authorised to update post or post not found
		if (!updatedGroup)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({
			success: true,
			message: 'Update successful!',
			post: updatedGroup
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route DELETE api/group
// @desc Delete group
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
	try {
		const groupDeleteCondition = { _id: req.params.id, user: req.userId }
		const deletedgroup = await Group.findOneAndDelete(groupDeleteCondition)

		// User not authorised or group not found
		if (!deletedgroup)
			return res.status(401).json({
				success: false,
				message: 'group not found or user not authorised'
			})

		res.json({ success: true, group: deletedgroup })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router