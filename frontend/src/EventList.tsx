import { useState, useEffect, useContext } from "react";
import { Button, Container } from "react-bootstrap";

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
    return <h1>Loading...</h1>;
  }

  return (
    <Container className="text-center ">
      <div className="p-5 mb-4 bg-light border rounded-3">
        <h1 className="mb-4 fw-bold">Current events in New York</h1>
      </div>
      <NewCoordinatesContext.Provider
        value={{ newCoordinates, updateNewCoordinates }}
      >
        <Map events={events} isAddingEvent={isAddingEvent} />
      </NewCoordinatesContext.Provider>
      {currentUser ? (
        <Button className="mt-2" type="submit" size="lg" onClick={addEvent}>
          Add Event
        </Button>
      ) : undefined}
      {isAddingEvent ? <AddEventForm submitEvent={submitEvent} /> : undefined}
    </Container>
  );
}

export default EventList;
