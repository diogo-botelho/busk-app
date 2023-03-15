import { useState, useEffect, useContext } from "react";
import { Button, Container } from "react-bootstrap";

import { Map } from "./Map";
import { AddEventForm } from "./AddEventForm";
import "./Home.css";
import { NewCoordinatesContext } from "./NewCoordinatesContext";
import { UserContext } from "./UserContext";

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
  return (
    <Container className="text-center ">
      <div className="p-5 mb-4 bg-light border rounded-3">
        <h1 className="mb-4 fw-bold">Welcome To Busk!</h1>
        <h6 className="fs-4">Find local artists around your location!</h6>
        <p>
          <b>busk·er</b> /ˈbəskər/
        </p>
        <p>
          noun: <b>busker</b>; plural noun: <b>buskers</b>
        </p>
        <p>
          <i>
            "a person who performs music or other entertainment in the street or
            another public place for monetary donations."
          </i>
        </p>
      </div>
    </Container>
  );
}

export default Home;
