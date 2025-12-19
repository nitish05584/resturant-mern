
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    address:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        default: "Cash on Delivery"
      },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;