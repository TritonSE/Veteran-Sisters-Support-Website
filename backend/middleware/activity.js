import { User } from "../models/userModel.js";
import { Activity } from "../models/activityModel.js";

export const authenticateActivityPermissions = async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ error: "Requesting User not found" });
    }

    if (user.role === "admin") {
      next();
      return;
    }

    const activity = await Activity.findById(req.params.activityId).exec();

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    if (activity.type !== "announcement" && !activity.receivers.includes(user._id)) {
      return res.status(403).json({ error: "You do not have permission to view this activity!" });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Internal server error" });
  }
};
