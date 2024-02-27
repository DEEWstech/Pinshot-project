import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import Pin from "../models/pin.models.js";
import User from "../models/user.models.js";
import Comment from "../models/comment.model.js";

export const addAComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  const { comment } = req.body;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
      return next(createHttpError(400, "Invalid user or pin Id"));
    }
    const pin = await Pin.findById(pinId);
    if (pin) {
      return next(createHttpError(404, "pin not found"));
    }
    if (!pinId) {
      return next(createHttpError(400, "pinId missing"));
    }
    if (!comment) {
      return next(createHttpError(400, "Comment is missing"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(400, "User  not found"));
    }
    if (!user.isVerified) {
      return next(
        createHttpError(401, "Email not verified, pls verify to create comment")
      );
    }
    const commentObj = {
      userId: user._id,
      pinId: pinId,
      comment: comment,
    };
    const comments = await Comment.create(commentObj);
    res.status(201).json({ comments, msg: "Comment added successfully" });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  const { id: pinId } = req.params;
  try {
    if (!isValidObjectId(pinId)) {
      return next(createHttpError(400, "Invalid pin Id"));
    }
    if (!pinId) {
      return next(createHttpError(400, "pinId missing"));
    }
    const pin = await Pin.findById(pinId);
    if (pin) {
      return next(createHttpError(404, "pin not found"));
    }
    const comments = await Comment.find({ pinId: pinId })
      .populate("userId", "userName profilePhoto")
      .sort({ id_: -1 });
    if (!comments) {
      return next(createHttpError(400, "Comment is missing"));
    }
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeAComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.params;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(commentId)) {
      return next(createHttpError(400, "Invalid user or comment Id"));
    }
    if (!commentId) {
      return next(createHttpError(400, "commentId missing"));
    }
    //find the mongodb id and updating the likes of the user
    const comment = await Comment.findByIdAndUpdate(commentId, {
      $addToSet: { likes: userId },
      $inc: { likeCount: 1 },
    });
    if (!comment) {
      return next(createHttpError(404, "Comment not found"));
    }
    if (comment.likes.includes(userId)) {
      res.status(400).send("You already liked this comment!");
    }
    res.status(200).send("Comment liked");
  } catch (error) {
    next(error);
  }
};
export const dislikeAComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.params;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(commentId)) {
      return next(createHttpError(400, "Invalid user or comment Id"));
    }
    if (!commentId) {
      return next(createHttpError(400, "commentId missing"));
    }
    //find the mongodb id and updating the likes of the user
    const comment = await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: userId },
      $inc: { likeCount: -1 },
    });
    if (!comment) {
      return next(createHttpError(404, "Comment not found"));
    }
    res.status(200).send("Comment disliked!");
  } catch (error) {
    next(error);
  }
};

export const deleteAComment = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: commentId } = req.params;
  try {
    if (!isValidObjectId(userId) || !isValidObjectId(commentId)) {
      return next(createHttpError(400, "Invalid user or comment Id"));
    }
    if (!commentId) {
      return next(createHttpError(400, "commentId missing"));
    }
    const user = await User.findById(userId);
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!user._id.equals(comment.userId)) {
      return next(createHttpError(401, " You can only delete commentId"));
    }
    if (!comment) {
      return next(createHttpError(404, "Comment not found"));
    }
    res.status(200).send("Comment deleted");
  } catch (error) {
    next(error);
  }
};
