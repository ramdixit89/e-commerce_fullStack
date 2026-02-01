import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiArrowLeft, FiShield, FiTruck, FiRefreshCw, FiPlus, FiMinus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { CartContext } from '../contextAPI/cartContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Description = () => {
    const [product, setProduct] = useState({});
    const [selectedVariants, setSelectedVariants] = useState({});
    const [qty, setQty] = useState(1);
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchCartItems } = useContext(CartContext);

    useEffect(() => {
        handleDescription();
    }, [id]);

    const handleDescription = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/products/${id}`);
            const data = await response.json();
            setProduct(data.product);
            
            // Initialize variants
            const initialVars = {};
            if (data.product.variantGlobals) {
                data.product.variantGlobals.forEach(v => {
                    initialVars[v.name] = v.options[0];
                });
            }
            setSelectedVariants(initialVars);
        } catch (e) {
            console.error("Failed to fetch product details");
        }
    };

    const handleVariantChange = (name, value) => {
        setSelectedVariants({ ...selectedVariants, [name]: value });
    };

    const addToCart = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`${BASE_URL}/api/add_cart/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ 
                    user_Id: userId,
                    variants: selectedVariants,
                    quantity: qty
                }),
            });
            if (response.ok) {
                toast.success("Added to cart successfully!");
                fetchCartItems();
            }
        } catch (e) {
            toast.error("Failed to add to cart");
        }
    };

    return (
        <div className="container py-5 mt-4">
             <button onClick={() => navigate(-1)} className="btn bg-white shadow-sm rounded-circle p-2 border-0 mb-4">
                <FiArrowLeft size={20} />
            </button>

            <div className="row g-5 align-items-center">
                {/* Product Image Gallery */}
                <div className="col-lg-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="premium-card p-4 border-0 shadow-sm bg-white d-flex align-items-center justify-content-center"
                        style={{ minHeight: '500px' }}
                    >
                        <img
                            src={`${product.productImage}`}
                            className="img-fluid"
                            style={{ maxHeight: '450px', objectFit: 'contain' }}
                            alt={product.productName}
                        />
                    </motion.div>
                </div>

                {/* Product Info */}
                <div className="col-lg-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="badge-premium bg-primary text-white mb-3 d-inline-block px-3 py-2">
                           Premium Product
                        </span>
                        <h1 className="display-5 fw-bold mb-3">{product.productName}</h1>
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <h2 className="text-primary fw-bold mb-0">${product.productPrice}</h2>
                            <span className="text-muted text-decoration-line-through small ms-2">${(product.productPrice * 1.2).toFixed(2)}</span>
                            <span className="text-success small fw-bold ms-2">20% OFF</span>
                        </div>

                        <p className="text-muted fs-5 mb-4 lh-lg">{product.productDesc}</p>

                        {/* Variants Selection */}
                        {product.variantGlobals?.map((v, i) => (
                            <div key={i} className="mb-4">
                                <h6 className="fw-bold small uppercase mb-3 text-muted">{v.name}</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {v.options.map((opt, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={() => handleVariantChange(v.name, opt)}
                                            className={`btn btn-sm px-4 py-2 rounded-pill border transition-all ${selectedVariants[v.name] === opt ? 'bg-primary text-white border-primary shadow' : 'bg-light text-muted border-transparent hover-border-primary'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <hr className="my-5 border-muted" />

                        <div className="row g-4 mb-5">
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light rounded-3 text-primary"><FiTruck size={24} /></div>
                                    <div>
                                        <h6 className="fw-bold mb-0 small">Free Shipping</h6>
                                        <p className="text-muted small mb-0">On orders over $50</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-light rounded-3 text-primary"><FiShield size={24} /></div>
                                    <div>
                                        <h6 className="fw-bold mb-0 small">Secure Payment</h6>
                                        <p className="text-muted small mb-0">100% Secure Transaction</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-4 mb-5">
                            <h6 className="fw-bold mb-0 text-muted small uppercase">Quantity</h6>
                            <div className="d-flex align-items-center gap-3 bg-light rounded-pill px-3 py-2 shadow-sm">
                                <button className="btn btn-link p-0 text-dark border-0" onClick={() => qty > 1 && setQty(qty-1)}>
                                    <FiMinus size={18} />
                                </button>
                                <span className="fw-bold fs-5" style={{ minWidth: '30px', textAlign: 'center' }}>{qty}</span>
                                <button className="btn btn-link p-0 text-dark border-0" onClick={() => setQty(qty+1)}>
                                    <FiPlus size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            <button onClick={addToCart} className="btn-premium btn-premium-primary flex-grow-1 py-3 shadow">
                                <FiShoppingCart className="me-2" /> Add to Cart
                            </button>
                            <button onClick={() => navigate(`/checkout/${id}`)} className="btn-premium btn-premium-secondary px-4 py-3 shadow">
                                Buy Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Description;
