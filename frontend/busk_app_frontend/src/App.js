import { BrowserRouter } from "react-router-dom";
import './App.css';
import AllRoutes from "./AllRoutes";
import NavBar from "./NavBar";

/** Renders Sharebnb App
 *
 * Props: none
 * State: none
 *
 * App -> {Routes, Navbar}
 */

function App() {
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