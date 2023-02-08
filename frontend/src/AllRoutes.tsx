// import { useContext } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import UserList from "./UserList";
import User from "./User";
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
function AllRoutes() {
    // const user = useContext(CurrUserContext);
    // const token = localStorage.getItem("token");
    return (
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/users" element={<UserList />}/>
                <Route path="/users/:id" element={<User />}/>
                {/* <Navigate to="/" /> */}
            </Routes>
    );
}

export default AllRoutes;
