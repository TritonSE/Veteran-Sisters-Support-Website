import express from "express";

import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.get("/comments/:profileId", commentController.queryComments);

router.post("/comments", commentController.addComment);

router.put("/comment/:id", commentController.editComment);

router.delete("/comment/:id", commentController.deleteComment);

export default router;
