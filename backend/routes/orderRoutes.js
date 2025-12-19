
    const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controller/orderController');
    const router = express.Router();

    router.post("/place",protect,placeOrder)

    router.get("/my-orders",protect,getUserOrders)

    router.get("/orders",adminOnly,getAllOrders)

    router.put("/update-status/:orderId",adminOnly,updateOrderStatus)   






    module.exports = router;
   