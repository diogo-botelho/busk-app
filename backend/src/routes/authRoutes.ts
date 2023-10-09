import express from "express";
import jsonschema from "jsonschema";

import { User } from "../models/user";
import { Busker } from "../models/busker";

import { UserData } from "../interfaces/UserData";
import { createResLocalsBuskers } from "../helpers/resLocals";

import { createToken } from "../helpers/tokens";
import { BadRequestError } from "../expressError";
import userLoginSchema from "../schemas/userLogin.json";
import userSignupSchema from "../schemas/userSignup.json";
import buskerNewSchema from "../schemas/buskerNew.json";
// import { ensureCorrectUserOrAdmin } from "src/middleware/auth";

export const router = express.Router();

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
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        buskerCheckmark,
        buskerName,
        category,
        description,
      } = req.body;

      const userSignupData = {
        email,
        password,
        firstName,
        lastName,
        phone,
      };

      const buskerRegistrationData = {
        buskerName,
        category,
        description,
      };

      const validator = jsonschema.validate(userSignupData, userSignupSchema);
      const buskerValidator = jsonschema.validate(
        buskerRegistrationData,
        buskerNewSchema
      );

      if (!validator.valid || (buskerCheckmark && !buskerValidator.valid)) {
        const errs = validator.errors.map((e) => e.stack);
        errs.concat(buskerValidator.errors.map((e) => e.stack));
        throw new BadRequestError(...errs);
      }

      const newUserData: UserData = userSignupData;
      const newUser = await User.signup({ ...newUserData, isAdmin: false });
      delete newUser.isAdmin;
      const userId = newUser.id;
      const token = createToken(userId, false);

      if (buskerCheckmark) {
        const busker = await Busker.register(userId, buskerRegistrationData);
        res.locals.buskers = await createResLocalsBuskers(userId, res);
      }
      
      return res.status(201).json({ token });
    } catch (error) {
      next(error);
    }
  }
);
