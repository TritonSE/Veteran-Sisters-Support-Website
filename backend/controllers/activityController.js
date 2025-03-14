import Activity from "../models/activityModel.js";

// Return a. Recent 3 unread activities, b. Total count of unread activities
export const getUnreadActivities = async (req, res) => {
  try {
    const totalUnreadCount = await Activity.countDocuments({ isRead: false });
    const activities = await Activity.find({ isRead: false })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    res.status(200).json({
      recentUnread: activities,
      totalUnread: totalUnreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread activities", error: error.message });
  }
};

// Create new activity when a document is uploaded
export const createActivity = async (activityData) => {
  try {
    const { firstName, lastName, role, type, documentName, programName } = activityData;

    if (!firstName || !lastName || !role || !type) {
      return res.status(400).json({ message: "Uploader ID, and type are required" });
    }

    if (["document", "comment", "request"].includes(type) && !documentName) {
      return res
        .status(400)
        .json({ message: "documentName is required for Document, Comment, and Request types" });
    }

    if (type === "document" && !programName) {
      return res.status(400).json({ message: "programName is required for Document type" });
    }

    const newActivity = new Activity({
      firstName,
      lastName,
      role,
      documentName,
      programName,
      isRead: false,
      createdAt: new Date(),
      type,
    });
    const savedActivity = await newActivity.save();
    return savedActivity;
    // res.status(201).json(newActivity);
  } catch (error) {
    throw new Error("Error creating activity: " + error.message);
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
