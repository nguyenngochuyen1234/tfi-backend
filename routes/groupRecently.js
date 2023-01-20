const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const GroupRecently = require('../models/GroupRecently')

router.patch('/:idGroup', verifyToken, async (req, res) => {
    try {
        const updateTimeGroup = await GroupRecently.findOneAndUpdate(
            { group: req.params.idGroup, user:req.userId },
            { $set: { time: Date.now() } },
            { new: true }
        )
        res.json({ success: true, updateTimeGroup })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})
router.get('/', verifyToken, async (req, res) => {
    try {
        const groups = await GroupRecently.find({user:req.userId}).sort({time:-1}).limit(6)
        res.json({ success: true, groups })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router