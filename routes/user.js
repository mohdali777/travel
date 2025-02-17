const express = require("express")
const router = express.Router();
const {User} = require("../model/usermode")
const bcrypt = require("bcrypt");

router.get("/login",(req,res)=>{
res.render("user/login")
})

router.get("/home",(req,res)=>{
    res.render("user/home")
})

router.post("/signup", async (req,res)=>{
    const {username,email,password} = req.body
    const existing = await User.findOne({username})
    if(existing){
        return res.status(404).json({success:false,message:"username alredy exist"})
    }
     
    const emailExist = await User.findOne({email})

    if(emailExist){
        return res.status(404).json({success:false,message:"email alredy exist"})
    }

    const newUser = new User({
        username,
        email,
        password
    })
   await newUser.save()
   return res.status(200).json({success:true,message:"user added Successfully",redirect:"/home"})    

})

router.post("/login",async (req,res)=>{
const {email,password} = req.body
const existing = await User.findOne({email:email})
if(!existing){
    return res.status(400).json({success:false,message:"user not found"})
}
if(existing.password !== password){
    return res.status(401).json({ success: false, message: "Password doesn't match" });
}

return res.status(200).json({success:true,message:"user Logged in Successfuly",redirect:"/home"})

})



module.exports = router