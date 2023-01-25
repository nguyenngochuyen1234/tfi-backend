const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Task = require('../models/Task')
const Group = require('../models/Group')
const Post = require('../models/Post')
const Account = require('../models/Account')

// @route GET api/post
// @desc Get all post/group
// @access Private
router.get('/:idGroup', verifyToken, async (req, res) => {
	try {
		const posts = await Post.aggregate([
			{
				$match:{group:req.params.idGroup}
			},
			{
				$lookup: {
					from: "accounts",
					localField: "user",
					foreignField: "_id",
					as: "userData"
				},
			}
		])
		res.json({ success: true, posts })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
// @route GET api/task
// @desc Get only task
// @access Private
// router.get('/find/:idTask', verifyToken, async (req, res) => {
// 	try {
// 		const task = await Task.findById(req.params.idTask)
// 		res.json({ success: true, task })
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ success: false, message: 'Internal server error' })
// 	}
// })

// @route POST api/post
// @desc Create post
router.post('/:idGroup', verifyToken, async (req, res) => {
	const idGroup = req.params.idGroup
	const { about } = req.body
	console.log(req.body)
	try {
		const newPost = new Post({
			about, group: idGroup, user:req.userId
		})

		const savedPost = await newPost.save()

		res.json({ success: true, task: savedPost })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/task
// @desc update task

// router.put('/:idTask', verifyToken, async (req, res) => {
// 	try {
// 		const task = await Task.findById(req.params.idTask);
// 		await task.updateOne({ $set: req.body });
// 		if (!task)
// 			return res.status(401).json({
// 				success: false,
// 				message: 'Task not found'
// 			})

// 		res.json({
// 			success: true,
// 			message: 'Update successful!',
// 			task
// 		})
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ success: false, message: 'Internal server error' })
// 	}
// })

// router.delete('/:idTask', verifyToken, async (req, res) => {
// 	try {
// 		await Group.updateMany(
// 			{ tasks: req.params.idTask },
// 			{ $pull: { tasks: req.params.idTask } }
// 		);
// 		const deletedTask = await Task.findByIdAndDelete(req.params.idTask);


// 		res.json({ success: true, task: deletedTask })
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ success: false, message: 'Internal server error' })
// 	}
// })


module.exports = router