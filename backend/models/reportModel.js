import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reportSchema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reporteeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  situation: [
    {
      type: String,
      enum: ["Unresponsive", "Offensive comment", "Proof of life", "Other", "Doesn’t respond"],
      required: true,
    },
  ],
  proofOfLifeDate: {
    type: Date,
    required: function () {
      return Array.isArray(this.situation) && this.situation.includes("Proof of life requested");
    },
  },
  proofOfLifeTime: {
    type: String,
    required: function () {
      return Array.isArray(this.situation) && this.situation.includes("Proof of life requested");
    },
  },
  explanation: {
    type: String,
    required: true,
  },
  datePosted: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    required: true,
  },
});

export const Report = model("Report", reportSchema);
