const Booking = require("../models/bookingModel");

const createBooking=async (req, res) => {
    try {
    const {id}=req.user;
    const {name,phone,numberOfPeople,date,time,note}=req.body;
    if(!name || !phone || !numberOfPeople || !date || !time){
        return res.status(400).json({message:"All fields are required except note"});
    } 
    const existingBooking=await Booking.findOne({date,time,status:{$ne:"cancelled"},});

    if(existingBooking){
        return res.status(400).json({message:"You already have a booking at this date and time"});
    }
    const booking=await Booking.create({
        user:id,
        name,
        phone,
        numberOfPeople,
        date,
        time,
        note,
    });
    return res.status(201).json({message:"Booking created successfully",booking});

    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({message:"Internal server error"});
    }       
};



const getUserBookings=async (req,res)=>{
    try {
        const {id}=req.user;
        const bookings=await Booking.find({user:id}).sort({createdAt:-1});

        return res.status(200).json({bookings});
    }
    catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}


const getAllBookings=async (req,res)=>{
    try {
        const bookings=await Booking.find().populate("user","name email").sort({createdAt:-1});

        return res.status(200).json({bookings,success:true});
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}




const updateBookingStatus=async (req,res)=>{        
    try {
        const {bookingId}=req.params;
        const {status}=req.body;

       const booking=await Booking.findById(bookingId);
       if(!booking){
        return res.status(404).json({message:"Booking not found"});
       }
         booking.status=status;

         await booking.save();

         return res.status(200).json({message:"Booking status updated successfully",booking});      
    } catch (error) {
        console.error("Error updating booking status:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}



module.exports=
{
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus


};