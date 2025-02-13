import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/Login/Login'
import Home from '../pages/Homepage/Homepage'
import Dashboard from '../pages/Admin/Dashboard'
import ButtonAppBar from '../layouts/Navbar'
import Footer from '../layouts/Footer'

const Layout = ({ children, showHeader = true, showFooter = true}) => {
    return (
      <div>
        {showHeader && <ButtonAppBar />}
        {children}
        {showFooter && <Footer />}
      </div>
    )
  }

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
          <Dashboard/>
        </Layout>
      ),
    },
  ])