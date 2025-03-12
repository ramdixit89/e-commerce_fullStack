import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [update, setUpdates] = useState('');
  useEffect(() => {
    fetchProducts();
  },[]);;
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/products'); 
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const handleDelete = async (product_Id) => {
    try {
      await fetch(`http://localhost:8000/api/delete/${product_Id}`, { method: 'DELETE' }); 
      setProducts(products.filter(product => product.product_Id !== product_Id));
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  const handleUpdate = (product_Id) => {
    navigate(`/update/${product_Id}`);
  };
  return (
    <div className='container-fluid mt-4'>
      <h2 className='text-center'>Availabe Products</h2>
      <div className='row'>
        {products.map((product) => (
          <div key={product.id} className='col-md-4 col-sm-6 mb-4'>
            <div className='card h-100 shadow-sm'>
              <div className='card-body'>
                <img width={200} src={`http://localhost:8000/uploads/${product.productImage}`} alt="" />
                <h5 className='card-title'>{product.productName}</h5>
                <p className='card-text'>{product.productDesc}</p>
                <p className='card-text'>Price: ${product.productPrice}</p>
                <div className='d-flex justify-content-between'>
                  <button className='btn btn-warning' onClick={() => handleUpdate(product._id)}>Update</button>
                  <button className='btn btn-danger' onClick={() => handleDelete(product._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Products;
