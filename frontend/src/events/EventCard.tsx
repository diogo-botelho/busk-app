import { useContext, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";

import { Event } from "../interfaces/Event";
import { UpdateEventFormData } from "../interfaces/UpdateEventFormData";

import { UpdateEventForm } from "./UpdateEventForm";

import { UserContext } from "../users/UserContext";

interface EventCardParamsInterface {
  event: Event;
  updateEvent: (event: Event, formData: UpdateEventFormData) => void;
  removeEvent: (eventId: number) => void;
  toggleDynamicMarker: (show: boolean) => void;
  isAddingEvent: boolean;
}

export function EventCard({
  event,
  updateEvent,
  removeEvent,
  toggleDynamicMarker,
  isAddingEvent,
}: EventCardParamsInterface) {
  const currentUser = useContext(UserContext);
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);

  const { title, type, id, buskerId } = event;

  //Toggle Add Event Button
  function toggleUpdateEvent() {
    setIsUpdatingEvent(true);
    toggleDynamicMarker(true);
  }

  async function handleCancel() {
    setIsUpdatingEvent(false);
    toggleDynamicMarker(false);
  }

  async function handleRemove() {
    toggleDynamicMarker(false);
    await removeEvent(id);
  }

  return (
    <Card className="mb-3">
      {isUpdatingEvent ? (
        <Card.Body>
          <UpdateEventForm event={event} updateEvent={updateEvent} />
          <Button onClick={handleCancel}>Cancel</Button>
        </Card.Body>
      ) : (
        <Card.Body>
          {" "}
          <Card.Title>{title}</Card.Title>
          <Card.Text>{type}</Card.Text>
          {!isAddingEvent && buskerId === currentUser?.buskerId ? (
            <Container>
              <Button onClick={toggleUpdateEvent}>Update</Button>
              <Button onClick={handleRemove}>Remove</Button>
            </Container>
          ) : null}
        </Card.Body>
      )}
    </Card>
  );
}
