import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NavBar from "./NavBar";
// import { UserProvider } from "../testUtils";

it("renders without crashing", function () {
  render(
      <MemoryRouter>
        {/* <UserProvider> */}
          <NavBar logout={()=>{}}/>
        {/* </UserProvider> */}
      </MemoryRouter>,
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        {/* <UserProvider> */}
          <NavBar logout={()=>{}}/>
        {/* </UserProvider> */}
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when logged out", function () {
  const { asFragment } = render(
      <MemoryRouter>
        {/* <UserProvider currentUser={null}> */}
          <NavBar logout={()=>{}}/>
        {/* </UserProvider> */}
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
