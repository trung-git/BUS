const express = require("express")
const router = express.Router()
const passport = require("passport")
const localstorage = require('localStorage')
const flash = require('connect-flash');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const LoginValidator = require("../validators/LoginValidator")
const session = require('express-session');
const AdminModel = require("../models/AdminModel")
const StudentModel = require("../models/StudentModel")
router.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 5 }
}))
router.use(flash());

require("../passport_setup/PassportGGSetup")
const AuthenMiddleware = require("../middlewares/AuthenMiddleware");
const PostModel = require("../models/PostModel");

router.use(passport.initialize());
router.use(passport.session());

router.get("/login", AuthenMiddleware.authenForLogin, (req, res) => {
    let message_temp = req.flash("message");
    if (message_temp.length === 0) {
        message_temp = req.flash("error")
    }
    let username_temp = req.flash("username");
    let password_temp = req.flash("password");

    res.render("login", { message: message_temp, username: username_temp, password: password_temp })

})
router.post("/login", AuthenMiddleware.authenForLogin, LoginValidator, (req, res) => {
    let result = validationResult(req);
    req.flash('username', req.body.username)
    req.flash('password', req.body.password)
    if (result.errors.length === 0) {
        let { username, password } = req.body
        let currentadmin = undefined

        AdminModel.findOne({ username: username })
            .then(admin => {
                if (!admin) {
                    return
                }
                currentadmin = admin
                return bcrypt.compare(password, admin.password)
            })
            .then(match => {
                if (!match) {
                    req.flash('message', "Sai tài khoản hoặc mật khẩu")
                    return res.redirect("/auth/login")
                }
                jwt.sign({
                    id: currentadmin._id
                }, process.env.JWT_SECRET, {
                    expiresIn: "1h"
                }, (err, token) => {
                    if (err) throw err
                    localstorage.setItem("token", token)
                        /* return res.json({
                            code: 0,
                            message: "Dang nhap thanh cong",
                            token
                        }) */
                    if (currentadmin.role === "admin") {
                        return res.redirect("/auth/quanly")
                    }
                    return res.redirect("/post")

                })
            })
            .catch(e => {
                return res.json({ code: 1, message: e.message })
            })
    } else {
        let messages = result.mapped()
        let message = ''
        for (i in messages) {
            message = messages[i].msg
            req.flash('message', message)

            break
        }
        return res.redirect("/auth/login")
    }
});
router.get("/change/password", AuthenMiddleware.authenForPb, (req, res) => {
    res.render("change-pass")
})
router.post("/change/password/", AuthenMiddleware.authenForPb, (req, res) => {
        let { oldpass, newpass } = req.body
        let token = localstorage.getItem("token")
        let temp = undefined
        let id = undefined
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) { return res.send(err.message) }
            id = data.id
        })
        AdminModel.findById(id)
            .then(user => {
                if (!user) {
                    throw Error("Không tồn tại admin này")
                }
                temp = user
                return bcrypt.compare(oldpass, user.password)
            })
            .then(match => {
                if (!match) {
                    throw Error("Mật khẩu cũ sai")
                }
                return bcrypt.hash(newpass, 10)
            })
            .then(hashed => {
                temp.password = hashed
                temp.save()
                return res.json({ code: 0, message: "Change password success" })
            })
            .catch(e => {
                return res.json({ code: 1, message: e.message })
            })
    })
    
//admin register for pb
router.get("/register", AuthenMiddleware.authenForAdmin, (req, res) => {
    res.render("newuser")
})
router.post("/register", AuthenMiddleware.authenForAdmin, (req, res) => {
    let { username, password, pb } = req.body
    AdminModel.findOne({ username: username })
        .then(admin => {
            if (admin) {
                throw Error("Tài khoản đã tồn tại")
            }
            return bcrypt.hash(password, 10)
        })
        .then(hashed => {
            let { username, password, pb } = req.body
            let admin = new AdminModel({
                username,
                password: hashed,
                pb
            })
            admin.save()
            return res.json({ code: 0, message: "Register done", hashed })
        })
        .catch(e => {
            return res.json({ code: 1, message: e.message })
        })


})

//admin  quan ly pb
router.get("/quanly", AuthenMiddleware.authenForAdmin, (req, res) => {
    AdminModel.find({ role: "pb" })
        .then(data => {

            return res.render("funman", { data: data })
        })
        .catch(e => {
            return res.json({ code: 1, message: e.message })
        })

})

//admin xoa pb
router.delete("/delete/:id", AuthenMiddleware.authenForAdmin, (req, res) => {
    if (!req.params.id) {
        return res.json({ code: 1, message: "Invalid id" })
    } else {
        let id = req.params.id
        AdminModel.deleteOne({ _id: id })
            .then(result => {
                if (result) {
                    return res.json({ code: 0, message: "Delete success" })
                }
            })
            .catch(e => {
                return res.json({ code: 1, message: "Delete fail" })
            })

    }
})



//student login success
router.get("/y", AuthenMiddleware.authenForStudent,async (req, res) => {
        const post = await PostModel.find({userId : req.user._id}).sort({ createdAt: -1 })
        
        res.render("about", { student: req.user, post })
    })
    //student edit profile
router.get("/edit", AuthenMiddleware.authenForStudent, (req, res) => {
    res.render("editinfo", { student: req.user })
})

//student edit profile
router.put("/update/student/:mssv", AuthenMiddleware.authenForStudent, (req, res) => {
    let mssv = req.params.mssv
    let { name, khoa, lop } = req.body;
    StudentModel.findOne({ mssv: mssv })
        .then(stu => {
            if (!stu) {
                return res.json({ code: 1, message: "Find student error: Not exists" })
            }
            let id = stu._id
            
            stu.name = name;
            stu.khoa = khoa;
            stu.lop = lop;
            /* stu.img = img; */
            stu.save()
            PostModel.updateMany({ userId: stu._id }, { $set: { name: name } }, (err, rel) => {
                if (err) {
                    throw Error(err)
                }
                
            })
            
            PostModel.find({"cmt.userId" : `${id}`},(err,data)=>{
                data.forEach(async d => {
                    
                    d.cmt.forEach(c => {
                        let up = undefined
                        if (c.userId === `${id}`) {
                            c.username = name
                            up = c
                        }    
                    }); 
                    d.markModified("cmt");
                    await d.save()
                    
                });

            })
            
            
                
                        
                
              
            
            return res.json({ code: 0, message: "Update student done", data: stu })

        })
        .catch(e => {
            return res.json({ code: 2, message: "Find student Fail" })

        })
})



router.get("/pb", AuthenMiddleware.authenForPb, (req, res) => {
    let token = localstorage.getItem("token")
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err) { return res.send("Err") }
        let id = data.id
        AdminModel.findById(id, (e, temp) => {
            if (e) { return res.send("Err") }

            return res.send(`Hello ${temp.pb}`)
        })
    })

})

//logout
router.get('/logout', (req, res) => {
    req.logout();
    localstorage.clear()
    req.flash('username', "")
    req.flash('password', "")
    res.redirect('/auth/login');
});


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login', successRedirect: '/auth/y', failureFlash: true, }));

module.exports = router