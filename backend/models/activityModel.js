import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["document", "comment", "assignment", "report", "request", "announcement", "signup"], // Restrict values
      required: true,
    },
    receivers: {
      type: [String],
      required: false,
    },
    title: {
      type: String,
      required: function () {
        return this.type === "announcement";
      },
    },
    description: {
      type: String,
      required: function () {
        return ["report", "announcement"].includes(this.type);
      },
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
