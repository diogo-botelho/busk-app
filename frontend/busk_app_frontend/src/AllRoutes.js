// import { useContext } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./HomePage";
import UserList from "./UserList";
import User from "./User";
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
            <Route exact path="/">
                <HomePage />
            </Route>
            <Route exact path="/users">
                <UserList />
            </Route>
            <Route exact path="/users/:id">
                <User />
            </Route>
            <Navigate to="/" />
        </Routes>
    );
}

export default AllRoutes;
