import { useState } from "react";

import { Map } from "./Map";
import { AddEventForm } from "./AddEventForm";
import "./Home.css";

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

  function submitEvent() {
    setIsAddingEvent(false);
  }

  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 fw-bold">Welcome To Busk!</h1>
        <p className="lead">Placeholder!</p>
        <Map isAddingEvent={isAddingEvent}/>
        <button onClick={addEvent}>Add Event</button>
        {isAddingEvent ? <AddEventForm submitEvent={submitEvent} /> : undefined}
      </div>
    </div>
  );
}

export default Home;
