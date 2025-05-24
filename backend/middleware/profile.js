import { User } from "../models/userModel.js";

export const authenticateProfilePermissions = async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email }).exec();
    const profileUser = await User.findById(req.params.userId).exec();
    if (!profileUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.email === profileUser.email) {
      next();
      return;
    }
    switch (user.role) {
      case "veteran":
        if (
          !(user.email === profileUser.email) &&
          !user.assignedUsers.includes(profileUser.email)
        ) {
          return res.status(403).json({ error: "You do not have permission to view this user!" });
        }
        break;
      case "volunteer":
        if (!user.assignedUsers.includes(profileUser.email)) {
          return res.status(403).json({ error: "You do not have permission to view this user!" });
        }
        break;
      case "staff":
        if (
          !user.assignedPrograms.some((element) => profileUser.assignedPrograms.includes(element))
        ) {
          return res.status(403).json({ error: "You do not have permission to view this user!" });
        }
        break;
      case "admin":
        break;
      default:
        return res.status(403).json({ error: "You do not have permission to view this user!" });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Internal server error" });
  }
};

export const authenticateStaffOrAdmin = async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "staff" && user.role !== "admin") {
      return res.status(403).json({ error: "You do not have permission!" });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Internal server error" });
  }
};

export const authenticateProfilePermissionsByEmail = async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email }).exec();
    const profileUser = await User.findOne({ email: req.params.email }).exec();
    if (!profileUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.email === profileUser.email) {
      next();
      return;
    }
    switch (user.role) {
      case "veteran":
        if (
          !(user.email === profileUser.email) &&
          !user.assignedUsers.includes(profileUser.email)
        ) {
          return res.status(403).json({ error: "You do not have permission to view this user!" });
        }
        break;
      case "volunteer":
        if (!user.assignedUsers.includes(profileUser.email)) {
          return res.status(403).json({ error: "You do not have permission to view this user!" });
        }
        break;
      case "staff":
        if (
          !user.assignedPrograms.some((element) => profileUser.assignedPrograms.includes(element))
        ) {
          return res.status(403).json({ error: "You do not have permission to view this user!" });
        }
        break;
      case "admin":
        break;
      default:
        return res.status(403).json({ error: "You do not have permission to view this user!" });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Internal server error" });
  }
};
