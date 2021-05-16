const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PostSchema = new Schema({
    userId: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    userimg: {
        type: String,
        require: true
    },
    desc: {
        type: String
    },
    img: String,
    video: String,
    like: {
        type: Array,
        default: []
    },
    cmt: {
        type: Array,
        default: []
    }


}, { timestamps: true })


module.exports = mongoose.model("Post", PostSchema)