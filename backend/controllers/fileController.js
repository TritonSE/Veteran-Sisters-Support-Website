import FileObject from "../models/fileModel.js";
import mongoose from "mongoose";

export const uploadFile = async (req, res, next) => {
  const { filename, uploader, comments, programs } = req.body;

  try {
    const fileObject = await FileObject.create({
      filename,
      uploader,
      comments,
      programs,
    });

    res.status(201).json(fileObject);
  } catch (error) {
    next(error);
  }
};

export const getFileByUploader = async (req, res, next) => {
  const { uploader } = req.params;
  const uploaderId = new mongoose.Types.ObjectId(uploader);
  try {
    const files = await FileObject.find({ uploader: uploaderId });
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
};
