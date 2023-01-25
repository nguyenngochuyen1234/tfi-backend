const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReactSchema = new Schema({
    username: {
        type:String,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
    },
})

module.exports = mongoose.model('react', ReactSchema)