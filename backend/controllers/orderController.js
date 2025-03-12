const Order = require('../models/orderModel');
const Cart = require('../models/addToCart');
const createOrder = async (req, res) => {
    try {
        const { user_Id } = req.params; 
        const { customer_details, billing_address, shipping_address, payment } = req.body;
        if (!customer_details || !customer_details.name || !customer_details.email || !customer_details.phone) {
            return res.status(400).json({ message: "Customer details are required" });
        }
        if (!payment || !payment.method) {
            return res.status(400).json({ message: "Payment method is required" });
        }
        const cartItems = await Cart.find({ user_Id }).populate('product_Id');
        if (!cartItems.length) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const products = cartItems.map(cartItem => {
            if (!cartItem.product_Id || !cartItem.product_Id.productName) {
                throw new Error("Invalid product data in cart");
            }
            return {
                product_id: cartItem.product_Id._id,
                name: cartItem.product_Id.productName,
                quantity: cartItem.quantity,
                total_amount: cartItem.quantity * cartItem.product_Id.productPrice
            };
        });
        // Create new order
        const newOrder = new Order({
            user_Id,
            customer_details,
            billing_address: billing_address || {}, 
            shipping_address: shipping_address || {}, 
            payment: {
                method: payment.method,
                status: payment.status || "Unpaid" 
            },
            products
        });
        const savedOrder = await newOrder.save();
        await Cart.deleteMany({ user_Id });
        res.status(201).json({ message: "Order placed successfully", order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//get orders
const getAllOrders = async(req, res) =>{
   try {
    const orders = await Order.find();
    // console.log(orders);
    res.status(200).json({
        status: 'success',
        message: 'All orders fetched!',
        orders: orders
    })
   } catch (error) {
    console.log(error);
    res.status(400).json({ message : 'Error in server!' })
   }
};
//getOrder by userID
const getOrderById = async(req, res) =>{
   try {
    const { user_Id } = req.params;
    const orderById = await Order.find({user_Id});
    res.status(200).json({ 
        status: 'Success',
        order : orderById 
    });
   } catch (error) {
    console.log('Error : ', error);
   }
}
// Update order & payment status (Admin Only)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Order status is required" });
        }

        let paymentStatus = "";

        switch (status) {
            case "Pending":
            case "Processing":
            case "Shipped":
                paymentStatus = "Unpaid"; 
                break;
            case "Delivered":
                paymentStatus = "Paid";  
                break;
            case "Canceled":
                paymentStatus = "Refunded";  
                break;
            default:
                return res.status(400).json({ message: "Invalid order status" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status, "payment.status": paymentStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status & payment status updated successfully",
            order: updatedOrder,
        });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createOrder, getAllOrders, getAllOrders, getOrderById, updateOrderStatus };

