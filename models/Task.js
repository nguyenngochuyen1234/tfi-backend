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
        type: Array,
        require: true,
    },
    status:{
        type: String,
        enum:["uncomplete","completed","past due"],
        default: "uncomplete"
    },
    group:{
        type: Schema.Types.ObjectId,
        ref: 'group'
    }
},{ timestamps: true })

module.exports = mongoose.model('task', TaskSchema)