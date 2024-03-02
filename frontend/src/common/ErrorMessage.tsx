import { Alert } from "@mantine/core";

/** Presentational component for showing bootstrap-style alerts.
 *
 * { LoginForm, SignupForm, EventList  } -> ErrorMessage
 **/

interface ErrorMessageParams {
  messages: string[];
}

function ErrorMessage({ messages }: ErrorMessageParams) {
  return (
    <Alert color="red" title="Oh snap! You got an error!">
      {messages.map((message, idx) => (
        <p key={idx}>{message}</p>
      ))}
    </Alert>
  );
}

export default ErrorMessage;
