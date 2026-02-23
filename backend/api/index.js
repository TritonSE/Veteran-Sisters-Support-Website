import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(console.error);