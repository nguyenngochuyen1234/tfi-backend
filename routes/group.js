const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const Group = require('../models/Group')
const Account = require('../models/Account')

// @route GET api/group
// @desc Get group
// @access Private
// router.get('/groupMade/:id', verifyToken, async (req, res) => {
// 	try {
// 		const group = await Group.findById(req.params.id).populate("member")
// 		console.log(group)
// 		res.json({ success: true, group })
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ success: false, message: 'Internal server error' })
// 	}
// })
// @route GET api/group
// @desc Get only group
// @access Private
router.get('/find/:idGroup', verifyToken, async (req, res) => {
	try {
		const group = await Group.findOne({ _id: req.params.idGroup })
		res.json({ success: true, group })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
router.get('/allGroupUser', verifyToken, async (req, res) => {
	try {
		const user = await Account
			.findById(req.userId)
			.populate("groupJoin")
			.populate("groupMade")
		res.json({ success: true, groupMade: user.groupMade, groupJoined: user.groupJoin })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async (req, res) => {
	const { name, description, member } = req.body

	// Simple validation
	if (!name)
		return res
			.json({ success: false, message: 'Name is required' })
	// check existing name group
	const group = await Group.findOne({ name })
	if (group && group.name === name)
		return res
			.json({ success: false, message: 'Name already taken' })
	try {
		const newGroup = new Group({
			name, description, leader: req.userId, member: [...member, req.userId]
		})
		//------------------------------------
		const savedGroup = await newGroup.save()
		if (req.userId) {
			const Leader = await Account.findById(req.userId)
			await Leader.updateOne({ $push: { groupMade: [savedGroup._id] } });
		}
		for (let i = 0; i < member.length; i++) {
			let user = await Account.findById(member[i])
			await user.updateOne({ $push: { groupJoin: [savedGroup._id] } });
		}
		res.json({ success: true, message: 'create done', group: newGroup })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// // @route PUT api/posts
// // @desc Update post
// // @access Private
router.patch('/:id', verifyToken, async (req, res) => {

	const member = req.body.member

	try {
		let dataGroup = req.body
		if (member.length > 0) {
			for (let i = 0; i < member.length; i++) {
				if (member[i] !== req.userId) {
					let user = await Account.findById(member[i])
					await user.updateOne({ $push: { groupJoin: [req.params.id] } });
				}
			}
		}

		const updatedGroup = await Group.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: dataGroup },
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
		const idGroup = req.params.id
		const groupDeleteCondition = { _id: idGroup, user: req.userId }
		const account = await Account.updateMany({
			$or: [
				{ groupMade: { $in: idGroup } },
				{ groupJoin: { $in: idGroup } }
			]
		},
			{ $pull: { groupMade: idGroup, groupJoin: idGroup } },
		);

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