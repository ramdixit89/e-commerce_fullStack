import React, { useEffect, useState } from 'react';
const REACT_BASE_URL =  process.env.REACT_APP_BASE_URL;
const Orders = () => {
  const [orders, setOrders] = useState([]);

  const handleOrders = async () => {
    try {
      const response = await fetch(`${REACT_BASE_URL}/api/cart`, {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
        console.log(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  useEffect(() => {
    handleOrders();
  }, []);

  return (
    <div className='container mt-4'>
      <h1 className='text-center'>All orders</h1>
      <div className='table-responsive'>
        <table className='table table-bordered table-hover text-center'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'>S. No.</th>
              <th scope='col'>Order ID</th>
              <th scope='col'>User ID</th>
              <th scope='col'>Product ID</th>
              <th scope='col'>Product Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Total Price</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order.user_Id}</td>
                  <td>{order.product_Id._id}</td>
                  <td>{order.product_Id.productName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.product_Id.productPrice * order.quantity}</td>
                  <td>
                    <button className='btn btn-sm btn-success'>Confirm</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='8' className='text-center'>No Orders Available</td>
              </tr>
            )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
