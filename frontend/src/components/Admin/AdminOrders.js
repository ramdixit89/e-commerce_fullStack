import React, { useState, useEffect } from "react";
import { Table, Container, Alert, Spinner, Badge, Form } from "react-bootstrap";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/allOrders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/update_status/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus, payment: { ...order.payment, status: updatedOrder.order.payment.status } }
            : order
        )
      );
    } catch (err) {
      alert("Error updating order status");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">All Orders</h2>
      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Billing Address</th>
              <th>Shipping Address</th>
              <th>Payment Method</th>
              <th>Order Status</th>
              <th>Payment Status</th>
              <th>Products</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id || index}>
                  <td>{index + 1}</td>
                  <td>{order.customer_details?.name || "N/A"}</td>
                  <td>{order.customer_details?.email || "N/A"}</td>
                  <td>{order.customer_details?.phone || "N/A"}</td>
                  <td>{`${order.billing_address?.street || ""}, ${order.billing_address?.city || ""}, ${order.billing_address?.state || ""}, ${order.billing_address?.zip || ""}, ${order.billing_address?.country || ""}`}</td>
                  <td>{`${order.shipping_address?.street || ""}, ${order.shipping_address?.city || ""}, ${order.shipping_address?.state || ""}, ${order.shipping_address?.zip || ""}, ${order.shipping_address?.country || ""}`}</td>
                  <td>{order.payment?.method || "N/A"}</td>
                  <td>
                    <Badge bg={getStatusVariant(order.status)}>{order.status}</Badge>
                  </td>
                  <td>
                    <Badge bg={getStatusVariant(order.payment?.status)}>{order.payment?.status}</Badge>
                  </td>
                  <td>
                    <ul>
                      {order.products.map((item, idx) => (
                        <li key={idx}>
                          {item.name} - {item.quantity} pcs - ${item.total_amount}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <Form.Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Canceled">Canceled</option>
                    </Form.Select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminOrders;
