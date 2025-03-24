import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_BASE_URL;
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;
const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        if (userId) {
            cartItems();
        }
    }, [userId]);
    const headers = {
        'Content-Type': 'application/json',
    };

    const cartItems = async () => {
        const response = await fetch(`${BASE_URL}/api/get_cart/${userId}`, { method: 'GET', headers });
        const data = await response.json();
        setCart(data);
    };

    const incrementQuant = async (product_Id) => {
        await fetch(`${BASE_URL}/api/add_cart/${product_Id}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ user_Id: userId }),
        });
        cartItems();
    };

    const removeCart = async (product_Id) => {
        await fetch(`${BASE_URL}/api/remove/${product_Id}`, { method: 'DELETE', headers });
        cartItems();
    };

    const decreaseCart = async (product_Id) => {
        await fetch(`${BASE_URL}/api/decreQuant/${product_Id}`, { method: 'POST', headers });
        cartItems();
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center fw-bold mb-4 text-primary">🛒 Your Shopping Cart</h2>
            {cart.length === 0 ? (
                <div className="text-center text-muted fs-5">Your cart is empty. Start adding products! 🛍</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover shadow-sm text-center align-middle">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={item.product_Id._id} className="bg-light">
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            width={80}
                                            height={80}
                                            className="rounded border"
                                            src={`${item.product_Id.productImage}`}
                                            alt="Product"
                                        />
                                    </td>
                                    <td className="fw-bold text-secondary">{item.product_Id.productName}</td>
                                    <td className="text-success fw-bold">$ {item.product_Id.productPrice}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-danger me-2" onClick={() => decreaseCart(item.product_Id._id)}>
                                            ➖
                                        </button>
                                        <span className="mx-2 fw-bold fs-5">{item.quantity}</span>
                                        <button className="btn btn-sm btn-outline-success ms-2" onClick={() => incrementQuant(item.product_Id._id)}>
                                            ➕
                                        </button>
                                    </td>
                                    <td className="fw-bold text-primary">${(item.quantity * item.product_Id.productPrice).toFixed(2)}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button className="btn btn-sm btn-danger px-3" onClick={() => removeCart(item._id)}>
                                                ❌ Remove
                                            </button>
                                            <button onClick={() => navigate(`/order/${item.product_Id._id}`)} className="btn btn-sm btn-warning px-3">
                                                🛒 Buy Now
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Cart;
