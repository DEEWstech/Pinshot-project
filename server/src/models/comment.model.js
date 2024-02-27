import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, //monogodb uses it to ref a doc.
      ref: "user",
      required: true,
    },
    pinId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default model("Comment", commentSchema);
