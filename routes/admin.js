const express = require("express")
const router = express.Router();
const {User} = require("../model/usermode")
const {Package,admin} = require("../model/adminModel")
const upload = require("../helpers/multer")
const {islogin,sessionCheck} = require("../session/adminsession")

router.get("/login",islogin,(req,res)=>{
    res.render("admin/login")
})

router.get("/adminhome",sessionCheck, async (req,res)=>{
    let pack = await Package.find({})
    res.render("admin/adminhome",{pack})
})

router.get("/Details",sessionCheck,(req,res)=>{
    res.render("admin/deatails")
})

router.get("/addDetails",sessionCheck,(req,res)=>{
    res.render("admin/adddeatails")
})

router.post("/addDeatails", upload.fields([
    { name: 'hotelImages', maxCount: 10 }, 
    { name: 'placeImages', maxCount: 10 }, 
  ]),async (req,res)=>{
    console.log(req.body);
    
    try {
        const {
            placeName,
            description,
            state,
            country,
            price,
            HotelName,
            phone,
            email,
            hotelFacil,
            tourPlace,
        } = req.body;

        const amenities = JSON.parse(hotelFacil);        
        const places = JSON.parse(tourPlace);

        const hotelImages = req.files['hotelImages'];
        const placeImages = req.files['placeImages']; 


        console.log("hotel",hotelImages);
        console.log("place",placeImages);

        places.forEach((place) => {
            place.placeImagesss.forEach((img) => {
                const matchedImage = placeImages.find((file) => file.originalname === img);
                if (matchedImage) {
                    console.log("Matched Image:", matchedImage);
                    place.images = place.images || []; 
                    place.images.push(matchedImage.path.replace('public', '')); 
                }
            });
        });
        
        
        const hotelImagePaths = hotelImages.map(file => {
            return file.path.replace('public', '');
        });        console.log(hotelImagePaths);
        
        const newPackage = new Package({
            packegId: Math.floor(Math.random() * 1000000), 
            packageName: placeName,
            description,
            state,
            Country:country,
            price: parseFloat(price), 
            tourplaces: places,
            hotelName: HotelName,
            HotelFacil: amenities,
            hotelImages: hotelImagePaths,
            PhoneNumber: parseInt(phone), 
            email,
        });
        await newPackage.save();
        res.status(201).json({ message: 'Package created successfully!', data: newPackage });
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ error: 'Failed to create package.' });
    }
})

router.post("/login", async (req, res) => {
    try {
        console.log(req.body);
        
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }
        const user = await admin.findOne({name:username});
        console.log(user);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username "
            });
        }
        const isMatch = user.password = password;
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid  password."
            });
        }
        req.session.admin = true;
        res.status(200).json({
            success: true,
            message: "Login successful!",
            redirect: "/admin/adminhome"
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});


module.exports = router