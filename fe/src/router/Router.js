import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';  
//Layout
import ButtonAppBar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
//Login
import Login from '../pages/Login/Login';
import ForgotPassword from '../pages/Login/ForgotPassword';
//General
import Home from '../pages/Homepage/Homepage';
import CollectionPage from '../pages/Collectionpage/CollectionPage'
//Admin
import Dashboard from '../pages/Admin/Dashboard';
//User
import CustomPage from '../pages/Custom/CustomPage';

const Layout = ({ children, showHeader = true}) => {
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
    path: '/Dashboard',
    element: (
      <Layout showHeader={true} >
        <ProtectedRoute requiredRole={0}>
          <Dashboard />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/Custom',
    element: (
      <Layout showHeader={true} >
        <ProtectedRoute requiredRole={1}>
          <CustomPage/>
        </ProtectedRoute>
      </Layout>
    ),
  },
  {       
    path: '/Collection-page',
    element: (
      <Layout showHeader={true} >
       <CollectionPage/>
      </Layout>
    ),
  },
]);
