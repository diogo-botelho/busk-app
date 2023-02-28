import { useState, useEffect } from "react";

import { Map } from "./Map";
import { AddEventForm } from "./AddEventForm";
import "./Home.css";
import { TemporaryCoordinatesContext } from "./TemporaryCoordinatesContext";

import { Coordinates } from "./interfaces/Coordinates";
import { AddEventFormData } from "./interfaces/AddEventFormData";
import { Event } from "./interfaces/Event";

import BuskApi from "./api";

/** Renders HomePage
 *
 * Props: none
 * State: none
 *
 * Routes --> HomePage
 */

function Home() {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [temporaryCoordinates, setTemporaryCoordinates] = useState<
    Coordinates | undefined
  >(undefined);
  const [events, setEvents] = useState<Event[]>([]);
  const [needsEvents, setNeedsEvents] = useState(true);

  useEffect(
    function fetchEventsOnLoad() {
      async function getEventsfromApi() {
        try {
          const events = await BuskApi.getEvents();
          console.log("called api", events);
          setEvents(events);
          setNeedsEvents(false);
        } catch (err) {
          console.log("Errors on getting Events.");
          // setErrors(previousErrors => [...previousErrors, ...err]);
        }
      }
      // console.log("right before calling getJobsFromApi");  //wrap API call in

      getEventsfromApi();
    },
    [needsEvents]
  );
  // await BuskApi.getEvents();

  function addEvent() {
    setIsAddingEvent(true);
  }

  function updateTemporaryCoordinates(mapCoordinates: Coordinates) {
    setTemporaryCoordinates(mapCoordinates);
  }

  async function submitEvent(formData: AddEventFormData) {
    console.log("submitEvent", formData, temporaryCoordinates);
    const eventDetails = {
      buskerId: 1,
      title: formData.title,
      type: formData.type,
      coordinates: {
        lat: temporaryCoordinates?.lat,
        lng: temporaryCoordinates?.lng,
      },
    };

    if (!temporaryCoordinates) {
      console.log("Please select a location");
    } else {
      await BuskApi.createEvent(eventDetails);
      setEvents((previousData) => [...previousData, eventDetails]);
    }
    setIsAddingEvent(false);
    setTemporaryCoordinates(undefined);
  }

  if (needsEvents) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 fw-bold">Welcome To Busk!</h1>
        <p className="lead">Placeholder!</p>
        <TemporaryCoordinatesContext.Provider
          value={{ temporaryCoordinates, updateTemporaryCoordinates }}
        >
          <Map events={events} isAddingEvent={isAddingEvent} />
        </TemporaryCoordinatesContext.Provider>
        <button onClick={addEvent}>Add Event</button>
        {isAddingEvent ? <AddEventForm submitEvent={submitEvent} /> : undefined}
      </div>
    </div>
  );
}

export default Home;
