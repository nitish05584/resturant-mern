const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const { addToCart, getCart, removeFromCart } = require('../controller/cartController');

const router = express.Router();

router.post("/add",protect,addToCart)

router.get("/get",protect,getCart)

router.delete("/remove",protect,removeFromCart)








module.exports = router;