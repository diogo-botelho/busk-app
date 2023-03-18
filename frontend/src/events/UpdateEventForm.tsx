import { ChangeEvent, FormEvent, useState } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

import { UpdateEventFormData } from "../interfaces/UpdateEventFormData"
import {Event} from "../interfaces/Event"

interface UpdateEventFormParams {
    event: Event,
    updateEvent: (eventId:number, formData: UpdateEventFormData) => void;
}

/**
 * UpdateEventForm Component
 *
 */
export function UpdateEventForm({ event, updateEvent }: UpdateEventFormParams) {
  const [formData, setFormData] = useState<UpdateEventFormData>({
    title: event.title,
    type: event.type,
  });

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    updateEvent(event.id, formData);
  }

  return (
    <Container className="UpdateEventForm">
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
