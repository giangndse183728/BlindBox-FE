

import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Home from '../pages/Homepage/Homepage';
import Dashboard from '../pages/Admin/Dashboard';
import ButtonAppBar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import ProtectedRoute from './ProtectedRoute';
import Collectionpage from '../pages/Collectionpage/Collectionpage';
import Detailpage from '../pages/Detailpage/Detailpage';
import NotFoundPage from '../pages/Error404/NotFoundPage';

const Layout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div>
      {showHeader && <ButtonAppBar />}
      {children}
      {showFooter && <Footer />}
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
    path: '/Login',
    element: (
      <Layout showHeader={false} showFooter={false}>
        <Login />
      </Layout>
    ),
  },

  {
    path: '/Dashboard',
    element: (
      <Layout showHeader={true} showFooter={false}>
        <ProtectedRoute requiredRole={0}>
          <Dashboard />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/Collection-page',
    element: (
      <Layout showHeader={true} showFooter={false}>
        <Collectionpage/>
      </Layout>
    ),
  },
  {
    path: '/product/:id',
    element: (
      <Layout showHeader={true} showFooter={false}>
        <Detailpage/>
      </Layout>
    ),
  },
  {
    path: "*",  
    element: (
      <Layout showHeader={false} showFooter={false}>
        <NotFoundPage/>
      </Layout>
    ),
  },
]);
