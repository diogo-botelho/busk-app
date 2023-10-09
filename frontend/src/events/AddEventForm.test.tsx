import React from "react";
import { render } from "@testing-library/react";
import { AddEventForm } from "./AddEventForm";
import { MemoryRouter } from "react-router";

it("matches snapshot", function () {
  const { asFragment } = render(
    <MemoryRouter>
      <AddEventForm submitEvent={() => {}} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
