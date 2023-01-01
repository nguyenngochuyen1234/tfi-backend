const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },
    member:[
        {
            type: Schema.Types.ObjectId,
            ref: 'account'
        }
    ],
    projects:[
        {
            type: Schema.Types.ObjectId,
            ref: 'project'
        }
    ]
})

module.exports = mongoose.model('group', GroupSchema)