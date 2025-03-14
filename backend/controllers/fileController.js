import { User } from "../models/userModel.js";
import FileObject from "../models/fileModel.js";

import { createActivity } from "./activityController.js";

export const uploadFile = async (req, res, next) => {
  const { filename, uploader, comments, programs } = req.body;

  try {
    const fileObject = await FileObject.create({
      filename,
      uploader,
      comments,
      programs,
    });

    // Find uploader's user details
    const user = await User.findById(uploader);
    if (!user) {
      return res.status(404).json({ message: "Uploader not found" });
    }

    console.log(user.firstName);
    // Create unread activity
    const newActivity = {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      type: "document",
      documentName: filename,
      programName: programs,
    };

    await createActivity(newActivity);

    return res.status(201).json(fileObject);
  } catch (error) {
    next(error);
  }
};

export const getFileByUploader = async (req, res, next) => {
  const { uploader } = req.params;
  try {
    const files = await FileObject.find({ uploader });
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
};
