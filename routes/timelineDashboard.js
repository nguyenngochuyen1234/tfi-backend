const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')
const TimelineDashBoard = require('../models/TimelineDashBoard')
// create new notification


router.post("/",verifyToken, async (req, res) => {
    const { titleTimeline } = req.body  
    console.log(req.userId)
    try {
        if (titleTimeline) {
            const newTitleTimeline = new TimelineDashBoard({ title: titleTimeline, user:req.userId });
            await newTitleTimeline.save();
            res.status(200).json({ data: newTitleTimeline });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })

    }
});

//get
router.get("/", verifyToken, async (req, res) => {
    const idUser = req.userId
    try {
        const timelineDashboard = await TimelineDashBoard.find({ user: idUser }).sort({ time: -1 })
        res.status(200).json({ success: true, timelineDashboard });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }

});




module.exports = router