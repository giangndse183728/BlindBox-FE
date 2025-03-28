import { RouterProvider } from "react-router-dom"
import { routes } from "./router/Router";
import { ToastContainer, Bounce } from "react-toastify";
import LoadingScreen from "./components/Loading/LoadingScreen";
import "react-toastify/dist/ReactToastify.css";
import './App.css'
import useSocket from "./utils/useSocket";

function App() {
 
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  useSocket(token, userInfo);

  return (
    <>
      <RouterProvider
        router={routes}
        fallbackElement={<div><LoadingScreen/></div>}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;

