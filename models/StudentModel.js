const mongoose = require('mongoose')
const Schema = mongoose.Schema
const StudentSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    name: String,
    mssv: {
        type: String,
        unique: true
    },
    khoa: String,
    lop: String,
    img: String


})


module.exports = mongoose.model("Student", StudentSchema)