const localstorage = require('localStorage')
const express = require("express")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const flash = require('connect-flash')
const session = require('express-session');
const router = express.Router()
const AuthenMiddleware = require("../middlewares/AuthenMiddleware");
const AdminModel = require("../models/AdminModel");
const NotiModel = require("../models/NotiModel")
router.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 5 }
}))
router.use(flash());


router.get("/pb",AuthenMiddleware.authenForStudent,async(req,res)=>{
    try {
        let id = undefined
        let name = undefined
        let img = undefined
        let isAd = false
        if (req.user) {
            id = req.user._id
            name = req.user.name
            img = req.user.img
        }
        else if (localstorage.getItem("token")) {
            isAd = true
            img = "/img/logo.png"
            let token = localstorage.getItem("token")
            jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
                if (err) { return res.send("Err") }
                id = data.id
                AdminModel.findById(id, (err, temp) => {
                    if (err) {
                        throw Err(err)
                    }

                    name = temp.pb

                })
            })

            
        }
        
        const ad = await AdminModel.find({role: "pb"})
        
        res.render("departlist",{ad,img,name})
    } catch (error) {
        console.log(error);
    }

})
router.post("/",AuthenMiddleware.authenForPb,async (req,res)=> {
    let id = undefined
    let name = undefined
    let img = undefined
    if(localstorage.getItem("token")){
        img = "/img/logo.png"
        let token = localstorage.getItem("token")
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) { return res.send("Err") }
            id = data.id
            
        })

        try {
            const admin = await AdminModel.findById(id)
            name = admin.pb
        } catch (error) {
            console.log(error);
        }
        
    }
    const newbnoti = new NotiModel({
        userId: req.body.userId,
        username: name,
        userimg: img,
        title: req.body.title,
        content: req.body.content
    })
    try {
        const savednoti = await newbnoti.save()
        res.status(200).json({ code: 0, message: "Notification success", data: savednoti, name: name, img })
    } catch (error) {
        res.status(500).json({ code: 1, message: error.message })
    }
})
router.get("/show/:idpb",AuthenMiddleware.authenForStudent,async(req,res)=>{
    try {
        let id = undefined
        let name = undefined
        let img = undefined
        let isAd = false
        if (req.user) {
            id = req.user._id
            name = req.user.name
            img = req.user.img

        }
        else if (localstorage.getItem("token")) {
            isAd = true
            img = "/img/logo.png"
            let token = localstorage.getItem("token")
            jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
                if (err) { return res.send("Err") }
                id = data.id
            })
                const admin = await AdminModel.findById(id)
                name = admin.pb

            
        }
        const pb = await AdminModel.findById(req.params.idpb)
        let namepb = pb.pb
        const noti = await NotiModel.find({username: namepb}).sort({ createdAt: -1 })
        res.render("depart",{noti, iduser:id , img , name , pb: namepb})
    } catch (error) {
        console.log(error);
    }
})
router.get("/pb/:id",AuthenMiddleware.authenForStudent,async(req,res)=> {
    try {
        let id = undefined
        let name = undefined
        let img = undefined
        let isAd = false
        if (req.user) {
            id = req.user._id
            name = req.user.name
            img = req.user.img

        }
        else if (localstorage.getItem("token")) {
            isAd = true
            img = "/img/logo.png"
            let token = localstorage.getItem("token")
            jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
                if (err) { return res.send("Err") }
                id = data.id
                

                
                })
                const admin = await AdminModel.findById(id)
                name = admin.pb

            
        }
        const idnoti = req.params.id
        const noti = await NotiModel.findById(idnoti)
        res.render("singlenoti",{noti,img,name})
    } catch (error) {
        console.log(error);
    }

})
/* xoa thong bao */
router.delete("/del/:id",AuthenMiddleware.authenForPb,async(req,res)=>{
    
    try {
        const noti = await NotiModel.findById(req.params.id)
        if (noti.userId === req.body.userId) {
            await noti.deleteOne()
            res.status(200).json({code:0, message: "The notification has been deleted"})
        } else {
            res.status(403).json({code:1, message: "You can only deleted your notification"})
        }
    } catch (error) {
        res.status(500).json({code:2, message: error})
    }
})
/* update thong bao */
router.put("/update/:id",AuthenMiddleware.authenForPb,async(req,res)=>{
    try {
        const noti = await NotiModel.findById(req.params.id)
        if (noti.userId === req.body.userId) {
            await noti.updateOne({ $set: req.body })
            res.status(200).json({code:0, message: "The notification has been updated"})
        } else {
            res.status(403).json({code:1, message: "You can only update your notification"})
        }
    } catch (error) {
        res.status(500).json({code:2, message: error})
    }
})
module.exports = router