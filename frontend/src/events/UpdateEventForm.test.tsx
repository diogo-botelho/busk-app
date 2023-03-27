import React from "react";
import { render } from "@testing-library/react";
import { UpdateEventForm }  from "./UpdateEventForm";
import { MemoryRouter } from "react-router";

const demoEvent = {
    id: 1,
    buskerId: 1,
    title: "demo title",
    type: "demo type",
    coordinates: {lat: 1,lng: 1}
};

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UpdateEventForm event={demoEvent} updateEvent={()=>{}}/>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
