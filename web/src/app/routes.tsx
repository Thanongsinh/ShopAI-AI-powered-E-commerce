import { createBrowserRouter, Navigate } from 'react-router';

import { Layout } from './Layout';
import { ProtectedRoute, RequireGuest } from '@/components/auth/ProtectedRoute';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import BuyerShell from './pages/buyer/BuyerShell';
import Profile from './pages/buyer/Profile';
import Orders from './pages/buyer/Orders';
import Wishlist from './pages/buyer/Wishlist';

import SellerShell from './pages/seller/SellerShell';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/Products';
import SellerOrders from './pages/seller/Orders';
import SellerAnalytics from './pages/seller/Analytics';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'search', Component: Search },
      { path: 'products/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: (
          <RequireGuest>
            <Login />
          </RequireGuest>
        ),
      },
      {
        path: 'register',
        element: (
          <RequireGuest>
            <Register />
          </RequireGuest>
        ),
      },

      {
        path: 'buyer',
        element: (
          <ProtectedRoute>
            <BuyerShell />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/buyer/profile" replace /> },
          { path: 'profile', Component: Profile },
          { path: 'orders', Component: Orders },
          { path: 'wishlist', Component: Wishlist },
        ],
      },

      {
        path: 'seller',
        element: (
          <ProtectedRoute>
            <SellerShell />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/seller/dashboard" replace /> },
          { path: 'dashboard', Component: SellerDashboard },
          { path: 'products', Component: SellerProducts },
          { path: 'orders', Component: SellerOrders },
          { path: 'analytics', Component: SellerAnalytics },
        ],
      },
    ],
  },
]);
