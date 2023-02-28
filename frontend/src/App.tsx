import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AllRoutes from "./AllRoutes";
import NavBar from "./NavBar";
import BuskApi from "./api";
import { LoginFormData } from "./interfaces/LoginFormData";
import { RegistrationFormData } from "./interfaces/RegistrationFormData";

/** Renders Sharebnb App
 *
 * Props: none
 * State: none
 *
 * App -> {AllRoutes, Navbar}
 */

function App() {
  // const [errors, setErrors] = useState([]);

  async function login(username: LoginFormData) {
    const token = await BuskApi.login(username);
    // localStorage.setItem("token", token);
    // setToken(token);
    console.log(token.username + " was successfully logged in");
  }

  async function register({
    username,
    firstName,
    lastName,
    phone,
    email,
  }: RegistrationFormData) {
    const token = await BuskApi.register({
      username,
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
