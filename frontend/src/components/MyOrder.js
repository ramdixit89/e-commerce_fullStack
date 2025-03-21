import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

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
      const response = await fetch(`${BASE_URL}/api/orderById/${userId}`);
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
        headers: { "Content-Type": "application/json" },
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

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Processing":
        return "primary";
      case "Shipped":
        return "info";
      case "Delivered":
        return "success";
      case "Canceled":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary fw-bold">🛒 My Orders</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-muted fs-5">No orders found 📦</p>
      ) : (
        <div className="row justify-content-center">
          {orders.map((order) => (
            <div key={order._id} className="col-lg-6 col-md-8 mb-4">
              <div className="card shadow border-0 rounded-3 p-3">
                <div className="card-body">
                  <h5 className="fw-bold text-dark">Order ID: <span className="text-primary">{order._id}</span></h5>
                  
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="mb-0">
                      <strong>Status:</strong> 
                      <span className={`badge bg-${getStatusVariant(order.status)} ms-2`}>{order.status}</span>
                    </p>
                    <p className="mb-0"><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                  </div>
                  
                  <p className="mt-2">
                    <strong>Payment:</strong> 
                    <span className={`badge bg-${order.payment.status === "Paid" ? "success" : "danger"} ms-2`}>
                      {order.payment.status}
                    </span>
                  </p>

                  <h6 className="mt-3 text-muted">🛍 Products:</h6>
                  <div className="border rounded-3 p-2 bg-light">
                    {order.products.map((product, index) => (
                      <div key={product.product_id} className={`p-2 ${index !== order.products.length - 1 ? "border-bottom" : ""}`}>
                        <strong className="text-dark">{product.name}</strong>
                        <span className="text-muted"> ({product.quantity} pcs)</span>
                        <span className="float-end text-danger fw-bold">${product.total_amount}</span>
                      </div>
                    ))}
                  </div>

                  {order.status !== "Delivered" && order.status !== "Canceled" && (
                    <div className="mt-3 text-end">
                      <button onClick={() => cancelOrder(order._id)} className="btn btn-sm btn-danger">
                        ❌ Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
