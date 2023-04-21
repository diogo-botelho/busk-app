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
 * Shows form and manages update to state on changes.
 *
 * Props:
 *  - signup(): function that handles user signup.
 *
 * State:
 *  - formData: tracks data inserted into form.
 *  - formErrors: tracks errors.
 *
 * On submission:
 *  - calls signup function prop
 *
 * AllRoutes -> SignupForm -> ErrorMessage
 * Routed as /signup
 * */

function SignupForm({ signup }: SignupFormParams) {
  const [formData, setFormData] = useState<SignupFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    buskerCheckmark: false,
    buskerName: "",
    buskerCategory: "musician",
    buskerDescription: "",
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
  function handleChange(
    evt: ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) {
    const { name } = evt.target;

    const value =
      name === "buskerCheckmark" ? evt.target.checked : evt.target.value;

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
              <Form.Check
                className="form-check"
                id="buskerCheckmark"
                name="buskerCheckmark"
                label={"Do you wish to also create a busker account?"}
                onChange={handleChange}
              />
            </Form.Group>
            {formData.buskerCheckmark && (
              <>
                <Form.Group className="">
                  <FloatingLabel label="BuskerName" className="mb-2">
                    <Form.Control
                      className="form-control"
                      type="buskerName"
                      id="buskerName"
                      name="buskerName"
                      value={formData.buskerName}
                      onChange={handleChange}
                      placeholder="Busker Name"
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="">
                  <FloatingLabel label="buskerCategory" className="mb-2">
                    <Form.Select
                      id="buskerCategory"
                      name="buskerCategory"
                      value={formData.buskerCategory}
                      onChange={handleChange}
                    >
                      <option>musician</option>
                      <option>painter</option>
                      <option>juggler</option>
                      <option>other</option>
                    </Form.Select>
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="">
                  <FloatingLabel label="buskerDescription" className="mb-2">
                    <Form.Control
                      className="form-control"
                      type="buskerDescription"
                      id="buskerDescription"
                      name="buskerDescription"
                      value={formData.buskerDescription}
                      onChange={handleChange}
                      placeholder="Description"
                    />
                  </FloatingLabel>
                </Form.Group>
              </>
            )}
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
