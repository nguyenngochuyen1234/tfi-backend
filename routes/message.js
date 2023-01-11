const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Message = require('../models/Message')
const Conversation = require('../models/Conversations')

// create new message


router.post("/",verifyToken, async (req, res) => {

	const {conversationId, text} = req.body
	const newMessage = new Message({conversationId, text, sender:req.userId});

	try {
		const savedMessage = await newMessage.save();
		res.status(200).json(savedMessage);
	} catch (err) {
		res.status(500).json({ success: false, message: 'Internal server error' })

	}
});

//get

router.get("/find/:friendId",verifyToken, async (req, res) => {
	try {
		console.log([req.params.friendId, req.userId])
		const conversation = await Conversation.findOne({
			members: { $all: [req.params.friendId, req.userId] },
		});
		const messages = await Message.find({
			conversationId: conversation._id,
		});
		res.status(200).json({ success: true, messages, conversationId: conversation._id });
	} catch (err) {
		res.status(500).json({ success: false, message: 'Internal server error' })

	}

});


module.exports = router