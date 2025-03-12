import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Products from './components/Products'
import AdminProducts from './components/Admin/Products';
import Cart from './components/Cart'
import Login from './components/Login'
import Register from './components/Register'
import WithoutLayout from './components/WithoutLayout'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PageNotFound from './components/PageNotFound'
import AdminLogin from './components/Admin/Login';
import AdminLayout from './components/Admin/AdminLayout'
import Dashboard from './components/Admin/Dashboard'
import Users from './components/Admin/Users'
import Orders from './components/Admin/Orders';
import AddProduct from './components/Admin/AddProduct';
import Update from './components/Admin/Update';
import Description from './components/Description';
import OrderForm from './components/OrderForm';
import AdminOrders from './components/Admin/AdminOrders';
import MyOrder from './components/MyOrder';


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path='/admin'
            element={
              <AdminLogin />
            }
          />
          <Route
            path='/dashboard'
            element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            }
          />
          <Route
            path='/users'
            element={
              <AdminLayout>
                <Users />
              </AdminLayout>
            }
          />
          <Route
            path='/admin_products'
            element={
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            }
          />
          {/* <Route
            path='/allOrders'
            element={
              <AdminLayout>
                <Orders />
              </AdminLayout>
            }
          /> */}
             <Route
            path='/allOrders'
            element={
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            }
          />
          <Route
            path='/add_product'
            element={
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            }
          />
          <Route
            path="/update/:id"
            element={
              <AdminLayout>
                <Update />
              </AdminLayout>
            }
          />
          <Route
            path='/'
            element={
              <WithoutLayout>
                <Login />
              </WithoutLayout>
            }
          />
          <Route
            path='/register'
            element={
              <WithoutLayout>
                <Register />
              </WithoutLayout>
            }
          />
          <Route
            path='/cart'
            element={
              <ProtectedRoute>
                <Layout>
                  <Cart />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path='/products'
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />
            <Route
            path='/myorder'
            element={
              <ProtectedRoute>
                <Layout>
                  <MyOrder />
                </Layout>
              </ProtectedRoute>
            }
          />
            <Route
            path='/order/:id'
            element={
              <ProtectedRoute>
                <Layout>
                  <OrderForm />
                </Layout>
              </ProtectedRoute>
            }
          />
           <Route
            path='/products/:id'
            element={
              <ProtectedRoute>
                <Layout>
                  <Description/>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App