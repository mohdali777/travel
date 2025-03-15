const mongoose = require('mongoose');

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone:{
  type:String,
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


const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  transactions: [
    {
      amount: Number,
      transactionType: {
        type: String,
        enum: ['credit', 'debit'],
        required: true,
      },
      description: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    address: {
      name: { type: String, required: true },
      phone: { type: Number, required: true },
      email: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "Debit Card", "PayPal", "UPI", "Bank Transfer","wallet"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0, // Ensure the amount is non-negative
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now, // Automatically set the date when booking is created
    },
    travelDate: {
      type: Date,
      required: true,
    },
    numberOfPersons: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
const Wallet = mongoose.model('Wallet', walletSchema);
const User = mongoose.model('User', userSchema);
module.exports = { User,Wallet,Booking};


