import { User } from "../models/userModel.js";
import FileObject from "../models/fileModel.js";
import { ActiveVolunteers } from "../models/activeVolunteers.js";
/*
authenticateUser() from auth.js must be used before this
*/
export const authenticateDocumentPermissions = async (req, res, next) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const documentId = req.params.id;
    const document = await FileObject.findOne({ _id: documentId }).populate("uploader");
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const assignedUsers = await ActiveVolunteers.find({ volunteer: email })
      .populate("volunteerUser", "firstName lastName email")
      .populate("veteranUser", "firstName lastName email")
      .exec();
    switch (user.role) {
      case "veteran":
        if (!document.uploader.equals(user)) {
          return res
            .status(403)
            .json({ error: "You do not have permission to view this document!" });
        }
        break;
      case "volunteer":
        if (!user.assignedUsers.includes(document.uploader.email)) {
          return res
            .status(403)
            .json({ error: "You do not have permission to view this document!" });
        }
        //check volunteer is assigned to veteran for particular program
        for (const assignedUser of assignedUsers ?? []) {
          if (assignedUser.veteranUser._id.equals(document.uploader._id)) {
            if (!document.programs.includes(assignedUser.assignedProgram)) {
              return res
                .status(403)
                .json({ error: "You do not have permission to view this document!" });
            } else {
              break;
            }
          }
        }
        //check volunteer is allowed to make action (prohibit change file name)
        if (req.body.filename && req.body.filename !== document.filename)
          return res
            .status(403)
            .json({ error: "You do not have permission to perform this action" });
        break;
      case "staff":
        if (!user.assignedPrograms.some((element) => document.programs.includes(element))) {
          return res
            .status(403)
            .json({ error: "You do not have permission to view this document!" });
        }

        break;
      case "admin":
        break;
      default:
        return res.status(403).json({ error: "You do not have permission to view this document!" });
    }

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ error: "Internal server error" });
  }
};
