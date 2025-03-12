import React from 'react'
import Header from './Header'
import { CartProvider } from '../contextAPI/cartContext';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <CartProvider>
        <Header />
        {
          children
        }
        <Footer/>
      </CartProvider>
    </>
  )
}

export default Layout;