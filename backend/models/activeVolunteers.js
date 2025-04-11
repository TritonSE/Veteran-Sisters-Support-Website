import mongoose from "mongoose";
const { Schema, model } = mongoose;

const activeVolunteersSchema = new Schema({
  assignedProgram: {
    type: String,
    enum: ["battle buddies", "advocacy", "operation wellness"],
    required: true,
  },
  assignedVeteran: String,
  volunteer: String,
  volunteerUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  veteranUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const ActiveVolunteers = model("ActiveVolunteers", activeVolunteersSchema);
