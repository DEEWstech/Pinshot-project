import express from "express";
import * as CommentControlller from "../controllers/comment.js";
import { verifyToken, Roles } from "../middleware/authVerify.js";

const router = express.Router();

router.post("/:id/add", verifyToken(Roles.All), CommentControlller.addAComment);
router.get("/:id/", verifyToken(Roles.All), CommentControlller.getComments);

router.put(
  "/:id/like",
  verifyToken(Roles.All),
  CommentControlller.likeAComment
);
router.put(
  "/:id/dislike",
  verifyToken(Roles.All),
  CommentControlller.dislikeAComment
);
router.delete(
  "/:id",
  verifyToken(Roles.Admin),
  CommentControlller.deleteAComment
);
export default router;
