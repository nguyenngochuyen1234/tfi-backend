const mongoose = require('mongoose');
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
    },
    major: {
        type: String,
    },
    school: {
        type: String,
    },
    gmail: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    groupMade: [
        {
            type: Schema.Types.ObjectId,
            ref: 'group'
        },
    ],
    groupJoin: [
        {
            type: Schema.Types.ObjectId,
            ref: 'group'
        },
    ],
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'project'
        },
    ]
})

module.exports = mongoose.model('account', AccountSchema) 