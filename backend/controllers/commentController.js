import Comment from "../models/commentModel.js";

export const queryComments = async (req, res) => {
  try {
    const profileId = req.params.profileId;
    const comments = await Comment.find({ profileId })
      .populate("profileId", "firstName lastName")
      .populate("commenterId", "firstName lastName")
      .exec();
    if (comments) {
      res.json(comments);
    } else {
      res.status(404).json({ error: "Could not find comments" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { profileId, commenterId, comment } = req.body;
    const newComment = await Comment.create({
      profileId,
      commenterId,
      comment,
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};