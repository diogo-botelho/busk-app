import { ChangeEvent, FormEvent, useState, useContext } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

import { UserContext } from "../users/UserContext";

import { AddEventFormData } from "../interfaces/AddEventFormData";

interface AddEventFormParams {
  submitEvent: (
    userId: number,
    buskerName: string,
    formData: AddEventFormData
  ) => void;
}

/**Add Event Form.
 *
 * Shows form and manages update to state on changes.
 *
 * Props:
 *  - submitEvent(): function that hadnles event creation.
 *
 * State:
 *  - formData: tracks data inserted into form.
 *
 * On submission:
 *  - calls submitEvent function prop
 *
 * EventList -> AddEventForm
 */
export function AddEventForm({ submitEvent }: AddEventFormParams) {
  const currentUser = useContext(UserContext);
  const [formData, setFormData] = useState<AddEventFormData>({
    title: "",
    type: "concert",
  });

  /** Handle form submit:
   *
   * Calls submitEvent func prop.
   */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (!currentUser) {
      console.log("Please log in.");
    } else {
      submitEvent(currentUser.id, "Saxiogo", formData);
    }
  }

  /** Update form data field */
  function handleChange(
    evt: ChangeEvent<HTMLInputElement & HTMLSelectElement>
  ) {
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
                <Form.Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option>concert</option>
                  <option>dance</option>
                  <option>something else</option>
                </Form.Select>
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
