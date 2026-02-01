import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiCreditCard, FiUser, FiMapPin, FiPhone, FiMail, FiCheckCircle } from "react-icons/fi";
import { CartContext } from "../contextAPI/cartContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;
const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { fetchCartItems } = useContext(CartContext);

  const [formData, setFormData] = useState({
    customer_details: { name: "", email: "", phone: "" },
    billing_address: { street: "", city: "", state: "", zip: "", country: "" },
    shipping_address: { street: "", city: "", state: "", zip: "", country: "" },
    payment: { method: "" },
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
        setUserId(storedUserId);
        fetchProduct(storedUserId);
    } else {
        toast.error("User not found. Please log in.");
        navigate('/');
    }
  }, []);

  const fetchProduct = async (currentUserId) => {
    const uId = currentUserId || userId;
    if (!uId) return;
    try {
      if (id) {
        // Single product checkout (Buy Now)
        const response = await fetch(`${BASE_URL}/api/products/${id}`);
        const data = await response.json();
        if (response.ok) {
          setProduct({
            items: [{
                name: data.product.productName,
                image: data.product.productImage,
                price: data.product.productPrice,
                quantity: 1
            }],
            total: data.product.productPrice
          });
        }
      } else {
        // Cart checkout
        const response = await fetch(`${BASE_URL}/api/get_cart/${uId}`, {
            headers: { 'Authorization': localStorage.getItem('token') }
        });
        const data = await response.json();
        if (response.ok) {
            const total = data.reduce((acc, item) => acc + (item.quantity * item.product_Id.productPrice), 0);
            setProduct({
                items: data.map(item => ({
                    name: item.product_Id.productName,
                    image: item.product_Id.productImage,
                    price: item.product_Id.productPrice,
                    quantity: item.quantity
                })),
                total: total.toFixed(2)
            });
        }
      }
    } catch (error) {
      toast.error("Error loading order details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, section, field) => {
    setFormData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: e.target.value,
        },
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("User ID not found. Please log in.");

    try {
      const response = await fetch(`${BASE_URL}/api/order/${userId}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token')
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Order Placed Successfully!");
        fetchCartItems();
        navigate("/myorder");
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getSectionIcon = (section) => {
      switch(section) {
          case 'customer_details': return <FiUser size={18} />;
          case 'billing_address': return <FiMapPin size={18} />;
          case 'shipping_address': return <FiMapPin size={18} />;
          case 'payment': return <FiCreditCard size={18} />;
          default: return null;
      }
  }

  return (
    <div className="container py-5 mt-4">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-5">
          {/* Order Summary Sidebar */}
          <div className="col-lg-4 order-lg-2">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card p-4 glass-morphism sticky-top" style={{ top: '100px' }}
            >
                <h5 className="fw-bold mb-4">You're buying</h5>
                <div className="mb-4">
                    {product.items?.map((item, idx) => (
                        <div key={idx} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                            <img
                                className="rounded-3 shadow-sm bg-white p-2"
                                src={`${item.image}`}
                                alt={item.name}
                                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                            />
                            <div className="flex-grow-1 overflow-hidden">
                                <h6 className="fw-bold mb-0 text-truncate small">{item.name}</h6>
                                <p className="text-muted small mb-0">{item.quantity} x ${item.price}</p>
                            </div>
                        </div>
                    ))}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <span className="text-muted fw-bold small uppercase">Total Payment</span>
                        <h4 className="fw-bold gradient-text mb-0">${product.total}</h4>
                    </div>
                </div>
                <hr className="my-4 border-muted" />
                <div className="d-flex align-items-center gap-3 text-muted small">
                    <FiCheckCircle className="text-success" />
                    <span>Instant order confirmation</span>
                </div>
            </motion.div>
          </div>

          {/* Checkout Form */}
          <div className="col-lg-8 order-lg-1">
            <h2 className="fw-bold mb-5">Secure <span className="gradient-text">Checkout</span></h2>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {Object.entries(formData).map(([section, fields], sIdx) => (
                  <motion.div 
                    key={section} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sIdx * 0.1 }}
                    className="col-12"
                  >
                    <div className="premium-card p-4 border-0 shadow-sm">
                        <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                            {getSectionIcon(section)}
                            <h5 className="fw-bold mb-0 uppercase tracking-wider small">
                                {section.replace("_", " ")}
                            </h5>
                        </div>
                        
                        <div className="row g-3">
                            {Object.keys(fields).map((field) =>
                            field === "method" && section === "payment" ? (
                                <div key={field} className="col-12">
                                    <select
                                        className="form-select form-control-premium"
                                        value={formData.payment.method}
                                        onChange={(e) => handleChange(e, "payment", "method")}
                                        required
                                    >
                                        <option value="">Select Payment Method</option>
                                        <option value="Credit Card">💳 Credit Card</option>
                                        <option value="PayPal">💲 PayPal</option>
                                        <option value="COD">🏠 Cash on Delivery</option>
                                    </select>
                                </div>
                            ) : (
                                <div key={field} className={section.includes('details') ? 'col-md-4' : 'col-md-6'}>
                                    <input
                                        type="text"
                                        className="form-control form-control-premium text-capitalize"
                                        placeholder={field.replace("_", " ")}
                                        value={formData[section][field]}
                                        onChange={(e) => handleChange(e, section, field)}
                                        required
                                    />
                                </div>
                            )
                            )}
                        </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5">
                <button type="submit" className="btn-premium btn-premium-primary w-100 py-3 shadow">
                  Confirm and Pay Now
                </button>
                <div className="text-center mt-3 text-muted small">
                    By clicking "Confirm and Pay Now", you agree to our Terms & Conditions.
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
