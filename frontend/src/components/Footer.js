import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

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
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">
        <div className="row">
          {/* Navigation Links */}
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/products" className="text-white text-decoration-none">Products</Link></li>
              <li><Link to="/cart" className="text-white text-decoration-none">Cart</Link></li>
              <li><Link to="/myorder" className="text-white text-decoration-none">My Orders</Link></li>
              <li><Link to="/register" className="text-white text-decoration-none">Register</Link></li>
            </ul>
          </div>

          {/* Subscription Form */}
          <div className="col-md-4 mb-3">
            <h5>Subscribe to Our Newsletter</h5>
            <form onSubmit={handleSubscribe} className="d-flex flex-column align-items-center">
              <input 
                type="email" 
                className="form-control w-75 mb-2" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
            </form>
            {message && <p className="mt-2 text-warning">{message}</p>}
          </div>

          {/* Social Media Links */}
          <div className="col-md-4 mb-3">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="text-white fs-4"><FaFacebook /></a>
              <a href="#" className="text-white fs-4"><FaTwitter /></a>
              <a href="#" className="text-white fs-4"><FaInstagram /></a>
              <a href="#" className="text-white fs-4"><FaYoutube /></a>
            </div>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="mb-0">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
