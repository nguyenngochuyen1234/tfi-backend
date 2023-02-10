const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Task = require('../models/Task')
const Group = require('../models/Group')
const Account = require('../models/Account')
const GroupRecently = require('../models/GroupRecently')
const PendingMember = require('../models/PendingMember')

// @route GET api/task
// @desc Get task
// @access Private
router.get('/:idGroup', verifyToken, async (req, res) => {
	try {
		const pendingMembers = await PendingMember.findOne({ group: req.params.idGroup }).populate("member")

		console.log(pendingMembers)
		res.json({ success: true, pendingMembers })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
router.patch('/:idGroup/:idUser', verifyToken, async (req, res) => {
	try {
		const { key } = req.body
		const userId = req.params.idUser
		const groupId = req.params.idGroup
		const pendingMembers = await PendingMember.findOne({ group: groupId })
		console.log({key})
		if (key === "add") {
			const account = await Account.findById(userId)
			const group = await Group.findById(groupId)
			const newGroupRecently = new GroupRecently({
				user: userId, group: groupId
			})
			await newGroupRecently.save()
			await account.updateOne({ $push: { groupJoin: [groupId] } })
			await group.updateOne({ $push: { member: [userId] } })
		}
		const newPendingMembers = await pendingMembers.updateOne({ $pull: { member: userId } })
		res.json({ success: true, newPendingMembers })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
module.exports = router