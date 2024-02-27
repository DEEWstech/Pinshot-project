import { Schema, model } from "mongoose";

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId, //monogodb uses it to ref a doc.
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    requires: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 1800,
  },
},
{
    timestamps: true,
  }
);

export default model("Token", tokenSchema);

