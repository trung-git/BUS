const localstorage = require('localStorage')
const jwt = require('jsonwebtoken');
const Admin = require("../models/AdminModel")
const authenForStudent = (req, res, next) => {
    if (req.user || localstorage.getItem("token")) {
        next()
    } else {
        return res.redirect("/auth/login")
    }
}
const authenForAdmin = (req, res, next) => {
    if (localstorage.getItem("token")) {
        let token = localstorage.getItem("token")
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) { return res.send("Err") }
            let id = data.id
            Admin.findById(id, (e, temp) => {
                if (e) { return res.send("Err") }
                if (temp.role === "admin") {
                    next()
                } else {
                    return res.send("You not permission")
                }
            })
        })

    } else {
        return res.redirect("/auth/login")
    }
}

const authenForPb = (req, res, next) => {
    if (localstorage.getItem("token")) {
        next()
    } else {
        return res.redirect("/auth/login")
    }
}

const authenForLogin = (req, res, next) => {
    if (req.user) {
        return res.redirect("/auth/y")
    } else if (localstorage.getItem("token")) {
        let token = localstorage.getItem("token")
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) { return res.send("Err") }
            let id = data.id
            Admin.findById(id, (e, temp) => {
                if (e) { return res.send("Err") }
                if (temp.role === "admin") {
                    return res.redirect("/auth/quanly")
                } else {
                    return res.redirect("/post")
                }
            })
        })
    } else {
        next()
    }
}

module.exports.authenForStudent = authenForStudent
module.exports.authenForAdmin = authenForAdmin
module.exports.authenForPb = authenForPb
module.exports.authenForLogin = authenForLogin