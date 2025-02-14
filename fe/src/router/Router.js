import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/Login/Login'
import Home from '../pages/Homepage/Homepage'
import ButtonAppBar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import ListingPage from '../pages/Listingpage/Listingpage'




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
      path: '/login',
      element: (
        <Layout showHeader={false} showFooter={false}>
          <Login />
        </Layout>
      ),
    },
    {       
      path: '/listing-page',
      element: (
        <Layout showHeader={false} showFooter={false}>
         <ListingPage/>
        </Layout>
      ),
    },
  ])