import { Card } from "react-bootstrap";

import { Event } from "../interfaces/Event";

interface EventDetailParams {
  event: Event;
}

/** Event Detail page.
 *
 * Renders information about event.

 * EventList -> EventDetail
 */
export function EventDetail({ event }: EventDetailParams) {
  const { title, type } = event;

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{type}</Card.Text>
      </Card.Body>
    </Card>
  );
}
