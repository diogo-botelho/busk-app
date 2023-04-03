import express from "express";
import jsonschema from "jsonschema";

import { BadRequestError } from "../expressError";
import buskerNewSchema from "../schemas/buskerNew.json";
import buskerUpdateSchema from "../schemas/buskerUpdate.json";

/** Routes for buskers. */

import { Busker } from "../models/busker";
import { ensureCorrectUserOrAdmin } from "../middleware/auth";

const router = express.Router();

/** GET / => { buskers: [ {buskerId, buskerName, category, description }, ... ] }
 *
 * Returns list of all buskers.
 *
 **/

router.get(
  "/",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const buskers = await Busker.getAll();
      return res.json(buskers);
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[buskerName] => { busker }
 *
 * Returns { buskerId, buskerName, category, description }
 *
 **/
router.get(
  "/:buskerName",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { buskerName } = req.params;
      const busker = await Busker.get(buskerName);
      return res.json(busker);
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /
 *
 * Returns { buskerId, buskerName, category, description }
 *
 **/
router.post(
  "/",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const validator = jsonschema.validate(req.body, buskerNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(...errs);
      }

      const newBuskerData = req.body;

      const busker = await Busker.register(newBuskerData);
      return res.status(201).json(busker);
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[buskerName] { busker } => { busker }
 *
 * Data can include:
 *   { buskerName, category, description }
 *
 * Returns { buskerId, buskerName, category, description }
 *
 * Authorization required: admin or same busker
 **/

router.patch(
  "/:buskerName",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const validator = jsonschema.validate(req.body, buskerUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(...errs);
      }

      const { buskerName } = req.params;

      const busker = await Busker.update(buskerName, req.body);

      return res.json({ busker });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[buskerName]  =>  { deleted: buskerName }
 *
 * Authorization required: admin or same busker
 **/
router.delete(
  "/:buskerName",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { buskerName } = req.params;

      await Busker.remove(buskerName);
      return res.json({ message: `User ${buskerName} deleted.` });
    } catch (err) {
      return next(err);
    }
  }
);

export { router };
