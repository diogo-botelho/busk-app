import { useState, useEffect } from "react";

import { Map } from "./Map";
import { AddEventForm } from "./AddEventForm";
import "./Home.css";
import { NewCoordinatesContext } from "./NewCoordinatesContext";

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
  const [newCoordinates, setNewCoordinates] = useState<Coordinates | undefined>(
    undefined
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [needsEvents, setNeedsEvents] = useState(true);

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

    if (!newCoordinates) {
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
    <div className="Homepage">
      <div className="container text-center ">
        <div className="p-5 mb-4 bg-light border rounded-3">
          <h1 className="mb-4 fw-bold">Welcome To Busk!</h1>
          <h6 className="fs-4">Find local artists around your location!</h6>
        </div>
        <NewCoordinatesContext.Provider
          value={{ newCoordinates, updateNewCoordinates }}
        >
          <Map events={events} isAddingEvent={isAddingEvent} />
        </NewCoordinatesContext.Provider>
        <button className="mt-3 btn btn-primary btn-lg" onClick={addEvent}>
          Add Event
        </button>
        {isAddingEvent ? <AddEventForm submitEvent={submitEvent} /> : undefined}
      </div>
    </div>
  );
}

export default Home;
