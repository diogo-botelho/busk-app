import { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Map } from "../map/Map";
import { NewCoordinatesContext } from "../map/NewCoordinatesContext";

import { AddEventForm } from "./AddEventForm";
import { EventCard } from "./EventCard";

import { UserContext } from "../users/UserContext";

import { Coordinates } from "../interfaces/Coordinates";
import { AddEventFormData } from "../interfaces/AddEventFormData";
import { Event } from "../interfaces/Event";

import BuskApi from "../api/api";
import { addSyntheticLeadingComment } from "typescript";

/** Renders EventList
 *
 * Props: none
 * State: none
 *
 * Routes --> List
 */

function EventList() {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newCoordinates, setNewCoordinates] = useState<Coordinates | undefined>(
    undefined
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [needsEvents, setNeedsEvents] = useState(true);
  const currentUser = useContext(UserContext);

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
          console.log("Errors on getting Events.");
          // setErrors(previousErrors => [...previousErrors, ...err]);
        }
      }
      getEventsfromApi();
    },
    [needsEvents]
  );

  /** Add Event
   */
  //Load Add Event Button
  function newEventSection() {
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
      return <AddEventForm submitEvent={submitEvent} />;
    }
  }

  //Toggle Add Event Button
  function toggleAddEvent() {
    setIsAddingEvent(true);
  }

  //Update coordinates based on DynamicMarker coordinates
  function updateNewCoordinates(mapCoordinates: Coordinates) {
    setNewCoordinates(mapCoordinates);
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
    if (!currentUser) {
      console.log("Please log in to submit an event.");
    } else if (!newCoordinates) {
      console.log("Please select a location");
    } else {
      const newEvent = await BuskApi.createEvent(eventDetails);
      setEvents((previousData) => [...previousData, newEvent]);
    }
    setIsAddingEvent(false);
    setNewCoordinates(undefined);
  }

  /** Remove Event
   */
  async function removeEvent(eventId: number) {
    await BuskApi.removeEvent(eventId);
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
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
              <EventCard key={event.id} event={event} remove={removeEvent} />
            ))}
            {newEventSection()}
          </Col>
          <Col>
            <NewCoordinatesContext.Provider
              value={{ newCoordinates, updateNewCoordinates }}
            >
              <Map events={events} isAddingEvent={isAddingEvent} />
            </NewCoordinatesContext.Provider>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default EventList;
