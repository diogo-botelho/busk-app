const express = require("express");
const axios = require("axios");
const eventRoutes = require("./eventRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/events", eventRoutes);

  
module.exports = app;