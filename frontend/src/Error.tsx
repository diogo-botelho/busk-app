import { Alert } from "react-bootstrap";

/** Renders an error message
 *
 * State:
 *  - none
 *
 * Props:
 *  - Array of errror messages
 *
 */

interface ErrorMessageParams {
  messages: string[];
}

function Error({ messages }: ErrorMessageParams) {
  return (
    <Alert variant="danger">
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      {messages.map((message, idx) => (
        <p key={idx}>{message}</p>
      ))}
    </Alert>
  );
}

export default Error;
