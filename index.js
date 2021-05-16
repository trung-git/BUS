const express = require("express");
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require("passport")
require("dotenv").config();

const AuthenRouter = require('./routes/AuthenRouter')
const PostRouter = require("./routes/PostRouter")
const NotiRouter = require("./routes/NotiRouter")
const app = express()

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 5 }
}))
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", AuthenRouter)
app.use("/post", PostRouter)
app.use("/noti",NotiRouter)
app.get('/', (req, res) => {

    res.redirect("/auth/login")

})

port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex:true
    })
    .then(() => {
        console.log("Connect to MONGODB success");
        app.listen(port, () => console.log('> Server is up and running http://localhost:' + port))
    })
    .catch(e => {
        console.log("Not connect to MongogDB " + e.message);
    })