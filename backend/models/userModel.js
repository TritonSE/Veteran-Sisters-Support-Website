import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ["veteran", "volunteer", "staff", "admin"],
    required: true,
  },
  assignedPrograms: {
    type: [String],
    enum: ["battle buddies", "advocacy", "operation wellness"],
    required: true,
  },
  assignedVeteran: String,
});

export const User = model("User", userSchema);
