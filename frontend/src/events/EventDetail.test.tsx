// import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { EventDetail } from "./EventDetail";


it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <EventDetail />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
        <EventDetail />
      </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
