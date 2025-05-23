import Comment from "../models/commentModel.js";
import { User } from "../models/userModel.js";

export const authenticateCommentPermissions = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userEmail = req.user.email;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isAdmin = user.role === "admin";
    const isCommentCreator = comment.commenterId.toString() === user._id.toString();

    if (!isAdmin && !isCommentCreator) {
      return res.status(403).json({ 
        error: "Unauthorized: Only the comment creator or an admin can perform this action" 
      });
    }
    next();
  } catch (error) {
    console.error("Error in checkCommentOwnership middleware:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
