import React, { useState } from 'react';
const REACT_BASE_URL =  process.env.REACT_APP_BASE_URL;
const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    productDesc: '',
    productPrice: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('productName', formData.productName);
    submitData.append('productDesc', formData.productDesc);
    submitData.append('productPrice', formData.productPrice);

    if (image) {
        console.log("Selected Image:", image); // ✅ Debugging log
        submitData.append('productImage', image);
    }

    try {
        const response = await fetch(`${REACT_BASE_URL}/api/addProduct`, {
            method: 'POST',
            body: submitData
        });

        if (!response.ok) {
            throw new Error('Failed to submit product');
        }

        const result = await response.json();
        console.log('Product added:', result);
    } catch (error) {
        console.error('Error:', error.message);
    }
};
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const submitData = new FormData();
  //   submitData.append('productName', formData.productName);
  //   submitData.append('productDesc', formData.productDesc);
  //   submitData.append('productPrice', formData.productPrice);
  //   if (image) {
  //     submitData.append('productImage', image);
  //   }

  //   try {
  //     const response = await fetch(`${REACT_BASE_URL}/api/addProduct`, {
  //       method: 'POST',
  //       body: submitData,
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to submit product');
  //     }

  //     const result = await response.json();
  //     console.log('Product added:', result);

  //     // Reset the form
  //     setFormData({
  //       productName: '',
  //       productDesc: '',
  //       productPrice: '',
  //     });
  //     setImage(null);
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }
  // };

  return (
    <div className="container">
      <h1 className="text-center">Add New Product</h1>
      <form onSubmit={handleSubmit} className="w-50 py-5">
        <label className="form-label">Product Name</label>
        <input
          className="form-control border-info"
          type="text"
          name="productName"
          placeholder="Enter product name"
          value={formData.productName}
          onChange={handleChange}
          required
        />

        <label className="form-label">Product Description</label>
        <textarea
          className="form-control border-info"
          name="productDesc"
          rows="3"
          placeholder="Enter product description"
          value={formData.productDesc}
          onChange={handleChange}
          required
        />

        <label className="form-label">Product Price</label>
        <input
          className="form-control border-info"
          type="number"
          name="productPrice"
          placeholder="Enter product price"
          value={formData.productPrice}
          onChange={handleChange}
          required
        />

        <label className="form-label">Product Image</label>
        <input
          className="form-control"
          type="file"
          name="productImage"
          accept="image/*"
          onChange={handleImage}
        />

        <button type="submit" className="btn btn-primary mt-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
