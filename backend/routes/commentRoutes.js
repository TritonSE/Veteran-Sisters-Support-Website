import express from "express";
import * as commentController from "../controllers/commentController.js";
import { authenticateUser } from "../middleware/auth.js";
import { authenticateProfilePermissions } from "../middleware/profile.js";
import { authenticateCommentPermissions } from "../middleware/comments.js";
const router = express.Router();

// All comment routes require authentication
router.get("/comments/:userId", authenticateUser, authenticateProfilePermissions, commentController.queryComments);
router.post("/comments", authenticateUser, commentController.addComment);
router.put("/comment/:commentId", authenticateUser, authenticateCommentPermissions, commentController.editComment);
router.delete("/comment/:commentId", authenticateUser, authenticateCommentPermissions, commentController.deleteComment);

export default router;
