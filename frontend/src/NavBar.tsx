import { NavLink } from "react-router-dom";
import "./NavBar.css";
// import { useContext } from "react";
// import "./NavBar.css";

/** Renders NavLinks
 *
 * Props: none
 * State: none
 *
 * App -> NavBar
 */

function NavBar() {
  return (
    <nav className="NavBar navbar navbar-expand-md">
      <div className="container-fluid">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item me-4">
            <NavLink className="nav-link" to="/">
              Busk!
            </NavLink>
          </li>
          <li className="nav-item me-4">
            <NavLink className="nav-link" to="/users">
              Users
            </NavLink>
          </li>
          <li className="nav-item me-4">
            <NavLink className="nav-link" to="/login">
              Login
            </NavLink>
          </li>
          <li className="nav-item me-4">
            <NavLink className="nav-link" to="/register">
              Register
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
