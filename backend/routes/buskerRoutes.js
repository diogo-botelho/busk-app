"use strict";

const express = require("express");

const db = require("../db");
const router = new express.Router();


/** GET /events: get list of events */
router.get("/", function (req, res, next) {
    // return res.send("Buskers will go here");
    return res.json(db.Busker.all());
});

/** DELETE /events/[id]: delete event, return {message: Deleted} */
router.delete("/:id", function (req, res, next) {
    db.Busker.delete(req.params.id);
    return res.json({ message: "Deleted" });
});

module.exports = router;