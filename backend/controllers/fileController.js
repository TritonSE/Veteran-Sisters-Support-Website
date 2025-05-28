import Comment from "../models/commentModel.js";
import FileObject from "../models/fileModel.js";
import mongoose from "mongoose";

import { createComment, createDocument } from "./activityController.js";

export const uploadFile = async (req, res, next) => {
  const { filename, uploaderId, comment, programs } = req.body;

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
      uploader: uploaderId,
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
    const files = await FileObject.find({ uploader: userId })
      .populate("uploader")
      .populate("comments");
    res.status(200).json(files);
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error" });
  }
};

export const editFileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const originalFile = await FileObject.findById(id);
    const file = await FileObject.findOneAndUpdate({ _id: id }, update, { new: true })
      .populate("uploader")
      .populate([{ path: "comments", populate: [{ path: "commenterId" }] }]);
    if (!!update.comments && update.comments.length > originalFile.comments.length) {
      const originalComments = originalFile.comments.map((comment) => comment.toString());
      const newComments = update.comments.filter(
        (comment) => !originalComments.includes(comment._id),
      );
      newComments.forEach((comment) => {
        createComment({
          comment: comment,
          documentName: file.filename,
          documentUploader: file.uploader._id.toString(),
        });
      });
    }
    res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};
