import express from "express";
import * as SearchController from "../controllers/search.js";
import { verifyToken, Roles } from "../middleware/authVerify.js";

const router = express.Router();

router.get("/", verifyToken(Roles.All), SearchController.searchDb);
router.get("/tags", verifyToken(Roles.All), SearchController.getTags);

router.delete("/:id/tags", verifyToken(Roles.All), SearchController.deleteATag);

export default router;
