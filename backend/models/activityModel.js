import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, required: true }, // "Veteran" or "Volunteer"
  documentName: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
