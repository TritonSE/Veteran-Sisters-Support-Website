import Activity from "../models/activityModel.js";
import { User } from "../models/userModel.js";
import { ActiveVolunteers } from "../models/activeVolunteers.js";

// Return a. Recent 3 unread activities, b. Total count of unread activities
export const getUnreadActivities = async (req, res) => {
  try {
    // Commented for future use maybe
    // const announcements = await Activity.find({ isRead: false, type: "announcement" })
    //   .populate("uploader", "firstName lastName role")
    //   .sort({ createdAt: -1 })
    //   .lean();

    // let otherActivities;
    // if (user.role == "admin") {
    //   otherActivities = await Activity.find({
    //     isRead: false,
    //     type: { $ne: "announcement" },
    //     $or: [{ receivers: user._id.toString() }, { type: "report" }, { type: "signup" }],
    //   })
    //     .populate("uploader", "firstName lastName role")
    //     .sort({ createdAt: -1 })
    //     .lean();
    // } else if (user.role == "staff") {
    //   otherActivities = await Activity.find({
    //     isRead: false,
    //     type: { $ne: "announcement" },
    //     $or: [
    //       { receivers: user._id.toString() },
    //       { type: "request" },
    //       { type: "signup" },
    //       { programName: { $in: user.assignedPrograms } },
    //     ],
    //   })
    //     .populate("uploader", "firstName lastName role")
    //     .sort({ createdAt: -1 })
    //     .lean();
    // } else {
    //   otherActivities = await Activity.find({
    //     isRead: false,
    //     receivers: user._id.toString(),
    //     type: { $ne: "announcement" },
    //   })
    //     .populate("uploader", "firstName lastName role")
    //     .sort({ createdAt: -1 })
    //     .lean();
    // }
    // const totalUnreadCount = announcements.length + otherActivities.length;
    // const activities = [...announcements, ...otherActivities].slice(0, 3);

    const { userId } = req.params;
    const user = await User.findById(userId);

    const announcements = await Activity.find({
      _id: { $in: user.unreadActivities },
      type: "announcement",
    })
      .populate("uploader", "firstName lastName role")
      .sort({ createdAt: -1 })
      .lean();

    const otherActivities = await Activity.find({
      _id: { $in: user.unreadActivities },
      type: { $ne: "announcement" },
    })
      .populate("uploader", "firstName lastName role")
      .sort({ createdAt: -1 })
      .lean();

    const totalUnreadCount = announcements.length + otherActivities.length;
    const activities = [...announcements, ...otherActivities].slice(0, 3);

    res.status(200).json({
      recentUnread: activities,
      totalUnread: totalUnreadCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching unread activities", error: error.message });
  }
};

// Helper function: Create new activity
export const createActivity = async (activityData) => {
  try {
    const { uploader, type, receivers, title, description, documentName, programName } =
      activityData;

    if (!uploader || !type) {
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

    if (["report", "announcement"].includes(type) && !description) {
      return res
        .status(400)
        .json({ message: "description is required for Report and Announcement type" });
    }

    if (type === "announcement" && !title) {
      return res.status(400).json({ message: "title is required for Announcement type" });
    }

    // // Find uploader's user details
    const user = await User.findById(uploader);
    if (!user) {
      return res.status(404).json({ message: "Uploader not found" });
    }

    const newActivity = new Activity({
      uploader: uploader,
      type,
      receivers,
      title,
      description,
      documentName,
      programName,
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

// Create activity type "document" by calling createActivity
export const createDocument = async ({ uploader, filename, programs }) => {
  try {
    // Create unread activity
    const lowercasePrograms = programs.map((program) => {
      if (program === "BattleBuddies") return "battle buddies";
      else if (program === "Advocacy") return "advocacy";
      else return "operation wellness";
    });
    const activeVolunteer = await ActiveVolunteers.find({
      veteranUser: uploader,
      assignedProgram: { $in: lowercasePrograms },
    });
    const receivers = activeVolunteer.map((item) => item.volunteerUser.toString());

    const newActivity = {
      uploader,
      type: "document",
      receivers: receivers,
      documentName: filename,
      programName: lowercasePrograms,
    };

    const savedActivity = await createActivity(newActivity);
    await User.updateMany(
      { _id: { $in: receivers } },
      { $push: { unreadActivities: savedActivity._id.toString() } },
    );
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Document activity: " + error.message);
  }
};

// Create activity type "announcement" by calling createActivity
export const createAnnouncement = async ({ uploader, title, description }) => {
  try {
    const newActivity = {
      uploader,
      type: "announcement",
      title,
      description,
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Announcement activity: " + error.message);
  }
};

// Create activity type "comment" by calling createActivity
export const createComment = async ({ uploader, documentName }) => {
  try {
    const newActivity = {
      uploader,
      type: "comment",
      documentName,
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Comment activity: " + error.message);
  }
};

// Create activity type "assignment" by calling createActivity
export const createAssignment = async ({ uploader }) => {
  try {
    const newActivity = {
      uploader,
      type: "assignment",
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Assignment activity: " + error.message);
  }
};

// Create activity type "report" by calling createActivity
export const createReport = async ({ uploader, description }) => {
  try {
    const newActivity = {
      uploader,
      type: "report",
      description,
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Report activity: " + error.message);
  }
};

// Create activity type "request" by calling createActivity
export const createRequest = async ({ uploader, documentName }) => {
  try {
    const newActivity = {
      uploader,
      type: "request",
      documentName,
    };

    const savedActivity = await createActivity(newActivity);
    return savedActivity;
  } catch (error) {
    throw new Error("Error creating Request activity: " + error.message);
  }
};
