import { Route, Routes } from "react-router-dom";
import { useContext } from "react";

import Home from "../homepage/Home";

import UserList from "../users/UserList";
import User from "../users/User";
import { UserContext } from "../users/UserContext";

import EventList from "../events/EventList";

import LoginForm from "../auth/LoginForm";
import RegistrationForm from "../auth/RegistrationForm";

import { LoginFormData } from "../interfaces/LoginFormData";
import { RegistrationFormData } from "../interfaces/RegistrationFormData";

/**Renders Routes
 *
 * Props: none
 * State: none
 * Context: none
 *
 * App -> Routes -> {
 *              HomePage,
 *              UserList,
 *              User,
 *              AddUserForm
 *          }
 */

interface AllRoutesParams {
  login: (user: LoginFormData) => void;
  register: (user: RegistrationFormData) => void;
}

function AllRoutes({ login, register }: AllRoutesParams) {
  const currentUser = useContext(UserContext);
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:username" element={<User user={currentUser} />} />
      <Route path="/events" element={<EventList />} />
      {/* <Route path="/events/:id" element={<Event />} /> */}
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route
        path="/register"
        element={<RegistrationForm register={register} />}
      />
      ;{/* <Navigate to="/" /> */}
    </Routes>
  );
}

export default AllRoutes;
