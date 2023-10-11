import React from "react";
import { render } from "@testing-library/react";
import { UpdateEventForm } from "./UpdateEventForm";
import { MemoryRouter } from "react-router";

const demoEvent = {
  id: 1,
  buskerId: 1,
  buskerName: "demoBusker",
  title: "demo title",
  type: "demo type",
  date: "2023-1-1",
  startTime: "00:00",
  endTime: "01:00",
  coordinates: { lat: 1, lng: 1 },
};

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <UpdateEventForm event={demoEvent} updateEvent={() => {}} />
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
