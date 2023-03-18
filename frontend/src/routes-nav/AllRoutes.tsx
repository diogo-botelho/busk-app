import { Route, Routes } from "react-router-dom";
import { useContext } from "react";

import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm"

import EventList from "../events/EventList";

import Home from "../homepage/Home";

import { LoginFormData } from "../interfaces/LoginFormData";
import { SignupFormData } from "../interfaces/SignupFormData"

import UserList from "../users/UserList";
import User from "../users/User";
import { UserContext } from "../users/UserContext";

/**Renders Routes
 *
 * Props: none
 * State: none
 * Context: none
 *
 * App -> AllRoutes -> {
 *              HomePage,
 *              UserList,
 *              User,
 *              AddUserForm
 *          }
 */

interface AllRoutesParams {
  login: (user: LoginFormData) => void;
  signup: (user: SignupFormData) => void;
}

function AllRoutes({ login, signup }: AllRoutesParams) {
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
        path="/signup"
        element={<SignupForm signup={signup} />}
      />
      ;{/* <Navigate to="/" /> */}
    </Routes>
  );
}

export default AllRoutes;
