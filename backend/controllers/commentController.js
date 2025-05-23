import Comment from "../models/commentModel.js";

export const queryComments = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const comments = await Comment.find({ 
      profileId: userId
    })
      .populate("profileId", "firstName lastName")
      .populate("commenterId", "firstName lastName")
      .sort({ createdAt: -1 })
      .exec();
    
    const validComments = comments.filter(
      comment => comment.profileId && comment.commenterId
    );
    
    res.json(validComments);
  
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
      datePosted: new Date(Date.now()),
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const newComment = await Comment.findOneAndUpdate(
      { _id: commentId },
      { comment, datePosted: new Date(Date.now()), edited: true },
      { new: true },
    ).populate("commenterId");
    res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const response = await Comment.findByIdAndDelete(commentId);
    res.status(204).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
