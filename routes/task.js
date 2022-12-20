const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Task = require('../models/Task')
const Project = require('../models/Project')


// @route GET api/task
// @desc Get task
// @access Private
router.get('/:id', verifyToken, async (req, res) => {
	try {
		const task = await Task.findById(req.params.id)
		res.json({ success: true, task })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/task
// @desc Create task
// @access Private
router.post('/', verifyToken, async (req, res) => {
	const { nameTask, descriptionTask, comment, links, dealine, member, project } = req.body
	try {
		const newTask = new Task({
			nameTask, descriptionTask, comment, links, dealine, member, project
		})

		const savedTask = await newTask.save()

		if (req.body.project) {
			const projectFind = Project.findById(project)
			await projectFind.updateOne({ $push: { tasks: [savedTask._id] } });
		}
		res.json({ success: true, message: 'Happy learning!', task: newTask})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// // // @route PUT api/task
// // // @desc Update post
// // // @access Private
// router.put('/:id', verifyToken, async (req, res) => {
// 	const { name } = req.body

// 	// Simple validation
// 	if (!name)
// 		return res
// 			.status(400)
// 			.json({ success: false, message: 'Name is required' })
//      // check existing name group
//      const group = await Group.findOne({name})
//      if(group && group.name === name)
//          return res
//              .status(400)
//              .json({ success: false, message: 'Name already taken' })

// 	try {
// 		let updatedGroup = {
// 			name
// 		}

// 		const postUpdateCondition = { _id: req.params.id, user: req.userId }

// 		updatedGroup = await Group.findOneAndUpdate(
// 			postUpdateCondition,
// 			updatedGroup,
// 			{ new: true }
// 		)

// 		// User not authorised to update post or post not found
// 		if (!updatedGroup)
// 			return res.status(401).json({
// 				success: false,
// 				message: 'Post not found or user not authorised'
// 			})

// 		res.json({
// 			success: true,
// 			message: 'Update successful!',
// 			post: updatedGroup
// 		})
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ success: false, message: 'Internal server error' })
// 	}
// })

// // @route DELETE api/group
// // @desc Delete group
// // @access Private
// router.delete('/:id', verifyToken, async (req, res) => {
// 	try {
// 		const groupDeleteCondition = { _id: req.params.id, user: req.userId }
// 		const deletedgroup = await Group.findOneAndDelete(groupDeleteCondition)

// 		// User not authorised or group not found
// 		if (!deletedgroup)
// 			return res.status(401).json({
// 				success: false,
// 				message: 'group not found or user not authorised'
// 			})

// 		res.json({ success: true, group: deletedgroup })
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).json({ success: false, message: 'Internal server error' })
// 	}
// })

module.exports = router