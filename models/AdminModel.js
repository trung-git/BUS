const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AdminSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "pb"
    },
    pb: {
        type: String,
        default: ""
    }


})


module.exports = mongoose.model("Admin", AdminSchema)