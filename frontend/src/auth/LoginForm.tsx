import { ChangeEvent, FormEvent, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";

import ErrorMessage from "../common/ErrorMessage";
import { LoginFormData } from "../interfaces/LoginFormData";

interface LoginFormParams {
  login: (username: LoginFormData) => void;
}

/**Login form.
 *
 * Shows form and manages uodate to state on changes.
 *
 * Props:
 *  - login(): function that authenticates user data
 *
 * State:
 *  - formData: tracks data inserted into form.
 *  - errors: tracks errors.
 *
 * On submission:
 * - calls login function prop
 *
 * AllRoutes -> LoginForm -> ErrorMessage
 * Routed as /login
 * */

function LoginForm({ login }: LoginFormParams) {
  const [formData, setFormData] = useState<LoginFormData>(
    {
      username: "",
      password: "",
    })
  const [formErrors, setFormErrors] = useState<string[] | []>([]);

  /** Handle form submit:
   *
   * Calls login func prop and, if not successful, sets errors.
   */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      if (Array.isArray(err)) {
        setFormErrors(["Invalid username or password."]);
      } else {
        setFormErrors([`${err}`]);
      }
    }
  }

  /** Update form data field */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
            {formErrors.length > 0 && <ErrorMessage messages={formErrors} />}

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
