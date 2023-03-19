import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./Home.css";

/** Homepage of site.
 *
 * Shows welcome message and link to events.
 *
 * Routed at /
 *
 * AllRoutes -> Homepage
 */

function Home() {
  return (
    <Container className="text-center">
      <header className="p-3 mb-4 bg-light border rounded-3">
        <h1>Welcome To Busk!</h1>
      </header>
      <h6 className="fs-4">Find local artists around your location!</h6>
      <p>
        <b>busk·er</b> /ˈbəskər/
      </p>
      <p>
        noun: <b>busker</b>; plural noun: <b>buskers</b>
      </p>
      <p>
        <i>
          "a person who performs music or other entertainment in the street or
          another public place for monetary donations."
        </i>
      </p>
      <img
        src="https://media.istockphoto.com/id/1006917342/photo/busking-street-musician.jpg?s=612x612&w=0&k=20&c=XKKyNCLiz4Wq7dnJsj3VlDcthFwvzCJSgbyW2oWxt-Q="
        alt="busker"
      ></img>
      <p>
        Check out the events from our users <Link to="/events">here</Link>.
      </p>
      <p>
        Do you have any feedback and/or feature requests? Please tell us on our{" "}
        <a href="https://github.com/diogo-botelho/busk-app">Github</a>.
      </p>
    </Container>
  );
}

export default Home;
