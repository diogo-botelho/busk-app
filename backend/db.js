"use strict";

/** Database for Busk */

const { Client } = require("pg");

const DB_URI = process.env.NODE_ENV === "test"
  ? "postgresql://diogobotelho:password@localhost/busk_app_test"
  : "postgresql://diogobotelho:password@localhost/busk_app";

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;