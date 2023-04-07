import express from "express";
import jsonschema from "jsonschema";

import { BadRequestError } from "../expressError";
import buskerNewSchema from "../schemas/buskerNew.json";
import buskerUpdateSchema from "../schemas/buskerUpdate.json";
import { createResLocalsBuskers } from "../helpers/resLocals";

/** Routes for buskers. */

import { Busker } from "../models/busker";
import {
  ensureCorrectUserOrAdmin,
  ensureUserOwnsBuskerAccount,
} from "../middleware/auth";

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
  ensureCorrectUserOrAdmin,
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

      const { userId, buskerData } = req.body;
      const busker = await Busker.register(userId, buskerData);
      res.locals.buskers = await createResLocalsBuskers(userId, res);

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
  ensureUserOwnsBuskerAccount,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const validator = jsonschema.validate(
        req.body.updateData,
        buskerUpdateSchema
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(...errs);
      }

      const { buskerName } = req.params;

      const busker = await Busker.update(buskerName, req.body.updateData);

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
  ensureUserOwnsBuskerAccount,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { buskerName } = req.params;

    const result = await Busker.remove(buskerName);
    return res.json(result);
  }
);

export { router };
