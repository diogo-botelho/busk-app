import { render } from "@testing-library/react";
import { DynamicMarker } from "./DynamicMarker";
import { MemoryRouter } from "react-router";
import { MapContainer } from "react-leaflet";

it("renders without crashing", function () {
  <MemoryRouter>
    <MapContainer>
      render(
      <DynamicMarker />
      );
    </MapContainer>
  </MemoryRouter>;
});

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <MapContainer>
        render(
        <DynamicMarker />
        );
      </MapContainer>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
