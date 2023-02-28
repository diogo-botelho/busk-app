import express from "express";

import db from "../db";
const router = express.Router();

/** GET /events: get list of buskers */
router.get(
  "/",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    return res.send("Buskers will go here");
    // return res.json(db.Busker.all());
  }
);

/** DELETE /events/[id]: delete event, return {message: Deleted} */
router.delete(
  "/:id",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    db.Busker.delete(req.params.id);
    return res.json({ message: "Deleted" });
  }
);

export { router };
