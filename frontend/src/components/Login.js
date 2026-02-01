import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { CartContext } from '../contextAPI/cartContext';

const REACT_BASE_URL =  process.env.REACT_APP_BASE_URL;

const Login = () => {
  const { fetchCartItems } = useContext(CartContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/products");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${REACT_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        fetchCartItems();
        toast.success(data.message || 'Login Successfully');
        navigate('/products');
      } else {
        toast.error(data.message || 'Login Failed');
      }
    } catch (error) {
      toast.error('Something went wrong, please try again later.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='container-fluid d-flex justify-content-center align-items-center vh-100 overflow-hidden' style={{ background: 'radial-gradient(circle at top right, #f8fafc 0%, #e2e8f0 100%)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='premium-card p-5 glass-morphism shadow-lg border-0' 
        style={{ maxWidth: '450px', width: '100%', borderRadius: '32px' }}
      >
        <div className='text-center mb-5'>
          <h1 className='fw-bold mb-2 gradient-text' style={{ fontSize: '2.5rem' }}>Bazaar</h1>
          <p className='text-muted'>Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='form-label fw-semibold mb-2'>Username</label>
            <div className='position-relative'>
              <FiMail className='position-absolute top-50 translate-middle-y ms-3 text-muted' style={{ zIndex: 10 }} />
              <input
                type='text'
                placeholder='Enter your username'
                onChange={handleChange}
                value={formData.username}
                name='username'
                className='form-control form-control-premium ps-5'
                required
              />
            </div>
          </div>

          <div className='mb-4'>
            <label className='form-label fw-semibold mb-2'>Password</label>
            <div className='position-relative'>
              <FiLock className='position-absolute top-50 translate-middle-y ms-3 text-muted' style={{ zIndex: 10 }} />
              <input
                type='password'
                placeholder='••••••••'
                onChange={handleChange}
                value={formData.password}
                name='password'
                className='form-control form-control-premium ps-5'
                required
              />
            </div>
          </div>

          <div className='d-flex justify-content-between align-items-center mb-4'>
            <div className='form-check'>
              <input type='checkbox' className='form-check-input border-secondary' id='remember' />
              <label className='form-check-label small text-muted' htmlFor='remember'>Remember me</label>
            </div>
            <a href='#' className='small fw-bold text-primary text-decoration-none'>Forgot Password?</a>
          </div>

          <button type='submit' className='btn-premium btn-premium-primary w-100 mb-4 shadow'>
            Sign In <FiArrowRight className='ms-2' />
          </button>

          <p className='text-center text-muted mt-3 mb-0'>
            Don't have an account? <Link to='/register' className='text-primary fw-bold text-decoration-none'>Sign up for free</Link>
          </p>
        </form>
      </motion.div>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar
        theme='light'
      />
    </div>
  );
};

export default Login;