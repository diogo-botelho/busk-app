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
 *  id provided as route param.
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
    if (!(user && (user.isAdmin || user.id === +req.params.id))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  id provided as route param.
 *
 *  If not, raises Unauthorized.
 */

export function ensureCorrectUserOrAdminForBuskers(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    console.log("ensureCorrectUserOrAdminForBuskers");

    const user = res.locals.user;
    console.log(user, req.body);
    if (!(user && (user.isAdmin || user.id === +req.body.userId))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    
    console.log("fail");
    return next(err);
  }
}

export async function ensureUserOwnsBuskerAccount(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    console.log("ensureUserOwnsBuskerAccount", req.params.buskerName);
    await createResLocalsBuskers(req.body.userId, res);
    console.log("after awaiting", res.locals.buskers);
    const buskers = res.locals.buskers;
    if (buskers.indexOf(req.params.buskerName) < 0) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

export async function ensureBuskerOwnsEvent(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    // const buskerId = req.body.buskerId;
    await createResLocalsEvents(req.body.buskerName, res);

    const events = res.locals.events;
    if (events.indexOf(req.params.eventId) < 0) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}
