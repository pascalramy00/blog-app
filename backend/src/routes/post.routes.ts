import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/post.controller";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.get("/:slug", getPost);
router.delete("/:slug", deletePost);
router.patch("/:slug", updatePost);

export default router;
