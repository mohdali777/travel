const express = require("express")
const router = express.Router();
const {islogin,sessionCheck} = require("../session/userSession");
const UserRoutes = require("../controllers/user")


// GetRoutes

router.get("/login",islogin,UserRoutes.login)
router.get("/signout",UserRoutes.signout)
router.get("/",UserRoutes.home)
router.get("/packageD/:id",UserRoutes.packageDeatails)
router.get("/profile",sessionCheck,UserRoutes.profile)
router.get("/checkout/:id",sessionCheck,UserRoutes.Checkout)
router.get("/bookings",sessionCheck,UserRoutes.GetBooking)

//PostRoutes
router.post("/signup", UserRoutes.signup)
router.post("/login",UserRoutes.loginPost)
router.post("/searchPlace",UserRoutes.SearchPlace)
router.post("/searchPlacesQery",UserRoutes.SearchPlaceQuary)
router.post("/wallet/add",sessionCheck,UserRoutes.WalletAddMoney)
router.post("/booking/:id",sessionCheck,UserRoutes.BookingPost)



module.exports = router


