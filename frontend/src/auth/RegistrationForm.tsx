import { ChangeEvent, FormEvent, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import ErrorMessage from "../ErrorMessage";

import { RegistrationFormData } from "../interfaces/RegistrationFormData";

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

// interface RegistrationFormParams {
// }

const INITIAL_FORM_DATA = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
};

interface RegisterFormParams {
  register: (name: RegistrationFormData) => void;
}

function RegistrationForm({ register }: RegisterFormParams) {
  const [formData, setFormData] =
    useState<RegistrationFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    try {
      evt.preventDefault();
      await register(formData);
      return navigate("/events", { replace: true });
    } catch (err) {
      if (Array.isArray(err)) {
        setErrors(err);
      } else {
        setErrors([`${err}`]);
      }
    }
  }

  return (
    <Container>
      <header className="p-3 mb-4 bg-light border rounded-3">
        <h1 className="text-center">Register</h1>
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
            {errors.length > 0 && <ErrorMessage messages={errors} />}
            <Button type="submit" className="btn btn-primary ">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default RegistrationForm;
