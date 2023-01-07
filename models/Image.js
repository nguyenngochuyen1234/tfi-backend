const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imgSchema = new Schema({
    name: String,
    img:{
        data: Buffer,
        contentType: String
    }
})
module.exports = mongoose.model("Image", imgSchema)