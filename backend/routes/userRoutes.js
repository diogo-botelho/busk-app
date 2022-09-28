"use strict";

const express = require("express");
const db = require("../db");

const User = require("../models/user");

const router = new express.Router();

/** Get users: [user, user, user] */
router.get("/", async function (req, res, next) {
  const users = await User.getAll();
  return res.json(users);
});

/** Get user, return user */
router.get("/:id", async function (req, res, next) {
  const user = await User.getById(req.params.id);
  return res.json(user);
});

/** Create new user, return user */

router.post("/", async function (req, res, next) {
  const user = await User.create(
    req.body.username,
    req.body.firstName,
    req.body.lastName
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
});

/** Update user, returning user */

router.patch("/:id", async function (req, res, next) {
  const { firstName } = req.body;

  const result = await db.query(
    `UPDATE users
             SET first_name = $1
             WHERE id = $2
             RETURNING id, first_name`,
    [firstName, req.params.id],
  );

  // if(!result.rows[0]) throw new NotFoundError();

  const user = result.rows[0];
  if (!user) return res.status(404);
  return res.json({ user });
});

/** Delete user, returning {message: "Deleted"} */

router.delete("/:id", async function (req, res, next) {
  await User.remove(req.params.id);
  return res.json({ message: `User ${req.params.id} deleted.` });
});

module.exports = router;