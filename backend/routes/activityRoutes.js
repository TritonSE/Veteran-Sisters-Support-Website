import express from "express";

const router = express.Router();

router.get("/activities");

// router.get("/users/:email", getUserByEmail);

// router.get("/nonAdminUsers", getUsersNonAdmins);

router.post("/activity");

// router.delete("/users/:email", deleteUser);

export default router;
