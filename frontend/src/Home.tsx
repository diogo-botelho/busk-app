import { useState } from "react";

import { Map } from "./Map";
import { AddEventForm } from "./AddEventForm";
import "./Home.css";
import { LocationContext } from "./LocationContext";

import BuskApi from "./api";

/** Renders HomePage
 *
 * Props: none
 * State: none
 *
 * Routes --> HomePage
 */
interface AddEventFormData {
  title: string;
  type: string;
}

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

function Home() {
  // have a user context
  // have a state that checks if user is an artist to conditionally show add event button
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  function addEvent() {
    setIsAddingEvent(true);
  }

  function updateCoordinates(mapLocation: Coordinates) {
    setCoordinates(mapLocation);
  }

  async function submitEvent(formData: AddEventFormData) {
    console.log("submitEvent", formData, coordinates);
    const eventDetails = {
      title: formData.title,
      type: formData.type,
    };

    await BuskApi.createEvent(eventDetails);
    setIsAddingEvent(false);
    setCoordinates(null);
  }

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 fw-bold">Welcome To Busk!</h1>
        <p className="lead">Placeholder!</p>
        <LocationContext.Provider value={{ coordinates, updateCoordinates }}>
          <Map isAddingEvent={isAddingEvent} />
        </LocationContext.Provider>
        <button onClick={addEvent}>Add Event</button>
        {isAddingEvent ? <AddEventForm submitEvent={submitEvent} /> : undefined}
      </div>
    </div>
  );
}

export default Home;
