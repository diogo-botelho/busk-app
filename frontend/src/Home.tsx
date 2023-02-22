import { useState, useContext } from "react";
import React from "react";

import { Map } from "./Map";
import { AddEventForm } from "./AddEventForm";
import "./Home.css";

import BuskApi from "./api";

import LocationContext from "./LocationContext";

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

function Home() {
  // have a user context
  // have a state that checks if user is an artist to conditionally show add event button
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const { coordinates } = useContext<any|null>(LocationContext);

  function addEvent() {
    setIsAddingEvent(true);
  }

  function submitEvent(formData:AddEventFormData) {
    console.log("submitEvent", formData,coordinates);
    setIsAddingEvent(false);
    coordinates.lat = null;
    coordinates.lng = null;
  }

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 fw-bold">Welcome To Busk!</h1>
        <p className="lead">Placeholder!</p>
        <LocationContext.Provider value={{coordinates}}>
          <Map isAddingEvent={isAddingEvent} />
        </LocationContext.Provider>
        <button onClick={addEvent}>Add Event</button>
        {isAddingEvent ? <AddEventForm submitEvent={submitEvent} /> : undefined}
      </div>
    </div>
  );
}

export default Home;
