import { ChangeEvent, FormEvent, useState, useContext, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

import { EventFormData } from "../interfaces/EventFormData";
import { Event } from "../interfaces/Event";
import {
  NewCoordinatesContext,
  NewCoordinatesContextInterface,
} from "../map/NewCoordinatesContext";

interface UpdateEventFormParams {
  event: Event;
  updateEvent: (event: Event, formData: EventFormData) => void;
}

/**Update Event form.
 *
 * Shows form and manages update to state on changes.
 *
 * Props:
 *  - event: event object {eventId, buskerId, title, type, coordinates{lat,lng}}
 *  - updateEvent(): function that handles updating an event.
 *
 * State:
 *  - formData: tracks data inserted into form.
 *
 * On submission:
 *  - calls updateEvent function prop
 *
 * EventCard -> UpdateEventForm
 * */

export function UpdateEventForm({ event, updateEvent }: UpdateEventFormParams) {
  const { newCoordinates } = useContext<NewCoordinatesContextInterface>(
    NewCoordinatesContext,
  );
  const [formData, setFormData] = useState<EventFormData>({
    title: event.title,
    type: event.type,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
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

  /** Handle form submit.
   *
   * Calls updateEvent func prop.
   */
  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    updateEvent(event, formData);
  }

  /** Update form data field */
  function handleChange(
    evt: ChangeEvent<HTMLInputElement & HTMLSelectElement>,
  ) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <Container className="UpdateEventForm">
      <h5>Select a location on the map</h5>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col xs={6} className="">
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
          <Col xs={6} className="">
            <Form.Group className="">
              <FloatingLabel label="Type">
                <Form.Select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option>""</option>
                  <option>concert</option>
                  <option>dance</option>
                  <option>something else</option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={4} className="">
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
          <Col xs={4} className="">
            <Form.Group>
              <Form.Label>Start</Form.Label>
              <Form.Control
                id="startTime"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col xs={4} className="">
            <Form.Group>
              <Form.Label>End</Form.Label>
              <Form.Control
                id="endTime"
                type="time"
                name="endTime"
                value={formData.endTime}
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
