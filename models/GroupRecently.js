const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupRecentlySchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'group',
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    },
})
module.exports = mongoose.model("GroupRecently", GroupRecentlySchema)