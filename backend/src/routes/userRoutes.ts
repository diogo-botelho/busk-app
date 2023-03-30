/** Routes for users. */

import express from "express";
import jsonschema from "jsonschema";

import { User } from "../models/user";
import { ensureCorrectUserOrAdmin, ensureAdmin } from "../middleware/auth";
import { createToken } from "../helpers/tokens";
import userNewSchema from "../schemas/userNew.json";
import userUpdateSchema from "../schemas/userUpdate.json";
import { UserData } from "../interfaces/UserData";
import { BadRequestError } from "../expressError";

const router = express.Router();

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the signup endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { id, email, firstName, lastName, phone, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(...errs);
    }
    const newUserData: UserData = req.body;

    const user = await User.signup(newUserData);
    const token = createToken(user.id, user.isAdmin);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { users: [ {email, firstName, lastName, phone }, ... ] }
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

/** GET /[id] => { user }
 *
 * Returns { id, email, firstName, lastName, phone, isAdmin }
 *
 * Authorization required: admin or same user-as-:id
 **/
router.get(
  "/:id",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.params;
      if (Number.isNaN(+id)) throw new BadRequestError("Invalid user id");
      const user = await User.get(+id);
      return res.json(user);
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[id] { user } => { user }
 *
 * Data can include:
 *   { id, email, password, firstName, lastName, phone }
 *
 * Returns { id, email, firstName, lastName, phone, isAdmin }
 *
 * Authorization required: admin or same-user-as-:id
 **/

router.patch(
  "/:id",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(...errs);
      }
      const { id } = req.params;

      const user = await User.update(id, req.body);

      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same-user-as-:id
 **/
router.delete(
  "/:id",
  ensureCorrectUserOrAdmin,
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.params;
      await User.remove(id);
      return res.json({ deleted: id });
    } catch (err) {
      return next(err);
    }
  }
);

export { router };
