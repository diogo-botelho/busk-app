import { createContext } from "react";

/** Context: provides currentUser object and setter for it throughout app. */

export const UserContext = createContext<string | undefined>(undefined);
