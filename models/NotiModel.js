const mongoose = require('mongoose')
const Schema = mongoose.Schema
const NotiModel = new Schema({
    userId: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    userimg: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    content: {
        type: String
    }
    
    

}, { timestamps: true })


module.exports = mongoose.model("Notification", NotiModel)