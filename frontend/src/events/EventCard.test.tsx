import React from "react";
import { render } from "@testing-library/react";
import { EventCard } from "./EventCard";

const demoEvent = {
  id: 1,
  buskerId: 1,
  buskerName: "demoBusker",
  title: "demo title",
  type: "demo type",
  coordinates: { lat: 1, lng: 1 },
};

it("renders without crashing", function () {
  render(<EventCard event={demoEvent} />);
});

it("matches snapshot", function () {
  const { asFragment } = render(<EventCard event={demoEvent} />);
  expect(asFragment()).toMatchSnapshot();
});
