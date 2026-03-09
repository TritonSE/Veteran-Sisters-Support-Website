// /* eslint-disable */

// import cors from "cors";
// import express from "express";
// import fileRoutes from "./routes/fileRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import activeVolunteersRoute from "./routes/activeVolunteersRoutes.js";
// import commentRoutes from "./routes/commentRoutes.js";
// import reportRoutes from "./routes/reportRoutes.js";
// import activityRoutes from "./routes/activityRoutes.js";

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api", fileRoutes);
// app.use("/api", userRoutes);
// app.use("/api", activeVolunteersRoute);
// app.use("/api", commentRoutes);
// app.use("/api", reportRoutes);
// app.use("/api", activityRoutes);

// export default app;

/* eslint-disable */

import cors from "cors";
import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import activeVolunteersRoute from "./routes/activeVolunteersRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

// import { CustomError, InternalError } from "./errors.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api", fileRoutes);
app.use("/api", userRoutes);
app.use("/api", activeVolunteersRoute);
app.use("/api", commentRoutes);
app.use("/api", reportRoutes);
app.use("/api", activityRoutes);

// optional test route
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const errorHandler = (err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
};

app.use(errorHandler);

export default app;