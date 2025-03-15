const {User,Wallet,Booking} = require("../model/usermode")
const {Package} = require("../model/adminModel")

const login = (req,res) => {
res.render("user/login")
}


const signout = (req,res)=>{
    req.session.destroy()
    res.redirect("/login")
}

const home = async(req,res)=>{
    let pack = await Package.find({})
    res.render("user/home",{pack})
}

const signup =  async (req,res)=>{
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

}

const loginPost = async (req,res)=>{
const {email,password} = req.body
const existing = await User.findOne({email:email})
if(!existing){
    return res.status(400).json({success:false,message:"user not found"})
}
if(existing.password !== password){
    return res.status(401).json({ success: false, message: "Password doesn't match" });
}

req.session.user = true;
req.session.userId = existing._id;
return res.status(200).json({success:true,message:"user Logged in Successfuly",redirect:"/"})

}



const packageDeatails = async (req,res)=>{
    const {id} = req.params;
    let place = await Package.findById(id)
    res.render("user/packageD",{place})
}

const SearchPlace =  async (req, res) => {
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
}

const SearchPlaceQuary = async (req,res) => {
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
}


const profile = async (req,res)=>{
   
   const userId = req.session.userId;
   if (!userId) {
    return res.status(401).send('Unauthorized');
  }
   let wallet = await Wallet.findOne({userId})
   if(!wallet){
    wallet = new Wallet({
        userId: userId,
        balance: 0.0,   
        transactions: []  
      })
   }
   console.log(wallet);
   const user = await User.findById(userId)
    res.render("user/profile",{wallet,user})
}


const WalletAddMoney = async (req, res) => {
    try {
      let { amount } = req.body;
      console.log(req.body);
      
      amount = parseFloat(amount)
      const userId = req.session.userId;  
      if (!userId) {
        return res.status(401).json({success:false,message:"Unauthorized"});
      }  
      if (!amount || typeof amount !== "number" || amount <= 0) {
        return res.status(400).send("Invalid amount");
      }  
      let wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        wallet = new Wallet({
          userId,
          balance: 0,
          transactions: [],
        });
      }  
      wallet.balance += amount;
      wallet.transactions.push({
        amount,
        transactionType: "credit",
        description: "Wallet top-up",
      });
  
      await wallet.save();
      return res.status(200).json({success:true, message: "Amount added successfully"})
    } catch (error) {
      console.error("Error adding to wallet:", error);
      return res.status(500).send("Internal Server Error");
    }
  }


  const Checkout = async (req,res)=>{
    const {id} = req.params
    console.log(id);
    const package = await Package.findById(id)
    res.render("user/checkout",{package})
  }

 const BookingPost =  async (req, res) => {
    try {
      const packageId = req.params.id;
      const { name, phone, email, NoPeoples, date, method, amount } = req.body;
      const userId = req.session.userId;
  
      if (!userId) {
        return res.status(401).json({ success:false,message: "Unauthorized: User not authenticated" });
      }
      
      const totalAmount = parseFloat(amount);
      const numberOfPersons = parseInt(NoPeoples);
      const packageExists = await Package.findById(packageId);
      if (!packageExists) {
        return res.status(404).json({ success:false,message: "Package not found." });
      }
  
     if(method === "card"||method=="upi"){
        return res.status(404).json({ success:false,message: "method Not available" });
     }
     if(method == "wallet"){
        let wallet = await Wallet.findOne({userId})
        if(!wallet){
            return res.status(404).json({ success:false,message: "Wallet Not Found." });
        } 
        if(wallet.balance<amount){
            return res.status(402).json({
                success: false,
                message: "Insufficient balance.",
              });
        }
        wallet.balance-=amount;
        wallet.transactions.push({
            amount,
            transactionType: "debit",
            description: "Booking",
          });
          await wallet.save()
     }
       

      const newBooking = new Booking({
        userId,
        packageId,
        address: {
          name: name,
          phone: phone,
          email: email,
        },
        paymentMethod: method,
        totalAmount,
        travelDate: new Date(date),
        numberOfPersons,
        status: "Pending",
      });
  
      await newBooking.save();
  
      res.status(201).json({ success:true,message: "Booking successful!", redirectUrl:"/bookings"});
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

const GetBooking = async (req,res)=>{
  const userId = req.session.userId
  const bookings = await Booking.find({userId}).populate('packageId') 
    res.render("user/Bookings",{bookings})
}



module.exports = {
    login,
    signout,
    home,
    signup,
    loginPost,
    packageDeatails,
    SearchPlace,
    SearchPlaceQuary,
    profile,
    WalletAddMoney,
    Checkout,
    BookingPost,
    GetBooking
}