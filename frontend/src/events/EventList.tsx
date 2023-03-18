import { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import ErrorMessage from "../ErrorMessage";

import BuskApi from "../api/api";

import { AddEventForm } from "./AddEventForm";
import { EventCard } from "./EventCard";

import { Coordinates } from "../interfaces/Coordinates";
import { AddEventFormData } from "../interfaces/AddEventFormData";
import { Event } from "../interfaces/Event";
import { UpdateEventFormData } from "../interfaces/UpdateEventFormData";

import { Map } from "../map/Map";
import { NewCoordinatesContext } from "../map/NewCoordinatesContext";

import { UserContext } from "../users/UserContext";

/** Renders EventList
 *
 * Props: none
 * State: none
 *
 * Routes --> List
 */
function EventList() {
  const currentUser = useContext(UserContext);
  const [errors, setErrors] = useState<string[] | []>([]);
  const [needsEvents, setNeedsEvents] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newCoordinates, setNewCoordinates] = useState<Coordinates | undefined>(
    undefined
  );
  const [showDynamicMarker, setShowDynamicMarker] = useState(false);

  // Fetch events when rendering component
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
    [needsEvents]
  );

  /** Add Event
   */
  //Load Add Event Button
  function addEventSection() {
    // If not logged in, show prompt to login/register
    if (!currentUser) {
      return (
        <div className="mt-auto">
          <p>
            Please <Link to="/login">login</Link> or{" "}
            <Link to="/register">register</Link> to add an event.
          </p>
        </div>
      );
    }
    // If logged in, show button to add new event
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
      //If adding new event, show AddEventForm component
      return (
        <Container>
          <AddEventForm submitEvent={submitEvent} />
          <Button onClick={handleCancel}>Cancel</Button>
        </Container>
      );
    }
  }

  //Toggle Add Event Button
  function toggleAddEvent() {
    setIsAddingEvent(true);
    setShowDynamicMarker(true);
  }

  //Update coordinates based on DynamicMarker coordinates
  function updateNewCoordinates(mapCoordinates: Coordinates) {
    setNewCoordinates(mapCoordinates);
  }

  async function handleCancel() {
    setIsAddingEvent(false);
    toggleDynamicMarker(false);
  }

  //Submit AddEventForm
  async function submitEvent(formData: AddEventFormData) {
    const eventDetails = {
      buskerId: 1,
      title: formData.title,
      type: formData.type,
      coordinates: {
        lat: newCoordinates?.lat,
        lng: newCoordinates?.lng,
      },
    };
    if (!newCoordinates) {
      setErrors(["Please select a location"]);
    } else {
      try {
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

  /** Submit UpdateEventForm
   */
  async function updateEvent(event: Event, formData: UpdateEventFormData) {
    const eventDetails = {
      buskerId: 1,
      title: formData.title,
      type: formData.type,
      coordinates: {
        lat: newCoordinates?.lat || event.coordinates.lat,
        lng: newCoordinates?.lng || event.coordinates.lng
      },
    };

    const eventId = event.id;
    
    try {
      await BuskApi.updateEvent(eventId, eventDetails);
      setNeedsEvents(true);
      setErrors([]);
    } catch (err) {
      if (Array.isArray(err)) {
        setErrors(err);
      } else {
        setErrors([`${err}`]);
      }
    }
    toggleDynamicMarker(false);
  }

  /** Remove Event
   */
  async function removeEvent(eventId: number) {
    try {
      await BuskApi.removeEvent(eventId);
      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);
    } catch (err) {
      if (Array.isArray(err)) {
        setErrors(err);
      } else {
        setErrors([`${err}`]);
      }
    }
    setShowDynamicMarker(false);
  }

  // Last 4 events
  let firstFourEvents = events.slice(-4);

  // Loading
  if (needsEvents) {
    return (
      <Container className="text-center">
        <h1>Loading...</h1>
      </Container>
    );
  }

  //Function that resets newCoordinates and shows/hides DynamicMarker
  function toggleDynamicMarker(show: boolean) {
    setNewCoordinates(undefined);
    setShowDynamicMarker(show);
  }

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
              <EventCard
                key={event.id}
                event={event}
                updateEvent={updateEvent}
                removeEvent={removeEvent}
                toggleDynamicMarker={toggleDynamicMarker}
                isAddingEvent={isAddingEvent}
              />
            ))}
            {errors.length > 0 && <ErrorMessage messages={errors} />}
            {addEventSection()}
          </Col>
          <Col>
            <NewCoordinatesContext.Provider
              value={{ newCoordinates, updateNewCoordinates }}
            >
              <Map events={events} showDynamicMarker={showDynamicMarker} />
            </NewCoordinatesContext.Provider>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default EventList;
