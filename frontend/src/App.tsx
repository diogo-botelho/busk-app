import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Container } from "react-bootstrap";

import "./App.css";
import BuskApi from "./api/api";
import { LoginFormData } from "./interfaces/LoginFormData";
import { RegistrationFormData } from "./interfaces/RegistrationFormData";
import AllRoutes from "./routes-nav/AllRoutes";
import NavBar from "./routes-nav/NavBar";
import { UserContext } from "./users/UserContext";

const TOKEN_STORAGE_ID = "busk-app-token";

/** Renders Busk App
 *
 * Props: none
 * State: none
 *
 * App -> {AllRoutes, Navbar}
 */
function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("token" || TOKEN_STORAGE_ID)
  );
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(
    function loadUserInfo() {
      console.debug("App useEffect loadUserInfo", "token=", token);

      async function getCurrentUser() {
        if (token) {
          try {
            let username = jwt_decode(token);

            const decodedUsername = JSON.parse(
              JSON.stringify(username)
            ).username;

            // put the token on the Api class so it can use it to call the API.
            BuskApi.token = token;
            let currentUser = await BuskApi.getCurrentUser(decodedUsername);
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
   * Logs in a user, adds token to localStorage and adds current user to
   * CurrentUser context.
   *
   * Make sure you await this function to see if any error happens.
   */
  async function login(loginData: LoginFormData) {
    const token = await BuskApi.login(loginData);

    localStorage.setItem("token", token);
    setToken(token);
  }

  /** Handles site-wide new user registration.
   *
   * Automatically logs them in (set token) upon signup and adds current user to
   * CurrentUser context.
   *
   * Make sure you await this function to see if any error happens.
   */
  async function register(registerData: RegistrationFormData) {
    const token = await BuskApi.register(registerData);
    localStorage.setItem("token", token);
    setToken(token);
    console.log(token.username + " was successfully registered");
  }

  /** Handles site-wide logout. */
  function logout() {
    localStorage.removeItem("token");
    setCurrentUser(undefined);
    setToken(null);
  }

  // Loading
  if (!infoLoaded) {
    return (
      <Container className="text-center">
        <h1>Loading...</h1>
      </Container>
    );
  }

  return (
    <div className="App">
      <UserContext.Provider value={currentUser}>
        <NavBar logout={logout} />
        <AllRoutes login={login} register={register} />
      </UserContext.Provider>
    </div>
  );
}

export default App;
