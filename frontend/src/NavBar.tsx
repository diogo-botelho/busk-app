import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext";
// import "./NavBar.css";

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
  const [toggled, setToggle] = useState(false);

  const toggle = () => setToggle((toggled) => !toggled);

  const currentUser = useContext(UserContext);

  function loggedInNav() {
    return (
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">
            Events
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/logout">
            Logout
          </Link>
        </li>
      </ul>
    );
  }
  
  function loggedOutNav() {
    return (
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">
            Events
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login" onClick={toggle}>
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/register" onClick={toggle}>
            Register
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <nav className="d-flex navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand me-auto" href="/">
          Busk!
        </a>
        <button
          onClick={toggle} // need an onClick to toggle
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navItems"
          aria-controls="navItems"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          id="navItems"
          className={`navbar-collapse ${!toggled ? "collapse" : ""}`}
        >
          {currentUser ? loggedInNav() : loggedOutNav()}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
