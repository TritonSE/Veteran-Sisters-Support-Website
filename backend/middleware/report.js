import { User } from "../models/userModel.js";

export const authenticateReportPermissions = async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ error: "Requesting User not found" });
    }

    const reportUser = await User.findById(req.params.userId).exec();

    if (!reportUser) {
      return res.status(404).json({ error: "Report User not found" });
    }

    if (user.role !== "admin" && user.email !== reportUser.email) {
      return res.status(403).json({ error: "You do not have permission to view this report!" });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Internal server error" });
  }
};
