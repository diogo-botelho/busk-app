import express from "express";

import db from "../db";
import { User } from "../models/user";
export const router = express.Router();

/** Logs in a user, return user */
router.post(
  "/login",
  async function login(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    // const validator = jsonschema.validate(req.body, userAuthSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map(e => e.stack);
    //   throw new BadRequestError(errs);
    // }

    const { username } = req.body;
    const user = await User.authenticate(username);
    // const token = createToken(user);
    return res.json({ user });
  }
);

/** Create new user, return user */

router.post(
  "/register",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { username, firstName, lastName, phone, email } = req.body;

    const user = await User.register(
      username,
      firstName,
      lastName,
      phone,
      email
    );
    return res.status(201).json(user);
  }
);
