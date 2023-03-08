import express from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

import { UnauthorizedError } from "../expressError";

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

export function authenticateJWT(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

export function ensureLoggedIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (!res.locals.user) {
      // console.log("Unauthorized User");
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

export function ensureAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

export function ensureCorrectUserOrAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const user = res.locals.user;
    if (!(user && (user.isAdmin || user.username === req.params.username))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}
