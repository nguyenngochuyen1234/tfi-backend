const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Exercise = require('../models/Exercise')
const Account = require('../models/Account')
// create new message


router.post("/:idTask", verifyToken, async (req, res) => {

	try {
		const { data, type, title } = req.body
		const user = await Account.findOne({ _id: req.userId })
		const newExercise = new Exercise({
			name: user.name,
			idUser: req.userId,
			avatar: user.avatar,
			task: req.params.idTask,
			data,
			type,
			title
		});
		const savedExercise = await newExercise.save();

		res.status(200).json({ success: true, savedExercise });
	} catch (err) {
		res.status(500).json({ success: false, message: 'Internal server error' })

	}
});




module.exports = router