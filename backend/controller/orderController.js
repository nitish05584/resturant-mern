const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const placeOrder=async(req,res)=>{
    try {
        const { id } = req.user;
        const {address} = req.body;
        if(!address){
            return  res.status(400).json({ message: 'Address is required to place an order.',success:false });
        }
        const cart=await Cart.findOne({user:id}).populate('items.menuItem');
        if(!cart || cart.items.length===0){
            return res.status(400).json({ message: 'Your cart is empty.',success:false });
        }
        let totalAmount=cart.items.reduce((sum,item)=>sum + (item.menuItem.price * item.quantity),0);
        const newOrder=await Order.create({
            user:id,
            items:cart.items.map((i)=>({
                menuItem:i.menuItem._id,
                quantity:i.quantity 

            })),
            totalAmount,
            address,
        })
            cart.items=[],
            await cart.save();

            res.status(201).json({ message: 'Order placed successfully.', order: newOrder,success:true });
    } catch (error) {
        console.error('Error placing order:', error);
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
        const orders=await Order.find().populate('items.menuItem').populate('user').sort({createdAt:-1});
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

        
