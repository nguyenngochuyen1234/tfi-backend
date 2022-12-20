const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    major: {
        type: String,
    },
    studentNumber: {
        type: String,
    },
    school:{
        type: String,
    },
    gmail:{
        type: String,
        required:true 
    },
    phoneNumber:{
        type: String,
        required:true
    },
    account: {
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'account'
    },
    groupMade:[
        {
            type: Schema.Types.ObjectId,
            ref: 'group'
        },
    ],
    groupJoin:[
        {
            type: Schema.Types.ObjectId,
            ref: 'group'
        },
    ],
    tasks:[
        {
            type: Schema.Types.ObjectId,
            ref: 'project'
        },
    ]
})

module.exports = mongoose.model('user', UserSchema)