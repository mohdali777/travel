const express = require("express")
const router = express.Router();
const upload = require("../helpers/multer")
const {islogin,sessionCheck} = require("../session/adminsession")
const AdminRoutes = require("../controllers/admin")


//GetRoutes

router.get("/login",islogin,AdminRoutes.Login)
router.get("/adminhome",sessionCheck,AdminRoutes.AdminHome)
router.get("/Details",sessionCheck,AdminRoutes.Packages)
router.get("/addDetails",sessionCheck,AdminRoutes.AddPackagesGet)


//Postroutes

router.post("/addDeatails", upload.fields([
    { name: 'hotelImages', maxCount: 10 }, 
    { name: 'placeImages', maxCount: 10 }, 
  ]),AdminRoutes.AddDeatailsPost)
router.post("/login", AdminRoutes.PostLogin)


module.exports = router