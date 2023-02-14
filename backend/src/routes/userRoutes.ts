import express from "express";
import db from "../db";

import { User } from "../models/user";

const router = express.Router();

/** Get users: [user, user, user] */
router.get(
  "/",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const users = await User.getAll();
    return res.json(users);
  }
);

/** Get user, return user */
router.get(
  "/:id",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await User.getById(+req.params.id);
    return res.json(user);
  }
);

/** Create new user, return user */

router.post(
  "/",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await User.create(
      req.body.username,
      req.body.firstName,
      req.body.lastName,
      req.body.phone,
      req.body.email
    );
    return res.status(201).json(user);

    // const { name } = req.body;

    //   const result = await db.query(
    //     `INSERT INTO users (name)
    //            VALUES ($1, $2)
    //            RETURNING id, name`,
    //     [name],
    //   );
    //   const user = result.rows[0];
    //   return res.status(201).json({ user });
  }
);

/** Update user, returning user */

router.patch(
  "/:username",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {

   const user = await User.update(req.params.username, req.body);

   return res.json({ user });
  }
);

/** Delete user, returning {message: "Deleted"} */

router.delete(
  "/:id",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    await User.remove(+req.params.id);
    return res.json({ message: `User ${req.params.id} deleted.` });
  }
);

export { router };
