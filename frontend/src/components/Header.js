import React, { useContext, useEffect } from "react";
import { CartContext } from "../contextAPI/cartContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiShoppingBag, FiUser, FiLogOut } from "react-icons/fi";

const Header = () => {
  const { cartQuantity, fetchCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-premium sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/products">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
             <FiShoppingBag size={24} />
          </div>
          <span className="fw-bold fs-4 gradient-text">GrandBazaar</span>
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <Link className="nav-link nav-link-premium" to="/register">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-premium" to="/">
                Login
              </Link>
            </li>
            <li className="nav-item ms-lg-2">
              <Link to="/cart" className="nav-link nav-link-premium d-flex align-items-center gap-2 position-relative">
                <FiShoppingCart size={20} />
                <span>Cart</span>
                {cartQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartQuantity}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/myorder" className="nav-link nav-link-premium d-flex align-items-center gap-2">
                <FiUser size={20} />
                <span>My Orders</span>
              </Link>
            </li>
            <li className="nav-item ms-lg-3">
              <button onClick={Logout} className="btn-premium btn-premium-primary py-2 px-4 d-flex align-items-center gap-2 shadow-sm">
                <FiLogOut />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
