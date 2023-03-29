import React from "react";
import { render } from "@testing-library/react";
import ErrorMessage from "./ErrorMessage";

it("renders without crashing", function() {
  render(<ErrorMessage messages={[]}/>);
});

it("matches snapshot for danger", function() {
  let messages = ["Everything is broken", "Run for the hills"];
  const { asFragment } = render(<ErrorMessage messages={messages} />);
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot for success", function() {
  let messages = ["Everything is awesome!"];
  const { asFragment } = render(<ErrorMessage messages={messages} />);
  expect(asFragment()).toMatchSnapshot();
});
