const express = require('express')
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
const projectRouter = require('./routes/project')
const taskRouter = require('./routes/task')
const messageRouter = require('./routes/message')
const imageRouter = require('./routes/image')
const conversationRouter = require('./routes/conversation')
//-------------SOCKET.IO------------
global.onlineUsers = new Map()
io.on('connection', (socket) => {
    console.log(onlineUsers);
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId, socket.id)
    });
    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.receiverId);
        console.log(data)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data)
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

app.get("/", (req, res) => {
    res.status(200).json("Hello")
})

app.use('/api/auth', authRouter)
app.use('/api/group', groupRouter)
app.use('/api/project', projectRouter)
app.use('/api/task', taskRouter)
app.use('/api/message', messageRouter)
app.use('/api/image', imageRouter)
app.use('/api/conversation', conversationRouter)

httpServer.listen(8000, () => {
    console.log('Server is runnning')
})
