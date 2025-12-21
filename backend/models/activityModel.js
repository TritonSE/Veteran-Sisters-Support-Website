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
    // list of user id string
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
        return ["report", "announcement", "comment"].includes(this.type);
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
    assignmentInfo: {
      volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
          this.type === "assignment";
        },
      },
      veteranId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function () {
          this.type === "assignment";
        },
      },
    },
  },
  { timestamps: true }, // Will create createdAt timestamp
);

export const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
