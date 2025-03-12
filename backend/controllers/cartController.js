const Cart = require('../models/addToCart');
const Product = require('../models/addProduct');
const createCart = async (req, res) => {
    try {
        const { product_Id } = req.params;
        const { user_Id } = req.body;
        const quantity = 1;
        if (!product_Id) {
            return res.status(400).json({ message: "Product ID and quantity are required" });
        }
        const product = await Product.findById(product_Id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const cartItem = await Cart.findOne({ user_Id });
        if (cartItem) {
            cartItem.quantity += quantity;
            await cartItem.save();
            return res.status(200).json({ message: "Quantity updated successfully" });
        }
        const newCart = new Cart({
            user_Id,
            product_Id,
            quantity
        });
        await newCart.save();
        res.status(201).json({ message: "Product added to cart successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
//Decrease
const decreaseQuantity = async (req, res) => {
    try {
        const { product_Id } = req.params;
        if (!product_Id) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const cartItem = await Cart.findOne({ product_Id });
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
            return res.status(200).json({ message: "Quantity decreased successfully", cartItem });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//get cart by ID
const getCartById = async (req, res) => {
    try {
        const { user_Id } = req.params;
        // console.log(user_Id);
        const cartItems = await Cart.find({ user_Id }).populate('product_Id');
        // console.log(cartItems);
        res.status(200).json(cartItems);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
//get cart items 
const getCartItem = async (req, res) => {
    try {
        const cartItems = await Cart.find().populate('product_Id');
        res.status(200).json(cartItems);
    } catch (
    error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//Remove cart
const removecart = async (req, res) => {
    try {
        const { product_Id } = req.params
        await Cart.findByIdAndDelete(product_Id);
        res.status(200).json({ message: "Product removed from cart successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { createCart, getCartItem, removecart, decreaseQuantity, getCartById };