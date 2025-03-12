import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const REACT_BASE_URL = 'http://localhost:8000';

const Login = () => {
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
      console.log(data);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
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
    <>
      <div className='container d-flex justify-content-center align-items-center vh-100'>
        <div className='card p-4 shadow' style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className='text-center fw-bold mb-3'>Welcome Back</h2>
          <p className='text-center text-muted'>Login to access your account and start shopping.</p>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label className='form-label'>Username</label>
              <input
                type='text'
                placeholder='Enter your username'
                onChange={handleChange}
                value={formData.username}
                name='username'
                className='form-control'
              />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Password</label>
              <input
                type='password'
                placeholder='Enter your password'
                onChange={handleChange}
                value={formData.password}
                name='password'
                className='form-control'
              />
            </div>
            <button type='submit' className='btn btn-primary w-100'>Login</button>
            <p className='text-center text-muted mt-3'>Don't have an account? <Link to='/register' className='text-primary'>Sign up</Link></p>
          </form>
        </div>
        <ToastContainer
          position='top-right'
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </div>
    </>
  );
};

export default Login;