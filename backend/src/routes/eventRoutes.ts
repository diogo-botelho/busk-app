import express from "express";

import db from "../db";
const router = express.Router();

/** Get events: [event, event, event] */
router.get("/", async function (req: express.Request, res: express.Response, next:express.NextFunction) {
  const results = await db.query(
    `SELECT id, busker_id, title, type
           FROM events`);
  const events = results.rows;
  return res.json({ events });
});

/** Get event, return event */
router.get("/:id", async function (req: express.Request, res: express.Response, next:express.NextFunction) {
  const results = await db.query(
    `SELECT id,busker_id, title, type
         FROM events
         WHERE id = $1`,
    [req.params.id],
  );
  const event = results.rows[0];
  if (!event) return res.status(404);
  return res.json({ event });
});

/** Create new event, return event */

router.post("/", async function (req: express.Request, res: express.Response, next:express.NextFunction) {
  const { busker_id, title, type } = req.body;

  const result = await db.query(
    `INSERT INTO events (busker_id, title, type)
             VALUES ($1, $2, $3)
             RETURNING id, busker_id, title, type`,
    [busker_id, title, type],
  );
  const event = result.rows[0];
  return res.status(201).json({ event });
});

/** Update event, returning event */

router.patch("/:id", async function (req: express.Request, res: express.Response, next:express.NextFunction) {
  const { title, type } = req.body;

  const result = await db.query(
    `UPDATE events
             SET title=$1,
                 type=$2
             WHERE id = $3
             RETURNING id, busker_id, title, type`,
    [title, type, req.params.id],
  );
  // if(!result.rows[0]) throw new NotFoundError();
  const event = result.rows[0];
  if (!event) return res.status(404);
  return res.json({ event });
});

/** Delete event, returning {message: "Deleted"} */

router.delete("/:id", async function (req: express.Request, res: express.Response, next:express.NextFunction) {
  await db.query(
    "DELETE FROM events WHERE id = $1",
    [req.params.id],
  );
  return res.json({ message: "event deleted" });
});

export { router };