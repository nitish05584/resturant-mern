const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Menu = require("../models/menuModel");
const mongoose = require("mongoose");

const placeOrder=async(req,res)=>{
    try {
        const { id } = req.user || {};
        const {address, paymentMethod, items} = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(401).json({ message: 'Please login with a valid user account to place order.', success: false });
        }

        if(!address){
            return  res.status(400).json({ message: 'Address is required to place an order.',success:false });
        }

        let orderItems = [];
        let totalAmount = 0;

        if (Array.isArray(items) && items.length > 0) {
            const menuIds = items
                .map((item) => item?.menuItem)
                .filter((menuId) => mongoose.Types.ObjectId.isValid(menuId));

            if (menuIds.length === 0) {
                return res.status(400).json({ message: 'No valid menu items were provided.', success: false });
            }

            const menus = await Menu.find({ _id: { $in: menuIds } });
            const menuMap = new Map(menus.map((menu) => [menu._id.toString(), menu]));

            for (const item of items) {
                const menu = menuMap.get(String(item.menuItem));
                const quantity = Number(item.quantity);

                if (!menu || !quantity || quantity <= 0) {
                    continue;
                }

                orderItems.push({
                    menuItem: menu._id,
                    quantity,
                });

                totalAmount += menu.price * quantity;
            }
        } else {
            const cart=await Cart.findOne({user:id}).populate('items.menuItem');
            if(!cart || cart.items.length===0){
                return res.status(400).json({ message: 'Your cart is empty.',success:false });
            }

            orderItems = cart.items.map((item) => ({
                menuItem: item.menuItem._id,
                quantity: item.quantity,
            }));

            totalAmount = cart.items.reduce((sum,item)=>sum + (item.menuItem.price * item.quantity),0);

            cart.items=[];
            await cart.save();
        }

        if (orderItems.length === 0) {
            return res.status(400).json({ message: 'No valid items found to place order.', success: false });
        }

        const newOrder=await Order.create({
            user:id,
            items: orderItems,
            totalAmount,
            address,
            paymentMethod: paymentMethod || 'Cash on Delivery',
        })

            res.status(201).json({ message: 'Order placed successfully.', order: newOrder,success:true });
    } catch (error) {
        console.error('Error placing order:', error);

        if (error?.name === 'CastError' || error?.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid order payload.', success: false });
        }

        res.status(500).json({ message: 'Internal server error',success:false });
    }
}



const getUserOrders=async(req,res)=>{ 

 try {
    const { id } = req.user;
    const orders=await Order.find({user:id}).populate('items.menuItem').sort({createdAt:-1});

    res.status(200).json({orders,success:true});
 }  catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error',success:false });
 }
}

const getAllOrders=async(req,res)=>{
    try {
        const orders=await Order.find().populate('items.menuItem').populate('user','name email').sort({createdAt:-1});
        res.status(200).json({orders,success:true});
    }   catch (error) { 
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Internal server error',success:false });
    }
}

const updateOrderStatus=async(req,res)=>{
    try {
        const { orderId } = req.params;
        const { status } = req.body;    
        const order=await Order.findById(orderId);
        if(!order){
            return res.status(404).json({ message: 'Order not found',success:false });
        }
        order.status=status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order,success:true });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Internal server error',success:false });
    }
}




module.exports=
{
    placeOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus    

};

        
