import express from "express";
import {
  queryActiveVolunteers,
  addVolunteer,
  removeVolunteer,
} from "../controllers/activeVolunteersController.js";

const router = express.Router();

router.get("/activeVolunteers", queryActiveVolunteers);

router.post("/activeVolunteers", addVolunteer);

router.delete("/activeVolunteers/:id", removeVolunteer);

export default router;
