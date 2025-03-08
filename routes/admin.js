const express = require("express")
const router = express.Router();
const {User} = require("../model/usermode")

router.get("/login",(req,res)=>{
    res.render("admin/login")
})

router.get("/adminhome",(req,res)=>{
    res.render("admin/adminhome")
})

router.get("/Details",(req,res)=>{
    res.render("admin/deatails")
})

router.get("/addDetails",(req,res)=>{
    res.render("admin/adddeatails")
})



module.exports = router