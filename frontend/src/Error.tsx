import React from "react";
// import "./Error.css";

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
    <div className="Error">
      {messages.map((message, idx) => (
        <p key={idx}>{message}</p>
      ))}
    </div>
  );
}

export default Error;
