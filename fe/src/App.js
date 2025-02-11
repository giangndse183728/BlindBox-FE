import { RouterProvider } from "react-router-dom"
import { routes } from "./router/Router";


function App() {
  
  return (
    <RouterProvider 
    router={routes} 
    fallbackElement={<div>Loading...</div>} 
  />
  );
}

export default App;

