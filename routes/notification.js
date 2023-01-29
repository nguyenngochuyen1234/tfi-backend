const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Notification = require("../models/Notification")
// create new notification


router.post("/", verifyToken, async (req, res) => {
    const { receiver, type, title, link, description } = req.body

    try {
        const notificationMessage = await Notification.find({ receiver, title, type: "message", seen: false })
        if (notificationMessage.length == 0) {
            const newNotification = new Notification({ receiver, type, title, link, description });
            await newNotification.save();
        }
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })

    }
});

//get

router.get("/find/:notificationId", verifyToken, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId)
        res.status(200).json({ success: true, notification });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })

    }

});


router.get("/", verifyToken, async (req, res) => {
    const idUser = req.userId
    try {
        const notifications = await Notification.find({ receiver: { $in: [idUser] } }).sort({ time: -1 })
        res.status(200).json({ success: true, notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }

});
router.patch("/:idNotifiction", verifyToken, async (req, res) => {
    const newData = req.body
    try {
        const updatedNotifiction = await Notification.findOneAndUpdate(
            { _id: req.params.idNotifiction },
            { $set: newData },
            { new: true }
        )

        res.status(200).json({ success: true, updatedNotifiction });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }

});


module.exports = router