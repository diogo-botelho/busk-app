import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllRoutes from "./AllRoutes";
import NavBar from "./NavBar";
import BuskApi from "./api";
import { LoginFormData } from "./interfaces/LoginFormData";
import { RegistrationFormData } from "./interfaces/RegistrationFormData";
import useLocalStorage from "./useLocalStorage";

const TOKEN_STORAGE_ID = "busk-app-token";

/** Renders Busk App
 *
 * Props: none
 * State: none
 *
 * App -> {AllRoutes, Navbar}
 */

function App() {
  // const [errors, setErrors] = useState([]);
  const [goRedirect, setGoRedirect] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  async function login(loginData: LoginFormData) {
    const token = await BuskApi.login(loginData);
    localStorage.setItem("token", token);
    // setToken(token);
    console.log(token);
    // console.log(token.username + " was successfully logged in");
    setGoRedirect(true);
  }

  async function register({
    username,
    password,
    firstName,
    lastName,
    phone,
    email,
  }: RegistrationFormData) {
    const token = await BuskApi.register({
      username,
      password,
      firstName,
      lastName,
      phone,
      email,
    });
    // localStorage.setItem("token", token);
    // setToken(token);
    console.log(token.username + " was successfully registered");
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <AllRoutes login={login} register={register} />
      </BrowserRouter>
    </div>
  );
}

export default App;
