import express from "express";

const router = express.Router();

router.get("/users", (req, res) => {
  const role = req.query.role;
  res.send(`requesting all users with role=${role}`);
});

router.get("/users/:email", (req, res) => {
  res.send(`requesting user with email=${req.params.email}`);
});

router.post("/users", (req, res) => {
  const { firstName, lastName, email, role, assignedPrograms, assignedVeteran } = req.body;
  res.send(`adding a user with the following details=${JSON.stringify(req.body)}`);
});

router.delete("/users/:email", (req, res) => {
  res.send(`deleting user with email=${req.params.email}`);
});

export default router;
