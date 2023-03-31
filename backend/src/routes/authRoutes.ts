import express from "express";
import jsonschema from "jsonschema";

import { User } from "../models/user";
export const router = express.Router();
import { UserData } from "../interfaces/UserData";
import { createToken } from "../helpers/tokens";
import { BadRequestError } from "../expressError";
import userLoginSchema from "../schemas/userLogin.json";
import userSignupSchema from "../schemas/userSignup.json";

/** Logs in a user, return user */
router.post(
  "/login",
  async function login(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const validator = jsonschema.validate(req.body, userLoginSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(...errs);
      }

      const { email, password } = req.body;
      const user = await User.authenticate(email, password);
      delete user.isAdmin;
      const token = createToken(user.id, false);
      return res.json({ token });
    } catch (error) {
      next(error);
    }
  }
);

/** Create new user, return user */
router.post(
  "/signup",
  async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const validator = jsonschema.validate(req.body, userSignupSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(...errs);
      }

      const newUserData: UserData = req.body;

      const newUser = await User.signup({ ...newUserData, isAdmin: false });
      delete newUser.isAdmin;
      const token = createToken(newUser.id, false);
      return res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  }
);
