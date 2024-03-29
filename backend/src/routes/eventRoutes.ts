import express from "express";
import jsonschema from "jsonschema";

import eventNewSchema from "../schemas/eventNew.json";
import eventUpdateSchema from "../schemas/eventUpdate.json";
import { Event } from "../models/event";
import { BadRequestError } from "../expressError";
import {
  ensureCorrectUserOrAdmin,
  ensureUserOwnsBuskerAccount,
  ensureBuskerOwnsEvent,
} from "../middleware/auth";
import dateConverter from "../helpers/dateConverter";

const router = express.Router();

/** Get events: [event, event, event] */
router.get(
  "/",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const events = await Event.getAll();
    return res.json(events);
  },
);

/** Get event, return event */
router.get(
  "/:id",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const { id } = req.params;

      const event = await Event.getById(+id);
      return res.json({ event });
    } catch (err) {
      return next(err);
    }
  },
);

/** Create new event, return event */

router.post(
  "/create",
  ensureCorrectUserOrAdmin,
  ensureUserOwnsBuskerAccount,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const validator = jsonschema.validate(req.body.eventData, eventNewSchema);

      if (!validator.valid || !req.body.eventData) {
        const errs =
          validator.errors.length > 0
            ? validator.errors.map((e) => e.stack)
            : "eventData is not defined.";
        throw new BadRequestError(...errs);
      }
      let eventDetails = req.body.eventData;

      eventDetails.date = dateConverter(eventDetails.date);

      if (eventDetails.date === "Invalid Date") {
        throw new BadRequestError("Invalid date format, please use YYYY-MM-DD");
      }

      const event = await Event.create(eventDetails);

      return res.status(201).json({ event });
    } catch (err) {
      return next(err);
    }
  },
);

/** Update event, returning event */

router.patch(
  "/:id",
  ensureCorrectUserOrAdmin,
  ensureUserOwnsBuskerAccount,
  ensureBuskerOwnsEvent,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    try {
      const validator = jsonschema.validate(
        req.body.updateData,
        eventUpdateSchema,
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(...errs);
      }
      const { id } = req.params;
      const { updateData } = req.body;

      if (!updateData) return res.status(204).json("No content");

      if (updateData && updateData.date) {
        updateData.date = dateConverter(updateData.date);
        if (updateData.date === "Invalid Date") {
          throw new BadRequestError(
            "Invalid date format, please use YYYY-MM-DD",
          );
        }
      }

      const event = await Event.update(+id, updateData);

      return res.status(201).json({ event });
    } catch (err) {
      return next(err);
    }
  },
);

/** Delete event, returning {message: "Deleted"} */

router.delete(
  "/:id",
  ensureCorrectUserOrAdmin,
  ensureUserOwnsBuskerAccount,
  ensureBuskerOwnsEvent,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const { id } = req.params;
    await Event.remove(+id);

    return res.json({ message: "event deleted" });
  },
);

export { router };
