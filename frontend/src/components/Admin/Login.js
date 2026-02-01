import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShield, FiUser, FiLock, FiLogIn } from "react-icons/fi";

const REACT_BASE_URL =  process.env.REACT_APP_BASE_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${REACT_BASE_URL}/admin/login_admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", formData.username);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card p-5 glass-morphism border-0 shadow-lg" 
        style={{ width: "420px", background: 'rgba(255, 255, 255, 0.05)', color: 'white' }}
      >
        <div className="text-center mb-4">
          <div className="bg-primary d-inline-block p-3 rounded-circle mb-3 shadow">
            <FiShield size={32} className="text-white" />
          </div>
          <h3 className="fw-bold mb-1">Admin Portal</h3>
          <p className="text-secondary small">Restricted Access Area</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small text-secondary">Admin Username</label>
            <div className="position-relative">
              <FiUser className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ zIndex: 1 }} />
              <input
                type="text"
                className="form-control form-control-premium bg-dark border-secondary text-white ps-5"
                placeholder="Manager ID"
                name="username"
                onChange={handleChange}
                value={formData.username}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label small text-secondary">Secure Password</label>
            <div className="position-relative">
              <FiLock className="position-absolute top-50 translate-middle-y ms-3 text-secondary" style={{ zIndex: 1 }} />
              <input
                type="password"
                className="form-control form-control-premium bg-dark border-secondary text-white ps-5"
                placeholder="••••••••"
                name="password"
                onChange={handleChange}
                value={formData.password}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-premium btn-premium-primary w-100 py-3 shadow-lg">
            Authorize <FiLogIn className="ms-2" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};
export default Login;
