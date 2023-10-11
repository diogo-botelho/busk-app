import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Map } from "./Map";
import { MapContainer } from "react-leaflet";

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

const demoEvents = [demoEvent];

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <Map events={demoEvents} enableDynamicMarker={true} />
    </MemoryRouter>,
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <MapContainer>
        <Map events={demoEvents} enableDynamicMarker={true} />
      </MapContainer>
    </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
