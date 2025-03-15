const mongoose = require('mongoose');

// User schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const packageSchema = new mongoose.Schema({
    packegId :{
        type:Number,
        required:true
    },
    packageName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true,
    },
    Country:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    tourplaces:[
        {
          placeName:{
            type:String,
            required:true
         },
         placeDesc:{
            type:String,
            required:true
         },
         placeImagesss:{
            type:[String],
         },
         images:{
          type:[String],
         }
        }
    ],
    hotelName:{
        type:String,
        required:true
    },
    HotelFacil:{
        type:[String],
        required:true
    },
    hotelImages:{
        type:[String]
    },
    PhoneNumber:{
        type:Number,
        required:true
    },email:{
        type:String,
        required:true
    },createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
})

const admin = mongoose.model('admin', adminSchema);
const Package = mongoose.model('Package', packageSchema);
module.exports = { admin,Package};
