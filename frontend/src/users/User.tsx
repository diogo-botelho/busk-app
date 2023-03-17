import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

import "./User.css";
import { UserContext, UserContextType } from "./UserContext";

interface userParamsInterface {
  user: UserContextType | undefined;
}
function User({user}:userParamsInterface) {
  const currentUser = useContext(UserContext);
  const params = useParams();

  return currentUser && currentUser.username === params.username ? (
    <Container>
      <div>
        <h1> You must be user {currentUser.username} </h1>
      </div>
      Events created by the user will go here.
    </Container>
  ) : (
    <div>This user doesn't exist.</div>
  );
}

export default User;
