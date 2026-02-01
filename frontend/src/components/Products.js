import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiEye, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { CartContext } from '../contextAPI/cartContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchCartItems } = useContext(CartContext);

  useEffect(() => {
    allProducts();
    fetchCategories();
  }, []);

  const allProducts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/products`);
        if (!response.ok) {
            setError("Failed to load products. Please try again later.");
            return;
        }
        const data = await response.json();
        setProducts(data);
    } catch (e) {
        setError("Unable to connect to the server.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/category/all`); // Fixed path to /category/all
      if (response.ok) {
        const data = await response.json();
        // Extract names if data is array of objects
        setCategories(data.map(c => c.name));
      }
    } catch (e) {
      console.log("No categories found");
    }
  };

  const addToCart = async (product_Id) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!token || !userId) {
        toast.warn("Please login to add items to cart");
        navigate('/');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/add_cart/${product_Id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ user_Id: userId }),
        });
        
        if (response.ok) {
            toast.success("Product added to cart!");
            fetchCartItems(); // Update badge count
        } else {
            const errorData = await response.json();
            toast.error(errorData.message || "Failed to add product");
        }
    } catch (error) {
        toast.error("Something went wrong");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category?.name === selectedCategory;
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const viewDetail = (product_Id) => {
    navigate(`/products/${product_Id}`);
  };

  return (
    <div className='container py-5'>
      {/* Hero Section */}
      <div className='row mb-5 align-items-center animate-fade-in'>
        <div className='col-lg-6'>
          <h1 className='display-4 fw-bold mb-3'>Discover Our <span className='gradient-text'>Premium</span> Collection</h1>
          <p className='text-muted fs-5 mb-4'>Explore the latest trends in technology and lifestyle. Curated just for you with premium quality and style.</p>
          <div className='d-flex gap-3'>
            <div className='position-relative flex-grow-1' style={{ maxWidth: '400px' }}>
              <FiSearch className='position-absolute top-50 translate-middle-y ms-3 text-muted' />
              <input 
                type='text' 
                placeholder='Search products...' 
                className='form-control form-control-premium ps-5'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <button className='btn btn-premium btn-premium-primary px-4'>Search</button> */}
          </div>
        </div>
        <div className='col-lg-6 d-none d-lg-block text-end'>
           {/* You can add a premium illustration/image here later */}
        </div>
      </div>

      {/* Filter Section */}
      <div className='d-flex justify-content-between align-items-center mb-5'>
        <div className='d-flex align-items-center gap-3 overflow-auto pb-2' style={{ whiteSpace: 'nowrap' }}>
          <button 
            className={`btn-premium ${selectedCategory === 'all' ? 'btn-premium-primary shadow' : 'bg-white border text-muted'}`}
            onClick={() => setSelectedCategory('all')}
            style={{ borderRadius: '12px', padding: '10px 20px' }}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`btn-premium ${selectedCategory === cat ? 'btn-premium-primary shadow' : 'bg-white border text-muted'}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ borderRadius: '12px', padding: '10px 20px' }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className='text-muted small fw-bold d-none d-md-block'>
           {filteredProducts.length} Products Found
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger rounded-4 p-4 text-center border-0 shadow-sm mb-5">
           <p className="mb-0 fw-bold">{error}</p>
        </div>
      )}

      <div className='row g-4'>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <motion.div 
              className='col-xl-3 col-lg-4 col-sm-6' 
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className='premium-card h-100 border-0 shadow-sm'>
                <div className='position-relative overflow-hidden' style={{ height: '240px', backgroundColor: '#fdfdfd' }}>
                  <img 
                    src={`${product.productImage}`} 
                    alt={product.productName} 
                    className='card-img-top h-100 w-100' 
                    style={{ objectFit: 'contain', padding: '20px', transition: 'transform 0.5s ease' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  <div className='position-absolute top-0 end-0 m-3'>
                    <span className='badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill fw-bold'>
                      ${product.productPrice}
                    </span>
                  </div>
                </div>
                <div className='card-body p-4'>
                  <div className='mb-2'>
                    <span className='text-primary small fw-semibold uppercase tracking-wider'>{product.category?.name || 'Lifestyle'}</span>
                  </div>
                  <h5 className='fw-bold mb-2 text-truncate'>{product.productName}</h5>
                  <p className='text-muted small mb-4 line-clamp-2' style={{ height: '40px', overflow: 'hidden' }}>{product.productDesc}</p>
                  
                  <div className='d-flex gap-2 mt-auto'>
                    <button 
                      className='btn-premium btn-premium-primary flex-grow-1 py-2 px-0' 
                      onClick={() => addToCart(product._id)}
                    >
                      <FiShoppingCart className='me-2' /> Add
                    </button>
                    <button 
                      className='btn bg-light text-dark px-3 rounded-3 border-0' 
                      onClick={() => viewDetail(product._id)}
                    >
                      <FiEye size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className='col-12 py-5 text-center'>
            <div className='mb-3'>📦</div>
            <p className='text-muted fs-5'>No products available matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
