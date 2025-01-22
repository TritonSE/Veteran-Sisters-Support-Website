/* eslint-disable */

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import fileRoutes from "./routes/fileRoutes.js";

// import { CustomError, InternalError } from "./errors.js";

dotenv.config();

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (!err) return;
  if (!(err instanceof CustomError)) {
    // All unhandled errors are marked as unknown internal errors
    const e = InternalError.UNKNOWN.addContext(err.stack);
    res.status(e.statusCode).json({
      message: e.format(false),
      error: true,
    });
  } else if (err instanceof InternalError) {
    // Internal Error Logging
    console.error(err.format(false));
    res.status(err.statusCode).json({
      message: err.format(true),
      error: true,
    });
  } else {
    res.status(err.statusCode).json({
      message: err.format(true),
      error: true,
    });
  }
};

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api", fileRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});
