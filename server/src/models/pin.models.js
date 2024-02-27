import { Schema, model } from "mongoose";

const pinSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, //monogodb uses it to ref a doc.
      ref: "user",
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
    },
    title: {
      type: [String],
      required: true,
      max: 50,
    },
    description: {
      type: [String],
      required: true,
      max: 300,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default model("Pin", pinSchema);
