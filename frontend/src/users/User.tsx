import { useContext } from "react";
import { useParams } from "react-router-dom";
import "./User.css";
import { UserContext } from "./UserContext";
import { Container } from "react-bootstrap";

function User() {
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