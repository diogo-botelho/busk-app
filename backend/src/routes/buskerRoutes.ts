import express from "express";

import db from "../db";
/** Routes for buskers. */

import { Busker } from "../models/busker";
import { ensureCorrectUserOrAdmin, ensureAdmin } from "../middleware/auth";
import { BuskerData } from "../interfaces/BuskerData";

const router = express.Router();


/** GET / => { buskers: [ {buskerId, buskerName, category, description }, ... ] }
 *
 * Returns list of all buskers.
 *
 * Authorization required: admin
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
 * Authorization required: admin or same user-as-:id
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

/** PATCH /[buskerName] { busker } => { busker }
 *
 * Data can include:
 *   { buskerName, category, description }
 *
 * Returns { buskerId, buskerName, category, description }
 *
 * Authorization required: admin or same-user-as-:username
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
      const { buskerName } = req.params;

      const busker = await Busker.update(buskerName, req.body);

      return res.json({ buskerName });
    } catch (err) {
      return next(err);
    }
  }
);


/** DELETE /[buskerName]  =>  { deleted: buskerName }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.delete(
  "/:buskerName",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { buskerName } = req.params;

    await Busker.remove(buskerName);
    return res.json({ message: `User ${buskerName} deleted.` });
  }
);

export { router };
