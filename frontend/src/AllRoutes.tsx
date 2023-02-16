// import { useContext } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import UserList from "./UserList";
import User from "./User";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

// import LoginForm from "./LoginForm";
// import AddUserForm from './AddUserForm'

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

interface LoginFormData {
    username: string;
}

interface RegistrationFormData {
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

function AllRoutes({login, register}: AllRoutesParams) {
    // const user = useContext(CurrUserContext);
    // const token = localStorage.getItem("token");
    return (
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/users" element={<UserList />}/>
                <Route path="/users/:id" element={<User />}/>
                <Route path="/login" element={<LoginForm login={login} />}/>
                <Route path="/register" element={<RegistrationForm register={register} />}/>;
                {/* <Navigate to="/" /> */}
            </Routes>
    );
}

export default AllRoutes;
