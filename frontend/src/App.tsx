import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import "./App.css";
import BuskApi from "./api/api";
import { LoadingMessage } from "./common/LoadingMessage";
import { LoginFormData } from "./interfaces/LoginFormData";
import { SignupFormData } from "./interfaces/SignupFormData";
import {
  NewCoordinatesContext,
  NewCoordinatesContextInterface,
} from "./map/NewCoordinatesContext";
import AllRoutes from "./routes-nav/AllRoutes";
import NavBar from "./routes-nav/NavBar";
import { UserContext } from "./users/UserContext";

// Key name for storing token in localStorage for "remember me" re-login
const TOKEN_STORAGE_ID = "busk-app-token";

/** Busk application.
 *
 * Props:
 * - none
 *
 * State:
 * - infoLoaded: has user data been pulled from API?
 *   (this manages message for "Loading...")
 *
 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app.
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> {AllRoutes, Navbar}
 */

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [token, setToken] = useState(
    localStorage.getItem("token" || TOKEN_STORAGE_ID)
  );
  const [newCoordinates, setNewCoordinates] =
    useState<NewCoordinatesContextInterface["newCoordinates"]>(undefined);

  const navigate = useNavigate();

  // Load user info from API. Until a user is logged in and they have a token,
  // this should not run. It only needs to re-run when a user logs out, so
  // the value of the token is a dependency for this effect.

  useEffect(
    function loadUserInfo() {
      console.debug("App useEffect loadUserInfo", "token=", token);

      async function getCurrentUser() {
        if (token) {
          try {
            const user = jwt_decode(token);
            const decodedUser = JSON.parse(JSON.stringify(user)).id;

            // put the token on the Api class so it can use it to call the API.
            BuskApi.token = token;
            const currentUser = await BuskApi.getCurrentUser(decodedUser);

            setCurrentUser(currentUser);
          } catch (err) {
            setCurrentUser(undefined);
          }
        }
        setInfoLoaded(true);
      }
      // set infoLoaded to false while async getCurrentUser runs; once the
      // data is fetched (or even if an error happens!), this will be set back
      // to false to control the spinner.
      setInfoLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  /** Handles site-wide login.
   *
   * Logs in a user, adds token to localStorage, adds current user to
   * CurrentUser context and redirects user to Events.
   *
   * Make sure you await this function to see if any error happens.
   */
  async function login(loginData: LoginFormData) {
    const token = await BuskApi.login(loginData);

    localStorage.setItem("token", token);
    setToken(token);
    return navigate("/events", { replace: true });
  }

  /** Handles site-wide user signup.
   *
   * Automatically logs them in (set token) upon signup, adds current user to
   * CurrentUser context and redirects user to Events.
   *
   * Make sure you await this function to see if any error happens.
   */
  async function signup(signupData: SignupFormData) {
    const token = await BuskApi.signup(signupData);
    localStorage.setItem("token", token);
    setToken(token);
    return navigate("/events", { replace: true });
  }

  /** Handles site-wide logout. */
  function logout() {
    localStorage.removeItem("token");
    setCurrentUser(undefined);
    setToken(null);
  }

  /** Update coordinates based on DynamicMarker coordinates */
  function updateNewCoordinates(
    mapCoordinates: NewCoordinatesContextInterface["newCoordinates"]
  ) {
    setNewCoordinates(mapCoordinates);
  }

  // Loading
  if (!infoLoaded) return <LoadingMessage />;

  return (
    <div className="App">
      <NewCoordinatesContext.Provider
        value={{ newCoordinates, updateNewCoordinates }}
      >
        <UserContext.Provider value={currentUser}>
          <NavBar logout={logout} />
          <AllRoutes login={login} signup={signup} />
        </UserContext.Provider>
      </NewCoordinatesContext.Provider>
    </div>
  );
}

export default App;
