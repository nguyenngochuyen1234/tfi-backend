const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Task = require('../models/Task')
const Group = require('../models/Group')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const React = require('../models/React')
// @route GET api/post
// @desc Get all post/group
// @access Private
router.get('/:idGroup', verifyToken, async (req, res) => {
	try {
		const posts = await Post.aggregate([
			{
				$match: { group: req.params.idGroup }
			},
			{
				$lookup: {
					from: "accounts",
					localField: "user",
					foreignField: "_id",
					as: "userData"
				},
			}
		], function (err, results) {
			if (err) throw err;
			Post.populate(results, { "path": "comments reacts" }, function (err, results) {
				if (err) throw err;
				console.log(results)
				res.json({ success: true, posts: results })
			});
		})
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
			about, group: idGroup, user: req.userId
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

router.delete('/:idPost', verifyToken, async (req, res) => {
	try {
		const idPost = req.params.idPost
		await Comment.deleteMany({post:idPost})
		await React.deleteMany({post:idPost})
		const deletedPost = await Post.findByIdAndDelete(idPost);


		res.json({ success: true, task: deletedPost })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router