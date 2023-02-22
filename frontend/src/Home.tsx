import { useState, createContext } from "react";
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

function Home() {
  // have a user context
  // have a state that checks if user is an artist to conditionally show add event button
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  function addEvent() {
    setIsAddingEvent(true);
  }

  function submitEvent(formData: any) {
    // const eventDetails = {
    //   //title and type we get from the AddEventForm
    //   title = formData.title,
    //   type = formData.type,
    //   //coordinates we get from the Location Marker
    //   // coordinates =
    // }
    // const res = await BuskApi.createEvent(eventDetails);
    setIsAddingEvent(false);
  }

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 fw-bold">Welcome To Busk!</h1>
        <p className="lead">Placeholder!</p>
        <LocationContext.Provider value={{ position }}>
          <Map isAddingEvent={isAddingEvent} />
        </LocationContext.Provider>
        <button onClick={addEvent}>Add Event</button>
        {isAddingEvent ? <AddEventForm submitEvent={submitEvent} /> : undefined}
      </div>
    </div>
  );
}

export default Home;
