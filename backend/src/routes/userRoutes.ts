/** Routes for users. */

import express from "express";
import db from "../db";

// import jsonschema from "jsonschema";

import { User } from "../models/user";
import { ensureCorrectUserOrAdmin, ensureAdmin } from "../middleware/auth";
import { createToken } from "../helpers/tokens";
// import userNewSchema from "../schemas/userNew.json";
// import userUpdateSchema from "../schemas/userUpdate.json";
import { UserData } from "../interfaces/UserData";

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the signup endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, phone, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, userNewSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map(e => e.stack);
    //   throw new BadRequestError(errs);
    // }
    const newUserData: UserData = req.body;

    const user = await User.signup(newUserData);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { users: [ {username, firstName, lastName, email, phone }, ... ] }
 *
 * Returns list of all users.
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
      const users = await User.getAll();
      return res.json(users);
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, phone, isAdmin }
 *
 * Authorization required: admin or same user-as-:username
 **/
router.get(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { username } = req.params;
      const user = await User.get(username);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { username, password, firstName, lastName, email, phone }
 *
 * Returns { username, firstName, lastName, email, phone, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      // const validator = jsonschema.validate(req.body, userUpdateSchema);
      // if (!validator.valid) {
      //   const errs = validator.errors.map(e => e.stack);
      //   throw new BadRequestError(errs);
      // }
      const { username } = req.params;

      const user = await User.update(username, req.body);

      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/
router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { username } = req.params;
      await User.remove(username);
      return res.json({ deleted: username });
    } catch (err) {
      return next(err);
    }
  }
);

export { router };
