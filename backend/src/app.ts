/** Express app for Busk. */
import express from "express";
import bodyParser from "body-parser";

const { NotFoundError, ExpressError } = require("./expressError");
const buskerRoutes = require("./routes/buskerRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Parse body for urlencoded (non-JSON) data
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/buskers", buskerRoutes);
app.use("/events", eventRoutes);
app.use("/users", userRoutes);

/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err: ExpressError, req: express.Request, res: express.Response, next:express.NextFunction) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});

export default app;
