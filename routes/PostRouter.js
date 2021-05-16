const { Template } = require("ejs")
const localstorage = require('localStorage')
const express = require("express")
const jwt = require('jsonwebtoken');
const passport = require("passport")
const mongoose = require('mongoose')
const flash = require('connect-flash');
const Post = require("../models/PostModel")
const session = require('express-session');
const { route } = require("./AuthenRouter");
const StudentModel = require("../models/StudentModel")
const AdminModel = require("../models/AdminModel");
const PostModel = require("../models/PostModel");
const NotiModel = require("../models/NotiModel")

const router = express.Router()

router.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 5 }
}))
router.use(flash());

router.use(passport.initialize());
router.use(passport.session());
const AuthenMiddleware = require("../middlewares/AuthenMiddleware");
require("../passport_setup/PassportGGSetup")
    /* create post */

router.get("/",AuthenMiddleware.authenForStudent,async (req, res) => {
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
    const post = await PostModel.find({}).sort({ createdAt: -1 })
    const noti = await NotiModel.find({}).sort({ createdAt: -1 })
    res.render("template", { userId: id, name, img, post, noti,isAd })

})
router.post("/",AuthenMiddleware.authenForStudent ,async(req, res) => {
        let username = undefined
        let img = undefined
        if (req.user) {
            username = req.user.name
            img = req.user.img
        } else if (localstorage.getItem("token")) {
            let token = localstorage.getItem("token")
            jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
                if (err) { return res.send("Err") }
                id = data.id
                AdminModel.findById(id, (err, temp) => {
                    if (err) {
                        throw Err(err)
                    }
                    username = temp.pb
                    img = "/img/logo.png"
                })
            })
        }
        const newPost = new Post({
            userId: req.body.userId,
            name: req.user.name,
            userimg: req.user.img,
            desc: req.body.desc,
            video: req.body.video

        })
        try {
            const savedPost = await newPost.save()
            res.status(200).json({ code: 0, message: "Post success", data: savedPost, name: username, img })
        } catch (error) {
            res.status(500).json({ code: 1, message: error.message })
        }
    })
    /* update post */
router.put("/:id", async(req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            if (post.userId === req.body.userId) {
                await post.updateOne({ $set: req.body })
                res.status(200).json({code:0, message: "The post has been updated"})
            } else {
                res.status(403).json({code:1, message: "You can only update your post"})
            }
        } catch (error) {
            res.status(500).json({code:2, message: error})
        }
    })
    /* delete post  kem theo data la userId del post*/ 
router.delete("/delete/:id", async(req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            if (post.userId === req.body.userId) {
                await post.deleteOne()
                res.status(200).json({code:0, message: "The post has been deleted"})
            } else {
                res.status(403).json({code:1, message: "You can only deleted your post"})
            }
        } catch (error) {
            res.status(500).json({code:2, message: error})
        }
    })
    /* like/dislike post */
router.put("/:id/like", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post.like.includes(req.body.userId)) {
            await post.updateOne({ $push: { like: req.body.userId } })
            res.status(200).json({code:0,message:"The post has been liked"})
        } else {
            await post.updateOne({ $pull: { like: req.body.userId } })
            res.status(200).json({code:1,message:"The post has been disliked"})
        }
    } catch (error) {
        res.status(500).json({code:2,message:error})
    }
})
router.delete("/:idpost/delcmt/:idcmt", async(req, res) => {
    try {
        const post = await Post.findById(req.params.idpost)
        let cmt = post.cmt.find(a => a._id == req.params.idcmt)
        await post.updateOne({ $pull: { cmt: { _id: cmt._id, userId: cmt.userId, desc_cmt: cmt.desc_cmt } } })
        res.status(200).json({code : 0 , message :"The cmt has been del"})

    } catch (error) {
        res.status(500).json({code : 0 , message : error})
    }
})
router.put("/:id/cmt", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const idcmt = mongoose.Types.ObjectId()
        await post.updateOne({ $push: { cmt: { _id: idcmt, userId: req.body.userId, userimg:req.body.userimg,username:req.body.username ,desc_cmt: req.body.desc_cmt } } })
        
        res.status(200).json({code:0, message:"The post has been cmt",data:idcmt})

    } catch (error) {
        res.status(500).json({code:1, message: error})
    }
})


router.get("/sinhvien",async(req,res)=> {
    
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
    
    const sv = await StudentModel.find()
    
    res.render("allsv",{sv,img,name})
})
router.get("/from/:idsv",async(req,res)=> {
    try {
        const idsv = req.params.idsv
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
        const sv = await StudentModel.findById(idsv)
        const post = await PostModel.find({userId: sv._id}).sort({ createdAt: -1 })
        res.render("sv",{name,img,sv,post})
    } catch (error) {
        
    }
})

module.exports = router