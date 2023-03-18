import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used

import "./NavBar.css";

import { UserContext } from "../users/UserContext";

/** Renders NavLinks
 *
 * Props: none
 * State: none
 *
 * App -> NavBar
 */
interface Logout {
  logout: () => void;
}

function NavBar({ logout }: Logout) {
  const [toggled, setToggle] = useState(false);

  const toggle = () => setToggle((toggled) => !toggled);

  const currentUser = useContext(UserContext);

  function loggedInNav() {
    return (
      <ul className="nav nav-pills ms-auto mb-2">
        <li className="nav-item mx-2">
          <Link className="nav-link" aria-current="page" to="/events">
            Events
          </Link>
        </li>
        <li className="nav-item mx-2">
          {currentUser ? (
            <Link
              className="nav-link"
              aria-current="page"
              to="/"
              onClick={logout}
            >
              Logout
            </Link>
          ) : null}
        </li>
      </ul>
    );
  }

  function loggedOutNav() {
    return (
      <ul className="nav nav-pills ms-auto mb-2">
        <li className="nav-item mx-2">
          <Link className="nav-link" aria-current="page" to="/events">
            Events
          </Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/login" onClick={toggle}>
            Login
          </Link>
        </li>
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/signup" onClick={toggle}>
            Signup
          </Link>
        </li>
      </ul>
    );
  }

  return (
    <nav className="d-flex navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand me-auto" href="/">
        {/* <FontAwesomeIcon icon={icon({name:'guitar', style:'solid'})} /> */}
        <FontAwesomeIcon icon={solid('guitar')} />
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
