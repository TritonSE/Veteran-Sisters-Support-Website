import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: ["veteran", "volunteer", "staff", "admin"],
  assignedPrograms: [String],
  assignedVeteran: String,
});

export const User = model("User", userSchema);


