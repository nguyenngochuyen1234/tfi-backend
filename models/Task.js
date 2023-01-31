const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    comment: {
        type: String,
        default:"",
    },
    links: {
        type: String,
    },
    deadline: {
        type: Date,
        required: true,
        default: Date.now
    },
    dayStart: {
        type: Date,
        default: Date.now

    },
    member: {
        type: Array,
        require: true,
    },
    status: {
        type: String,
        enum: ["uncomplete", "completed", "past-due","pending"],
        default: "uncomplete"
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    exercise:{
        type: Schema.Types.ObjectId,
        ref: 'exercise',
    }
}, { timestamps: true })

module.exports = mongoose.model('task', TaskSchema)