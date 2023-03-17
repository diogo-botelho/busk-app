import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  FloatingLabel,
} from "react-bootstrap";

import Error from "../Error";

import { LoginFormData } from "../interfaces/LoginFormData";

/**Renders a login form
 *
 * Props:
 *  - login(): function that authenticates user data
 *
 * State:
 *  - formData
 *  - errors
 *
 * Routes -> LoginForm
 * */

const INITIAL_FORM_DATA = {
  username: "",
  password: "",
};

interface LoginFormParams {
  login: (username: LoginFormData) => void;
}

function LoginForm({ login }: LoginFormParams) {
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<string[] | []>([]);
  const navigate = useNavigate();

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      await login(formData);
      return navigate("/events", { replace: true });
    } catch (err) {
      if (Array.isArray(err)) {
        setErrors(["Invalid username or password."]);
      } else {
        setErrors(["Something went wrong. Please try again later."]);
      }
    }
  }

  return (
    <Container className="">
      <header className="p-3 mb-4 bg-light border rounded-3">
        <h1 className="text-center">Log In</h1>
      </header>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col xs={6} className="">
            <Form.Group className="">
              <FloatingLabel label="Username" className="mb-3">
                <Form.Control
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="">
              <FloatingLabel label="Password">
                <Form.Control
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </FloatingLabel>
            </Form.Group>
            {errors.length > 0 && <Error messages={errors} />}

            <Button type="submit" className="btn-primary mt-2">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default LoginForm;
