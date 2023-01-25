const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'account',
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    },
    data: {
        type: String,
    },
})

module.exports = mongoose.model('comment', CommentSchema)