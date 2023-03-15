// import { useContext } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import UserList from "./UserList";
import User from "./User";
import EventList from "./EventList";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";
import { LoginFormData } from "./interfaces/LoginFormData";
import { RegistrationFormData } from "./interfaces/RegistrationFormData";

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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/:id" element={<User />} />
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
