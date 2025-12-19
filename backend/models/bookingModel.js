
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
   user:{ type: mongoose.Schema.Types.ObjectId, 
    ref: "User", required: true
    },
    name:{ 
        type: String, 
        required: true
     },
     phone:{ 
        type: String, 
        required: true
     },
     numberOfPeople:{ 
        type: Number, 
        required: true
    },
    date:{ 
        type: String, 
        required: true
    },
    time:{ 
        type: String, 
        required: true
    },
    note:{
        type: String,
        default: ""
    },
    status:{
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    }

  },

  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema); 
module.exports = Booking;      