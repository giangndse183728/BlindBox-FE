import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
//Layout
import ButtonAppBar from '../layouts/Navbar';
//Login
import Login from '../pages/Login/Login';
import ForgotPassword from '../pages/Login/ForgotPassword';
import AuthCallback from '../pages/Login/AuthCallBack';
//General
import Home from '../pages/Homepage/Homepage';
import Collectionpage from '../pages/Collectionpage/CollectionPage';
import Detailpage from '../pages/Detailpage/Detailpage';
import NotFoundPage from '../pages/Error404/NotFoundPage';
//Admin
import Dashboard from '../pages/Admin/Dashboard';
//User
import CustomPage from '../pages/Custom/CustomPage';

import ProfilePage from '../pages/ProfilePage/ProfilePage';
//Seller
import SubscriptionPage from '../pages/SubscriptionPage/SubscriptionPage';

import CartPage from '../pages/Shoppingcart/CartPage';
import Tradingpage from '../pages/Tradingpage/Trandingpage';



const Layout = ({ children, showHeader = true }) => {
  return (
    <div>
      {showHeader && <ButtonAppBar />}
      {children}
    </div>
  );
};



export const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },

  {
    path: '/login',
    element: (
      <Layout showHeader={false} >
        <Login />
      </Layout>
    ),
  },
  {
    path: '/login/reset-password',
    element: (
      <Layout showHeader={false}>
        <ForgotPassword />
      </Layout>
    ),
  },

  {
    path: '/login/oauth',
    element: (
      <AuthCallback />
    ),
  },

  {
    path: '/dashboard',
    element: (
      <Layout showHeader={true} >
        <ProtectedRoute requiredRole={0}>
          <Dashboard />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/custom-accessories',
    element: (
      <Layout showHeader={true} >
        <ProtectedRoute requiredRole={1}>
          <CustomPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/Collection-page',
    element: (
      <Layout showHeader={true}>
        <Collectionpage />
      </Layout>
    ),
  },
  {
    path: '/product/:id',
    element: (
      <Layout showHeader={true}>
        <Detailpage />
      </Layout>
    ),
  },
  {
    path: '/cart',
    element: (
      <Layout showHeader={true}>
        <CartPage />
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout showHeader={false} >
        <NotFoundPage />
      </Layout>
    ),
  },
  {
    path: "/profile",
    element: (
      <Layout showHeader={true} >
        <ProfilePage />
      </Layout>
    ),
  },
  {
    path: "/subscription",
    element: (
      <Layout showHeader={true} >
        <SubscriptionPage />
      </Layout>
    ),
  },
  {
    path: "/trading",
    element: (
      <Layout showHeader={true} >
        <Tradingpage />
      </Layout>
    ),
  },
]);
