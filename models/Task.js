const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    nameTask: {
        type: String,
        required: true,
    },
    descriptionTask: {
        type: String,
    },
    comment: {
        type: String,
    },
    links: {
        type: String,
    },
    dealine: {
        type: Date,
        required: true,
        default: Date.now
    },
    member: {
        type: String,
        require: true,
    },
    status:{
        type: String,
        enum:["Hoàn thành", "Chưa hoàn thành","Đang hoàn thành"],
        default: "Chưa hoàn thành"
    },
    project:{
        type: Schema.Types.ObjectId,
        ref: 'project'
    }
})

module.exports = mongoose.model('task', TaskSchema)