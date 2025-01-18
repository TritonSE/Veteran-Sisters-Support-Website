import { Schema, model } from "mongoose";

const fileSchema = new Schema({
  filename: { type: String, required: true },
  uploader: { type: String, required: true },
  comments: { type: [String], required: true },
  programs: { type: [String], required: true },
});

const FileObject = model("FileObject", fileSchema);

export default FileObject;
