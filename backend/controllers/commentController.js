import Comment from "../models/commentModel.js";

export const queryComments = async (req, res, next) => {
  try {
    const profileId = req.params.profileId;
    const comments = await Comment.find({ profileId })
      .populate("profileId", "firstName lastName")
      .populate("commenterId", "firstName lastName")
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

export const addComment = async (req, res, next) => {
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

export const editComment = async (req, res, next) => {
  try{
    const { id } = req.params
    const { comment } = req.body;
    const newComment = await Comment.findOneAndUpdate({_id: id}, {comment, datePosted: new Date(), edited: true}, {new: true}).populate("commenterId")
    res.status(200).json(newComment)
  } catch (error) { 
    next(error)
  } 
}

export const deleteComment = async (req, res, next) => {
  try{
    const { id } = req.params
    const response = await Comment.findByIdAndDelete(id) 
    res.status(204).json(response)
  } catch (error) {
    next(error)
  }
}