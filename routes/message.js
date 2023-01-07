const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Message = require('../models/Message')

router.post('/', verifyToken, async (req, res) => {
	const { conversationId,sender,text } = req.body
	try {
		const newMessage = new Message({
			conversationId,sender,text 
		})

		const savedMessage = await newMessage.save()

		res.json({ success: true, message: 'Tin nhắn được gửi thành công', message: savedMessage})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

module.exports = router