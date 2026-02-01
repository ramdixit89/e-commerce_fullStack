import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiPackage, FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiTruck } from "react-icons/fi";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/orderById/${userId}`, {
        headers: {
            'Authorization': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      
      if (response.ok && data.status === "Success") {
        setOrders(Array.isArray(data.order) ? data.order : [data.order]);
      } else {
        toast.error(data.message || "Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      toast.error("Error fetching orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cancelOrder/${orderId}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token')
        },
      });

      const data = await response.json();
      if (response.ok && data.status === "Success") {
        toast.success("Order cancelled successfully!");
        fetchOrders();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Error cancelling order");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <FiClock className="me-2" />;
      case "Processing": return <FiPackage className="me-2" />;
      case "Shipped": return <FiTruck className="me-2" />;
      case "Delivered": return <FiCheckCircle className="me-2" />;
      case "Canceled": return <FiXCircle className="me-2" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f59e0b";
      case "Processing": return "#6366f1";
      case "Shipped": return "#06b6d4";
      case "Delivered": return "#10b981";
      case "Canceled": return "#ef4444";
      default: return "#64748b";
    }
  };

  return (
    <div className="container py-5 mt-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold mb-2">Track Your <span className="gradient-text">Orders</span></h2>
        <p className="text-muted">Stay updated with your latest purchases and delivery status.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5 glass-morphism rounded-4">
          <FiPackage size={48} className="text-muted mb-3" />
          <h4 className="fw-bold">No orders found</h4>
          <p className="text-muted">You haven't placed any orders yet.</p>
        </motion.div>
      ) : (
        <div className="row g-4 justify-content-center">
          {orders.map((order, index) => (
            <motion.div 
                key={order._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="col-lg-8"
            >
              <div className="premium-card border-0 shadow-sm overflow-hidden">
                <div className="p-4 bg-light border-bottom d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small fw-bold uppercase">Order ID</span>
                    <h6 className="fw-bold mb-0 text-primary">#{order._id.slice(-8).toUpperCase()}</h6>
                  </div>
                  <div className="text-end">
                    <span className="text-muted small fw-bold uppercase d-block">Order Date</span>
                    <span className="fw-semibold small"><FiCalendar className="me-1" /> {new Date(order.order_date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="row align-items-center mb-4">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center mb-2">
                            <div className="p-2 rounded-circle me-2" style={{ backgroundColor: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}>
                                {getStatusIcon(order.status)}
                            </div>
                            <h5 className="fw-bold mb-0" style={{ color: getStatusColor(order.status) }}>{order.status}</h5>
                        </div>
                        <p className="text-muted small mb-0 ms-4 ps-2">Your order is currently {order.status.toLowerCase()}.</p>
                    </div>
                    <div className="col-md-6 text-md-end mt-3 mt-md-0">
                        <span className={`badge-premium px-3 py-2 ${order.payment.status === "Paid" ? "bg-success text-white" : "bg-warning text-dark"}`}>
                            Payment: {order.payment.status}
                        </span>
                    </div>
                  </div>

                  <div className="bg-light rounded-4 p-3 mb-4">
                    <h6 className="fw-bold mb-3 small uppercase text-muted tracking-wider">Items in this order</h6>
                    {order.products.map((product, idx) => (
                      <div key={idx} className={`d-flex justify-content-between align-items-center py-2 ${idx !== order.products.length - 1 ? "border-bottom" : ""}`}>
                        <div className="d-flex align-items-center">
                            <span className="fw-bold me-3 text-primary">{product.quantity}x</span>
                            <span className="fw-semibold">{product.name}</span>
                        </div>
                        <span className="fw-bold">${product.total_amount}</span>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between border-top mt-3 pt-3">
                        <h6 className="fw-bold mb-0">Total Amount Paid</h6>
                        <h5 className="fw-bold gradient-text mb-0">${order.products.reduce((acc, p) => acc + p.total_amount, 0).toFixed(2)}</h5>
                    </div>
                  </div>

                  {order.status !== "Delivered" && order.status !== "Canceled" && (
                    <div className="text-end">
                      <button onClick={() => cancelOrder(order._id)} className="btn btn-outline-danger btn-sm border-0 fw-bold">
                        <FiXCircle className="me-1" /> Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
