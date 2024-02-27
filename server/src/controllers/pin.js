import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import NodeCache from "node-cache";
import Pin from "../models/pin.models.js";
import User from "../models/user.models.js";
import Comment from "../models/comment.model.js";

const cache = new NodeCache({ stdTTL: 300 });

export const createAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const pinParams = req.body; //allows you to access data from the client side
  try {
    if (!userId || !pinParams) {
      return next(createHttpError(400, "Invalid userId or parameters missing"));
    }
    const user = await User.findById(userId);
    if (!user.isVerified) {
      return next(
        createHttpError(401, "Email not verified, pls verify to create a pin")
      );
    }
    const pinData = {
      userId: user._id,
      title: pinParams.title,
      description: pinParams.description,
      image: pinParams.image,
      tags: pinParams.tags,
    };
    const pin = await Pin.create(pinData);
    res.status(201).json(pin);
  } catch (error) {
    next(error);
  }
};

export const getAllPins = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  try {
    const count = await Pin.countDocuments();
    const pins = await Pin.find()
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);
    if (!pins) {
      return next(createHttpError(400, "Pins not found"));
    }
    const totalPages = Math.ceil(count / limit);
    const allPins = {
      currentPage: page,
      totalPages: totalPages,
      pins: pins,
    };
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

export const getRandomPins = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  const cacheKey = `randomPins_${page}_${limit}`;
  try {
    const cachedPins = cache.get(cacheKey);
    if (cachedPins) {
     return res.status(200).json(cachedPins);
    }
    const count = await Pin.countDocuments();
    const pins = await Pin.aggregate([{ $sample: { size: 60 } }])
      .skip(skipCount)
      .limit(limit);
    if (!pins) {
      return next(createHttpError(400, "Pins not found"));
    }
    const totalPages = Math.ceil(count / limit);
    const allPins = {
      currentPage: page,
      totalPages: totalPages,
      pins: pins,
    };
    cache.set(cacheKey, allPins);
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

export const getFollowedPins = async (req, res, next) => {
  const { id: userId } = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const count = await Pin.countDocuments();
    const subcribedPins = user.following;
    const pins = await Pin.find({
      $or: [{ userId: { $in: subcribedPins } }, { userId: userId }],
    })
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);
    const totalPages = Math.ceil(count / limit);
    const allPins = {
      currentPage: page,
      totalPages: totalPages,
      pins: pins,
    };
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

//we are trying get back all pins created by a single user
//req.user is fixed while params is dynamic
export const getPinsByUser = async (req, res, next) => {
  const { id: userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, "Invalid userId"));
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const count = await Pin.countDocuments();
    const pins = await Pin.find({ userId: user._id })
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);
    const totalPages = Math.ceil(count / limit);
    if (!pins) {
      return next(createHttpError(400, "Pins not found"));
    }

    const allPins = {
      currentPage: page,
      totalPages: totalPages,
      pins: pins,
    };
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

export const getASinglePin = async (req, res, next) => {
  const { id: pinId } = req.params;
  if (!isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid pin Id"));
  }
  try {
    const pin = await Pin.findById(pinId).populate(
      "userId",
      "userName profilePhoto followers"
    );
    if (!pin) {
      return next(createHttpError(400, "Invalid pin id"));
    }
    res.status(200).json(pin);
  } catch (error) {
    next(error);
  }
};

export const likeAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid user or pin Id"));
  }
  try {
    const pin = await Pin.findByIdAndUpdate(pinId, {
      $addToSet: { likes: userId },
    });
    if (!pin) {
      return next(createHttpError(404, "Pin not found"));
    }
    if (pin.likes.includes(userId)) {
      res.status(400).send("You already liked this pin");
    }
    res.status(200).json("Pin liked");
  } catch (error) {
    next(error);
  }
};

export const dislikeAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid user or pin Id"));
  }
  try {
    const pin = await Pin.findByIdAndUpdate(pinId, {
      $pull: { likes: userId },
    });
    if (!pin) {
      return next(createHttpError(404, "Pin not found"));
    }
    if (!pin.userId.equals(userId)) {
      return next(createHttpError(401, "You can only delete your pin"));
    }
    await Comment.deleteMany({ pinId: pinId });
    await pin.deleteOne();
    res.status(200).json("Pin disliked");
  } catch (error) {
    next(error);
  }
};

export const getPinsLikedByAUser = async (req, res, next) => {
  const { id: userId } = req.params;
  if (!isValidObjectId(userId)) {
    return next(createHttpError(400, "Invalid userId"));
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skipCount = (page - 1) * limit;
  try {
    const pins = await Pin.find({ likes: userId })
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(limit);
    const count = await Pin.countDocuments();
    const totalPages = Math.ceil(count / limit);
    if (!pins) {
      return next(createHttpError(400, "Pins not found"));
    }

    const allPins = {
      currentPage: page,
      totalPages: totalPages,
      pins: pins,
    };
    res.status(200).json(allPins);
  } catch (error) {
    next(error);
  }
};

export const updateAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;
  const pinParams = req.body;
  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid user or pin Id"));
  }
  if (!pinParams) {
    return next(createHttpError(400, "Parameters missing"));
  }
  try {
    const updatedFields = {
      title: pinParams.title,
      description: pinParams.description,
      image: pinParams.image,
      tags: pinParams.tags,
    };
    Object.keys(updatedFields).forEach(
      (key) =>
        (updatedFields[key] === " " || undefined) && delete updatedFields[key]
    );
    const updatedPin = await Pin.findByIdAndUpdate(pinId, updatedFields, {
      new: true,
    });

    if (!updatedPin) {
      return next(createHttpError(404, "Pin could not be updated"));
    }
    if (!updatedPin.userId.equals(userId)) {
      return next(createHttpError(401, "You can only update your pin"));
    }
    res.status(200).json({
      pin: updatedPin,
      msg: "Pin updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAPin = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: pinId } = req.params;

  if (!isValidObjectId(userId) || !isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid user or pin Id"));
  }
  try {
    const pin = await Pin.findById(pinId);
    if (!pin) return next(createHttpError(404, "Pin not found"));
    if (!pin.userId.equals(userId)) {
      return next(createHttpError(401, "You can only delete your pin"));
    }
    await pin.deleteOne();
    res.status(200).send("Pin deleted");
  } catch (error) {
    next(error);
  }
};

export const getRelatedPins = async (req, res, next) => {
  const { id: pinId } = req.params;
  if (!isValidObjectId(pinId)) {
    return next(createHttpError(400, "Invalid pin Id"));
  }
  try {
    const pin = await Pin.findById(pinId);
    if (!pin) {
      return next(createHttpError(404, "Pin not found"));
    }
    const getTags = pin.tags;
    const getRelatedTags = await Pin.find({ tags: { $in: getTags } });
    const filterRelatedPins = getRelatedTags.filter(
      (allPins) => allPins.id !== pinId
    );
    res.status(200).json(filterRelatedPins);
  } catch (error) {
    next(error);
  }
};
