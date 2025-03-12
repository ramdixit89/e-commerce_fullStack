import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <>
    <nav>
      <ul className='list-group'>
      <li className='list-group-item'>
          <Link className='text-decoration-none' to='/add_product'>Add product</Link>
        </li>
        <li className='list-group-item'>
          <Link className='text-decoration-none' to='/admin_products'>Products</Link>
        </li>
        <li className='list-group-item'>
          <Link className='text-decoration-none' to='/allOrders'>Orders</Link>
        </li>
        <li className='list-group-item'>
          <Link className='text-decoration-none' to='/users'>Users</Link>
        </li>
      </ul>
    </nav>
    </>
  );
};

export default Sidebar;
