import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;
const OrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    customer_details: { name: "", email: "", phone: "" },
    billing_address: { street: "", city: "", state: "", zip: "", country: "" },
    shipping_address: { street: "", city: "", state: "", zip: "", country: "" },
    payment: { method: "" },
  });

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`);
      const data = await response.json();
      if (response.ok) {
        setProduct(data.product);
      } else {
        toast.error("Failed to load product");
      }
    } catch (error) {
      toast.error("Error fetching product");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Order placed successfully!");
        navigate("/cart");
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="card p-3 mb-4 shadow-sm text-center">
            <img
              width={250}
              className="img-fluid rounded mx-auto"
              src={`${product.productImage}`}
              alt="Product"
            />
            <h4 className="fw-bold mt-3">{product.productName}</h4>
            <h5 className="text-danger">${product.productPrice}</h5>
          </div>

          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">🛒 Place Your Order</h2>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {Object.entries(formData).map(([section, fields]) => (
                  <div key={section} className="col-md-6">
                    <h5 className="fw-bold text-primary">
                      {section.replace("_", " ").toUpperCase()}
                    </h5>
                    {Object.keys(fields).map((field) =>
                      field === "method" && section === "payment" ? (
                        <select
                          key={field}
                          className="form-select mb-2"
                          value={formData.payment.method}
                          onChange={(e) => handleChange(e, "payment", "method")}
                          required
                        >
                          <option value="">Select Payment Method</option>
                          <option value="Credit Card">💳 Credit Card</option>
                          <option value="PayPal">💲 PayPal</option>
                          <option value="COD">🏠 Cash on Delivery</option>
                        </select>
                      ) : (
                        <input
                          key={field}
                          type="text"
                          className="form-control mb-2"
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          value={formData[section][field]}
                          onChange={(e) => handleChange(e, section, field)}
                          required
                        />
                      )
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-success px-4">
                  <i className="bi bi-cart-check"></i> Place Order
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderForm;
