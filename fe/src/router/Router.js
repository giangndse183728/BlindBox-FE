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
import AccessoryDetailPage from '../pages/Detailpage/AccessoryDetailPage';
//Admin
import Dashboard from '../pages/Admin/dashboard/Dashboard';
import ManageUsers from '../pages/Admin/dashboard/pages/ManageUsers';
import ManagePosts from '../pages/Admin/dashboard/pages/ManagePosts';
//User
import CustomPage from '../pages/Custom/CustomPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import OrderSuccessScreen from '../pages/Shoppingcart/OrderSuccessScreen';
import ManageMyOrders from '../pages/Buyer/ManageMyOrders';
//Seller
import SubscriptionPage from '../pages/SubscriptionPage/SubscriptionPage';
import CartPage from '../pages/Shoppingcart/CartPage';
import Tradingpage from '../pages/Tradingpage/Trandingpage';
import OrdersPage from '../pages/MyOrders/MyordersPage';
import ManageProduct from '../pages/Seller/ManageProduct';


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
      <Layout showHeader={false}>
        <ProtectedRoute requiredRoles={[0]}>
          <Dashboard />
        </ProtectedRoute>
      </Layout>
    ),
    children: [
      {
        index: true,
        element: null
      },
      {
        path: 'users',
        element: <ManageUsers />
      },
      {
        path: 'posts',
        element: <ManagePosts />
      },
   
    ],
  },


  {
    path: '/custom-accessories',
    element: (
      <Layout showHeader={true}>
        <ProtectedRoute requiredRoles={[1]}>
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
    path: '/product/:slug',
    element: (
      <Layout showHeader={true}>
        <Detailpage />
      </Layout>
    ),
  },

  {
    path: 'product/accessory/:slug',
    element: (
      <Layout showHeader={true}>
        <AccessoryDetailPage />
      </Layout>
    ),
  },

  {
    path: '/cart',
    element: (
      <Layout showHeader={false}>
        <ProtectedRoute requiredRoles={[1]}>
          <CartPage />
        </ProtectedRoute>
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
        <ProtectedRoute requiredRoles={[0, 1]}>
          <ProfilePage />
        </ProtectedRoute>
      </Layout>
    ),
  },


  {
    path: "/subscription",
    element: (
      <Layout showHeader={true} >
        <ProtectedRoute requiredRoles={[1]}>
          <SubscriptionPage />
        </ProtectedRoute>
      </Layout>
    ),
  },


  {
    path: "/trading",
    element: (
      <Layout showHeader={true} >
        <ProtectedRoute requiredRoles={[1]}>
          <Tradingpage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/order",
    element: (
      <Layout showHeader={true} >
        <OrdersPage />
      </Layout>
    ),
  },
  {
    path: "/order-success",
    element: (
      <Layout showHeader={false} >
        <OrderSuccessScreen />
      </Layout>
    ),
  },
  {
    path: "/sales",
    element: (
      <Layout showHeader={true}  >
        <ProtectedRoute requiredRoles={[1]} requireSeller={true}>
          <ManageProduct />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: "/my-orders",
    element: (
      <Layout showHeader={true}  >
        <ProtectedRoute requiredRoles={[1]} requireSeller={false}>
          <ManageMyOrders />
        </ProtectedRoute>
      </Layout>
    ),
  },
]);
