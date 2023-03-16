import { Card, Button } from "react-bootstrap";
import { Event } from "../interfaces/Event";
import BuskApi from "../api/api";

interface EventCardParams {
  event: Event;
}

export function EventCard({ event }: EventCardParams) {
  const { title, type } = event;

  async function remove() {
    const token = await BuskApi.removeEvent(event.id);
    console.log(token);
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{type}</Card.Text>
        <Button onClick={remove}>Remove</Button>
      </Card.Body>
    </Card>
  );
}
