import { ActiveVolunteers } from "../models/activeVolunteers.js";

//query active volunteers by program, veteran, or get all active volunteers
export const queryActiveVolunteersVeteranByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    let query = { assignedVeteran: email };

    const filteredVolunteers = await ActiveVolunteers.find(query)
      .populate("volunteerUser", "firstName lastName email")
      .populate("veteranUser", "firstName lastName email")
      .exec();

    res.json(filteredVolunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const queryActiveVolunteersVolunteerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    let query = { volunteer: email };

    const filteredVolunteers = await ActiveVolunteers.find(query)
      .populate("volunteerUser", "firstName lastName email")
      .populate("veteranUser", "firstName lastName email")
      .exec();

    res.json(filteredVolunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//add a volunteer using their user email, program, and assigned veteran email
export const addVolunteer = async (req, res) => {
  try {
    const { userEmail, program, veteranEmail, volunteerId, veteranId } = req.body;

    // Validate required fields are provided
    if (!volunteerId || !veteranId || !program) {
      return res.status(400).json({
        error: "Missing required fields: volunteerId, veteranId, and program are required.",
      });
    }

    const existingVolunteer = await ActiveVolunteers.findOne({
      volunteer: userEmail,
      assignedProgram: program,
      assignedVeteran: veteranEmail,
      volunteerUser: volunteerId,
      veteranUser: veteranId,
    }).exec();

    if (existingVolunteer) {
      return res
        .status(400)
        .json({ error: "This volunteer is already assigned to this program and veteran." });
    }

    // Create and save with proper validation
    const newVolunteer = await ActiveVolunteers.create({
      volunteer: userEmail,
      assignedProgram: program,
      assignedVeteran: veteranEmail,
      volunteerUser: volunteerId,
      veteranUser: veteranId,
    });

    res.status(201).json(newVolunteer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//delete a volunteer using their user email, program, or veteran email
export const removeVolunteer = async (req, res) => {
  try {
    const id = req.params.id;
    const { program, veteranEmail } = req.body;

    const volunteerEntry = await ActiveVolunteers.findOne({
      volunteer: id,
      ...(program && { assignedProgram: program }),
      ...(veteranEmail && { assignedVeteran: veteranEmail }),
    }).exec();

    if (!volunteerEntry) {
      return res.status(404).json({ error: "Volunteer assignment not found" });
    }

    // If no specific program or veteran is provided, delete all assignments of the volunteer
    if (!program && !veteranEmail) {
      await ActiveVolunteers.deleteMany({ volunteer: id }).exec();
      return res.status(200).json({ message: "All volunteer assignments removed" });
    }

    // If a specific entry is found, delete it
    await ActiveVolunteers.deleteOne({ volunteer: volunteerEntry.volunteer }).exec();

    return res.status(200).json({ message: "Volunteer assignment removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
