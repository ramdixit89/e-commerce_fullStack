import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { FiMail, FiSend } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setMessage("Thank you for subscribing!");
      setEmail("");
    } else {
      setMessage("Please enter a valid email.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <footer className="bg-white border-top py-5 mt-5">
      <div className="container">
        <div className="row g-5">
          {/* Brand and About */}
          <div className="col-lg-4 mb-3">
             <h4 className="fw-bold fs-4 mb-3 gradient-text">GrandBazaar</h4>
             <p className="text-muted small lh-lg">
                Your ultimate destination for premium products. We bring you the best selection of technology, lifestyle, and fashion items curated with excellence.
             </p>
             <div className="d-flex gap-3 mt-4">
              <a href="#" className="text-muted hover-primary fs-5"><FaFacebook /></a>
              <a href="#" className="text-muted hover-primary fs-5"><FaTwitter /></a>
              <a href="#" className="text-muted hover-primary fs-5"><FaInstagram /></a>
              <a href="#" className="text-muted hover-primary fs-5"><FaYoutube /></a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-lg-2 col-md-4 mb-3">
            <h6 className="fw-bold mb-4 uppercase tracking-wider small">Shop</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/products" className="text-muted text-decoration-none small hover-link">All Products</Link></li>
              <li><Link to="/cart" className="text-muted text-decoration-none small hover-link">My Cart</Link></li>
              <li><Link to="/myorder" className="text-muted text-decoration-none small hover-link">Order Status</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none small hover-link">Member Sign Up</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-3">
            <h6 className="fw-bold mb-4 uppercase tracking-wider small">Help</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="#" className="text-muted text-decoration-none small hover-link">Contact Us</Link></li>
              <li><Link to="#" className="text-muted text-decoration-none small hover-link">Shipping & Delivery</Link></li>
              <li><Link to="#" className="text-muted text-decoration-none small hover-link">Returns Policy</Link></li>
              <li><Link to="#" className="text-muted text-decoration-none small hover-link">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Subscription Form */}
          <div className="col-lg-4 col-md-4 mb-3">
            <h6 className="fw-bold mb-4 uppercase tracking-wider small">Newsletter</h6>
            <p className="text-muted small mb-4">Be the first to know about new arrivals and exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="position-relative">
              <input 
                type="email" 
                className="form-control form-control-premium w-100 pe-5" 
                placeholder="Your email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary position-absolute end-0 top-0 h-100 rounded-end px-3 border-0">
                <FiSend />
              </button>
            </form>
            {message && <p className="mt-2 text-success small">{message}</p>}
          </div>
        </div>
        
        <hr className="my-5 border-muted" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="mb-0 text-muted small">&copy; {new Date().getFullYear()} GrandBazaar. Built with excellence.</p>
          <div className="d-flex gap-4">
             <span className="text-muted small text-decoration-none cursor-pointer">Privacy Policy</span>
             <span className="text-muted small text-decoration-none cursor-pointer">Cooke Policy</span>
          </div>
        </div>
      </div>
      <style>{`
        .hover-primary:hover { color: var(--primary) !important; transition: 0.3s; }
        .hover-link:hover { color: var(--primary) !important; padding-left: 5px; transition: 0.3s; }
      `}</style>
    </footer>
  );
};

export default Footer;
