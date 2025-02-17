const express = require("express")
const app = express()
const path = require("path")
const monogos = require("./db/connect")
const userRoutes = require("./routes/user")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/",userRoutes)


app.listen(3000,()=>{
    console.log("running")
    monogos()
})