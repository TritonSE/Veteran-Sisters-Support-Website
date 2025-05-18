import Comment from "../models/commentModel.js";
import FileObject from "../models/fileModel.js";
import mongoose from "mongoose";

import { createDocument } from "./activityController.js";

export const uploadFile = async (req, res, next) => {
  const { filename, userId, comment, programs } = req.body;

  try {
    let commentObject = null;
    if (comment) {
      commentObject = await Comment.create({
        comment: comment,
        commenterId: uploaderId,
        datePosted: new Date(Date.now()),
      });
    }

    const fileObject = await FileObject.create({
      filename: filename,
      uploader: userId,
      comments: commentObject ? [commentObject._id] : [],
      programs: programs,
    });

    // Create unread activity
    await createDocument({ uploader: uploaderId, filename: filename, programs: programs });

    return res.status(201).json(fileObject);
  } catch (error) {
    next(error);
  }
};

export const getFileById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await FileObject.findById(id)
      .populate("uploader")
      .populate([{ path: "comments", populate: [{ path: "commenterId" }] }]);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getFileByUploader = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const files = await FileObject.find({ uploader: userId }).populate("uploader").populate("comments");
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const editFileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const file = await FileObject.findOneAndUpdate({ _id: id }, update, { new: true })
      .populate("uploader")
      .populate([{ path: "comments", populate: [{ path: "commenterId" }] }]);
    res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};
