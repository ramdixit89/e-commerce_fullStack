import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const REACT_BASE_URL =  `${process.env.REACT_APP_BASE_URL}/`;
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
            const response = await fetch(`https://grand-bazar.onrender.com/auth/register`, {
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
        <div className='container d-flex justify-content-center align-items-center vh-100'>
            <div className='card p-4 shadow' style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className='text-center fw-bold mb-3'>Create an Account</h2>
                <p className='text-center text-muted'>Join us to start shopping and explore amazing products.</p>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label className='form-label'>Username</label>
                        <input
                            name='username'
                            value={formData.username}
                            type='text'
                            className='form-control'
                            placeholder='Enter username'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>Email</label>
                        <input
                            name='email'
                            value={formData.email}
                            type='email'
                            className='form-control'
                            placeholder='Enter email'
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label'>Password</label>
                        <input
                            name='password'
                            value={formData.password}
                            type='password'
                            className='form-control'
                            placeholder='Enter password'
                            onChange={handleChange}
                        />
                    </div>
                    <button type='submit' className='btn btn-primary w-100'>Register</button>
                    <p className='text-center text-muted mt-3'>Already have an account? <Link to='/' className='text-primary'>Login</Link></p>
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
    );
};

export default Register;
