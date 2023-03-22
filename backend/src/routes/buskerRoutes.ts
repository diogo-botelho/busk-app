import express from "express";

import db from "../db";
/** Routes for buskers. */

import { Busker } from "../models/busker";
import { ensureCorrectUserOrAdmin, ensureAdmin } from "../middleware/auth";
import { BuskerData } from "../interfaces/BuskerData";

const router = express.Router();


/** GET / => { buskers: [ {buskerId, buskerName, category, descritpion }, ... ] }
 *
 * Returns list of all buskers.
 *
 * Authorization required: admin
 **/

router.get(
  "/",
  ensureAdmin,
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

/** GET /[buskerId] => { user }
 *
 * Returns { buskerId, buskerName, category, description }
 *
 * Authorization required: admin or same user-as-:id
 **/
router.get(
  "/:buskerId",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { buskerId } = req.params;
      const busker = await Busker.get(+buskerId);
      return res.json(busker);
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[buskerId] { busker } => { busker }
 *
 * Data can include:
 *   { buskerName, category, description }
 *
 * Returns { buskerId, buskerName, category, description }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch(
  "/:buskerId",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { buskerId } = req.params;

      const busker = await Busker.update(+buskerId, req.body);

      return res.json({ buskerId });
    } catch (err) {
      return next(err);
    }
  }
);


/** DELETE /[buskerId]  =>  { deleted: buskerId }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.delete(
  "/:buskerId",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { buskerId } = req.params;

    await Busker.remove(+buskerId);
    return res.json({ message: `User ${buskerId} deleted.` });
  }
);

export { router };
