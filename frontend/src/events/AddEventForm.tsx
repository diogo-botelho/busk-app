import { ChangeEvent, FormEvent, useState, useContext, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

import { EventFormData, EventFormErrors } from "../interfaces/EventFormData";
import { NewCoordinatesContext } from "../map/NewCoordinatesContext";
import findFormErrors from "../helpers/findFormErrors";

interface AddEventFormParams {
  submitEvent: (formData: EventFormData) => void;
}

const DEFAULT_FORM_VALUES = {
  title: "",
  type: "",
  date: "",
  startTime: "",
  endTime: "",
};

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
  const { newCoordinates } = useContext(NewCoordinatesContext);
  const [formData, setFormData] = useState<EventFormData>({
    ...DEFAULT_FORM_VALUES,
    coordinates: newCoordinates,
  });
  const [errors, setErrors] = useState<EventFormErrors>({});

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

  // /** Handle form submit:
  //  *
  //  * Calls submitEvent func prop.
  //  */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const newErrors = findFormErrors(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    } else {
      submitEvent(formData);
    }
  }

  console.log("err", errors);
  /** Update form data field */
  function handleChange(
    evt: ChangeEvent<HTMLInputElement & HTMLSelectElement>,
  ) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (!!errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors({
        ...updatedErrors,
      });
    }
  }

  return (
    <Container className="AddEventForm">
      <h5>Select a location on the map</h5>
      <Form.Control.Feedback type="invalid">
        {errors?.coordinates}
      </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors?.title}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors?.type}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors?.date}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors?.startTime}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors?.endTime}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Button
          type="submit"
          disabled={Object.keys(errors).length === 0 ? false : true}
          className="btn-primary mt-2"
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}
