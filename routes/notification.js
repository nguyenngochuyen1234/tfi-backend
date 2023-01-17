const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Notification = require("../models/Notification")
// create new notification


router.post("/", verifyToken, async (req, res) => {

    const { receiver, type, title } = req.body
    const newNotification = new Notification({ receiver, type, title });

    try {
        const savedNotification = await newNotification.save();
        res.status(200).json(savedNotification);
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


module.exports = router