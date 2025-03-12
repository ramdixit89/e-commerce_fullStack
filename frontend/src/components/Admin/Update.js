import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Update = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    productName: "",
    productDesc: "",
    productPrice: "",
    productImage: null, // Image file
  });

  useEffect(() => {
    fetchProductDetails();
  }, [id]); // Depend on id to re-fetch when it changes

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`);
      const data = await response.json();
      
      if (data) { // Ensure data exists before updating state
        setProduct({
          productName: data.product.productName || "",
          productDesc: data.product.productDesc || "",
          productPrice: data.product.productPrice || "",
          productImage: data.product.productImage || null, // Handle empty image
        });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, productImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productName", product.productName);
      formData.append("productDesc", product.productDesc);
      formData.append("productPrice", product.productPrice);
      if (product.productImage instanceof File) {
        formData.append("productImage", product.productImage); // Only append new file
      }
      await fetch(`http://localhost:8000/api/update/${id}`, {
        method: "PUT",
        body: formData,
      });
      navigate("/admin_products"); // Redirect to products page
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="text-center">Update Product</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="productName"
            className="form-control"
            value={product.productName}
            onChange={handleChange}
          
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="productDesc"
            className="form-control"
            value={product.productDesc}
            onChange={handleChange}
          
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            name="productPrice"
            className="form-control"
            value={product.productPrice}
            onChange={handleChange}
         
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          {product.productImage && !(product.productImage instanceof File) && (
            <div className="mb-2">
              <img
                src={`http://localhost:8000/uploads/${product.productImage}`}
                alt="Product"
                className="img-fluid rounded"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
          <input
            type="file"
            name="productImage"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-success">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default Update;
