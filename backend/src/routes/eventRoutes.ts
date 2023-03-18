import express from "express";

import db from "../db";
import { Event } from "../models/event";
const router = express.Router();

/** Get events: [event, event, event] */
router.get(
  "/",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const events = await Event.getAll();
      return res.json(events);
    } catch (err) {
      return next(err);
    }
  }
);

/** Get event, return event */
router.get(
  "/:id",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.params;

      const event = await Event.getById(+id);
      return res.json({ event });
    } catch (err) {
      return next(err);
    }
  }
);

/** Create new event, return event */

router.post(
  "/create",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const eventDetails = req.body;
      const event = await Event.create(eventDetails);

      return res.status(201).json({ event });
    } catch (err) {
      
      return next(err);
    }
  }
);

/** Update event, returning event */

router.patch(
  "/:id",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.params;

      const event = await Event.update(+id, req.body);

      if (!event) return res.status(404);
      return res.json({ event });
    } catch (err) {
      return next(err);
    }
  }
);

/** Delete event, returning {message: "Deleted"} */

router.delete(
  "/:id",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.params;

      await Event.remove(+id);
      return res.json({ message: "event deleted" });
    } catch (err) {
      return next(err);
    }
  }
);

export { router };
