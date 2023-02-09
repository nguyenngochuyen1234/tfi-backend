const mongoose = require('mongoose')
const Schema = mongoose.Schema


const PendingMemberSchema = new Schema({
    group: {
        type: String,
        required: true,
    },
    member: [
        {
            type: Schema.Types.ObjectId,
            ref: 'account'
        }
    ],
})

module.exports = mongoose.model('pendingMember', PendingMemberSchema)