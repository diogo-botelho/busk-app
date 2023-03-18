import { Container } from "react-bootstrap";

/** Loading message used by components that fetch API data.
 * 
 * { App, EventList } -> LoadingMessage
*/

export function LoadingMessage() {
  return (
    <Container className="text-center">
      <h1>Loading...</h1>
    </Container>
  );
}