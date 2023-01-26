const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const React = require('../models/React')
const Account = require('../models/Account')
const Post = require('../models/Post')
// create new message


router.post("/:idPost", verifyToken, async (req, res) => {

	try {

		const user = await Account.findOne({ _id: req.userId })
		const newReact = new React({
			username: user.name,
			idUser: req.userId,
			post: req.params.idPost
		});
		const savedReact = await newReact.save();

		const post = await Post.findById(req.params.idPost)
		await post.updateOne({ $push: { reacts: [savedReact._id] } });

		res.status(200).json({ success: true, savedReact });
	} catch (err) {
		res.status(500).json({ success: false, message: 'Internal server error' })

	}
});


router.delete("/:idPost", verifyToken, async (req, res) => {
	try {
		const react = await React.findOneAndDelete({ post: req.params.idPost, idUser: req.userId })
		await Post.updateMany(
			{ _id: req.params.idPost },
			{ $pull: { reacts: react._id } }
		);

		res.status(200).json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, message: 'Internal server error' })

	}

});


module.exports = router