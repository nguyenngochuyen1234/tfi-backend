const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TimelineDashboardSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    },

}, { timestamps: true })

module.exports = mongoose.model('TimelineDashboardSchema', TimelineDashboardSchema)