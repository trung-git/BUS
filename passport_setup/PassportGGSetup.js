const passport = require("passport")
const StudentModel = require("../models/StudentModel")
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    StudentModel.findOne({ email: user.email })
        .then(function(user) {
            done(null, user);
        }).catch(function(err) {
            console.log(err);
        })
});

passport.use(new GoogleStrategy({
        clientID: "629885708455-lsf606087p6390ic1ifbprvs2cle2f6v.apps.googleusercontent.com",
        clientSecret: "Su15sdeMujLv6CPYReuJVgi9",
        callbackURL: `/auth/google/callback`,

    },
    function(accessToken, refreshToken, profile, done) {
        let istdtugmail = profile._json.email.indexOf("@student.tdtu.edu.vn")
        if (istdtugmail === -1) {
            //Email không phải TDTUgmail
            return done(null, false, { message: "Bạn không phải sinh viên TDT" })
        } else {
            let email = profile._json.email
            StudentModel.findOne({ email: email })
                .then(stu => {
                    if (stu) {
                        return done(null, stu)
                    } else {
                        let name = profile._json.name
                        let img = profile._json.picture
                        let mssv = email.slice(0, 8)
                        let khoa = ""
                        let code = mssv.slice(0, 1)
                        console.log(code);
                        switch (code) {
                            case "1":
                                khoa = "Kế Toán"
                                break;
                            case "2":
                                khoa = "Khoa học thể thao"
                                break;
                            case "3":
                                khoa = "Khoa học ứng dụng"
                                break;
                            case "4":
                                khoa = "Khoa học xã hội và nhân văn"
                                break;
                            case "5":
                                khoa = "Công nghệ thông tin"
                                break;
                            case "6":
                                khoa = "Kĩ thuật công trình"
                                break;
                            case "7":
                                khoa = "Lao động công đoàn"
                                break;
                            case "8":
                                khoa = "Luật"
                                break;
                            case "9":
                                khoa = "Tài chính ngân hàng"
                                break;
                            default:
                                break;
                        }
                        let student = new StudentModel({
                            email: email,
                            name: name,
                            mssv: mssv,
                            khoa: khoa,
                            lop: "",
                            img: img
                        })
                        student.save()
                        return done(null, student)
                    }
                })
                .catch(e => {
                    return done(e);
                })
        }

    }
));