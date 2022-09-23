"use strict";

const express = require("express");

const db = require("../db");
const router = new express.Router();

/** Get users: [user, user, user] */
router.get("/", async function (req, res, next) {
    const results = await db.query(
      `SELECT id, name, type
           FROM users`);
    const users = results.rows;
    return res.json({ users });
});

/** Create new user, return user */

router.post("/", async function (req, res, next) {
    const { name, type } = req.body;
  
    const result = await db.query(
      `INSERT INTO users (name, type)
             VALUES ($1, $2)
             RETURNING id, name, type`,
      [name, type],
    );
    const user = result.rows[0];
    return res.status(201).json({ user });
});

/** Update user, returning user */

router.patch("/:id", async function (req, res, next) {
    const { name, type } = req.body;
  
    const result = await db.query(
      `UPDATE users
             SET name=$1,
                 type=$2
             WHERE id = $3
             RETURNING id, name, type`,
      [name, type, req.params.id],
    );
    const user = result.rows[0];
    return res.json({ user });
});

/** Delete user, returning {message: "Deleted"} */

router.delete("/:id", async function (req, res, next) {
    await db.query(
      "DELETE FROM users WHERE id = $1",
      [req.params.id],
    );
    return res.json({ message: "Deleted" });
  });

module.exports = router;