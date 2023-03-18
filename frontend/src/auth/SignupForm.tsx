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
import { SignupFormData } from "../interfaces/SignupFormData";

interface SignupFormParams {
  signup: (name: SignupFormData) => void;
}

/**Signup Form.
 *
 * Props:
 *  - signup(): function that handles user signup.
 *
 * State:
 *  - formData: tracks data inserted into form.
 *  - formErrors: tracks errors.
 *
 * On submission:
 * - calls signup function prop
 *
 * AllRoutes -> LoginForm -> ErrorMessage
 * Routed as /signup
 * */

function SignupForm({ signup }: SignupFormParams) {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  /** Handle form submit:
   *
   * Calls signup func prop and, if not successful, sets errors.
   */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    try {
      evt.preventDefault();
      await signup(formData);
    } catch (err) {
      if (Array.isArray(err)) {
        setFormErrors(err);
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
    <Container>
      <header className="p-3 mb-4 bg-light border rounded-3">
        <h1 className="text-center">Signup</h1>
      </header>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col xs={6}>
            <Form.Group className="">
              <FloatingLabel label="Username" className="mb-2">
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
              <FloatingLabel label="Password" className="mb-2">
                <Form.Control
                  className="form-control"
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="">
              <FloatingLabel label="First Name" className="mb-2">
                <Form.Control
                  className="form-control"
                  type="firstName"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="">
              <FloatingLabel label="Last Name" className="mb-2">
                <Form.Control
                  className="form-control"
                  type="lastName"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="">
              <FloatingLabel label="Phone" className="mb-2">
                <Form.Control
                  className="form-control"
                  type="phone"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="">
              <FloatingLabel label="Email" className="mb-2">
                <Form.Control
                  className="form-control"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </FloatingLabel>
            </Form.Group>
            {formErrors.length > 0 && <ErrorMessage messages={formErrors} />}
            <Button type="submit" className="btn btn-primary ">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default SignupForm;
