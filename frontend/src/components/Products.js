import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    allProducts();
    fetchCategories();
  }, []);

  const allProducts = async () => {
    const response = await fetch(`${BASE_URL}/api/products`);
    const data = await response.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const response = await fetch(`${BASE_URL}/categories`);
    const data = await response.json();
    setCategories(data);
  };

  const addToCart = async (product_Id) => {
    const userId = localStorage.getItem('userId');
    const response = await fetch(`${BASE_URL}/api/add_cart/${product_Id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_Id: userId }),
    });
    const data = await response.json();
    console.log(data);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const viewDetail = (product_Id) => {
    navigate(`/products/${product_Id}`);
  };

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h4 className='fw-bold'>Shop Our Latest Products</h4>
        {/* <select 
          className='form-select w-auto' 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value='all'>All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select> */}
      </div>
      <div className='row'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className='col-lg-3 col-md-4 col-sm-6 mb-4' key={product._id}>
              <div className='card shadow-sm border-0 rounded h-100'>
                <img 
                  src={`${IMAGE_URL}/${product.productImage}`} 
                  alt={product.productName} 
                  className='card-img-top img-fluid p-2' 
                  style={{ objectFit: 'cover', height: '160px' }}
                />
                <div className='card-body text-center'>
                  <h6 className='fw-bold'>{product.productName}</h6>
                  <p className='text-muted small mb-1'>${product.productPrice}</p>
                  <p className='text-truncate small'>{product.productDesc}</p>
                  <div className='d-grid gap-2 mt-2'>
                    <button className='btn btn-sm btn-outline-primary' onClick={() => addToCart(product._id)}>Add to Cart</button>
                    <button className='btn btn-sm btn-primary' onClick={() => viewDetail(product._id)}>View Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center'>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
