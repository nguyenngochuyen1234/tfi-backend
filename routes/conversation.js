const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const Conversation = require("../models/Conversations");
const account = require("../models/Account")

//new conv

router.post("/", verifyToken, async (req, res) => {
  const newConversation = new Conversation({
    members: [req.userId, req.body.receiverId],
  });

  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });
    if (conversation) {
      return res
        .status(400)
        .json({ success: false, message: 'conversation already taken' })

    }
    else {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friend data of user

router.get("/", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.userId] },
    })
    const idFriends = conversations.map(conversation => {
      const idFriend = conversation.members.find(member => {
        return member !== req.userId
      })
      return idFriend
    })
    let friendData = []
    for (let i = 0; i < idFriends.length; i++) {
      let data = await account.findById(idFriends[i])
      friendData.push(data)
    }
    res.status(200).json({ success: true, friendData });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:friendId", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.friendId, req.userId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;