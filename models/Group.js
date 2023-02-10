const mongoose = require('mongoose')
const Schema = mongoose.Schema
const short = require('short-uuid');
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId();
const GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    code: {
        type: String,
        default:uid()
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'account'
    },

    member: [
        {
            type: Schema.Types.ObjectId,
            ref: 'account'
        }
    ],
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'task'
        }
    ]
})

module.exports = mongoose.model('group', GroupSchema)