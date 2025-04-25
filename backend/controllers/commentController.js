import Comment from "../models/commentModel.js";

export const queryComments = async (req, res, next) => {
  try {
    const profileId = req.params.profileId;
    console.log(profileId);
    const comments = await Comment.find({ 
      profileId
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
    const { id } = req.params;
    const { comment } = req.body;
    const newComment = await Comment.findOneAndUpdate(
      { _id: id },
      { comment, datePosted: new Date(Date.now()), edited: true },
      { new: true },
    ).populate("commenterId");
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await Comment.findByIdAndDelete(id);
    res.status(204).json(response);
  } catch (error) {
    next(error);
  }
};
