import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

import { UserContext } from "../users/UserContext";
import BuskApi from "../api/api";
import { Event } from "../interfaces/Event";
import { UpdateEventFormData } from "../interfaces/UpdateEventFormData";
import { Coordinates } from "../interfaces/Coordinates";

import { UpdateEventForm } from "./UpdateEventForm";
import { Map } from "../map/Map";
import ErrorMessage from "../common/ErrorMessage";
import { LoadingMessage } from "../common/LoadingMessage";

/** Show information about an event.
 *
 * Is rendered by EventList to show a "card" for each event. Includes buttons
 * to update or remove the event.
 *
 * Props:
 *  - event: event object {eventId, buskerId, title, type, coordinates{lat,lng}}
 *  - updateEvent(): function that handles updating event details.
 *  - removeEvent(): function that handles removing event.
 *  - toggleDynamicMarker(): function that handles enabling/disabling
 *  DynamicMarker on Map. Calls setNewCoordinates and setEnableDynamicMarker
 *  parent component.
 *  - isAddingEvent: tracks if an event is being added and hides update/delete
 *  buttons if yes.
 *
 * Context:
 *  - currentUser: current logged in user, or undefined.
 *
 * State:
 *  - isUpdatingEvent: tracks if event is being updated. If true, shows
 *  UpdateEventForm
 *
 * EventList -> EventCard -> UpdateEventForm
 */
export function EventDetail() {
  const currentUser = useContext(UserContext);
  // const { title, type } = event;
  let { id } = useParams();
  const [errors, setErrors] = useState<string[] | []>([]);
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false);
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [newCoordinates, setNewCoordinates] = useState<Coordinates | undefined>(
    undefined
  );
  const [enableDynamicMarker, setEnableDynamicMarker] = useState(false);
  const [infoLoaded, setInfoLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(
    function getEventDetails() {
      async function getEvent() {
        try {
          if (id) {
            const event = await BuskApi.getEvent(+id);
            setEvent(event);
            setInfoLoaded(true);
          }
        } catch (err) {
          setErrors(["This event doesn't exist."]);
          setInfoLoaded(true);
        }
      }
      getEvent();
    },
    [id]
  );

  /** Handles updating event.
   *
   * Submits a request to api to update the event, triggers needsEvents to fetch
   * updated list of events from the api and disables the DynamicMarker.
   *
   * If any error occurs, updates errors state with errors.
   */
  async function updateEvent(event: Event, formData: UpdateEventFormData) {
    const eventDetails = {
      buskerId: 1,
      title: formData.title,
      type: formData.type,
      coordinates: {
        lat: newCoordinates?.lat || event.coordinates.lat,
        lng: newCoordinates?.lng || event.coordinates.lng,
      },
    };

    const eventId = event.id;

    try {
      await BuskApi.updateEvent(eventId, eventDetails);
      setErrors([]);
    } catch (err) {
      if (Array.isArray(err)) {
        setErrors(err);
      } else {
        setErrors([`${err}`]);
      }
    }
    setIsUpdatingEvent(false);
  }

  /** Handles removing event.
   *
   * Submits a request to api to remove the event, sets events state to exclude
   * removed event and disables the DynamicMarker.
   *
   * If any error occurs, updates errors state with errors.
   */
  async function removeEvent(eventId: number) {
    try {
      await BuskApi.removeEvent(eventId);
      return navigate("/events", { replace: true });
    } catch (err) {
      if (Array.isArray(err)) {
        setErrors(err);
      } else {
        setErrors([`${err}`]);
      }
    }
    setEnableDynamicMarker(false);
  }

  //Toggle Add Event Button
  function toggleUpdateEvent() {
    setIsUpdatingEvent(true);
  }

  async function handleCancel() {
    setIsUpdatingEvent(false);
  }

  async function handleRemove() {
    if (id) {
      await removeEvent(+id);
    }
  }

  /** Loading message */
  if (!infoLoaded) return <LoadingMessage />;

  return event ? (
    <Container>
      <Card className="mb-3">
        {isUpdatingEvent ? (
          <Row className="justify-content-md-center">
            <Card.Body>
              <UpdateEventForm event={event} updateEvent={updateEvent} />
              <Button onClick={handleCancel}>Cancel</Button>
            </Card.Body>
          </Row>
        ) : (
          <Container>
            <Card.Body>
              {" "}
              <Card.Title>{event.title}</Card.Title>
              <Card.Text>{event.type}</Card.Text>
              {event.buskerId === currentUser?.buskerId ? (
                <Container>
                  <Button onClick={toggleUpdateEvent}>Update</Button>
                  <Button onClick={handleRemove}>Remove</Button>
                </Container>
              ) : null}
            </Card.Body>
          </Container>
        )}
      </Card>
      <Row>
        <Map events={[event]} enableDynamicMarker={enableDynamicMarker} />
      </Row>
    </Container>
  ) : (
    <Container>
      <ErrorMessage messages={errors} />
      <Map events={[]} enableDynamicMarker={enableDynamicMarker} />
    </Container>
  );
}
