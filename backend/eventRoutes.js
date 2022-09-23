const express = require("express");

// const db = require("./fakeDb");
const router = new express.Router();


/** GET /events: get list of events */
router.get("/", function (req, res, next) {
    return res.send("Events will go here");
    // return res.json(db.Event.all());
});

/** DELETE /events/[id]: delete event, return {message: Deleted} */
router.delete("/:id", function (req, res, next) {
    db.Event.delete(req.params.id);
    return res.json({ message: "Deleted" });
});

module.exports = router;