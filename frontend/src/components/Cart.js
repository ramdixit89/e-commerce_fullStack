import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { CartContext } from '../contextAPI/cartContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const { fetchCartItems } = useContext(CartContext);

    useEffect(() => {
        if (userId) {
            cartItems();
        }
    }, [userId]);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token')
    };

    const cartItems = async () => {
        const response = await fetch(`${BASE_URL}/api/get_cart/${userId}`, { method: 'GET', headers });
        const data = await response.json();
        setCart(data);
    };

    const incrementQuant = async (cart_Id) => {
        await fetch(`${BASE_URL}/api/increQuant/${cart_Id}`, {
            method: 'POST',
            headers
        });
        cartItems();
        fetchCartItems();
    };

    const removeCart = async (cart_Id) => {
        await fetch(`${BASE_URL}/api/remove/${cart_Id}`, { method: 'DELETE', headers });
        cartItems();
        fetchCartItems();
    };

    const decreaseCart = async (cart_Id) => {
        await fetch(`${BASE_URL}/api/decreQuant/${cart_Id}`, { method: 'POST', headers });
        cartItems();
        fetchCartItems();
    };

    const calculateTotal = () => {
        return cart.reduce((acc, item) => acc + (item.quantity * item.product_Id.productPrice), 0).toFixed(2);
    };

    return (
        <div className="container py-5 mt-4">
            <div className="d-flex align-items-center mb-5 gap-3">
                <button onClick={() => navigate('/products')} className="btn bg-white shadow-sm rounded-circle p-2 border-0">
                    <FiArrowLeft size={20} />
                </button>
                <h2 className="fw-bold mb-0">Shopping <span className="gradient-text">Cart</span></h2>
            </div>
            
            {cart.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-5 glass-morphism rounded-4 shadow-sm"
                >
                    <div className="mb-4 text-muted" style={{ fontSize: '4rem' }}>🛒</div>
                    <h3 className="fw-bold">Your cart is empty</h3>
                    <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                    <button className="btn-premium btn-premium-primary px-5" onClick={() => navigate('/products')}>
                        Start Shopping
                    </button>
                </motion.div>
            ) : (
                <div className="row g-4">
                    {/* Items List */}
                    <div className="col-lg-8">
                        <div className="d-flex flex-column gap-3">
                            {cart.map((item, index) => (
                                <motion.div 
                                    key={item._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="premium-card p-3 border-0 shadow-sm d-flex align-items-center gap-4"
                                >
                                    <div className="bg-light rounded-4 overflow-hidden" style={{ width: '100px', height: '100px', minWidth: '100px' }}>
                                        <img
                                            className="w-100 h-100 p-2"
                                            src={`${item.product_Id.productImage}`}
                                            alt={item.product_Id.productName}
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between mb-1">
                                            <h6 className="fw-bold mb-0">{item.product_Id.productName}</h6>
                                            <button 
                                                className="btn text-danger p-0 border-0" 
                                                onClick={() => removeCart(item._id)}
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                        <p className="text-muted small mb-2">{item.product_Id.category || 'Lifestyle'}</p>
                                        
                                        {item.variants && Object.keys(item.variants).length > 0 && (
                                            <div className="d-flex flex-wrap gap-1 mb-2">
                                                {Object.entries(item.variants).map(([k, v]) => (
                                                    <span key={k} className="badge bg-light text-muted fw-normal" style={{ fontSize: '0.7rem' }}>{k}: {v}</span>
                                                ))}
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-3 bg-light rounded-3 px-2 py-1">
                                                <button className="btn btn-sm btn-link p-0 text-dark text-decoration-none" onClick={() => decreaseCart(item._id)}>
                                                    <FiMinus size={14} />
                                                </button>
                                                <span className="fw-bold">{item.quantity}</span>
                                                <button className="btn btn-sm btn-link p-0 text-dark text-decoration-none" onClick={() => incrementQuant(item._id)}>
                                                    <FiPlus size={14} />
                                                </button>
                                            </div>
                                            <h6 className="fw-bold mb-0">${(item.quantity * item.product_Id.productPrice).toFixed(2)}</h6>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div className="premium-card p-4 glass-morphism border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
                            <h5 className="fw-bold mb-4">Order Summary</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Subtotal</span>
                                <span className="fw-semibold">${calculateTotal()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-success">
                                <span className="">Shipping</span>
                                <span className="fw-semibold">FREE</span>
                            </div>
                            <hr className="my-4 border-muted" />
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="fw-bold">Total</h5>
                                <h5 className="fw-bold gradient-text">${calculateTotal()}</h5>
                            </div>
                            <button className="btn-premium btn-premium-primary w-100 py-3 mb-3 shadow" onClick={() => navigate('/checkout')}>
                                Checkout Now <FiCheckCircle className="ms-2" />
                            </button>
                            <p className="text-center text-muted small">Secure payment handled by Stripe</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
