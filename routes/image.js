const multer = require('multer')
const fs = require('fs')
const express = require('express')
const router = express.Router()
const imageModel = require('../models/Image')
const User = require('../models/Account')

//----------------MULTER--------------


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("testImage"), (req, res) => {
    const saveImage = imageModel({
        name: req.body.name,
        img: {
            data: fs.readFileSync("uploads/" + req.file.filename),
            contentType: "image/png",
        },
    });
    saveImage
        .save()
        .then((res) => {
            console.log("image is saved");
        })
        .catch((err) => {
            console.log(err, "error has occur");
        });
    res.send('image is saved')
})

router.post("/singleImage", async (req, res) => {
    const name = req.body.name
    console.log(req.body)
    try {
        const data = await imageModel.findOne({ name: name })
        res.json({ success: true, data })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})
router.post("/groupImage", async (req, res) => {
    const ids = req.body.arrayId
    console.log(ids)
    try {
        let groupName = []
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i]
            let userData = await User.findById(id)
            let name = userData.username
            let data = await imageModel.findOne({ name: name })
            console.log(data)
            groupName.push(data)
        }
        res.json({ success: true, groupName })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

module.exports = router

