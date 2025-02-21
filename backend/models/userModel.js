import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
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
  assignedVeterans: [String],
  assignedVolunteers: [String],
});

export const User = model("User", userSchema);
