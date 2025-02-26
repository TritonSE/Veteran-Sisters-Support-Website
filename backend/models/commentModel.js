import mongoose, { Mongoose } from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  profileId: { type: Schema.Types.ObjectId, ref: "User", required: false },
  commenterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  datePosted: { type: Date, default: new Date() },
  edited: { type: Boolean, required: false }
});

const Comment = model("Comment", commentSchema);

export default Comment;