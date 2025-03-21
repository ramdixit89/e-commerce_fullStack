import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;

const Description = () => {
    const [product, setProduct] = useState({});
    const { id } = useParams();

    useEffect(() => {
        handleDescription();
    }, [id]);

    const handleDescription = async () => {
        const response = await fetch(`${BASE_URL}/api/products/${id}`);
        const data = await response.json();
        setProduct(data.product);
    };

    const addToCart = async () => {
        const userId = localStorage.getItem('userId');
        await fetch(`${BASE_URL}/api/add_cart/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_Id: userId }),
        });
    };

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Product Description</h3>
            <div className="card shadow-lg p-4">
                <div className="row align-items-center">
                    {/* Product Image */}
                    <div className="col-lg-6 text-center">
                        <img
                            src={`${IMAGE_URL}${product.productImage}`}
                            className="img-fluid rounded shadow"
                            style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
                            alt={product.productName}
                        />
                    </div>
                    {/* Product Details */}
                    <div className="col-lg-6">
                        <h2 className="fw-bold">{product.productName}</h2>
                        <p className="text-muted text-justify">{product.productDesc}</p>
                        <h4 className="text-primary fw-bold">${product.productPrice}</h4>
                        <button onClick={addToCart} className="btn btn-warning btn-lg mt-3 shadow">
                            <i className="fas fa-cart-plus me-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Description;
