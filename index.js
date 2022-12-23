const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyPharser = require('body-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const authRouter = require('./routes/auth')
const groupRouter = require('./routes/group')
const projectRouter = require('./routes/project')
const taskRouter = require('./routes/task')

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
app.use(bodyPharser.json({limit: "50mb"}))
app.use(express.json())
app.use(cors())
app.use(morgan("common"))

app.get("/api", (req, res) => {
    res.status(200).json("Hello")
})

app.use('/api/auth', authRouter)
app.use('/api/group', groupRouter)
app.use('/api/project', projectRouter)
app.use('/api/task', taskRouter)

app.listen(8000, () => {
    console.log('Server is runnning')
})