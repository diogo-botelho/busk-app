import { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Map } from "./Map";
import { AddEventForm } from "./AddEventForm";
// import "./Home.css";
import { NewCoordinatesContext } from "./NewCoordinatesContext";
import { UserContext } from "./UserContext";

import { Coordinates } from "./interfaces/Coordinates";
import { AddEventFormData } from "./interfaces/AddEventFormData";
import { Event } from "./interfaces/Event";

import BuskApi from "./api";

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

  useEffect(
    function fetchEventsOnLoad() {
      async function getEventsfromApi() {
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
  // await BuskApi.getEvents();

  function addEvent() {
    setIsAddingEvent(true);
  }

  function updateNewCoordinates(mapCoordinates: Coordinates) {
    setNewCoordinates(mapCoordinates);
  }

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
      await BuskApi.createEvent(eventDetails);
      setEvents((previousData) => [...previousData, eventDetails]);
    }
    setIsAddingEvent(false);
    setNewCoordinates(undefined);
  }

  if (needsEvents) {
    return (
      <Container className="text-center">
        <h1>Loading...</h1>
      </Container>
    );
  }

  let firstFourEvents = events.slice(-6,);

  function newEventComponent() {
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

    if (isAddingEvent) {
      return <AddEventForm submitEvent={submitEvent} />;
    }

    return (
      <Button
        className="mt-2 bottom"
        type="submit"
        size="lg"
        onClick={addEvent}
      >
        Add Event
      </Button>
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
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{event.type}</Card.Text>
                </Card.Body>
              </Card>
            ))}
            {newEventComponent()}
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
