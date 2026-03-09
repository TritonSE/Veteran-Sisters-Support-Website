// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import app from "../app.js";

// dotenv.config();

// const PORT = process.env.PORT || 3000;

// mongoose.connect(process.env.DATABASE_URL)
//   .then(() => {
//     console.log("Database Connected");

//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch(console.error);

import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../app.js";

dotenv.config();

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  const mongoUri = process.env.DATABASE_URL;
  if (!mongoUri) {
    throw new Error("DATABASE_URL is not set");
  }

  await mongoose.connect(mongoUri);
  isConnected = true;
  console.log("Database Connected");
}

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Backend function error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}