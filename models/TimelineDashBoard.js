const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TimelineDashboardSchema = new Schema({

    user:{
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true })

module.exports = mongoose.model('TimelineDashboard', TimelineDashboardSchema)