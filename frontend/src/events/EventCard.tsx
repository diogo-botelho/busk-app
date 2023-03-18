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

/** Show information about an event.
 * 
 * Is rendered by EventList to show a "card" for each event. Includes buttons
 * to update or remove the event.
 *
 * Props:
 *  - event: event object
 *  - updateEvent(): function that handles updating event details.
 *  - removeEvent(): function that handles removing event.
 *  - toggleDynamicMarker(): function that handles showing/hiding DynamicMarker
 *  on Map component.
 *  - isAddingEvent: tracks if an event is being added and hides update/delete 
 *  buttons if yes.
 * 
 * Context:
 *  - currentUser: current logged in user, or undefined.
 * 
 * State:
 *  - isUpdatingEvent: tracks if event is being updated.
 *
 * EventList -> EventCard -> UpdateEventForm
 */

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
