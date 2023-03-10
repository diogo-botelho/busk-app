/** Express app for Busk. */
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { NotFoundError, ExpressError } from "./expressError";

import { router as buskerRoutes } from "./routes/buskerRoutes";
import { router as eventRoutes } from "./routes/eventRoutes";
import { router as userRoutes } from "./routes/userRoutes";
import { router as authRoutes } from "./routes/authRoutes";

import { authenticateJWT } from "./middleware/auth";
import morgan from "morgan";

const app = express();

app.use(cors());
// Parse body for urlencoded (non-JSON) data
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use(authenticateJWT);
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/buskers", buskerRoutes);
app.use("/events", eventRoutes);
app.use("/users", userRoutes);

/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (
  err: ExpressError,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});

export default app;
