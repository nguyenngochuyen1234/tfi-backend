const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'account',
    },
    group: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    },
    about:{
        type: String,
        required: true,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
})

module.exports = mongoose.model('post', PostSchema)