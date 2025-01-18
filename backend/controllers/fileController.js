import FileObject from "../models/fileModel.js";

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
