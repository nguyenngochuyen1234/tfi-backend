const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    nameProject: {
        type: String,
        required: true,
    },
    descriptionProject: {
        type: String,
    },
    schedule: {
        type: String,
        required: true,
    },
    dealine: {
        type: Date,
        required: true,
        default: Date.now
    },
    group:{
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'task'
        }
    ]
})

module.exports = mongoose.model('project', ProjectSchema)