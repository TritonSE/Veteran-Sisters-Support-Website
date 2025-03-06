import Activity from "../models/activityModel.js";

// Get all unread activities
export const getUnreadActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ isRead: false }).sort({ createdAt: -1 });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread activities", error: error.message });
  }
};

// Create new activity when a document is uploaded
export const createActivity = async (req, res) => {
  try {
    const { firstName, lastName, role, documentName } = req.body;

    if (!firstName || !lastName || !role || !documentName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newActivity = new Activity({ firstName, lastName, role, documentName });
    await newActivity.save();

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({ message: "Error creating activity", error: error.message });
  }
};

// Mark activity as read
export const markActivityRead = async (req, res) => {
  try {
    const { activityId } = req.params;

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { isRead: true },
      { new: true },
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json({ message: "Error marking activity as read", error: error.message });
  }
};
