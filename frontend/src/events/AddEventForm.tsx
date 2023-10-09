import { ChangeEvent, FormEvent, useState, useContext, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

import { UserContext } from "../users/UserContext";

import { EventFormData } from "../interfaces/EventFormData";
import { NewCoordinatesContext } from "../map/NewCoordinatesContext";

interface AddEventFormParams {
  submitEvent: (formData: EventFormData) => void;
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
  const { newCoordinates } = useContext(NewCoordinatesContext);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    type: "",
    date: "",
    startTime: "",
    endTime: "",
    coordinates: newCoordinates,
  });

  /** Handle newCoordinates change. Adds newCoordinates to formData. */
  useEffect(
    function updateFormCoordinates() {
      async function updateCoordinatesOnClick() {
        try {
          setFormData((prevData) => ({
            ...prevData,
            coordinates: newCoordinates,
          }));
        } catch (err) {
          // setErrors(["Error"]);
          console.log("error");
        }
      }
      updateCoordinatesOnClick();
    },
    [newCoordinates],
  );

  /** Handle form submit:
   *
   * Calls submitEvent func prop.
   */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    submitEvent(formData);
  }

  /** Update form data field */
  function handleChange(
    evt: ChangeEvent<HTMLInputElement & HTMLSelectElement>,
  ) {
    console.log(evt);
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <Container className="AddEventForm">
      <h5>Select a location on the map</h5>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col xs={12}>
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
          </Col>
          <Col xs={12}>
            <Form.Group className="">
              <FloatingLabel label="Type">
                <Form.Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option>Event type</option>
                  <option>concert</option>
                  <option>dance</option>
                  <option>something else</option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="">
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                id="date"
                type="date"
                name="date"
                placeholder="Date"
                value={formData.date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col xs={6} className="">
            <Form.Group>
              <Form.Label>Start</Form.Label>
              <Form.Control
                id="startTime"
                type="time"
                name="startTime"
                placeholder="Time"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col xs={6} className="">
            <Form.Group>
              <Form.Label>End</Form.Label>
              <Form.Control
                id="endTime"
                type="time"
                name="endTime"
                placeholder="Time"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" className="btn-primary mt-2">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
