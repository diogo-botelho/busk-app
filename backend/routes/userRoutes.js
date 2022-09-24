"use strict";

const express = require("express");

const db = require("../db");
const router = new express.Router();

const { NotFoundError } = require("../expressError");

/** Get users: [user, user, user] */
router.get("/", async function (req, res, next) {
    const results = await db.query(
      `SELECT id, name
           FROM users`);
    const users = results.rows;
    return res.json({ users });
});

/** Get user, return user */
router.get("/:id", async function (req, res, next) {
  const results = await db.query(
    `SELECT id, name
         FROM users
         WHERE id = $1`,
         [req.params.id],
         );
  const user = results.rows[0];
  if (!user) return res.status(404);
  return res.json({ user });
});

/** Create new user, return user */

router.post("/", async function (req, res, next) {
    const { name } = req.body;
  
    const result = await db.query(
      `INSERT INTO users (name)
             VALUES ($1, $2)
             RETURNING id, name`,
      [name],
    );
    const user = result.rows[0];
    return res.status(201).json({ user });
});

/** Update user, returning user */

router.patch("/:id", async function (req, res, next) {
    const { name } = req.body;
  
    const result = await db.query(
      `UPDATE users
             SET name=$1
             WHERE id = $3
             RETURNING id, name`,
      [name, req.params.id],
    );
    // if(!result.rows[0]) throw new NotFoundError();
    const user = result.rows[0];
    if(!user) return res.status(404);
    return res.json({ user });
});

/** Delete user, returning {message: "Deleted"} */

router.delete("/:id", async function (req, res, next) {
    await db.query(
      "DELETE FROM users WHERE id = $1",
      [req.params.id],
    );
    return res.json({ message: "user deleted" });
  });

module.exports = router;