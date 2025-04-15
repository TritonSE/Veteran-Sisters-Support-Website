import express from "express";
import * as commentController from "../controllers/commentController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// All comment routes require authentication
router.get("/comments/:profileId", authenticateUser, commentController.queryComments);
router.post("/comments", authenticateUser, commentController.addComment);
router.put("/comment/:id", authenticateUser, commentController.editComment);
router.delete("/comment/:id", authenticateUser, commentController.deleteComment);

export default router;
