import express from "express";

import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.get("/comments/:profileId", commentController.queryComments);

router.post("/comments", commentController.addComment);

export default router;