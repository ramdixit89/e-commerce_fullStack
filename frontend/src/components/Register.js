import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const REACT_BASE_URL =  process.env.REACT_APP_BASE_URL;

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${REACT_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message || 'Registration Successful');
                setTimeout(() =>{
                    navigate('/');
                },2000)
            } else {
                toast.error(data.message || 'Registration Failed');
            }
        } catch (error) {
            toast.error('Something went wrong, please try again later.');
        }
        setFormData({
            username: '',
            email: '',
            password: '',
        });
    };

    return (
        <div className='container-fluid d-flex justify-content-center align-items-center vh-100 overflow-hidden' style={{ background: 'radial-gradient(circle at bottom left, #f8fafc 0%, #e2e8f0 100%)' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='premium-card p-5 glass-morphism shadow-lg border-0' 
                style={{ maxWidth: '480px', width: '100%', borderRadius: '32px' }}
            >
                <div className='text-center mb-4'>
                    <h2 className='fw-bold mb-2 gradient-text'>Create Account</h2>
                    <p className='text-muted small'>Join our community of shoppers today.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label className='form-label fw-semibold small mb-1'>Username</label>
                        <div className='position-relative'>
                            <FiUser className='position-absolute top-50 translate-middle-y ms-3 text-muted' />
                            <input
                                name='username'
                                value={formData.username}
                                type='text'
                                className='form-control form-control-premium ps-5'
                                placeholder='johndoe'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='mb-3'>
                        <label className='form-label fw-semibold small mb-1'>Email Address</label>
                        <div className='position-relative'>
                            <FiMail className='position-absolute top-50 translate-middle-y ms-3 text-muted' />
                            <input
                                name='email'
                                value={formData.email}
                                type='email'
                                className='form-control form-control-premium ps-5'
                                placeholder='name@example.com'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='form-label fw-semibold small mb-1'>Password</label>
                        <div className='position-relative'>
                            <FiLock className='position-absolute top-50 translate-middle-y ms-3 text-muted' />
                            <input
                                name='password'
                                value={formData.password}
                                type='password'
                                className='form-control form-control-premium ps-5'
                                placeholder='••••••••'
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type='submit' className='btn-premium btn-premium-primary w-100 mb-3 shadow'>
                        Register Now <FiArrowRight className='ms-2' />
                    </button>

                    <p className='text-center text-muted small mt-3 mb-0'>
                        Already have an account? <Link to='/' className='text-primary fw-bold text-decoration-none'>Log in</Link>
                    </p>
                </form>
            </motion.div>
            <ToastContainer
                position='top-right'
                autoClose={1500}
                hideProgressBar
                theme='light'
            />
        </div>
    );
};

export default Register;
