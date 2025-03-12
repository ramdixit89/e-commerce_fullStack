import React, { useContext, useEffect } from "react";
import { CartContext } from "../contextAPI/cartContext";
import { Link, useNavigate } from "react-router-dom";

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
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold fs-4 text-primary" to="/products">
        GrandBazaar
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link text-muted" to="/register">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-muted" to="/">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="btn btn-outline-primary position-relative">
                Cart
                {cartQuantity > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartQuantity}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/myorder" className="btn btn-outline-primary position-relative">
                My order
              </Link>
            </li>
            <li className="nav-item">
              <button onClick={Logout} className="btn btn-danger">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
