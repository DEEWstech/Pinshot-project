import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";
import NodeCache from "node-cache";
import Pin from "../models/pin.models.js";
import User from "../models/user.models.js";

const cache = new NodeCache({ stdTTL: 600 });

export const getTags = async (req, res, next) => {
  const cacheTags = cache.get("tags");
  try {
    if (cacheTags) {
      return res.status(200).json(cacheTags);
    }
    const getPins = await Pin.find();
    const filterTags = getPins.flatMap((pin) => pin.tags);
    const removeTagsDuplicates = [
      ...filterTags.filter((tag, i) => {
        return filterTags.indexOf(tag) === i && item?.length > 0;
      }),
    ];
    cache.set("tags", removeTagsDuplicates);
    res.status(200).json(removeTagsDuplicates);
  } catch (error) {
    next(error);
  }
};

export const deleteATag = async (req, res, next) => {
  const { id: pinId } = req.params;
  try {
    if (!isValidObjectId(pinId)) {
      return next(createHttpError(400, "Invalid pin id"));
    }
    const pin = await Pin.findById();
    if (!pin) {
      return next(createHttpError(400, "Pin not found"));
    }
    const getTags = [...pin.tags];
    const editTags = getTags.splice(index, 1);
    await Pin.findByIdAndUpdate(pinId, { tags: editTags });
    res.stsatus(200).send("Tag deleted");
  } catch (error) {
    next(error);
  }
};

export const searchDb = async (req, res, next) => {
  const query = req.query.q;
  if (!query) {
    return next(createHttpError(400, "Search parameter is missing"));
  }
  try {
    //userResult
    const searchQuery =
      query.trim() || req.query.split(" , ").map((tag) => tag.trim());
    const userResult = await User.find({
      userName: { $regex: searchQuery, $options: "i" },
    });
    const pinResult = await Pin.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ],
    });
    const SearchResult = userResult.concat(pinResult);
    res.status(200).json(SearchResult)
  } catch (error) {
    next(error)
  }
};
