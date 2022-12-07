const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newSchema = new Schema({
    temp: Number,
    sound: Number,
    humidity: Number,
    time  : String
})

const data = mongoose.model('data', newSchema)
module.exports = data