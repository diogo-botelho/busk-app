import { BrowserRouter } from "react-router-dom";
import './App.css';
import AllRoutes from "./AllRoutes";
import NavBar from "./NavBar";
// import Homepage from "./Homepage";
// import { useState } from "react";


/** Renders Sharebnb App
 *
 * Props: none
 * State: none
 *
 * App -> {AllRoutes, Navbar}
 */

function App() {
  // const [errors, setErrors] = useState([]);

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <AllRoutes />
      </BrowserRouter>
    </div>
  );
};

export default App;