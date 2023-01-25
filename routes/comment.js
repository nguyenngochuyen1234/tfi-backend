const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const Account = require('../models/Account')
const Comment = require('../models/Comment')
const Post = require('../models/Post')

router.post('/:idPost', verifyToken, async (req, res) => {
    const idPost = req.params.idPost

    const { data } = req.body
    try {
        const user = await Account.findById(req.userId)
        const newComment = new Comment({
            data,
            post: idPost,
            idUser: req.userId,
            avatar: user.avatar,
            name: user.name
        })
        
        const savedComment = await newComment.save()
        
        const post = await Post.findById(req.params.idPost)
        console.log(post)
        await post.updateOne({ $push: { comments: [savedComment._id] } });

        res.json({ success: true, comment: savedComment })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})
module.exports = router;