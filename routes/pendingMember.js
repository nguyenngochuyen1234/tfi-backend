const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Task = require('../models/Task')
const Group = require('../models/Group')
const PendingMember = require('../models/PendingMember')

// @route GET api/task
// @desc Get task
// @access Private
router.get('/:idGroup', verifyToken, async (req, res) => {
	try {
		const pendingMembers = await PendingMember.findOne({ group: req.params.idGroup }).populate("account")
		res.json({ success: true, pendingMembers })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
module.exports = router