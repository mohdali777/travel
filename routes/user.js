const express = require("express")
const router = express.Router();
const {User} = require("../model/usermode")
const bcrypt = require("bcrypt");
const {Package} = require("../model/adminModel")
const {islogin,sessionCheck} = require("../session/userSession")


router.get("/login",islogin,(req,res)=>{
res.render("user/login")
})

router.get("/signout",(req,res)=>{
    res.redirect("/login")
})

router.get("/home",sessionCheck,async (req,res)=>{
    let pack = await Package.find({})
    res.render("user/home",{pack})
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
   return res.status(200).json({success:true,message:"user added Successfully",redirect:"/login"})    

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

req.session.user = true;
return res.status(200).json({success:true,message:"user Logged in Successfuly",redirect:"/home"})

})

router.get("/searchD/:place",sessionCheck,(req,res)=>{
    res.render("user/searchD")
})
router.get("/packageD/:id",sessionCheck,async (req,res)=>{
    const {id} = req.params;
    let place = await Package.findById(id)
    res.render("user/packageD",{place})
})

router.post("/searchPlace",sessionCheck, async (req, res) => {
    try {
        console.log(req.body);        
        const { place } = req.body;
        let places = await Package.find({ packageName: place });
        console.log(places);
        return res.render("user/searchD",{places})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/searchPlacesQery",sessionCheck,async (req,res) => {
    try {
        const {place} = req.query;
        console.log(place);        
        const places = await Package.find({
            packageName: { $regex: place, $options: 'i' }, 
          });
          console.log(places);
          const names = places.length !==0 ? places.map((pl)=>{
            return pl.packageName
          }):[]
          console.log(names);
          return res.status(200).json({names})
    } catch (error) {
        
    }
})

module.exports = router