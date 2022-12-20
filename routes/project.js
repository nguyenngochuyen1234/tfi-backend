const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Project = require('../models/Project')
const Group = require('../models/Group')


// @route GET api/project
// @desc Get project
// @access Private
router.get('/:id', verifyToken, async (req, res) => {
	try {
		const project = await Project.findById(req.params.id)
		res.json({ success: true, project })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/project
// @desc Create project
// @access Private
router.post('/', verifyToken, async (req, res) => {
	const { nameProject, descriptionProject, schedule, dealine, group } = req.body
	try {
		const newProject = new Project({
			nameProject, descriptionProject, schedule, dealine, group
		})

		const savedProject = await newProject.save()
		if (req.body.group) {
			const groupFind = Group.findById(group)
			await groupFind.updateOne({ $push: { projects: [savedProject._id] } });
		}
		res.json({ success: true, message: 'Happy learning!', project: newProject})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// // // @route PUT api/project
// // // @desc Update project
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