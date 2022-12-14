const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newTable = new Schema({
    switch : Boolean
})

const actuatoin = mongoose.model('actuator',newTable)

module.exports = actuatoin