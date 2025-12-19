
const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createBooking, getUserBookings, getAllBookings, updateBookingStatus } = require("../controller/bookingController");

const router = express.Router();


router.post("/create",protect,createBooking)

router.get("/my-bookings",protect,getUserBookings)

router.get("/bookings",protect,adminOnly,getAllBookings)


router.put("/update-status",protect,adminOnly,updateBookingStatus)






module.exports = router;