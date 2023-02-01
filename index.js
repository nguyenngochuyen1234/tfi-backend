const express = require('express')
const firebase = require('./firebase')
const multer = require('multer')

const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");



const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
});
require('dotenv').config()

const authRouter = require('./routes/auth')
const groupRouter = require('./routes/group')
const taskRouter = require('./routes/task')
const messageRouter = require('./routes/message')
const imageRouter = require('./routes/image')
const conversationRouter = require('./routes/conversation')
const notificationRouter = require('./routes/notification')
const groupRecentlyRouter = require('./routes/groupRecently')
const postRouter = require('./routes/post')
const commentRouter = require('./routes/comment')
const reactRouter = require('./routes/react')
const exerciseRouter = require('./routes/exercise')
const timelineDashboardRouter = require('./routes/timelineDashboard')
//-------------SOCKET.IO------------
global.onlineUsers = new Map()
io.on('connection', (socket) => {
    console.log("socket run");
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    });
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.receiverId);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data)
        }
    })
    console.log(onlineUsers);
    socket.on("send-notification", (data) => {
        if(data){
            let sendUserSocket = onlineUsers.get(data.receiver);
            console.log({data})
            if (sendUserSocket) {
                socket.to(sendUserSocket).emit("notification-recieve", {...data})
            }

        }
    })
});






mongoose.set('strictQuery', true)
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@task-management.yohdjlz.mongodb.net/?retryWrites=true&w=majority`, {
            useUnifiedTopology: true,
        })
        console.log('MogoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(cors())
app.use(morgan("common"))
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ extended: false }))

app.use(express.urlencoded({ extended: false }))
app.use(express.json({ extended: false }))

const upload = multer({
    storage: multer.memoryStorage()
})

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("Error: No files found")
    }
    const nameFile = Date.now() + "." + req.file.originalname
    const blob = firebase.bucket.file(nameFile)

    const blobWriter = blob.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    })

    blobWriter.on('error', (err) => {
        console.log(err)
    })

    blobWriter.on('finish', async () => {
        await blob.makePublic()
        res.status(200).send({ link: `https://firebasestorage.googleapis.com/v0/b/storageapp-13725.appspot.com/o/${nameFile}?alt=media` })
    })

    blobWriter.end(req.file.buffer)
})
app.post('/api/delete',async (req, res) => {
    
        try {
        console.log(req.body.link)
           const response= await firebase.bucket.deleteFile(req.body.link);
           console.log(response)
            res.status(200).send({ message: "Xóa thành công", success: true })
        } catch (error) {
            res.status(400).send({ message: "Xóa không thành công", success: false })

        }

   
})

app.get("/", (req, res) => {
    res.status(200).json("Hello")
})


app.use('/api/auth', authRouter)
app.use('/api/group', groupRouter)
app.use('/api/task', taskRouter)
app.use('/api/message', messageRouter)
app.use('/api/image', imageRouter)
app.use('/api/conversation', conversationRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/groupRecently', groupRecentlyRouter)
app.use('/api/post', postRouter)
app.use('/api/comment', commentRouter)
app.use('/api/react', reactRouter)
app.use('/api/exercise', exerciseRouter)
app.use('/api/timelineDashboard', timelineDashboardRouter)

httpServer.listen(8000, () => {
    console.log('Server is runnning')
})
