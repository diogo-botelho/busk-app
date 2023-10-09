import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
/** return signed JWT from user data. */

export function createToken(id: number, isAdmin: boolean) {
  console.assert(
    isAdmin !== undefined,
    "createToken passed user without isAdmin property"
  );

  let payload = {
    id: id,
    isAdmin: isAdmin || false,
  };

  return jwt.sign(payload, SECRET_KEY);
}
