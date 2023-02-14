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
    const events = await Event.getAll();
    return res.json(events);
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
    const { id } = req.params;

    const event = await Event.getById(+id);
    return res.json({ event });
  }
);

/** Create new event, return event */

router.post(
  "/",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { buskerId, title, type } = req.body;

    const event = await Event.create(buskerId, title, type);
    return res.status(201).json({ event });
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
    const { id } = req.params;

    const event = await Event.update(+id, req.body);
    // if(!result.rows[0]) throw new NotFoundError();

    if (!event) return res.status(404);
    return res.json({ event });
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
    const { id } = req.params;

    await Event.remove(+id);
    return res.json({ message: "event deleted" });
  }
);

export { router };
