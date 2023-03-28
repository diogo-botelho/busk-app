// import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import EventList from "./EventList";


it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <EventList />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
        <EventList />
      </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
