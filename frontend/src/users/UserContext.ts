import { createContext } from "react";

/** Context: provides currentUser object and setter for it throughout app. */

export interface UserContextType {
  buskerId: number;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isAdmin: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
