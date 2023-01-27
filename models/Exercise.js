const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExerciseSchema = new Schema({
    name: {
        type: String,
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'account',
    },
    avatar:{
        type:String,
    },
    time:{
        type: Date,
        default: Date.now,
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'task',
    },
    type:{
        type: String,
        enum: ["file", "link"],
    },
    data:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('exercise', ExerciseSchema)