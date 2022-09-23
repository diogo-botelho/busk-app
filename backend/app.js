const express = require("express");
const axios = require("axios");

// const { NotFoundError } = require("./expressError");
const buskerRoutes = require("./routes/buskerRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/routes/buskers", buskerRoutes);
app.use("/routes/events", eventRoutes);
  
module.exports = app;