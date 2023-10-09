// import React from "react";
import { render } from "@testing-library/react";
import AllRoutes from "./AllRoutes";
import { MemoryRouter } from "react-router";
// import { UserProvider } from "../testUtils";

it("renders without crashing", function () {
  render(
      <MemoryRouter>
        {/* // <UserProvider> */}
          <AllRoutes login={()=>{}} signup={()=>{}}/>
        {/* // </UserProvider> */}
       </MemoryRouter>,
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        {/* // <UserProvider> */}
          <AllRoutes login={()=>{}} signup={()=>{}}/>
        {/* </UserProvider> */}
       </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
