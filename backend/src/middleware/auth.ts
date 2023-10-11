import express from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

import { UnauthorizedError } from "../expressError";
import {
  createResLocalsBuskers,
  createResLocalsEvents,
} from "../helpers/resLocals";

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the email and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

export function authenticateJWT(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
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
  next: express.NextFunction,
) {
  try {
    if (!res.locals.user) {
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
  next: express.NextFunction,
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

/** Middleware to use when they must provide a valid token & be user matching.
 *  user id provided as route param.
 *
 *  If not, raises Unauthorized.
 */

export function ensureCorrectUserOrAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = res.locals.user;
    const targetUser = req.params.userId || req.body.userId;

    if (!(user && (user.isAdmin || user.id === +targetUser))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to check if id of user making request is associated with busker
 *  account.
 *
 *  user id provided in req.body.
 *
 *  Runs createResLocalsBuskers function to build res.locals.buskers array.
 *
 *  If buskerName not in res.locals.buskers, raises Unauthorized.
 */
export async function ensureUserOwnsBuskerAccount(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await createResLocalsBuskers(req.body.userId, res);

    const buskers = res.locals.buskers;
    const targetBusker = req.params.buskerName || req.body.buskerName;

    if (buskers.indexOf(targetBusker) < 0) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to check if id of busker making request is associated with event.
 *
 *  user id provided in req.body.
 *
 *  Runs createResLocalsBuskers function to build res.locals.buskers array.
 *
 *  If buskerName not in res.locals.buskers, raises Unauthorized.
 */
export async function ensureBuskerOwnsEvent(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    await createResLocalsEvents(req.body.buskerName, res);

    const events = res.locals.events;
    if (events.indexOf(+req.params.id) < 0) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}
