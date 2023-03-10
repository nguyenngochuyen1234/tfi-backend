const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Task = require('../models/Task')
const Group = require('../models/Group')

// @route GET api/task
// @desc Get task
// @access Private
router.get('/:idGroup', verifyToken, async (req, res) => {
	try {
		const tasks = await Task.find({ group: req.params.idGroup }).populate("exercise")
		res.json({ success: true, tasks })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
// @route GET api/task
// @desc Get task
// @access Private
router.get('/findAllTask/allTaskOfUser', verifyToken, async (req, res) => {
	try {
		console.log("run")
		const tasks = await Task.find({ member: { $in: [req.userId] } }).populate("group exercise")
		res.json({ success: true, tasks })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
// @route GET api/task
// @desc Get only task
// @access Private
router.get('/find/:idTask', verifyToken, async (req, res) => {
	try {
		const task = await Task.findById(req.params.idTask).populate("exercise")
		res.json({ success: true, task })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
// @route GET api/task
// @desc Get task
// @access Private
router.post('/timeline/:idGroup', verifyToken, async (req, res) => {
	const { firstDayString, lastDayString } = req.body

	try {
		const tasks = await Task.find({
			group: req.params.idGroup,
			$and: [
				{ dayStart: { $lt: (lastDayString) } },
				{ deadline: { $gt: (firstDayString) } }
			]
		})
		console.log(tasks)
		res.json({ success: true, tasks })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route POST api/task
// @desc Create task
// @access Private
router.post('/:idGroup', verifyToken, async (req, res) => {
	const idGroup = req.params.idGroup
	const { name, description, comment, links, deadline, member } = req.body
	try {
		const newTask = new Task({
			name, description, comment, links, deadline, member, group: idGroup
		})

		const savedTask = await newTask.save()

		if (idGroup) {
			const groupFind = Group.findById(idGroup)
			await groupFind.updateOne({ $push: { tasks: [savedTask._id] } });
		}
		res.json({ success: true, task: newTask })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

// @route Put api/task
// @desc update task

router.put('/:idTask', verifyToken, async (req, res) => {
	try {
		const task = await Task.findById(req.params.idTask);
		await task.updateOne({ $set: req.body });
		if (!task)
			return res.status(401).json({
				success: false,
				message: 'Task not found'
			})

		res.json({
			success: true,
			message: 'Update successful!',
			task
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
router.patch('/:id', verifyToken, async (req, res) => {
	const dataTask = req.body
	console.log(dataTask)
	try {
		const updateTask = await Task.findOneAndUpdate(
			{ _id: req.params.id },
			{ $set: dataTask },
			{ new: true }
		)
		// User not authorised to update post or post not found
		if (!updateTask)
			return res.status(401).json({
				success: false,
				message: 'Post not found or user not authorised'
			})

		res.json({
			success: true,
			post: updateTask
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
router.delete('/:idTask', verifyToken, async (req, res) => {
	try {
		await Group.updateMany(
			{ tasks: req.params.idTask },
			{ $pull: { tasks: req.params.idTask } }
		);
		const deletedTask = await Task.findByIdAndDelete(req.params.idTask);


		res.json({ success: true, task: deletedTask })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router