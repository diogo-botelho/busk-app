import { Alert } from "react-bootstrap";

/** Presentational component for showing bootstrap-style alerts.
 *
 * { LoginForm, SignupForm, EventList  } -> ErrorMessage
 **/

interface ErrorMessageParams {
  messages: string[];
}

function ErrorMessage({ messages }: ErrorMessageParams) {
  return (
    <Alert variant="danger">
      <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
      {messages.map((message, idx) => (
        <p key={idx}>{message}</p>
      ))}
    </Alert>
  );
}

export default ErrorMessage;
