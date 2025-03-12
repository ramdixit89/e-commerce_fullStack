const express = require('express');
const { createProduct, getAllProduct, deleteProduct, updateProduct, getProductById } = require('../controllers/productController');
const { createCart, getCartItem, removecart, decreaseQuantity, getCartById } = require('../controllers/cartController');
const { createOrder, getAllOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();

router.post('/addProduct', createProduct); //Create product
router.get('/products', getAllProduct); //get all products
router.get('/products/:id', getProductById);
router.delete('/delete/:product_Id', deleteProduct); //Delete products
router.post('/add_cart/:product_Id', createCart); //Create carts
router.get('/cart', getCartItem); //get all carts 
router.delete('/remove/:product_Id', removecart); //remove cart items
router.post('/decreQuant/:product_Id', decreaseQuantity); // decrease quantity
//by id
router.get('/get_cart/:user_Id', getCartById); //get cart by ID
router.put('/update/:product_Id', updateProduct); //update product
//order
router.post('/order/:user_Id', createOrder);
//get orders
router.get('/allOrders', getAllOrders);
router.get('/orderById/:user_Id', getOrderById);

//Update order status
router.post('/update_status/:orderId', updateOrderStatus);
module.exports = router;