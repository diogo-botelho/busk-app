import { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import BuskApi from "../api/api";
import { LoadingMessage } from "../common/LoadingMessage";
import ErrorMessage from "../common/ErrorMessage";
import { AddEventForm } from "./AddEventForm";
import { EventCard } from "./EventCard";
import { EventFormData } from "../interfaces/EventFormData";
import { Event } from "../interfaces/Event";
import { Map } from "../map/Map";
import {
  NewCoordinatesContext,
  NewCoordinatesContextInterface,
} from "../map/NewCoordinatesContext";
import { UserContext } from "../users/UserContext";

/** Show page with list of events.
 *
 * On mount, loads events from API and Map component populated with
 * StaticMarkers for each event.
 *
 * Props: N/A
 *
 * Context:
 *  - currentUser: current logged in user, or undefined.
 *
 * State:
 *  - errors: tracks errors.
 *  - needsEvents: have events been pulled from API?
 *  - events: array of all events.
 *  - isAddingEvent: tracks if an event is being added and hides update/delete
 *  buttons if yes.
 *  - newCoordinates: tracks coordinates of DynamicMarker for adding/updating
 *  events.
 *  - enableDynamicMarker: function that handles enabling/disabling
 *  DynamicMarker on Map.
 *
 * AllRoutes -> EventList -> { Map, EventCard, AddEventForm, ErrorMessage }
 * This is routed to at /events
 */

function EventList() {
  const currentUser = useContext(UserContext);
  const { newCoordinates, updateNewCoordinates } =
    useContext<NewCoordinatesContextInterface>(NewCoordinatesContext);
  const [errors, setErrors] = useState<string[] | []>([]);
  const [needsEvents, setNeedsEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [enableDynamicMarker, setEnableDynamicMarker] = useState(false);

  /** Fetch events when rendering component */
  useEffect(
    function fetchEventsOnLoad() {
      async function getEventsfromApi() {
        console.log("get events from api");
        try {
          const events = await BuskApi.getEvents();
          setEvents(events);
          setNeedsEvents(false);
        } catch (err) {
          setErrors([
            "It seems we're struggling to get our events. " +
              "Please try again later.",
          ]);
          setNeedsEvents(false);
        }
      }
      getEventsfromApi();
    },
    [needsEvents],
  );

  /** Determines what to render depending on whether there's a currentUser and
   * if an event is being added.
   */
  function addEventSection() {
    // If user is not logged in, show prompt to login/signup
    if (!currentUser) {
      return (
        <div className="mt-auto">
          <p>
            Please <Link to="/login">login</Link> or{" "}
            <Link to="/signup">signup</Link> to add an event.
          </p>
        </div>
      );
    }
    // If user is logged in, show button to add new event
    if (!isAddingEvent) {
      return (
        <Button
          className="mt-2 bottom"
          type="submit"
          size="lg"
          onClick={toggleAddEvent}
        >
          Add Event
        </Button>
      );
    } else {
      // If user is adding new event, show AddEventForm component
      return (
        <Container>
          <AddEventForm submitEvent={submitEvent} />
          <Button onClick={handleCancel}>Cancel</Button>
        </Container>
      );
    }
  }

  /** Toggle Add Event Button
   *
   * Sets isAddingEvent to true and enables DynamicMarker.
   */
  function toggleAddEvent() {
    setIsAddingEvent(true);
    toggleDynamicMarker(true);
  }

  /** Cancels adding a new event.
   *
   *  Sets isAddingEvent to false and disables DynamicMarker.
   */
  async function handleCancel() {
    setIsAddingEvent(false);
    toggleDynamicMarker(false);
  }

  /** Handles adding a new event.
   *
   * Submits a request to api to create a new event, adds new event to events
   * state, sets isAddingEvent to false and disables DynamicMarker.
   *
   * If any error occurs, updates errors state with errors.
   */
  async function submitEvent(formData: EventFormData) {
    if (!formData.coordinates) {
      setErrors(["Please select a location"]);
    } else {
      const eventDetails = {
        buskerId: 1,
        title: formData.title,
        type: formData.type,
        coordinates: formData.coordinates,
      };
      try {
        //Uncomment when event model starts accepting timestamps
        //const newEvent = await BuskApi.createEvent(formData);
        const newEvent = await BuskApi.createEvent(eventDetails);
        setEvents((previousData) => [...previousData, newEvent]);
        setErrors([]);
      } catch (err) {
        if (Array.isArray(err)) {
          setErrors(err);
        } else {
          setErrors([`${err}`]);
        }
      }
    }
    setIsAddingEvent(false);
    toggleDynamicMarker(false);
  }

  // Fetches 4 latest events to show in the Latest Events section
  let firstFourEvents = events.slice(-4);

  /** Resets newCoordinates and enables/disables DynamicMarker */
  function toggleDynamicMarker(enable: boolean) {
    updateNewCoordinates(undefined);
    setEnableDynamicMarker(enable);
  }

  // Renders LoadingMessage
  if (needsEvents) return <LoadingMessage />;

  return (
    <Container className="text-center ">
      <header className="p-3 mb-4 bg-light border rounded-3">
        <h1>Current events in New York</h1>
      </header>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={4} className="shownEvents">
            <h5 className="text-start mb-3">Most recent events:</h5>
            {firstFourEvents.map((event) => (
              <Link
                to={`/events/${event.id}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                <EventCard key={event.id} event={event} />
              </Link>
            ))}
            {errors.length > 0 && <ErrorMessage messages={errors} />}
            {addEventSection()}
          </Col>
          <Col>
            <Map events={events} enableDynamicMarker={enableDynamicMarker} />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default EventList;
