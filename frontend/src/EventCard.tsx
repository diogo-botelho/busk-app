import { Card } from "react-bootstrap";
import { Event } from "./interfaces/Event";

interface EventCardParams {
    event: Event
}

export function EventListCard({ event } : EventCardParams) {
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

// export default EventListCard;
