import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { UserData } from "../interfaces/UserData";
/** return signed JWT from user data. */

export function createToken(user: UserData) {
  console.assert(
    user.isAdmin !== undefined,
    "createToken passed user without isAdmin property"
  );

  let payload = {
    username: user.username,
  };

  return jwt.sign(payload, SECRET_KEY);
}
