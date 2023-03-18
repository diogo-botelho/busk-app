import { ChangeEvent, FormEvent, useState } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

import { AddEventFormData } from "../interfaces/AddEventFormData";

interface AddEventFormParams {
  submitEvent: (formData: AddEventFormData) => void;
}

/**Add Event Form.
 *
 * Props:
 *  - submitEvent(): function that hadnles event creation.
 *
 * State:
 *  - formData: tracks data inserted into form.
 *
 * On submission:
 * - calls submitEvent function prop
 *
 * EventList -> AddEventForm
 */
export function AddEventForm({ submitEvent }: AddEventFormParams) {
  const [formData, setFormData] = useState<AddEventFormData>({
    title: "",
    type: "",
  });

  /** Handle form submit:
   *
   * Calls submitEvent func prop and, if not successful, sets errors.
   */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    submitEvent(formData);
  }

  /** Update form data field */
  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <Container className="AddEventForm">
      <h5>Select a location on the map</h5>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col xs={8} className="">
            <Form.Group className="">
              <FloatingLabel label="Title" className="mb-3">
                <Form.Control
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Title"
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="">
              <FloatingLabel label="Type">
                <Form.Control
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Type"
                />
              </FloatingLabel>
            </Form.Group>
            <Button type="submit" className="btn-primary mt-2">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
