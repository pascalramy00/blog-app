import express from "express";
import {
  createPost,
  getAllPosts,
  getPost,
} from "../controllers/post.controller";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:slug", getPost);
router.post("/", createPost);

export default router;
