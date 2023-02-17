import { Map } from "./Map";
import "./Home.css";

/** Renders HomePage
 *
 * Props: none
 * State: none
 *
 * Routes --> HomePage
 */

function Home() {
  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 fw-bold">Welcome To Busk!</h1>
        <p className="lead">Placeholder!</p>
        <Map />
      </div>
    </div>
  );
}

export default Home;
