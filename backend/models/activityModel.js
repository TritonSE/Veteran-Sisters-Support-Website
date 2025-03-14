import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userID: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true }, // "Veteran" or "Volunteer"
    type: {
      type: String,
      enum: ["document", "comment", "assignment", "report", "request"], // Restrict values
      required: true,
    },
    documentName: {
      type: String,
      required: function () {
        return ["document", "comment", "request"].includes(this.type);
      },
    },
    programName: {
      type: [String],
      required: function () {
        return this.type === "document";
      },
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }, // Will create createdAt timestamp
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
