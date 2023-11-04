import { createContext } from "react";

/** Context: provides currentUser object and setter for it throughout app. */

export interface UserContextType {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  buskerNames: string[];
  buskerId: number;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
