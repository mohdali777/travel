const express = require("express")
const app = express()
const path = require("path")
const monogos = require("./db/connect")
const session = require('express-session');
const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")

app.use(
    session({
        secret: 'your-secret-key', 
        resave: false, 
        saveUninitialized: false, 
        cookie: {
            secure: false, 
            maxAge: 1000 * 60 * 60 * 24, 
        },
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/",userRoutes)
app.use("/admin",adminRoutes)


app.listen(3000,()=>{
    console.log("running")
    monogos()
})