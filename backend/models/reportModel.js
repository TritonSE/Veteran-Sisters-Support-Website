import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reportSchema = new Schema({
  reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reporteeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  situation: [
    {
      type: String,
      enum: [
        "Veteran is unresponsive",
        "Veteran made offensive comment",
        "Proof of life requested",
        "Other, please specify",
        "Volunteer doesn’t respond",
        "Volunteer made offensive comment",
        "Other, please specify",
      ],
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
});

export const Report = model("Report", reportSchema);
