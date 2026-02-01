const express = require('express');
const { createProduct, getAllProduct, deleteProduct, updateProduct, getProductById } = require('../controllers/productController');
const { createCart, getCartItem, removecart, decreaseQuantity, incrementQuantity, getCartById } = require('../controllers/cartController');
const { createOrder, getAllOrders, getOrderById, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');

router.post('/addProduct', verifyToken, createProduct); //Protected
router.get('/products', getAllProduct); 
router.get('/products/:id', getProductById);
router.delete('/delete/:product_Id', verifyToken, deleteProduct); //Protected
router.post('/add_cart/:product_Id', verifyToken, createCart); //Protected
router.get('/cart', verifyToken, getCartItem); 
router.delete('/remove/:cart_Id', verifyToken, removecart); 
router.post('/decreQuant/:cart_Id', verifyToken, decreaseQuantity); 
router.post('/increQuant/:cart_Id', verifyToken, incrementQuantity); 
router.post('/cancelOrder/:orderId', verifyToken, cancelOrder); 
router.get('/get_cart/:user_Id', verifyToken, getCartById); 
router.put('/update/:product_Id', verifyToken, updateProduct); //Protected
//order
router.post('/order/:user_Id', verifyToken, createOrder);
//get orders
router.get('/allOrders', verifyToken, getAllOrders);
router.get('/orderById/:user_Id', verifyToken, getOrderById);

//Update order status
router.post('/update_status/:orderId', verifyToken, updateOrderStatus);
module.exports = router;