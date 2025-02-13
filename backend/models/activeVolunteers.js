import mongoose from "mongoose";
const { Schema, model } = mongoose;

const activeVolunteersSchema = new Schema({
  assignedPrograms: {
    type: [String],
    enum: ["battle buddies", "advocacy", "operation wellness"],
    required: true,
  },
  assignedVeterans: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  volunteer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const ActiveVolunteers = model("ActiveVolunteers", activeVolunteersSchema);
